/**
 * This is a DateTime Input Element
 *
 * Kreatx 2019
 */

var DateTime = function (_props, overrided = false) {
    var _self = this;
    Object.defineProperty(this, "label",
        {
            get: function label() {
                return _label;
            },
            set: function label(v) {
                if (_label != v) {
                    _label = v;
                    var target = this.$el.find("label");
                    if (target) {
                        target.children(":first-child").html(v);
                    }
                }
            }
        });

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
        this.$input = this.$el.filter("#" + this.domID + "-datetime");
        _enabled = (_enabled !== undefined && _enabled != null ? _enabled : true);
    };

    this.afterAttach = function (e) {
        //init datepicker

        if (_value != "" && _value != null && _value != "0000-00-00 00:00:00")
            _value = moment(this.$input.val()).format(_inputFormat);
        else
            _value = "";

        this.$input.datepicker({
            uiLibrary: 'bootstrap4',
            format: "dd/mm/yyyy",
        });
    };

    this.validate = function () {
        if (_required) {
            if (_value == "" || _value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];

                this.$input.addClass('invalid');
            } else {
                this.errorList = [];
                this.$input.removeClass('invalid');
            }
        }
    };

    this.changeHandler = function (e) {
        this.validate();
    };

    this.template = function () {
        return "<label id='" + this.domID + "'><b>" + _label + "</b></label>" +
            "<input data-triggers='change' type='text' id='" + this.domID + "-datetime' name='" + this.domID + "' value='" + _value + "' class='form-control'  placeholder='" + _label + "'/>";
    };

    var _defaultParams = {
        id: 'datetime',
        colspan: '4',
        label: 'qqq',
        versionStyle: '',
        blockProcessAttr: false,
        required: true,
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD-MM-YYYY',
        displayFormat: 'DD/MM/YYYY',
        value: '20/10/2010',
        afterAttach: this.afterAttach,
    };

    _props = extend(false, false, _defaultParams, _props);
    var _label = _props.label;
    var _required = _props.required;
    var _inputFormat = _props.inputFormat;
    var _outputFormat = _props.outputFormat;
    var _displayFormat = _props.displayFormat;
    var _value = _props.value;
    var _enabled = _props.enabled;
    var _embedded = _props.embedded;
    var _change = _props.change;

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

DateTime.type = "datetime";