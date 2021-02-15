var BindingsManager = function (site) {
    let _site = site;
    let _watchersCount = 0;
    let _watchers = [];
    let _bindingFunctions = [];
    let _totalBindings = 0;
    let _watcherBindingFunction = [];
    let _chainUpdateFns = {};

    Object.defineProperty(this, "watchers", {
        get: function watchers() {
            return _watchers;
        }
    });

    this.resetBindings = function () {
        let len = _watcherBindingFunction.length;
        for (let i = 0; i < len; i++) {
            _watchers[i].removeHandler(_watcherBindingFunction[i]);
        }
    };

    //TODO: check for duplicate chains to avoid adding multiple watchers for same host and chain
    //TODO: defaultContextProperty implement the possibility for this param to be a property chain
    /**
     *  Binds a public property chain, <code>site_chain</code> on the <code>site</code>
     *  Object, to a bindable property or property chain. 
     *  If a ChangeWatcher instance is successfully created, <code>prop</code>
     *  is initialized to the current value of <code>chain</code>.
     */
    this.getValue = function (context, bindingExpression, site_chain) {
        let toBind = BindingsManager.getPropertyChains(bindingExpression);
        let watchers = [];
        let chain = site_chain.join(".");
        if (_chainUpdateFns[chain] != null) {
            let len = _chainUpdateFns[chain].length;
            for (let i = 0; i < len; i++) {
                _chainUpdateFns[chain][i].watcher.removeHandler(_chainUpdateFns[chain][i].handler);
            }
        }
        _chainUpdateFns[chain] = [];
        if (toBind.length > 0) {

            if (_site != null && site_chain != undefined && Array.isArray(site_chain) && site_chain.length > 0) {
                context = context || {};

                let varsIn_defaultContextProperty = "";

                for (let i = 0; i < toBind.length; i++) {
                    if (Object.prototype.hasOwnProperty.call(context, toBind[i][0])) {
                        varsIn_defaultContextProperty += "var " + (toBind[i][0]) + " = context['" + (toBind[i][0]) + "'];\n";
                    } else {
                        let str = toBind[i][0] + " property not found on specified context.";
                        //throw str
                        console.log('%c ' + str, 'background: #222; color: #bada55');
                    }
                }
                _bindingFunctions[_totalBindings] = function () {
                    eval(varsIn_defaultContextProperty + 'setChainValue(_site, site_chain, (' + bindingExpression + '));');
                }.bind(context);

                //TODO:Reduce watchers by grouping them based on host and toBind[i]
                for (let i = 0; i < toBind.length; i++) {
                    //let host = toBind[i].shift();
                    _watchers[_watchersCount] = ChangeWatcher.getInstance(context);
                    _watchers[_watchersCount].watch(context, toBind[i].slice(0), _bindingFunctions[_totalBindings]);
                    _watcherBindingFunction[_watchersCount] = _bindingFunctions[_totalBindings];
                    _chainUpdateFns[chain].push({
                        "watcher": _watchers[_watchersCount],
                        "handler": _bindingFunctions[_totalBindings]
                    });
                    watchers.push(_watchers[_watchersCount]);
                    _watchersCount++;
                }
                _bindingFunctions[_totalBindings]();
                _totalBindings++;
            }
        }
        //TODO:Return the watchers Collection, so we can unwatch :) 
        return watchers;
    };
};

BindingsManager.getIdentifiers = function (bindingExpression) {
    let r = null;
    let tokens = tokenize(bindingExpression).all();
    let m = getMatching(tokens, "type", "IDENTIFIER", false);
    if (m.objects.length > 0) {
        r = m.objects;
    }
    return r;
};
/*
    s: String binding Expression
    site: Object Host object
    chain: String|Array property path or property chain
*/
BindingsManager.getPropertyChains = function (bindingExpression) {
    let tokens = tokenize(bindingExpression).all();
    let toBind = [];
    let kndex = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === "IDENTIFIER" || (tokens[i].type === "STRING" && tokens[i].value.trim() != "") || (tokens[i].type === "INTEGER" && tokens[i - 1] && tokens[i - 1].type === "LEFT_BRACKET")) {
            if (toBind[kndex] == undefined) {
                toBind[kndex] = [];
            }
            toBind[kndex].push(tokens[i].value);

        } else
        if (!(tokens[i].type === "DOT" || tokens[i].type === "LEFT_BRACKET" || tokens[i].type === "RIGHT_BRACKET" || (tokens[i].type === "LEFT_BRACKET" && tokens[i + 1] && tokens[i + 1].type === "LEFT_BRACKET")) && toBind[kndex] != undefined) {
            kndex++;
        }
    }
    return toBind;
};
BindingsManager.instances = {};
BindingsManager.getInstance = function (site) {
    let uid = site["guid"];
    if (!uid) {
        uid = StringUtils.guid();
        if (hasOwnProperty.call(site, "guid")) {
            site["guid"] = uid;
        } else {
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