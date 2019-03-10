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
            
            if((!_value && v) || (_value && !_value.equals(v)))
            {
                _value = v;
                this.list.value = v;
                this.trigger('change');
            }
        }
    });

    this.beforeAttach = function () {
        this.states = [
            {dataProviderField: _classField, states: {on: _selectedClass, off: _defaultClass}},
            {dataProviderField: _checkedField, states: {on: true, off: false}}
        ];
        this.direction = this.direction == undefined || this.direction == null ? 'vertical' : this.direction;
        _multiselect = (_multiselect != null ? _multiselect : true);
        this.$container = this.$el;
        this.list = new List({
            id: 'list',
            states: _states,
            direction: this.direction,
            multiselect: _multiselect,
            dataProvider: _dataProvider,
            valueField: _valueField,
            labelField: _labelField,
            classField: _classField,
            defaultClass: _defaultClass,
            selectedClass: _selectedClass,
            value: _value,
            components: [
                {
                    constructor: CheckBox,
                    props: {
                        id: 'checkBox',
                        label: "{" + _labelField + "}",
                        value: "{" + _valueField + "}",
                        checked: "{" + _checkedField + "}",
                        class: "{" + _classField + "}",
                        enabled: "{" + _enabledField + "}",
                    }
                }
            ],
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            this.trigger('creationComplete');
        }.bind(this)).on('change', function () {
            _value = this.list.value;
        }.bind(this));
    };

    this.template = function () {
        return "<div id='" + this.domID + "' class='card' role='group' style='padding:10px'>" +
            "</div>";
    };

    var _defaultParams = {
        id: 'checkBoxGroup',
        multiselect: true,
        dataProvider: [],
        valueField: "id",
        labelField: "text",
        classField: "buttonClass",
        defaultClass: 'btn btn-xs btn-default',
        selectedClass: 'btn btn-xs btn-success',
        enabledField: "enabled",
        checkedField: "checked",
        value: [],
        function(e) {
            console.log("From CheckBoxGroup ClickAction");
            //e.preventDefault();
        }
    };

    _props = extend(false, false, _defaultParams, _props);

    var _valueField = _props.valueField;
    var _value = _props.value;
    var _dataProvider = _props.dataProvider;
    var _labelField = _props.labelField;
    var _multiselect = _props.multiselect;
    var _classField = _props.classField;
    var _enabledField = _props.enabledField;
    var _checkedField = _props.checkedField;
    var _defaultClass = _props.defaultClass;
    var _states = _props.states;
    var _selectedClass = _props.selectedClass;

    Component.call(this, _props);

    this.afterAttach = function (e) {
        _value.forEach(function (element) {
            for (var i = 0; i < _dataProvider.length; i++) {
                if (element.id == _dataProvider[i].id) {
                    _self.list.repeater.checkBox[i].checked = true;
                }
            }
        })
    };

    this.render = function () {
        this.$container.append(this.list.render());
        return this.$el;
    };

    if (overrided) {
        this.keepBase();
    }
};

CheckBoxGroup.type = "checkboxgroup";