/**
 * This is a Radio Button Element
 *
 * Kreatx 2019
 */

//component definition
var RadioButton = function (_props, overrided = false) {

    Object.defineProperty(this, "label",
    {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (this.$input)
                    this.$input[0].nextSibling.textContent = v;
            }
        }
    });

    Object.defineProperty(this, "checked",
    {
        get: function checked() {
            return _checked;
        },
        set: function checked(v) {
            if (_checked != v) {
                _checked = !!v;
                if (this.$input)
                    this.$input.prop('checked', v)
            }
        }
    });

    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v)
                _value = v;
            else
                _checked = true;
            if (this.$input)
                this.$input.val(v);
        }
    });

    Object.defineProperty(this, "name", {
        set: function name(v) {
            if(_name!=v){
                _name = v;
                this.$input.attr("name", v);
            }
        },
        get: function name() {
            return _name;
        }
    });

    this.beforeAttach = function () {
        this.$input = this.$el.find("#" + this.domID + "-radio");
        if(_props.name){
            this.name = _props.name;
        }
    };

    this.template = function () {
        return "<label id='" + this.domID + "'>" +
            "<input data-triggers='click' id='" + this.domID + "-radio' type='radio' class='no-form-control' value='" + _value + "' " + (!_enabled ? "disabled" : "") + (_checked ? "checked='checked'" : '') + ">"
            + _label +
            "</label>";
    };

    var _defaultParams = {
        label: "",
        value: "",
        checked: false,
        enabled: true,
    };
    _props = extend(false, false, _defaultParams, _props);

    var _label = _props.label;
    var _value = _props.value;
    var _checked = _props.checked;
    var _enabled = _props.enabled;
    var _name;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
RadioButton.prototype.ctor = 'RadioButton';