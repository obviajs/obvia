/**
 * This is a CheckBox Element
 *
 * Kreatx 2019
 */

var CheckBox = function (_props, overrided = false) {
    var _self = this;

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

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value !== v) {
                _value = v;
            } else {
                _checked = true;
            }
            if (this.$input !== undefined)
                this.$input.val(v);
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

    this.beforeAttach = function () {
        this.$input = this.$el.find("#" + this.domID + "-checkbox");
    };

    this.changeHandler = function () {
        _checked = !_checked;
    };

    this.template = function () {
        return "<label  id='" + this.domID + "'>" +
            "<input data-triggers='click change' " + (_checked ? "checked='checked'" : '') + " id='" + this.domID + "-checkbox'  value='" + _value + "' " +
            " type='checkbox'/>" + _label + "</label>";
    };

    var _defaultParams = {
        label: 'CheckBox Label',
        blockProcessAttr: false,
        value: null,
        enabled: true,
        checked: false,
        embedded: false
    };

    _props = extend(false, false, _defaultParams, _props);

    var _label = _props.label;
    var _value = _props.value;
    var _enabled = _props.enabled;
    var _checked = _props.checked;
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

CheckBox.type = "checkbox";