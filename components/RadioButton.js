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
        _enabled = (_enabled != undefined && _enabled != null ? _enabled : true);
    };

    this.template = function () {
        return "<label>" +
            "<input data-triggers='click' id='" + this.domID + "' name='" + this.domID + "' type='radio' class='" + this.cssClass + "' value='" + _value + "' + rv-enabled='enabled' " + (_checked ? "checked='checked'" : '') + ">" + _label +
            "</label>";
    };


    var _defaultParams = {
        label: "",
        enabled: "",
        value: "",
        blockProcessAttr: false,
        checked: false
    };
    _props = extend(false, false, _defaultParams, _props);

    var _label = _props.label;
    var _enabled = _props.enabled;
    var _value = _props.value;
    var _blockProcessAttr = _props.required ? false : _props.blockProcessAttr;
    var _checked = _props.checked;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
RadioButton.type = 'radio';