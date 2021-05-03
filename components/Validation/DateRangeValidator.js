/**
 * This is a DateRangeValidator Element
 * 
 * Kreatx 2020
 */

//component definition
var DateRangeValidator = function (_props) {
    let _self = this,
        _min, _max;

    let _defaultParams = {
        min: null,
        max: null,
        inputFormat: "YYYY-MM-DD HH:mm",
        outputFormat: "YYYY-MM-DD HH:mm"
    };

    _props = extend(false, false, _defaultParams, _props);

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
            _min = moment(v, _inputFormat).format("X");
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "max", {
        get: function max() {
            return _max;
        },
        set: function max(v) {
            _max = moment(v, _inputFormat).format("X");
        },
        enumerable: true,
        configurable: true
    });

    this.validate = function () {
        let _controlToValidateInstance = _self.controlToValidateInstance;
        if (_controlToValidateInstance) {
            let v = moment(_controlToValidateInstance.value, _outputFormat).format("X");;
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