var Css = function(_css, $el)
{ 
    let _$el = $el;
    if (_css)
    {
        _$el.css(_css);
    }
    
    return new Proxy(this, {
        deleteProperty: function (target, property)
        {
            _$el.css(property, '');
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function(target, property, value, receiver) {   
            _$el.css(property, value);
            target[property] = value;   
            return true;
        },
        get: function(target, property, receiver) {
            return Reflect.get(...arguments);
        }
    });
}