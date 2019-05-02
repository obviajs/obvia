/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */
 
//component definition
var TextInput = function (_props, overrided = false) {
    var _self = this;
 
    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                if (_value) {
                    if (this.$el) {
                        this.$el.attr('value', _value);
                        this.trigger('change');
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('value');
                    }
                }
            }
        }
    });
 
    this.attached = false;
    this.afterAttach = function (e) {
        if (e.target.id == this.$el.attr('id') && !this.attached) {
            //init input mask
            if (_mask) {
                this.$el.inputmask(_mask);
                this.attached = true;
            }
        }
    };
 
    this.changeHandler = function () {
        _value = this.$el.val();
    };
 
    this.focus = function () {
        if (this.$el != null) {
            this.$el.focus();
        }
    };
 
    this.template = function () {
        return  "<input data-triggers='change' type='text' id='" + this.domID + "' " +
            (!this.enabled ? "disabled" : "") + " value='" + this.value + "' >";
    };
 
    var _defaultParams = {
        value: "",
        afterAttach: this.afterAttach
    };
    _props = extend(false, false, _defaultParams, _props);
 
    var _value = _props.value;
    var _mask = _props.mask;
    var _change = _props.change;
 
    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);
 
        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler(e);
        }
    };
 
    Component.call(this, _props);
 
    if (overrided) {
        this.keepBase();
    }
};
 
//component prototype
TextInput.prototype.ctor = 'TextInput';