/**
 * This is a RequiredFieldValidator Element
 * 
 * 
 */

import { Validator } from "/obvia/components/Validation/Validator.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ValidationManager } from "/obvia/components/Validation/ValidationManager.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var RequiredFieldValidator = function (_props)
{
    let _self = this;

    this.validate = function ()
    {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance)
        {
            let value = _controlToValidateInstance.valueProp ? _controlToValidateInstance[_controlToValidateInstance.valueProp] : _controlToValidateInstance.value;
            let isArray = value instanceof ArrayEx || Array.isArray(value);
            if (!_self.enabled || typeof value === "string")
            {
                _self.isValid = value.trim() !== "";
            } else if (!_self.enabled || (value != null && !isArray || (isArray && value.length > 0)))
            {
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
export
{
    RequiredFieldValidator
};