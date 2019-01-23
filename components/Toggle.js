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
                    var target = this.$el.find("label");
                    if (target[0]) {
                        target[0].textContent = _label;
                        target[0].style.fontWeight = "bold";
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
        _enabled = (_enabled !== undefined && _enabled != null ? _enabled : true);
        this.$input = this.$el.find("#" + this.domID);
    };

    this.template = function () {
        return (!_embedded ? ("<div id='" + this.domID + "-wrapper' class='" + (_colspan ? "col-sm-" + _colspan : "") + " form-group rowspan" + _rowspan + " resizable'>") : "") +
            (!_embedded ? ("<label rv-style='versionStyle' rv-for='id'><b>" + _label + "</b></label>") : "") + "<span rv-if='" + _required + "'>*</span>" +
            "<input type='checkbox' rv-checked='" + _value + "' switch-toggle='toggle' data-on='" + _checkedLabel + "' data-off='" + _unCheckedLabel + "' data-style='slow'  id='" + this.domID + "'  name='" + this.domID + "'/>" +
            (!_embedded ? ("</div>") : "");
    };

    var _defaultParams = {
        label: 'Toggle',
        blockProcessAttr: false,
        required: false,
        value: true,
        unCheckedLabel: "Jo",
        checkedLabel: "Po",
        afterAttach: this.afterAttach
    };

    _props = extend(false, false, _defaultParams, _props);

    var _colspan = _props.colspan;
    var _rowspan = _props.rowspan;
    var _label = _props.label;
    var _embedded = _props.embedded;
    var _enabled = _props.enabled;
    var _blockProcessAttr = _props.required ? false : _props.blockProcessAttr;
    var _required = _props.required;
    var _value = _props.value;
    var _unCheckedLabel = _props.unCheckedLabel;
    var _checkedLabel = _props.checkedLabel;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

Toggle.type = "toggle";