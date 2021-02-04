/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */

//component definition
var TextInput = function (_props) {
    let _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                if (_value != null) {
                    if (this.$el) {
                        this.$el.attr('value', _value);
                        this.$el.val(_value);
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('value');
                        this.$el.val("");
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "placeholder", {
        get: function placeholder() {
            return _placeholder;
        },
        set: function value(v) {
            if (_placeholder != v) {
                _placeholder = v;
                if (_placeholder) {
                    if (this.$el)
                        this.$el.attr('placeholder', _placeholder);

                }
            } else {
                this.$el.removeAttr('placeholder');
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "type", {
        get: function type() {
            return _type;
        },
        set: function type(v) {
            if (_type != v) {
                _type = v;
                if (_type != null) {
                    if (this.$el) {
                        this.$el.attr('type', _type);
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('type');
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "autocomplete", {
        get: function autocomplete() {
            return _autocomplete;
        },
        set: function autocomplete(v) {
            if (_autocomplete != v) {
                _autocomplete = v;
                if (_autocomplete != null) {
                    if (this.$el) {
                        this.$el.attr('autocomplete', _autocomplete);
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('autocomplete');
                    }
                }
            }
        },
        enumerable: true
    });

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function') _beforeAttach.apply(this, arguments);
            if (_props.value != null) this.value = _props.value;
            if (_props.autocomplete != null) this.autocomplete = _props.autocomplete;
            if (_props.placeholder) this.placeholder = _props.placeholder;
        }
    };

    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _afterAttach == 'function') _afterAttach.apply(this, arguments);
            //init input mask
            if (_mask) {
                this.$el.inputmask(_mask);
            }
        }
    };

    this.inputHandler = function () {
        _value = this.$el.val();
    };

    this.focus = function () {
        if (this.$el != null) {
            this.$el.focus();
        }
    };

    this.template = function () {
        return "<input data-triggers='input' type='" + this.type + "' id='" + this.domID + "'>";
    };

    var _defaultParams = {
        value: "",
        type: "text",
        placeholder: "",
        afterAttach: this.afterAttach,
        autocomplete: "off"
    };

    _props = extend(false, false, _defaultParams, _props);
    let _autocomplete;
    let _value;
    let _mask = _props.mask;
    let _placeholder;
    let _type = _props.type;
    let _input = _props.input;

    _props.input = function () {
        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.inputHandler(e);
        }
        if (typeof _input == 'function')
            _input.apply(this, arguments);
    };
    let r = Parent.call(this, _props);
    return r;
};

//component prototype
TextInput.prototype.ctor = 'TextInput';