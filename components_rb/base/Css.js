var Css = function (_css, $el) {
    let _$el = $el;
    if (_css) {
        _$el.css(_css);
        for(var prop in _css){
            this[prop] = _css[prop];
        }
    }
    
    return new Proxy(this, {
        deleteProperty: function (target, property) {
            _$el.css(property, '');
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function (target, property, value, receiver) {
            _$el.css(property, value);
            target[property] = value;
            return true;
        },
        get: function (target, property, receiver) {
            if (!isSymbol(property) && target[property] == null) {
                target[property] = _$el.css(property); 
            }
            return Reflect.get(...arguments);
        }
    });
};