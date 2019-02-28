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
            if(_value && !_value.equals(v)){
                _value = v;
            }
            this.list.value = v;
            this.trigger('change');
        }
    });

    this.beforeAttach = function () {
        this.checkedField = "checked_" + this.id;
        _states = [
            {dataProviderField: _classField, states: {on: _selectedClass, off: _defaultClass}},
            {dataProviderField: _checkedField, states: {on: true, off: false}}
        ];
        this.direction = this.direction == undefined || this.direction == null ? 'vertical' : this.direction;
        this.$container = this.$el.filter('#' + this.domID + '-radiogroup');
        this.list = new List({
            id: 'list',
            colspan: '6',
            label: 'Ministrite',
            fieldName: 'list',
            states: _states,
            blockProcessAttr: this.blockProcessAttr,
            required: this.required,
            direction: this.direction,
            multiselect: false,
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
                    constructor: RadioButton,
                    props: {
                        id: 'radioButton',
                        label: "{" + _labelField + "}",
                        value: "{" + _valueField + "}",
                        name: this.id,
                        checked: "{" + _checkedField + "}",
                        class: _classField,
                        click: this.clickHandler.bind(this),
                        enabled: "{" + this.enabled + "}",
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

    this.clickHandler = function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    };

    this.template = function () {
        return "<div id='" + this.domID + "-radiogroup' class='radiogroup card' style='padding:10px;'>" +
            "<label><b>" + _label + "</b></label>" +
            "</div>"
    };

    var _defaultParams = {
        id: 'radiogroup',
        colspan: '6',
        label: 'Radiogroup',
        fieldName: 'radioInput',
        blockProcessAttr: false,
        required: false,
        checkedField: true,
        dataProvider: [],
        valueField: 'id',
        labelField: 'text',
        classField: "buttonClass",
        defaultClass: 'btn btn-xs btn-default',
        selectedClass: 'btn btn-xs btn-success',
        enabledField: "enabled",
        value: [],
        click: function (e) {
            console.log("From RadioGroup ClickAction");
        }
    };

    _props = extend(false, false, _defaultParams, _props);

    var _value = _props.value;
    var _label = _props.label;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;
    var _checkedField = _props.checkedField;
    var _classField = _props.classField;
    var _enabledField = _props.enabledField;
    var _dataProvider = _props.dataProvider;
    var _states = _props.states;
    var _selectedClass = _props.selectedClass;
    var _defaultClass = _props.defaultClass;

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

RadioGroup.type = "radiogroup";