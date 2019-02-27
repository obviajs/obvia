/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */

//component definition
var TextArea = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value",
        {
            get: function value() {
                return _value;
            },
            set: function value(v) {
                if (_value != v) {
                    _value = v;
                    if (this.$input) {
                        this.$input.val(_value);
                        this.trigger('change');
                    }
                }
            }
        });


    this.beforeAttach = function () {
        this.$input = this.$el.filter('#' + this.domID);
    };

    this.changeHandler = function (e) {
        this.validate();
    };

    this.validate = function () {
        if (_props.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                this.$el.addClass('invalid');

                return false;
            } else {
                this.errorList = [];
                this.$el.removeClass('invalid');
            }
        }
        return true;
    };

    this.spellCHeckClickHandler = function (e) {
        this.$input.spellCheckInDialog({defaultDictionary: _spellCheck.defaultDictionary});
    };

    this.template = function () {
        return "<textarea data-triggers='change' id='" + this.domID + "' " + (!this.enabled ? "disabled" : "") + " class='" + this.cssClass + "'>" + this.value + "</textarea>" +
            (_spellCheck ? "<button data-triggers='click' type='button' id='" + this.domID + "-spellCheck' class='btn btn-sm btn-primary float-right'><i class='fas fa-book'></i> Spell Check </button>" : "");
    };

    var _defaultParams = {
        value: "",
        spellCheck: null,
        class: "form-control"
    };
    _props = extend(false, false, _defaultParams, _props);

    var _spellCheck = _props.spellCheck;
    var _value = _props.value;
    var _change = _props.change;
    var _click = _props.click;

    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler();
        }
    };

    _props.click = function () {
        if (typeof  _click == 'function')
            _click.apply(this, arguments);

        var e = arguments[0];
        if(!e.isDefaultPrevented()) {
            _self.spellCHeckClickHandler();
        }
    };

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
TextArea.type = 'textarea';