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
        this.$input = this.$el;
    };

    this.changeHandler = function (e) {
        this.validate();
    };

    _spellCheckClickHandler = function (e) {
        this.$input.spellCheckInDialog({defaultDictionary: _spellCheck.defaultDictionary});
    };

    this.template = function () {
        return "<textarea data-triggers='change' id='" + this.domID + "' " + (!this.enabled ? "disabled" : "") + " class='" + this.cssClass + "'>" + _value + "</textarea>" +
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

    _props.click = function () {
        if (typeof  _click == 'function')
            _click.apply(this, arguments);

        var e = arguments[0];
        if(!e.isDefaultPrevented()) {
            _spellCheckClickHandler();
        }
    };

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
TextArea.type = 'textarea';