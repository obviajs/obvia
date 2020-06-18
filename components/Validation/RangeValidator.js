/**
 * This is a RangeValidator Element
 * 
 * Kreatx 2020
 */

//component definition
var RangeValidator = function (_props) {
    let _self = this,
        _min, _max;

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance) {
            if (!_self.enabled || (_controlToValidateInstance.value >= _min && _controlToValidateInstance.value <= _max)) {
                _self.isValid = true;
            } else
                _self.isValid = false;
        }
        return Promise.resolve(_self.isValid);
    };

    Object.defineProperty(this, "min", {
        get: function min() {
            return _min;
        },
        set: function min(v) {
            if (_min != v) {
                _min = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "max", {
        get: function max() {
            return _max;
        },
        set: function max(v) {
            if (_max != v) {
                _max = v;
            }
        },
        enumerable: true,
        configurable: true
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.max != null) {
                _max = _props.max;
            }
            if (_props.min != null) {
                _min = _props.min;
            }
            if (_min > _max) {
                throw new Error("The specified Min value is greater than the specified Max value.");
            }
        }
    };

    let _defaultParams = {
        min: null,
        max: null
    };

    _props = extend(false, false, _defaultParams, _props);


    let _label;
    let _labelType = _props.labelType;

    let r = Validator.call(this, _props);
    return r;
};
RangeValidator.prototype.ctor = 'RangeValidator';