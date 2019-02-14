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
                    if (this.$el)
                        this.$el.find("span").html(v);
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
            this.$input.attr("name", v)
        }
    });

    this.beforeAttach = function () {
        this.$input = this.$el.find("#" + this.domID + "-radio");
    };

    this.template = function () {
        return "<label id='" + this.domID + "'>" +
            "<input data-triggers='click' id='" + this.domID + "-radio' name='" + _name + "-radio' type='radio' class='" + this.cssClass + "' value='" + _value + "' " + (!_enabled ? "disabled" : "") + (_checked ? "checked='checked'" : '') + ">" +
            "<span>" + _label + "</span>" +
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
    var _name = _props.name;
    var _value = _props.value;
    var _checked = _props.checked;
    var _enabled = _props.enabled;
    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
RadioButton.type = 'radio';