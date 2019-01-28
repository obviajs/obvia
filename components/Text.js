/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */

//component definition
var TextInput = function (_props, overrided = false) {
    Object.defineProperty(this, "label",
        {
            get: function label() {
                return _label;
            },
            set: function label(n) {
                if (_label != n && _label !== undefined) {
                    _label = n;
                    if (this.$label) {
                        this.$label.html(_label);
                    }
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
                    if (_value) {
                        if (this.$input) {
                            this.$input.attr('value', _value);
                        }
                    } else {
                        if (this.$input) {
                            this.$input.removeAttr('value');
                        }
                    }
                }
            }
        });

    Object.defineProperty(this, "required",
        {
            get: function required() {
                return _required;
            },
            set: function required(v) {
                if (_required != v) {
                    _required = v;
                    if (_required) {
                        if (this.$input) {
                            this.$input.attr('required', _required);
                        }
                    } else {
                        if (this.$input) {
                            this.$input.removeAttr('required');
                        }
                    }
                }
            }
        });

    this.beforeAttach = function () {
        if (_embedded) {
            this.$input = this.$el;
        } else {
            this.$input = this.$el.find("#" + this.domID);
            this.$label = this.$el.find("label");
        }
    };

    this.attached = false;
    this.afterAttach = function (e) {
        if (e.target.id == this.$el.attr('id') && !this.attached) {
            //init input mask
            if (_mask) {
                this.$input.inputmask(_mask);
                this.attached = true;
            }
        }
    };

    this.changeHandler = function () {
        this.validate();
    };

    this.validate = function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                this.$input.addClass('invalid');
            } else {
                this.errorList = [];
                this.$input.removeClass('invalid');
            }
        }
    };

    this.focus = function () {
        if (this.$input != null) {
            this.$input.focus();
        }
    };

    this.template = function () {
        return (!this.embedded ? ("<div id='" + this.domID + "-wrapper' class='" + (_props.colspan ? "col-sm-" + _props.colspan : "") + " form-group rowspan" + _props.rowspan + " resizable '>") : "") +
            (!this.embedded ? ("<label><b>" + _label + "</b><span>*</span></label>") : "") +
            "<input data-triggers='change' type='text' id='" + this.domID + "' name='" + this.domID + "'" + (_required ? "required" : "") + " " +
            (!this.enabled ? "disabled" : "") + " class='" + this.cssClass + "' value='" + _value + "' >" +
            (!this.embedded ? ("</div>") : "");
    };

    var _defaultParams = {
        label: "",
        value: "",
        class: "form-control",
        embedded: false,
        enabled: true,
        afterAttach: this.afterAttach,
        change: this.changeHandler
    };
    _props = extend(false, false, _defaultParams, _props);

    var _embedded = _props.embedded;
    var _label = !_embedded ? _props.label : undefined;
    var _value = _props.value;
    var _required = _props.required;
    var _mask = _props.mask;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
TextInput.type = 'text';