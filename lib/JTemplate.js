var JTemplate = function(_tpl, _context)
{
    var _hash = {};
    var _guid = guid();
    var _self = this;
    var _tempObj = null;

    this.parse = function()
    {
        const regex = /{{(\w|[\s-+.@,/\//()?=*_\"'\[\]])+}}/g;
        let parameters = [];
        if (regex.test(_tpl)) {
            const matches = _tpl.match(regex);
            matches.map(_processBinding);
        }
        _tempObj = JSON.parse(_tpl);
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
        _explore(_tempObj, []);
        return _tempObj;
    };

    var _watchers = [];
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
                _context = window[defaultBindTo] = (_context || Component.defaultContext);
                _watchers.splicea(_watchers.length, 0, BindingUtils.getValue(_context, bindingExp, obj, chain, defaultBindTo));
            }else if (isObject(obj[prop])) 
            {
                chain.push(prop);
                _explore(obj[prop], chain.slice(0));
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
}
JTemplate.defaultContext = window;