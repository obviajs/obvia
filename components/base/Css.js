var Css = function (_css, cmpInst) {
    let _$el = cmpInst.$el, _self = this;
    let p = new Proxy(this, {
        deleteProperty: function (target, property) {
            _$el.css(property, '');
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function (target, property, value, receiver) {
            _$el.css(property, value);
            if (_css && _css[property] && Array.isArray(_css[property])) {
                if (!target[property])
                    target[property] = [];
                target[property].push(value);
            } else
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
    UseBindings.call(this, _css);

    this.getScopeChain = function () {
        return [this, ...cmpInst.getScopeChain()];
    };
    return p;
};