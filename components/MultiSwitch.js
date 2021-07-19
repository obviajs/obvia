/**
 * This is a MultiSwitch component
 *
 * Kreatx 2019
 */
import { List } from "/obvia/components/List.js";
import { Button } from "/obvia/components/Button/Button.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var MultiSwitch = function (_props) {
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
                    let dpFields = Object.getOwnPropertyNames(_dataProvider[0]);
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
                    let dpFields = Object.getOwnPropertyNames(_dataProvider[0]);
                    if (propDataProvider && dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
                        propDataProvider['set'].call(_self, _dataProvider);
                    }
                }
            }
        },
        enumerable: true
    });

    let _defaultParams = {
        direction: "horizontal",
        multiselect: true,
        role: "group",
        css: {
            padding: 0
        }
    };
    ObjectUtils.fromDefault(_defaultParams, _props);

    let _value = _props.value;
    let _multiselect = _props.multiselect;
    let _valueField = _props.valueField;
    let _labelField = _props.labelField;
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
        }];
    }

    let fnContainerDelayInit = function () {
        return [{
            ctor: Button,
            props: {
                id: "button",
                type: "button",
                label: "{" + _labelField + "}",
                value: "{" + _valueField + "}",
                classes: "{" + _classesField + "}",
                enabled: "{" + _enabledField + "}",
                css: {
                    float: "left",
                    borderRadius: "0px"
                }
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

            if (v && v.length > 0) {
                let dpFields = Object.getOwnPropertyNames(v[0]);
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
MultiSwitch.prototype.ctor = 'MultiSwitch';
DependencyContainer.getInstance().register("MultiSwitch", MultiSwitch, DependencyContainer.simpleResolve);
export {
    MultiSwitch
};