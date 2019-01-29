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

    this.beforeAttach = function () {
        this.$input = this.$el.find("#" + this.domID);
    };

    this.template = function () {
        return "<label>" +
            "<input data-triggers='click' id='" + this.domID + "' name='" + this.domID + "' type='radio' class='" + this.cssClass + "' value='" + this.value + "' " + (!this.enabled ? "disabled" : "") +  (this.checked ? "checked='checked'" : '') + ">" + this.label +
            "</label>";
    };


    var _defaultParams = {
        label: "",
        value: "",
        checked: false
    };
    _props = extend(false, false, _defaultParams, _props);

    var _label = _props.label;
    var _value = _props.value;
    var _checked = _props.checked;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
RadioButton.type = 'radio';