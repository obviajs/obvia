/**
 * This is a CheckboxGroup component
 *
 * Kreatx 2019
 */

var CheckBoxGroup = function (_props) {
    let _self = this,
        _dataProvider;

    Object.defineProperty(this, "valueField", {
        get: function valueField() {
            return _valueField;
        },
        set: function valueField(v) {
            if (_valueField != v) {
                _valueField = v;
                this.components = fnContainerDelayInit();
                this.removeAllRows();
                if (_dataProvider && _dataProvider.length > 0) {
                    let dpFields = Object.keys(_dataProvider[0]);
                    if (propDataProvider && dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
                        propDataProvider['set'].call(_self, _dataProvider);
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "labelField", {
        get: function labelField() {
            return _labelField;
        },
        set: function labelField(v) {
            if (_labelField != v) {
                _labelField = v;
                this.components = fnContainerDelayInit();
                this.removeAllRows();
                if (_dataProvider && _dataProvider.length > 0) {
                    let dpFields = Object.keys(_dataProvider[0]);
                    if (propDataProvider && dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
                        propDataProvider['set'].call(_self, _dataProvider);
                    }
                }
            }
        },
        enumerable: true
    });

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
        attr: {
            "role": "group"
        }
    };

    _props = extend(false, false, _defaultParams, _props);

    let _valueField = _props.valueField;
    let _labelField = _props.labelField;
    let _classesField = _props.classesField;
    let _enabledField = _props.enabledField;
    let _checkedField = _props.checkedField;
    let _selectedClasses = _props.selectedClasses;
    let _defaultClasses = _props.defaultClasses;

    if (_props.states == null) {
        _props.states = [{
                dataProviderField: _classesField,
                states: {
                    on: _selectedClasses,
                    off: _defaultClasses
                }
            },
            {
                dataProviderField: _checkedField,
                states: {
                    on: true,
                    off: false
                }
            }
        ];
    }

    let fnContainerDelayInit = function () {
        return [{
            ctor: CheckBoxEx,
            props: {
                id: 'checkBox',
                label: "{" + _labelField + "}",
                value: "{" + _valueField + "}",
                checked: "{" + _checkedField + "}",
                classes: "{" + _classesField + "}",
                enabled: "{" + _enabledField + "}",
            }
        }];
    };

    _props.components = fnContainerDelayInit();

    List.call(this, _props);

    Object.defineProperty(this, "components", {
        enumerable: false
    });

    let propDataProvider = Object.getOwnPropertyDescriptor(this, "dataProvider");
    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return propDataProvider['get'].call(_self);
        },
        set: function dataProvider(v) {
            _dataProvider = v;
            this.removeAllRows();

            if (v.length > 0) {
                let dpFields = Object.keys(v[0]);
                if (dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
                    propDataProvider['set'].call(_self, _dataProvider);
                }
            } else {
                propDataProvider['set'].call(_self, _dataProvider);
            }
        },
        enumerable: true
    });

};

CheckBoxGroup.prototype.ctor = "CheckBoxGroup";