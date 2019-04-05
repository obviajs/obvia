/**
 * This is a Toggle Element
 *
 * Kreatx 2019
 */

var Toggle = function (_props, overrided = false) {

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                this.$input.bootstrapToggle('destroy');
                this.$input.bootstrapToggle();
            }
        }
    });

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) 
        {
            this.$input.bootstrapToggle();
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            //e.preventDefault();
        }
    };

    this.beforeAttach = function () {
        this.$input = this.$el;
    };

    this.template = function () {
        return "<input data-triggers='change' type='checkbox' switch-toggle='toggle' data-on='" + _onLabel + "' data-off='" + _offLabel +
            "' data-style='slow'  id='" + this.domID + "'/>";
    };

    var _defaultParams = {
        label: 'Toggle',
        value: true,
        offLabel: "Jo",
        onLabel: "Po"
    };
    
    _props = extend(false, false, _defaultParams, _props);

    var _value = _props.value;
    var _onLabel = _props.onLabel;
    var _offLabel = _props.offLabel;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

Toggle.prototype.type = "Toggle";