/**
 * This is a RegularExpressionValidator Element
 * 
 * Kreatx 2020
 */

import { Validator } from "/obvia/components/Validation/Validator.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var RegularExpressionValidator = function (_props) {
    let _self = this,
        _validationExpression, _validationExpressionCompiled, _modifiers;

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance) {
            if ((!_self.required && (_controlToValidateInstance.value ==null || _controlToValidateInstance.value=="")) || (!_self.enabled && _controlToValidateInstance.value=="") || (_controlToValidateInstance.value && _validationExpressionCompiled.test(_controlToValidateInstance.value))) {
                _self.isValid = true;
            } else
                _self.isValid = false;
        }
        return Promise.resolve(_self.isValid);
    };

    Object.defineProperty(this, "validationExpression", {
        get: function validationExpression() {
            return _validationExpression;
        },
        set: function validationExpression(v) {
            if (_validationExpression != v) {
                _validationExpression = v;
                _validationExpressionCompiled = new RegExp(_validationExpression, _modifiers);
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "modifiers", {
        get: function modifiers() {
            return _modifiers;
        },
        set: function modifiers(v) {
            if (_modifiers != v) {
                _modifiers = v;
                _validationExpressionCompiled = new RegExp(_validationExpression, _modifiers);
            }
        },
        enumerable: true,
        configurable: true
    });


    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.validationExpression && !this.getBindingExpression("validationExpression"))
                this.validationExpression = _props.validationExpression;
            if (_props.modifiers && !this.getBindingExpression("modifiers"))
                this.modifiers = _props.modifiers;
        }
    };

    let _defaultParams = {
        validationExpression: null,
        modifiers: ""
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);


    let _label;
    let _labelType = _props.labelType;

    let r = Validator.call(this, _props);
    return r;
};
RegularExpressionValidator.prototype.ctor = 'RegularExpressionValidator';
DependencyContainer.getInstance().register("RegularExpressionValidator", RegularExpressionValidator, DependencyContainer.simpleResolve);
export {
    RegularExpressionValidator
};