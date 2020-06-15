/**
 * This is a RegularExpressionValidator Element
 * 
 * Kreatx 2020
 */

//component definition
var RegularExpressionValidator = function (_props) {
    let _self = this, _validationExpression, _validationExpressionCompiled, _modifiers;

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance) { 
            if (!_self.enabled || (_controlToValidateInstance.value && _validationExpressionCompiled.test(_controlToValidateInstance.value))) {
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
                _validationExpressionCompiled = new RegExp(validator[type].exp, _modifiers);
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
            }
        },
        enumerable: true,
        configurable: true
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.label && !this.getBindingExpression("label")) {
                this.label = _props.label;
            }
            if (min > max) { 
                throw new Error("The specified Min value is greater than the specified Max value.");
            }
        }
    };

    let _defaultParams = {
        validationExpression: null,
        modifiers: ""
    };

    _props = extend(false, false, _defaultParams, _props);

    let _label;
    let _labelType = _props.labelType;

    let r = Validator.call(this, _props);
    return r;
};
RegularExpressionValidator.prototype.ctor = 'RegularExpressionValidator';