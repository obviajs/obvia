var Css = function (_css, $el) {
    let _$el = $el;
    let p = new Proxy(this, {
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

    if (_css) {
        _$el.css(_css);
        for (let prop in _css) {
            if (Array.isArray(_css[prop])) {
                let len = _css[prop].length;
                for (let i = 0; i < len; i++) {
                    p[prop] = _css[prop][i];
                }
            } else {
                p[prop] = _css[prop];
            }
        }
    }

    return p;
};