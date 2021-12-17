import { UseBindings } from "/obvia/lib/UseBindings.js";
import { isSymbol } from "/obvia/lib/my.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";

var Attr = function (_attr, cmpInst)
{
    let _$el = cmpInst.$el, _self = this;
    let p = new Proxy(this, {
        deleteProperty: function (target, property)
        {
            _$el.removeAttr(property);
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function (target, property, value, receiver)
        {
            if (property != "bindingDefaultContext")
            {
                if (typeof value != "function")
                {
                    if (value && !StringUtils.isString(value) && isNaN(value))
                    {
                        _$el.attr(property, JSON.stringify(value));
                    } else if (value != null)
                        _$el.attr(property, value);
                }
            }
            target[property] = value;
            return true;
        },
        get: function (target, property, receiver)
        {
            if (!isSymbol(property) && target[property] == null)
            {
                let v = _$el.attr(property);
                if (v)
                    target[property] = JSON.parse(_$el.attr(property));
            }
            return Reflect.get(...arguments);
        }
    });
    _self.guid = null;
    UseBindings.call(p, _attr);
    if (_attr)
    {
        for (let prop in _attr)
        {
            if (this.bindedProps.hasOwnProperty(prop))
                delete _attr[prop];
            else
                p[prop] = _attr[prop];
        }
    }

    this.getScopeChain = function ()
    {
        for (let prop in this.bindedProps)
        {
            delete this[prop];
        }
        return [this, ...cmpInst.getScopeChain()];
    };
    return p;
};
export
{
    Attr
};