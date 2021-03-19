/**
 * This is a DateCmp Input Element
 *
 * Kreatx 2019
 */
var DateCmp = function (_props) {
    let _self = this, _internalFormat = "YYYY-MM-DD";

    Object.defineProperty(this, "value", {
        get: function value() {
            let date = moment(this.$input.val(), _internalFormat).format(_outputFormat);
            return (date == "Invalid date" || date == "") ? "" : date;
        },
        set: function value(v) {
            _value = moment(v, _inputFormat);
            if (this.$el)
                this.attr['date'] = _value.format(_displayFormat);
            this.$el.val(_value.format(_internalFormat));
        },
        enumerable: true
    });

    Object.defineProperty(this, "min", {
        get: function min() {
            return _min;
        },
        set: function min(v) {
            _min = moment(v, _inputFormat);
            if (this.$el)
                this.attr['min'] = _min.format(_displayFormat);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "max", {
        get: function max() {
            return _max;
        },
        set: function max(v) {
            _max = moment(v, _inputFormat);
            if (this.$el)
                this.attr['max'] = _max.format(_displayFormat);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "inputFormat", {
        get: function inputFormat() {
            return _inputFormat;
        },
        set: function inputFormat(v) {
            if (_inputFormat !== v) {
                _inputFormat = v;
                this.value = _value.format(_inputFormat);;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "outputFormat", {
        get: function outputFormat() {
            return _outputFormat;
        },
        set: function outputFormat(v) {
            if (_outputFormat !== v) {
                _outputFormat = v;
                //this.value = _value;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "displayFormat", {
        get: function displayFormat() {
            return _displayFormat;
        },
        set: function displayFormat(v) {
            if (_displayFormat !== v) {
                _displayFormat = v;
                //this.value = _value;
                this.trigger('change');
            }
        },
        enumerable: true
    });

    this.beforeAttach = function () {
        this.$input = this.$el;      
        if (_props.min) {
            this.min = moment(_props.min, _inputFormat).format(_inputFormat);
        }
        if (_props.max) {
            this.max = moment(_props.max, _inputFormat).format(_inputFormat);
        }
        if (_props.value) {
            this.value = moment(_props.value, _inputFormat).format(_inputFormat);
        }
    };

    this.inputHandler = function (e) {
        _value = moment(this.$input.val(), _internalFormat);
        this.attr['date'] = _value.format(_displayFormat);
    };

    this.template = function () {
        return "<input data-triggers='input' type='date' id='" + this.domID + "'/>";
    };

    let _defaultParams = {
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD/MM/YYYY',
        displayFormat: 'DD/MM/YYYY',
        value: null,
        min: null,
        max: null        
    };

    _props = extend(false, false, _defaultParams, _props);
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _displayFormat = _props.displayFormat;
    let _value, _min, _max;
    let _input = _props.input;
    _props.input = function () {
        if (typeof _input == 'function')
            _input.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.inputHandler();
        }
    };
    let r = Parent.call(this, _props);
    return r;
};
DateCmp.prototype.ctor = "DateCmp";