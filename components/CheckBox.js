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
                if (this.$el)
                    this.$el[0].nextSibling.textContent = v;
            }
        },
        enumerable:true
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
            if (this.$el !== undefined)
                this.$el.val(v);
        },
        enumerable:true
    });

    Object.defineProperty(this, "checked",
    {
        get: function checked() {
            return _checked;
        },
        set: function checked(v) {
            if (_checked != v) {
                _checked = !!v;
                if (this.$el)
                    this.$el.prop('checked', v)
            }
        },
        enumerable:true
    });

    var _changeHandler = function () {
        _checked = !_checked;
    };

    this.template = function () {
        return "<input " + (_checked ? "checked='checked'" : '') + " id='" + this.domID + "'  value='" + _value + "' " +
            " type='checkbox'/>" + _label;
    };

    var _defaultParams = {
        label: '',
        value: null,
        enabled: true,
        checked: false,
        embedded: false
    };

    _props = extend(false, false, _defaultParams, _props);

    var _label = _props.label;
    var _value = _props.value;
    var _checked = _props.checked;
    var _change = _props.change;

    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _changeHandler.apply(this, arguments);
        }
    };

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

CheckBox.prototype.ctor = "CheckBox";