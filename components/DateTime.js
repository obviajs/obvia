/**
 * This is a DateTime Input Element
 *
 * Kreatx 2019
 */

var DateTime = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            var date = moment(this.$input.val(), _inputFormat).format(_outputFormat);
            return (date == "Invalid date" || date == "") ? "" : date;
        },
        set: function value(v) {
            _value = moment(v).format(_inputFormat);
            this.trigger('change');
        }
    });

    this.beforeAttach = function () {
        this.$input = this.$el;
        _enabled = (_enabled !== undefined && _enabled != null ? _enabled : true);
    };

    this.afterAttach = function (e) {
        //init datepicker
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);

        if (_value != "" && _value != null && _value != "0000-00-00 00:00:00")
            _value = moment(this.$input.val()).format(_inputFormat);
        else
            _value = "";

        this.$input.datepicker({
            uiLibrary: 'bootstrap4',
            format: "dd/mm/yyyy",
        });
    };

    this.changeHandler = function (e) {
    };

    this.template = function () {
        return "<input data-triggers='change' type='text' id='" + this.domID + "' value='" + _value + "'/>";
    };

    var _defaultParams = {
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD-MM-YYYY',
        displayFormat: 'DD/MM/YYYY',
        value: '20/10/2010'
    };

    _props = extend(false, false, _defaultParams, _props);
    var _inputFormat = _props.inputFormat;
    var _outputFormat = _props.outputFormat;
    var _displayFormat = _props.displayFormat;
    var _value = _props.value;
    var _enabled = _props.enabled;
    var _change = _props.change;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;

    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler();
        }
    };
    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

DateTime.prototype.type = "DateTime";