/**
 * This is a RadioGroup component
 *
 * Kreatx 2019
 */

var RadioGroup = function (_props, overrided = false) {

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            this.list.value = v;
        }
    });

    this.beforeAttach = function () {
        this.$container = this.$el;
        _states = [
            {dataProviderField: _classesField, states: {on: _selectedClasses, off: _defaultClasses}},
            {dataProviderField: _checkedField, states: {on: true, off: false}}
        ];        
        this.list = new List({
            id: 'list',
            states: _states,
            direction: _direction,
            multiselect: false,
            dataProvider: _dataProvider,
            valueField: _valueField,
            labelField: _labelField,
            classesField: _classesField,
            defaultClasses: _defaultClasses,
            selectedClasses: _selectedClasses,
            value: _value,
            component: {
                ctor: RadioButton,
                props: {
                    id: 'radioButton',
                    label: "{" + _labelField + "}",
                    value: "{" + _valueField + "}",
                    checked: "{" + _checkedField + "}",
                    class: "{" + _classesField + "}",
                    enabled: "{" + _enabledField + "}",
                    name:this.id
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
        return "<div data-triggers='change itemClick itemDblClick' id='" + this.domID + "' class='radiogroup card' style='padding:10px;'>" +
            "</div>"
    };

    var _defaultParams = {
        id: 'radiogroup',
        checkedField: true,
        dataProvider: [],
        valueField: 'id',
        labelField: 'text',
        classesField: "buttonClass",
        defaultClasses: [],
        selectedClasses: [],
        enabledField: "enabled",
        checkedField: "checked",
        value: [],
        direction: "vertical"
    };

    _props = extend(false, false, _defaultParams, _props);

    var _value = _props.value;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;
    var _checkedField = _props.checkedField;
    var _classesField = _props.classesField;
    var _enabledField = _props.enabledField;
    var _dataProvider = _props.dataProvider;
    var _states = _props.states;
    var _selectedClasses = _props.selectedClasses;
    var _defaultClasses = _props.defaultClasses;
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

RadioGroup.prototype.ctor = "RadioGroup";