/**
 * This is a CheckboxGroup component
 *
 * Kreatx 2019
 */

var CheckBoxGroup = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "label",
        {
            get: function label() {
                return _label;
            },
            set: function label(v) {
                if (_label != v) {
                    _label = v;
                    var target = this.$el.find("label");
                    if (target) {
                        target.children(":first-child").html(v);
                    }
                }
            }
        });

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            _value = v;
            this.list.set(v);
            this.trigger('change');
            return _value;
        }
    });

    this.beforeAttach = function () {
        this.checkedField = "checked_" + this.id;
        _states = [
            {dataProviderField: _classField, states: {on: _selectedClass, off: _defaultClass}},
            {dataProviderField: _checkedField, states: {on: true, off: false}}
        ];
        this.direction = this.direction == undefined || this.direction == null ? 'vertical' : this.direction;

        this.$container = this.$el.filter('#' + this.domID + '-list');

        this.multiselect = (this.multiselect != undefined && this.multiselect != null ? this.multiselect : true);

        this.list = new List({
            id: 'list',
            colspan: '6',
            label: 'Ministrite',
            fieldName: 'list',
            states: _states,
            blockProcessAttr: this.blockProcessAttr,
            required: this.required,
            direction: this.direction,
            multiselect: this.multiselect,
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
                    constructor: CheckBox,
                    props: {
                        id: 'checkBox',
                        label: "{" + _labelField + "}",
                        value: "{" + _valueField + "}",
                        checked: "{" + _checkedField + "}",
                        class: "{" + _classField + "}",
                        enabled: "{" + _enabledField + "}",
                        embedded: true
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
        return "<div id='" + this.domID + "-list' class='card' role='group' style='padding:10px'>" +
            "<label><b>" + _label + "</b> </label>" +
            "</div>";
    };

    var _defaultParams = {
        id: 'checkBoxGroupLonely1',
        colspan: '6',
        label: 'Ministrite',
        fieldName: 'checkBoxGroupInputR',
        checkedField: true,
        blockProcessAttr: false,
        required: true,
        dataProvider: [
            {
                "id": "1",
                "text": "Ministria e Puneve te Jashtme 1",
                "buttonClass": 'btn btn-xs btn-default',
                "enabled": true
            },
            // { "id": "2", "text": "Ministria e Drejtesise 1", "buttonClass": 'btn btn-xs btn-default', "enabled":true},
            // { "id": "3", "text": "Ministria e Brendshme 1", "buttonClass": 'btn btn-xs btn-success', "enabled":true},
            // { "id": "4", "text": "Ministria e Mbrojtjes 1", "buttonClass": 'btn btn-xs btn-default', "enabled":true}
        ],
        valueField: "id",
        labelField: "text",
        classField: "buttonClass",
        defaultClass: 'btn btn-xs btn-default',
        selectedClass: 'btn btn-xs btn-success',
        enabledField: "enabled",
        value: [{"id": "3", "text": "Ministria e Brendshme", "buttonClass": 'btn btn-xs btn-success', "enabled": true}],
        function(e) {
            console.log("From CheckBoxGroup ClickAction");
            //e.preventDefault();
        }
    };

    _props = extend(false, false, _defaultParams, _props);

    var _valueField = _props.valueField;
    var _label = _props.label;
    var _value = _props.value;
    var _dataProvider = _props.dataProvider;
    var _labelField = _props.labelField;
    var _classField = _props.classField;
    var _enabledField = _props.enabledField;
    var _checkedField = _props.checkedField;
    var _defaultClass = _props.defaultClass;
    var _states = _props.states;
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

CheckBoxGroup.type = "checkboxgroup";