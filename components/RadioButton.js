/**
 * This is a Radio Button Element
 *
 * 
 */

import { Component } from "/obvia/components/base/Component.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { extractText } from "/obvia/lib/my.js";
var RadioButton = function (_props)
{

    let _self = this,
        _label, _labelForLater, _value, _checked, _name;

    Object.defineProperty(this, "label", {
        get: function label()
        {
            return _label;
        },
        set: function label(v)
        {
            if (_label != v)
            {
                if (this.$el && this.attached)
                {
                    v = extractText(v);
                    let last = this.$el[0].nextSibling;
                    if (last)
                        last.textContent = v;
                    else
                    {
                        this.$el[0].insertAdjacentHTML('afterend', v);
                    }
                    _label = v;
                } else
                {
                    _labelForLater = v;
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "value", {
        get: function value()
        {
            return _value;
        },
        set: function value(v)
        {
            if (_value != v)
                _value = v;
            else
                _self.checked = true;
            if (this.$el)
                this.$el[0].checked = v;
        }
    });

    Object.defineProperty(this, "checked", {
        get: function checked()
        {
            return _checked;
        },
        set: function checked(v)
        {
            if (_checked != v)
            {
                _checked = !!v;
                if (this.$el)
                    this.$el[0].checked = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "name", {
        set: function name(v)
        {
            if (_name != v)
            {
                _name = v;
                this.$el[0].name = v;
            }
        },
        get: function name()
        {
            return _name;
        }
    });

    let _clickHandler = function ()
    {
        _checked = !_checked;
    };

    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (_props.label && !this.getBindingExpression("label"))
            {
                this.label = _props.label;
            }
            if (_props.name && !this.getBindingExpression("name"))
            {
                this.name = _props.name;
            }
            if (_props.value && !this.getBindingExpression("value"))
            {
                this.value = _props.value;
            }
            if (_props.checked && !this.getBindingExpression("checked"))
            {
                this.checked = _props.checked;
            }
            if (_props.enabled && !this.getBindingExpression("enabled"))
            {
                this.enabled = _props.enabled;
            }
        }
    };

    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            this.label = _labelForLater;
        }
    };

    this.template = function ()
    {
        return "<input type='radio' data-triggers='click' id='" + this.domID + "' class='no-form-control'>";
    };

    let _defaultParams = {
        label: "",
        value: "",
        checked: false,
        enabled: true,
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let _click = _props.click;

    _props.click = function ()
    {
        let e = arguments[0];
        if (!e.isDefaultPrevented())
        {
            _clickHandler.apply(this, arguments);
        }
        if (typeof _click == 'function')
            _click.apply(this, arguments);
    };
    let r = Component.call(this, _props);
    return r;
};
DependencyContainer.getInstance().register("RadioButton", RadioButton, DependencyContainer.simpleResolve);
RadioButton.prototype.ctor = 'RadioButton';
export
{
    RadioButton
};