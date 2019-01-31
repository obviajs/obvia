/**
 * This is a Toggle Element
 *
 * Kreatx 2019
 */

var Toggle = function (_props, overrided = false) {

    Object.defineProperty(this, "label",
        {
            get: function label() {
                return _label;
            },
            set: function label(v) {
                if (_label != v) {
                    _label = v;
                    if (this.$el) {
                        this.$el[0].textContent = v;
                    }
                }
            }
        });

    Object.defineProperty(this, "value", {
        set: function value(v) {
            if (_value != v) {
                _value = v;
                this.$input.bootstrapToggle('destroy');
                this.$input.bootstrapToggle();
            }
        }
    });

    this.afterAttach = function () {
        this.$input.bootstrapToggle();
    };

    this.beforeAttach = function () {
        this.$input = this.$el.filter("#" + this.domID + "-toggle");
    };

    this.template = function () {
        return "<label  id='" + this.domID + "'>" + _label + "</label>" +
            "<input data-triggers='click' type='checkbox' switch-toggle='toggle' data-on='" + _checkedLabel + "' data-off='" + _unCheckedLabel +
            "' data-style='slow'  id='" + this.domID + "-toggle'  name='" + this.domID + "'/>";
    };

    var _defaultParams = {
        label: 'Toggle',
        value: true,
        unCheckedLabel: "Jo",
        checkedLabel: "Po",
        afterAttach: this.afterAttach
    };

    _props = extend(false, false, _defaultParams, _props);

    var _label = _props.label;
    var _value = _props.value;
    var _unCheckedLabel = _props.unCheckedLabel;
    var _checkedLabel = _props.checkedLabel;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

Toggle.type = "toggle";