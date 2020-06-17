/**
 * This is a RegularExpressionValidator Element
 * 
 * Kreatx 2020
 */

//component definition
var RegularExpressionValidator = function (_props) {
    let _self = this,
        _validationExpression, _validationExpressionCompiled, _modifiers;

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
            _validationExpressionCompiled = new RegExp(_validationExpression, _modifiers);
            return _validationExpressionCompiled;
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
            }
        },
        enumerable: true,
        configurable: true
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.validationExpression && !this.getBindingExpression("validationExpression"))
                _validationExpression = _props.validationExpression;

            if (_props.modifiers && !this.getBindingExpression("validationExpression"))
                _modifiers = _props.modifiers;
            if (_props.label && !this.getBindingExpression("label"))
                this.label = _props.label;

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