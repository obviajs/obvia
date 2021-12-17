import { UseBindings } from "/obvia/lib/UseBindings.js";
import { isSymbol } from "/obvia/lib/my.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";

var Css = function (_css, cmpInst)
{
    let _$el = cmpInst.$el, _self = this;
    let p = new Proxy(this, {
        deleteProperty: function (target, property)
        {
            _$el.css(property, '');
            Reflect.deleteProperty(target, property);
            return true;
        },
        set: function (target, property, value, receiver)
        {
            if (property != "bindingDefaultContext")
            {
                if (typeof value != "function")
                {
                    _$el.css(property, value);
                }
                if (_css && _css[property] && Array.isArray(_css[property]))
                {
                    if (!target[property])
                        target[property] = [];
                    target[property].push(value);
                } else
                    target[property] = value;
            } else
                target[property] = value;
            return true;
        },
        get: function (target, property, receiver)
        {
            if (!isSymbol(property) && target[property] == null)
            {
                target[property] = _$el.css(property);
            }
            return Reflect.get(...arguments);
        }
    });

    UseBindings.call(p, _css);
    if (_css)
    {
        for (let prop in _css)
        {
            if (this.bindedProps.hasOwnProperty(prop))
                delete _css[prop];
            else
            {
                if (Array.isArray(_css[prop]))
                {
                    let len = _css[prop].length;
                    for (let i = 0; i < len; i++)
                    {
                        p[prop] = _css[prop][i];
                    }
                } else
                {
                    p[prop] = _css[prop];
                }
            }
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
    Css
};