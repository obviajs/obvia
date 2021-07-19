/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */

import { Parent } from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var TextInput = function (_props) {
    let _self = this;
    let _value, _autocomplete, _mask, _placeholder, _type, _input;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                let oldValue = _value;
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
                _myw.propertyChanged("value", oldValue, value);
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
        let oldValue = _value;
        _value = this.$el.val();
        _myw.propertyChanged("value", oldValue, _value);
    };

    this.focus = function () {
        if (this.$el != null) {
            this.$el.focus();
        }
    };

    this.template = function () {
        return "<input data-triggers='input' type='" + this.type + "' id='" + this.domID + "'>";
    };

    let _defaultParams = {
        value: "",
        type: "text",
        placeholder: "",
        afterAttach: this.afterAttach,
        autocomplete: "off"
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _mask = _props.mask;
    _type = _props.type;
    _input = _props.input;

    _props.input = function () {
        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.inputHandler(e);
        }
        if (typeof _input == 'function')
            _input.apply(this, arguments);
    };
    let r = Parent.call(this, _props);
    let _myw = ChangeWatcher.getInstance(r);
    return r;
};

//component prototype
TextInput.prototype.ctor = 'TextInput';
var TextInputType = {
    "EMAIL": "email",
    "PASSWORD": "password",
    "NUMBER": "number",
    "TEXT": "text",
    "DATE": "date",
    "DATETIME-LOCAL": "datetime-local",
    "MONTH": "month",
    "RANGE": "range",
    "TEL": "tel",
    "TIME": "time",
    "URL": "url",
    "WEEK": "week"
};
DependencyContainer.getInstance().register("TextInput", TextInput, DependencyContainer.simpleResolve);
export {
    TextInput, TextInputType
};