import { EventDispatcher } from "/obvia/lib/EventDispatcher.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { tokenize, findRightMatchingRightParenIndex } from "/obvia/lib/Tokenizer.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";

var BindingsManager = function (site)
{
    let _site = site;
    let _watchersCount = 0;
    let _watchers = [];
    let _bindingFunctions = [];
    let _totalBindings = 0;
    let _chainUpdateFns = {};
    let _self = this;

    this.$el = $(this);

    Object.defineProperty(this, "watchers", {
        get: function watchers()
        {
            return _watchers;
        }
    });

    this.resetBindings = function ()
    {
        let len = _bindingFunctions.length;
        for (let i = 0; i < len; i++)
        {
            if (_watchers[i])
                _watchers[i].removeHandler(_bindingFunctions[i]);
        }
        _watchers.splice(0, len);
        _bindingFunctions.splice(0, len);
    };
    let _bindingException = function (error)
    {
        console.log(error);
    };
    //TODO: check for duplicate chains to avoid adding multiple watchers for same host and chain
    //TODO: defaultContextProperty implement the possibility for this param to be a property chain
    /**
     *  Binds a public property chain, <code>site_chain</code> on the <code>site</code>
     *  Object, to a bindable property or property chain. 
     *  If a ChangeWatcher instance is successfully created, <code>prop</code>
     *  is initialized to the current value of <code>chain</code>.
     */
    this.getValue = async function (context, bindingExpression, site_chain)
    {
        let toBind = BindingsManager.getPropertyChains(bindingExpression);
        let watchers = [];
        let chain = site_chain.join(".");
        if (_chainUpdateFns[chain] != null)
        {
            let len = _chainUpdateFns[chain].length;
            for (let i = 0; i < len; i++)
            {
                _chainUpdateFns[chain][i].watcher.removeHandler(_chainUpdateFns[chain][i].handler);
            }
        }
        _chainUpdateFns[chain] = [];
        let _indicesMap = {};
        if (toBind)
        {
            let blen = toBind.length;
            if (_site != null && site_chain != null && Array.isArray(site_chain) && site_chain.length > 0)
            {
                let clen = context.length;
                let varsIn_defaultContextProperty = "";
                let aa = [];
                for (let i = 0; i < blen; i++)
                {
                    let found = false;
                    for (let ci = 0; ci < clen && !found; ci++)
                    {
                        if (Object.prototype.hasOwnProperty.call(context[ci], toBind[i][0]))
                        {
                            _indicesMap[toBind[i][0]] = ci;
                            found = true;
                            if (aa.indexOf(toBind[i][0]) < 0)
                            {
                                varsIn_defaultContextProperty += "var " + (toBind[i][0]) + " = context[" + ci + "]['" + (toBind[i][0]) + "'];\n";
                                aa.push(toBind[i][0]);
                            }
                        }
                    }
                    if (!found)
                    {
                        _indicesMap[toBind[i][0]] = 0;
                        let str = toBind[i][0] + " property not found on specified context, creating it with null value";
                        varsIn_defaultContextProperty += "var " + (toBind[i][0]) + " = null;\n"
                        console.log('%c ' + str, 'background: #222; color: #bada55');
                    }
                }
                let timesExecuted = 0;
                _bindingFunctions[_totalBindings] = eval(`var f = async function (e) {
                    try{
                        ${varsIn_defaultContextProperty}
                        let exp = (${bindingExpression});
                        
                        let b = StringUtils.getBindingExp(exp);
                        if (b) {
                            _self.getValue(context, b.expression, site_chain);
                        }else
                            ObjectUtils.setChainValue(_site, site_chain, exp);
                    }catch(error){
                        _bindingException(error);
                    }
                    let evt = jQuery.Event("bindingExecuted");
                    evt.source_guid = _site.guid;
                    evt.site = _site;
                    evt.site_chain = site_chain;
                    evt.timesExecuted = ++timesExecuted;
                    evt.originalEvent = e;
                    _self.trigger(evt);
                }.bind(context[0]); f;`);

                for (let i = 0; i < blen; i++)
                {
                    let found = false;
                    for (let ci = _indicesMap[toBind[i][0]]; ci < clen && !found; ci++)
                    {
                        if (Object.prototype.hasOwnProperty.call(context[ci], toBind[i][0]))
                        {
                            //let host = toBind[i].shift();
                            _watchers[_watchersCount] = ChangeWatcher.getInstance(context[ci]);
                            _watchers[_watchersCount].watch(context[ci], toBind[i].slice(0), _bindingFunctions[_totalBindings]);
                            _chainUpdateFns[chain].push({
                                "watcher": _watchers[_watchersCount],
                                "handler": _bindingFunctions[_totalBindings]
                            });
                            watchers.push(_watchers[_watchersCount]);
                            _watchersCount++;
                            found = true;
                        }
                    }
                }
                _bindingFunctions[_totalBindings]();
                _totalBindings++;
            }
        }
        //TODO:Return the watchers Collection, so we can unwatch :) 
        return watchers;
    };
};

BindingsManager.getIdentifiers = function (bindingExpression)
{
    let r = null;
    let tokens = tokenize(bindingExpression).all();
    let m = ArrayUtils.getMatching(tokens, "type", "IDENTIFIER", false);
    if (m.objects.length > 0)
    {
        r = m.objects;
    }
    return r;
};
/*
    s: String binding Expression
    site: Object Host object
    chain: String|Array property path or property chain
*/
BindingsManager.getPropertyChains = function (bindingExpression)
{
    let toBind = BindingsManager.cache[bindingExpression];
    if (!toBind)
    {
        let tokens = tokenize(bindingExpression).all();
        toBind = BindingsManager.parse(tokens);
        toBind = toBind.filter((el) => { return el != null && el.length > 0; });
        toBind.dedupe();
        BindingsManager.cache[bindingExpression] = toBind;
    }
    return toBind;
};
BindingsManager.cache = {};
BindingsManager.parse = function (tokens)
{
    let toBind = [];
    let kndex = 0;
    for (let i = 0; i < tokens.length; i++)
    {
        if ((tokens[i].type === "IDENTIFIER") || ((tokens[i - 1] && tokens[i - 1].type === "LEFT_BRACKET") && ((tokens[i - 2] && tokens[i - 2].type == "IDENTIFIER" && tokens[i].type === "STRING" && tokens[i].value.trim() != "") || (tokens[i - 2] && tokens[i - 2].type != "RIGHT_PAREN" && tokens[i].type === "INTEGER"))))
        {
            if (toBind[kndex] == undefined)
            {
                toBind[kndex] = [];
            }
            toBind[kndex].push(tokens[i].value);
        } else if (tokens[i].type === "LEFT_PAREN")
        {
            if (tokens[i - 1] && (tokens[i - 1].type === "RIGHT_BRACKET" || tokens[i - 1].type === "IDENTIFIER"))
            {
                //we are not interested in method calls so drop it
                if (toBind[kndex].length <= 2)
                {
                    toBind.splice(kndex, 1);
                    kndex = Math.max(--kndex, 0);
                } else
                {
                    toBind[kndex].splice(toBind[kndex].length - 1, 1);
                }
            }
            let rpi = findRightMatchingRightParenIndex(tokens, i);
            let r = BindingsManager.parse(tokens.slice(i + 1, rpi));
            if (r.length > 0)
            {
                toBind.splicea(toBind.length, 0, r);
                kndex += r.length + 1;
            } else
            {
                if (toBind[kndex] && toBind[kndex].length > 0)
                    ++kndex;
            }
            i = rpi + 1;
        } else if (tokens[i] && !(tokens[i].type === "DOT" || tokens[i].type === "LEFT_BRACKET" || tokens[i].type === "RIGHT_BRACKET" || (tokens[i].type === "LEFT_BRACKET" && tokens[i + 1] && tokens[i + 1].type === "LEFT_BRACKET")) && toBind[kndex] != undefined)
        {
            kndex++;
        }

    }
    return toBind;
};
BindingsManager.instances = {};
BindingsManager.getInstance = function (site)
{
    let uid = site["guid"];
    if (!uid)
    {
        uid = StringUtils.guid();
        if (hasOwnProperty.call(site, "guid"))
        {
            site["guid"] = uid;
        } else
        {
            Object.defineProperty(site, "guid", {
                value: uid,
                enumerable: false,
                configurable: true
            });
        }
    }
    let instance = BindingsManager.instances[uid];
    if (!instance)
        instance = BindingsManager.instances[uid] = new BindingsManager(site);
    return instance;
};
BindingsManager.prototype = Object.create(EventDispatcher.prototype);
export
{
    BindingsManager
};