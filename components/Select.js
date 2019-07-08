/**
 * This is a Select Html Element
 *
 * Kreatx 2019
 */

//component definition
var Select = function (_props, overrided = false) {
    var _self = this;
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                _dataProvider = v;
            }
        }
    });

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
        return "<select data-triggers='change' id='" + this.domID + "'>" + "</select>";
    };

    this.renderOptions = function () {
        var opts = "";

        _dataProvider.forEach(function (option, index) {
            if (option[_valueField] == _value) {
                opts += "<option value=" + option[_valueField] + " selected>" + option[_labelField] + "</option>";
            } else {
                opts += "<option value=" + option[_valueField] + ">" + option[_labelField] + "</option>";
            }
        }.bind(this));

        return opts;
    };

    var _defaultParams = {
        dataProvider: null,
        labelField: "",
        valueField: "",
        value: "",
        afterAttach: this.afterAttach
    };
    _props = extend(false, false, _defaultParams, _props);
    _props.applyBindings = false;
    var _dataProvider = _props.dataProvider;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;
    var _value = _props.value;
    var _change = _props.change;

    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler.apply(this, arguments);
        }
    };

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
Select.prototype.ctor = 'Select';