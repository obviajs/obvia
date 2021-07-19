/**
 * This is a CustomValidator Element
 * 
 * Kreatx 2020
 */
import { Validator } from "/obvia/components/Validation/Validator.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var CustomValidator = function (_props) {
    let _self = this,
        _validationFunction;

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        let r = Promise.resolve(_self.isValid);
        if (_controlToValidateInstance) {
            if (_self.enabled && _validationFunction !=null) {
                if (typeof _validationFunction == "function") {
                    r = _validationFunction.apply(_self).then((v) => {
                        _self.isValid = v;
                        return v;
                    });
                } else {
                    _self.isValid = _validationFunction;
                    r = Promise.resolve(_validationFunction);
                }                
            } else {
                _self.isValid = !_self.enabled;
                r = Promise.resolve(_self.isValid);
            }
        }
        return r;
    };

    Object.defineProperty(this, "validationFunction", {
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
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);


    let _label;
    let _labelType = _props.labelType;

    let r = Validator.call(this, _props);
    return r;
};
CustomValidator.prototype.ctor = 'CustomValidator';
DependencyContainer.getInstance().register("CustomValidator", CustomValidator, DependencyContainer.simpleResolve);
export {
    CustomValidator
};