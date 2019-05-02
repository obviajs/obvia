/**
 * This is a CheckboxGroup component
 *
 * Kreatx 2019
 */

var CheckBoxGroup = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            this.list.value = v;
        }
    });
    
    this.beforeAttach = function () {
        _multiselect = (_multiselect != null ? _multiselect : true);
        this.$container = this.$el;
        _states = [
            {dataProviderField: _classesField, states: {on: _selectedClasses, off: _defaultClasses}},
            {dataProviderField: _checkedField, states: {on: true, off: false}}
        ];
        this.list = new List({
            id: 'list',
            states: _states,
            direction: _direction,
            multiselect: _multiselect,
            dataProvider: _dataProvider,
            valueField: _valueField,
            labelField: _labelField,
            classesField: _classesField,
            defaultClasses: _defaultClasses,
            selectedClasses: _selectedClasses,
            value: _value,
            component: {
                constructor: CheckBox,
                props: {
                    id: 'checkBox',
                    label: "{" + _labelField + "}",
                    value: "{" + _valueField + "}",
                    checked: "{" + _checkedField + "}",
                    classes: "{" + _classesField + "}",
                    enabled: "{" + _enabledField + "}",
                }
            },
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            this.trigger('creationComplete');
        }.bind(this)).on('change', function (e) {
            e.stopImmediatePropagation();
            if (e.target.id == this.list.domID){
                _value = this.list.value;
                this.trigger('change');
            }
        }.bind(this));
    };

    this.template = function () {
        return "<div data-triggers='change itemClick itemDblClick' id='" + this.domID + "' class='card' role='group' style='padding:10px'>" +
            "</div>";
    };

    var _defaultParams = {
        id: 'checkBoxGroup',
        multiselect: true,
        dataProvider: [],
        valueField: "id",
        labelField: "text",
        classesField: "buttonClass",
        defaultClasses: [],
        selectedClasses: [],
        enabledField: "enabled",
        checkedField: "checked",
        value: [],
        direction: "vertical"
    };

    _props = extend(false, false, _defaultParams, _props);

    var _valueField = _props.valueField;
    var _value = _props.value;
    var _dataProvider = _props.dataProvider;
    var _labelField = _props.labelField;
    var _multiselect = _props.multiselect;
    var _classesField = _props.classesField;
    var _enabledField = _props.enabledField;
    var _checkedField = _props.checkedField;
    var _defaultClasses = _props.defaultClasses;
    var _states = _props.states;
    var _selectedClasses = _props.selectedClasses;
    var _direction = _props.direction;

    Component.call(this, _props);

    this.afterAttach = function (e) {
    };

    this.render = function () {
        this.$container.append(this.list.render());
        return this.$el;
    };

    if (overrided) {
        this.keepBase();
    }
};

CheckBoxGroup.prototype.ctor = "CheckBoxGroup";