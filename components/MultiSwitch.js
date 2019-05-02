/**
 * This is a MultiSwitch component
 *
 * Kreatx 2019
 */

var MultiSwitch = function (_props, overrided = false) {
    _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if((!_value && v) || (_value && !_value.equals(v)))
            {
                _value = v;
                this.list.value = v;
                this.trigger('change');
            }
        }
    });

    this.beforeAttach = function () {
        this.$container = this.$el;
        this.direction = this.direction == undefined || this.direction == null ? 'horizontal' : this.direction;

        this.list = new List({
            id: 'list',
            direction: this.direction,
            multiselect: _multiselect,
            dataProvider: _dataProvider,
            valueField: _valueField,
            labelField: _labelField,
            classField: _classField,
            defaultClass: _defaultClass,
            selectedClass: _selectedClass,
            value: _value,
            embedded: true,
            components: [
                {
                    constructor: Button,
                    props: {
                        id: 'button',
                        type: "button",
                        label: "{" + _labelField + "}",
                        value: "{" + _labelField + "}",
                        class: "{" + _classField + "}",
                        style: "float: left; border-radius: 0px",
                        click: this.clickHandler.bind(this),
                        embedded: true
                    }
                }
            ],
            onclick: this.onclick,
            onchange: this.onchange
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            this.trigger('creationComplete');
        }.bind(this)).on('change', function () {
            _value = this.list.value;
        }.bind(this));
    };

    this.afterAttach = function () {

    };

    this.changeHandler = function (e) {
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    };

    this.clickHandler = function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    };

    this.template = function () {
        return "<div id='" + this.domID + "' role='group' style='padding:0'>" +
            "</div>";
    };

    var _defaultParams = {
        id: '',
        multiselect: true,
        dataProvider: [],
        valueField: "",
        labelField: "",
        classField: "",
        defaultClass: '',
        selectedClass: '',
        value: [],
        onclick: function (e) {
            console.log("From MultiSwitch ClickAction");
            //e.preventDefault();
        }
    };

    _props = extend(false, false, _defaultParams, _props);

    var _value = _props.value;
    var _multiselect = _props.multiselect;
    var _dataProvider = _props.dataProvider;
    var _valueField = _props.valueField;
    var _labelField = _props.labelField;
    var _classField = _props.classField;
    var _defaultClass = _props.defaultClass;
    var _selectedClass = _props.selectedClass;

    Component.call(this, _props);

    this.render = function () {
        this.$container.append(this.list.render());
        return this.$el;
    };

    if (overrided) {
        this.keepBase();
    }
};

MultiSwitch.prototype.ctor = 'MultiSwitch';