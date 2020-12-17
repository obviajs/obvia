/**
 * This is a Color Element
 *
 * Kreatx 2018
 */

var Color = function (_props) {

    let _self = this, _value;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                this.$el.val(_value);
            }
        }
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.value != null)
                this.value = _props.value;
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.$el.attr('id') && !this.attached) {

        }
    };

    this.changeHandler = function () {
        _value = this.$el.val();
    };

    this.template = function () {
        return '<input data-triggers="change" type="color" id="' + this.domID + '" >';
    };

    let _defaultParams = {
        id: 'color1',
        css: {
            "width": "20px",
            "height": "20px"
        }
    };

    _props = extend(false, false, _defaultParams, _props);

    let _change = _props.change;

    _props.change = function () {
        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler(e);
        }
        if (typeof _change == 'function')
            _change.apply(this, arguments);
    };

    Component.call(this, _props);
};

Color.prototype.ctor = "Color";