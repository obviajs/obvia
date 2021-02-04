/**
 * This is a RadioGroup component
 *
 * Kreatx 2019
 */

var RadioGroup = function (_props) {
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
            ctor: RadioButton,
            props: {
                id: 'radioButton',
                label: "{" + _labelField + "}",
                value: "{" + _valueField + "}",
                checked: "{?" + _checkedField + "}",
                class: "{?" + _classesField + "}",
                enabled: "{?" + _enabledField + "}",
                name: this.id
            }
        }];
    };

    _props.components = fnContainerDelayInit();

    List.call(this, _props);

    this.afterAttach = function (e) {

    };

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

RadioGroup.prototype.ctor = "RadioGroup";