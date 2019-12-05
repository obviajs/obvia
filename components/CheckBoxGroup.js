/**
 * This is a CheckboxGroup component
 *
 * Kreatx 2019
 */

let CheckBoxGroup = function (_props, overrided = false) {
    let _self = this;
    
    this.beforeAttach = function () {
       
    };

    let _defaultParams = {
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
        direction: "vertical",
        value: [],
        classes: ["card"],
        attr: {"role":"group"}
    };

    _props = extend(false, false, _defaultParams, _props);

    let _valueField = _props.valueField;
    let _labelField = _props.labelField;
    let _classesField = _props.classesField;
    let _enabledField = _props.enabledField;
    let _checkedField = _props.checkedField;
    let _selectedClasses = _props.selectedClasses;
    let _defaultClasses = _props.defaultClasses;

    if(_props.states==null){
        _props.states = [
            {dataProviderField: _classesField, states: {on: _selectedClasses, off: _defaultClasses}},
            {dataProviderField: _checkedField, states: {on: true, off: false}}
        ];
    }
    
    _props.components = [
        {
                ctor: CheckBoxEx,
                props: {
                    id: 'checkBox',
                    label: "{" + _labelField + "}",
                    value: "{" + _valueField + "}",
                    checked: "{" + _checkedField + "}",
                    classes: "{" + _classesField + "}",
                    enabled: "{" + _enabledField + "}",
                }
        }
    ];
    List.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
    
    Object.defineProperty(this, "components",
    {
        enumerable:false
    });
};

CheckBoxGroup.prototype.ctor = "CheckBoxGroup";