var JTemplate = function(_tpl, _context)
{
    var _hash = {};
    var _guid = StringUtils.guid();
    var _self = this;
    var _tempObj = null;
    const _regex = /{{(\w|[\s-+.@,/\//()?=*_\"'\[\]])+}}/g;
        
    this.parse = function()
    {
        _mutations = [];
        if(isString(_tpl))
        {
            if (_regex.test(_tpl)) {
                const matches = _tpl.match(_regex);
                matches.map(_processBinding);
            }
            _tempObj = JSON.parse(_tpl);
        }else
        {
            _tempObj = extend(true, false, _tpl);
            _processBindingsLiteral(_tempObj);
        }
        _explore(_tempObj, []);
        return _tempObj;
    };

    this.resetBindings = function()
    {
        for(var i=0;i<_watchers.length;i++)
        {
            _watchers[i].reset();        
        }
    };

    this.refreshBindings = function(newContext)
    {
        _context = newContext;
        this.resetBindings();
        _tempObj = JSON.parse(_tpl);
        _mutations = [];
        _explore(_tempObj, []);
        return _tempObj;
    };

    var _watchers = [];
    var _mutations = [];

    var _explore = function(obj, chain)
    {
        for(var prop in obj)
        {
            if(isString(obj[prop]) && _hash[obj[prop]])
            {
                //cpath
                let bindingExp = _hash[obj[prop]];
                chain.push(prop);
                var defaultBindTo = "currentItem_"+_guid;
                _context = window[defaultBindTo] = (_context || JTemplate.defaultContext);
                _watchers.splicea(_watchers.length, 0, BindingUtils.getValue(_context, bindingExp, _tempObj, chain, defaultBindTo));
                _mutations.push({host: _tempObj, "chain": chain.slice(0)});
            }else if (isObject(obj[prop]) || Array.isArray(obj[prop])) 
            {
                var chainBranch = chain.slice(0);
                chainBranch.push(prop);
                _explore(obj[prop], chainBranch);
            }
        }
    }
    var _processBindingsLiteral = function(tplObj)
    {
        for(var prop in tplObj)
        {
            if(isString(tplObj[prop]) && _regex.test(tplObj[prop])) 
            {
                let chash = tplObj[prop].hashCode();
                let key = "a_"+(chash<0? "n"+Math.abs(chash):chash);
                if(_hash[key]==null)
                {
                    _hash[key] = tplObj[prop].slice(2, -2);
                }
                tplObj[prop] = key;
            }else if(isObject(tplObj[prop]) || Array.isArray(tplObj[prop]))
            {
                _processBindingsLiteral(tplObj[prop]);
            }
        }
    }

    var _processBinding = function(matched)
    {
        let chash = matched.hashCode();
        let key = "a_"+(chash<0? "n"+Math.abs(chash):chash);
        if(_hash[key]==null)
        {
            _hash[key] = matched.slice(2, -2);
            let regex = new RegExp(matched,'g');
            _tpl = _tpl.replace(regex, '"'+key+'"');
        }
    }

    Object.defineProperty(this, "mutations",
    {
        get: function mutations()
        {
            return _mutations;
        }
    });
    
}
JTemplate.defaultContext = window;
JTemplate.prototype.ctor = 'JTemplate';