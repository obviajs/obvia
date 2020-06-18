/**
 * This is a CustomValidator Element
 * 
 * Kreatx 2020
 */

//component definition
var CustomValidator = function (_props) {
    let _self = this,
        _validationFunction;

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        let r = Promise.resolve(_self.isValid);
        if (_controlToValidateInstance) {
            if (!_self.enabled || (_validationFunction && typeof _validationFunction == "function")) {
                r = _validationFunction.apply(_self).then((v) => {
                    _self.isValid = v;
                    return v;
                });
            } else {
                _self.isValid = false;
                r = Promise.resolve(_self.isValid);
            }
        }
        return r;
    };

    Object.defineProperty(this, "_validationFunction", {
        get: function validationFunction() {
            return _validationFunction;
        },
        set: function validationFunction(v) {
            if (_validationFunction != v) {
                _validationFunction = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.validationFunction && !this.getBindingExpression("validationFunction")) {
                _validationFunction = _props.validationFunction;
            }
        }
    };

    let _defaultParams = {
        validationFunction: null
    };

    _props = extend(false, false, _defaultParams, _props);


    let _label;
    let _labelType = _props.labelType;

    let r = Validator.call(this, _props);
    return r;
};
CustomValidator.prototype.ctor = 'CustomValidator';