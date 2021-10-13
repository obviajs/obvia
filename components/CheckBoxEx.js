/**
 * This is a CheckBox Element
 *
 * Kreatx 2019
 */
import { Component } from "/obvia/components/base/Component.js";
import { Label } from "/obvia/components/Label.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var CheckBoxEx = function (_props) {
    let _self = this, _value, _checked, _name;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _self.proxyMaybe.checkBox.value;
        },
        set: function value(v) {
            _self.proxyMaybe.checkBox.value = v;
        }
    });

    Object.defineProperty(this, "checked",
    {
        get: function checked() {
            return _self.proxyMaybe.checkBox.checked;
        },
        set: function checked(v) {
            _self.proxyMaybe.checkBox.checked = v;
        }
    });
    
    Object.defineProperty(this, "name", {
        set: function name(v) {
            _self.proxyMaybe.checkBox.name = v;
        },
        get: function name() {
            return _self.proxyMaybe.checkBox.name;
        }
    });

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            this.$input = this.checkBox.$el;
        }
    };
            
    this.beforeAttach = function (e) 
    {
        if (e.target.id == this.domID)
        {
            if (_props.label && !this.getBindingExpression("label")){
                this.label = _props.label;
            }
            if (_props.value && !this.getBindingExpression("value")){
                this.value = _props.value;
            }
            if (_props.checked && !this.getBindingExpression("checked")){
                this.checked = _props.checked;
            }
            if (_props.enabled && !this.getBindingExpression("enabled")){
                this.enabled = _props.enabled;
            }
        }
    };

    let _clickHandler = function () {
        _checked = !_checked;
    };

    let _defaultComponents = [
        {
            ctor: "CheckBox",
            props: {
                id:"checkBox"

            }
        }
    ];

    let _defaultParams = {
        label: 'CheckBox Label',
        value: null,
        enabled: true,
        checked: false,
        components: _defaultComponents
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let _click = _props.click;

    _props.click = function () {
        if (typeof _click == 'function')
            _click.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _clickHandler.apply(this, arguments);
        }
    };

    let r = Label.call(this, _props);
    return r;
};
DependencyContainer.getInstance().register("CheckBoxEx", CheckBoxEx, DependencyContainer.simpleResolve);
CheckBoxEx.prototype.ctor = "CheckBoxEx";
export {
    CheckBoxEx
};