var Attr = function(_attr, $el)
{ 
    let _$el = $el;
    if(_attr){
        for(var prop in _attr){
            _$el.attr(prop, _attr[prop]);
            this[prop] = _attr[prop];
        }
    }
    return new Proxy(this, {
        deleteProperty: function (target, property)
        {
            _$el.removeAttr(property);
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function(target, property, value, receiver) {   
            _$el.attr(property, value);
            target[property] = value;   
            return true;
        },
        get: function(target, property, receiver) {
            return Reflect.get(...arguments);
        }
    });
}