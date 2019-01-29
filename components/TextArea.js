/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */

//component definition
var TextArea = function (_props, overrided = false) {

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
        this.$spellCheckBtn = _spellCheck ? this.$el.filter('#' + this.domID + '-spellCheck') : null;
    };

    this.changeHandler = function (e) {
        this.validate();
    };

    this.validate = function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                this.$el.addClass('invalid');
            } else {
                this.errorList = [];
                this.$el.removeClass('invalid');
            }
        }
    };

    this.spellCHeckClickHandler = function (e) {
        this.$el.spellCheckInDialog({defaultDictionary: _spellCheck.defaultDictionary});
    };

    this.template = function () {
        return "<textarea data-triggers='change' id='" + this.domID + "' " + (!this.enabled ? "disabled" : "") + " class='" + this.cssClass + "'>" + this.value + "</textarea>" +
            (_spellCheck ? "<button data-triggers='click' type='button' id='" + this.domID + "-spellCheck' class='btn btn-sm btn-primary float-right'><i class='fas fa-book'></i> Spell Check </button>" : "");
    };

    var _defaultParams = {
        value: "",
        spellCheck: null,
        class: "form-control",
        change: this.changeHandler.bind(this),
        click: this.spellCHeckClickHandler.bind(this)
    };
    _props = extend(false, false, _defaultParams, _props);

    var _spellCheck = _props.spellCheck;
    var _value = _props.value;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
TextArea.type = 'textarea';