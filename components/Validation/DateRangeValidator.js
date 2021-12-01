/**
 * This is a DateRangeValidator Element
 * 
 * Kreatx 2020
 */
import { Validator } from "/obvia/components/Validation/Validator.js";
import { RangeValidator } from "/obvia/components/Validation/RangeValidator.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var DateRangeValidator = function (_props) {
    let _self = this,
        _min, _max;

    let _defaultParams = {
        min: null,
        max: null,
        inputFormat: "YYYY-MM-DD HH:mm",
        outputFormat: "YYYY-MM-DD HH:mm"
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _labelType = _props.labelType;

    let r = RangeValidator.call(this, _props);

    //Override default behavior
    Object.defineProperty(this, "min", {
        get: function min() {
            return _min;
        },
        set: function min(v) {
            _min = dayjs(v, _inputFormat).valueOf();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "max", {
        get: function max() {
            return _max;
        },
        set: function max(v) {
            _max = dayjs(v, _inputFormat).valueOf();
        },
        enumerable: true,
        configurable: true
    });

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance) {
            let v = dayjs(_controlToValidateInstance.value, _outputFormat).valueOf();
            if (!_self.enabled || ( (_self.min == null || v >= _self.min) && (_self.max ==null || v <= _self.max))) {
                _self.isValid = true;
            } else
                _self.isValid = false;
        }
        return Promise.resolve(_self.isValid);
    };

    return r;
};
DateRangeValidator.prototype.ctor = 'DateRangeValidator';
DependencyContainer.getInstance().register("DateRangeValidator", DateRangeValidator, DependencyContainer.simpleResolve);
export {
    DateRangeValidator
};