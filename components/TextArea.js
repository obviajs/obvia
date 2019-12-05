/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */

//component definition
var TextArea = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value", {
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
        },
        enumerable: true
    });

    Object.defineProperty(this, "spellCheck", {
        get: function spellCheck() {
            return _spellCheck;
        },
        set: function spellCheck(v) {
            if (_spellCheck != v) {
                _spellCheck = v;
                if (_spellCheck) {
                    if(this.$el){
                        this.$el.attr("spellcheck", _spellCheck);
                    }
                }
            }else{
                this.$el.removeAttr("spellcheck");
            }
        },
        enumerable: true
    });


    this.beforeAttach = function () {
        this.$input = this.$el;
    };

    this.changeHandler = function (e) {
        this.validate();
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
        if (!e.isDefaultPrevented()) {}
    };

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

//component prototype
TextArea.prototype.ctor = 'TextArea';