/**
 * This is a DateTime Input Element
 *
 * Kreatx 2019
 */

var DateTime = function (_props) {
    let _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            let date = moment(this.$input.val(), "YYYY-MM-DD").format(_outputFormat);
            return (date == "Invalid date" || date == "") ? "" : date;
        },
        set: function value(v) {
            _value = moment(v, _inputFormat);
            if (this.$el)
                this.attr["value"] = _value.format("YYYY-MM-DD");
            this.trigger('change');
        },
        enumerable: true
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
        _enabled = (_enabled !== undefined && _enabled != null ? _enabled : true);
        if (_props.value) {
            this.value = moment(_props.value, _inputFormat).format(_inputFormat);
        } else {
            this.value = _value.format(_inputFormat);
        };
        this.changeHandler();
    }

    this.changeHandler = function (e) {
        _value = moment(this.$input.val(), "YYYY-MM-DD");
        this.attr['data-date'] = _value.format(_displayFormat);
    };

    this.template = function () {
        return "<input data-triggers='change' type='date' id='" + this.domID + "' value='" + _value + "'/>";
    };

    let _defaultParams = {
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD/MM/YYYY',
        displayFormat: 'DD/MM/YYYY',
        value: undefined
    };

    _props = extend(false, false, _defaultParams, _props);
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _displayFormat = _props.displayFormat;
    let _value;
    let _enabled = _props.enabled;
    let _change = _props.change;

    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler();
        }
    };
    let r = Parent.call(this, _props);
    return r;
};
DateTime.prototype.ctor = "DateTime";