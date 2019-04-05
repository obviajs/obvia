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
        _self.$input.spellCheckInDialog({defaultDictionary: _spellCheck.defaultDictionary});
    };

    this.template = function () {
        return "<textarea data-triggers='change' id='" + this.domID + "' " + (!this.enabled ? "disabled" : "") + ">" + _value + "</textarea>";
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
    var _dblclick = _props.dblclick;

    _props.dblclick = function () {
        if (typeof _dblclick == 'function')
            _dblclick.apply(this, arguments);

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
TextArea.prototype.type = 'TextArea';