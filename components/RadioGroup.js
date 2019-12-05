/**
 * This is a RadioGroup component
 *
 * Kreatx 2019
 */

let RadioGroup = function (_props, overrided = false) {

    this.beforeAttach = function () {
       
    };

    let _defaultParams = {
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
        direction: "vertical",
        classes: ["radiogroup", "card"],
        multiselect: false
    };

    _props = extend(false, false, _defaultParams, _props);

    let _labelField = _props.labelField;
    let _valueField = _props.valueField;
    let _checkedField = _props.checkedField;
    let _classesField = _props.classesField;
    let _enabledField = _props.enabledField;
    let _selectedClasses = _props.selectedClasses;
    let _defaultClasses = _props.defaultClasses;

    if(_props.states==null){
        _props.states = [
            {dataProviderField: _classesField, states: {on: _selectedClasses, off: _defaultClasses}},
            {dataProviderField: _checkedField, states: {on: true, off: false}}
        ];      
    }
    
    _props.components = [{
        ctor: RadioButton,
        props: {
            id: 'radioButton',
            label: "{" + _labelField + "}",
            value: "{" + _valueField + "}",
            checked: "{?" + _checkedField + "}",
            class: "{?" + _classesField + "}",
            enabled: "{?" + _enabledField + "}",
            name:this.id
        }
    }];
    
    List.call(this, _props);

    this.afterAttach = function (e) {

    };

    if (overrided) {
        this.keepBase();
    }
    
    Object.defineProperty(this, "components",
    {
        enumerable:false
    });
};

RadioGroup.prototype.ctor = "RadioGroup";