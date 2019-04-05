/**
 * This is a Select Html Element
 *
 * Kreatx 2019
 */

//component definition
var Select = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value",
        {
            get: function value() {
                return _value;
            },
            set: function value(v) {
                if (_value != v) {
                    _value = v;
                    if (this.$el) {
                        this.$el.val(v);
                        this.trigger('change');
                    }
                }
            }
        });

    this.afterAttach = function (e) {
        this.$el.html(this.renderOptions());
    };

    this.changeHandler = function (e) {
        _value = this.$el.val();
    };

    this.template = function () {
        return "<select data-triggers='change' " + (!this.enabled ? "disabled" : "") + " class='" + this.cssClass + "' id='" + this.domID + "'>" + "</select>";
    };

    this.selectByText = function (text) {
        this.$el.find('option').each(function () {
            if ($(this).html() == text) {
                this.value = $(this).attr('value');
            }
        });

    };

    this.renderOptions = function () {
        var opts = "";

        _dataProvider.forEach(function (option, index) {
            if (option[_valueField] == _value) {
                opts += "<option value=" + option[_valueField] + " selected>" + option[_textField] + "</option>";
            } else {
                opts += "<option value=" + option[_valueField] + ">" + option[_textField] + "</option>";
            }
        }.bind(this));

        return opts;
    };

    var _defaultParams = {
        dataProvider: null,
        textField: "",
        valueField: "",
        value: "",
        class: "form-control",
        afterAttach: this.afterAttach
    };
    _props = extend(false, false, _defaultParams, _props);

    var _dataProvider = _props.dataProvider;
    var _textField = _props.textField;
    var _valueField = _props.valueField;
    var _value = _props.value;
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

//component prototype
Select.prototype.type = 'Select';