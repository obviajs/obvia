/**
 * This is a RequiredFieldValidator Element
 * 
 * Kreatx 2020
 */

import { Validator } from "/obvia/components/Validation/Validator.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ValidationManager } from "/obvia/components/Validation/ValidationManager.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var RequiredFieldValidator = function (_props) {
    let _self = this;

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance) {
            let value = _controlToValidateInstance.valueProp ? _controlToValidateInstance[_controlToValidateInstance.valueProp] : _controlToValidateInstance.value;
            if (!_self.enabled || (value != null && value != "")) {
                _self.isValid = true;
            } else
                _self.isValid = false;
        }
        return Promise.resolve(_self.isValid);
    };

    let _defaultParams = {

    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = Validator.call(this, _props);
    return r;
};
RequiredFieldValidator.prototype.ctor = 'RequiredFieldValidator';
DependencyContainer.getInstance().register("RequiredFieldValidator", RequiredFieldValidator, DependencyContainer.simpleResolve);
export {
    RequiredFieldValidator
};