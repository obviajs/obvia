/**
 * This is a List Element
 *
 * Kreatx 2019
 */
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var List = function (_props) {
    let _self = this, _classesField, _selectedClasses, _defaultClasses, _valueField;
    
    Object.defineProperty(this, "classesField", {
        get: function classesField() {
            return _classesField;
        }
    });
    
    Object.defineProperty(this, "defaultClasses", {
        get: function defaultClasses() {
            return _defaultClasses;
        }
    });

    Object.defineProperty(this, "selectedClasses", {
        get: function selectedClasses() {
            return _selectedClasses;
        }
    });

    Object.defineProperty(this, "valueField", {
        get: function valueField() {
            return _valueField;
        },
        configurable: true
    });
    
    this.beforeAttach = function () {
        _states = _states == null ?
            [
                {dataProviderField: _classesField, states: {on: _selectedClasses, off: _defaultClasses}}
            ] : _states;
        
        let lookUpValues = _value ? (!Array.isArray(_value) ? (_value=[_value], true):true):false;
        let ind = -1;
        for(let i=0;i<this.dataProvider.length;i++)
        {
            if(lookUpValues){
                ind = ArrayUtils.indexOfObject(_value, _valueField,  this.dataProvider[i][_valueField]);
                _states.forEach(function (state) {
                    if(ind>-1){
                        _self.dataProvider[i][state.dataProviderField] = state.states.on;
                    }
                });
            }
            if(!lookUpValues || ind == -1) {
                _states.forEach(function (state) {
                    _self.dataProvider[i][state.dataProviderField] = state.states.off;
                });
            }
        }
        
        if (_props.value) {
            _self.value = _props.value;
        }
    };

    this.selectComponent = function (e, repeaterEventArgs) {
        let componentID = this.id;
        let clickedComponent = repeaterEventArgs.currentRow[componentID];
        let index = repeaterEventArgs.currentIndex;

        let v = repeaterEventArgs.currentItem;
        let arrDpIndex = -1;
        let arrValueIndex = ArrayUtils.indexOfObject(_self.value, _valueField, v[_valueField]);
        let newValue = _self.value.slice();
        if (arrValueIndex == -1) {
            if (_multiSelect) {
                newValue.push(v);
            } else
                newValue = [v];
        } else {
            if (_multiSelect) {
                newValue.splice(arrValueIndex, 1);
            } else
                newValue = [];
        }
        _self.value = newValue;
    };

    let _defaultParams = {
        rendering: {
			direction: 'horizontal',
            separator: false
        },
        attr:{"data-triggers":"rowAdd rowEdit beforeRowAdd rowDelete beforeRowDelete change itemClick itemDblClick"},
        multiSelect: false,
        valueField: "id",
        classesField: "",
        defaultClasses: ["btn", "btn-sm", "btn-default"],
        selectedClasses: ["btn", "btn-sm", "btn-success"],
        value: []
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let _multiSelect = _props.multiSelect;
    let _value;
    let _states = _props.states;
    _valueField = _props.valueField;
    _classesField = _props.classesField;
    _selectedClasses = _props.selectedClasses;
    _defaultClasses = _props.defaultClasses;
    let _components = _props.components;
    let _rowAdd = _props.rowAdd;

    if (_classesField && !_components[0].props.classes) { 
        _components[0].props.classes = `{${_classesField}}`;
    }
    _props.rowAdd = function(e, r, ra){
        if (e.target.id == _self.domID) {
            if (typeof _rowAdd == 'function')
                _rowAdd.apply(_self, arguments);
            if (!e.isDefaultPrevented()) {
                for(let p in ra.currentRow){
                    ra.currentRow[p].on("click", _click);
                    ra.currentRow[p].on("dblclick", _dblclick);
                }
            }
        }
    }.bind(this);

    let _click = function (e, ra) {
        let itemClickEvent = jQuery.Event("itemClick");
        itemClickEvent.originalEvent = e;
        this.trigger.apply(_self, [itemClickEvent, ra]);
        if (!itemClickEvent.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    let _dblclick = function (e) {
        let itemDblClickEvent = jQuery.Event("itemDblClick");
        itemDblClickEvent.originalEvent = e;
        this.trigger.apply(_self, [itemDblClickEvent, ra]);
        if (!itemDblClickEvent.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    let r = Repeater.call(this, _props);
    let _myw = ChangeWatcher.getInstance(r);
    let propDataProvider = Object.getOwnPropertyDescriptor(this, "dataProvider");
    
    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return propDataProvider['get'].call(_self);
        },
        set: function dataProvider(v) {
            if (v && v.length > 0) {
                let len = v.length;
                for (let i = 0; i < len; i++) {
                    if(!v[i].hasOwnProperty(_classesField)){
                        v[i][_classesField] = null;
                    }
                }
            }
            propDataProvider['set'].call(_self, v);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function (value) {
            let oldValue = _value;
            let v = {};               
            if (value == null) {
                value = [];
            } else if (typeof value === "string") {
                v[_valueField] = value;
                value = [v];
            } else if (typeof (value) === "object" && !(value instanceof Array)) {
                value = [value];
            } else if (!(typeof (value) === "object" && (value instanceof Array))) {
                v[_valueField] = value;
                value = [v];
            }
            if((!_value && value) || (_value && !_value.equals(value))){
                _value = ArrayUtils.intersectOnKeyMatch(this.dataProvider, value, _valueField); //value;
                let unselect = this.dataProvider.difference(_value);

                unselect.forEach(function (v) {
                    let arrDpIndex = (v == undefined || v == null || v[_valueField] == undefined) ? -1 : ArrayUtils.indexOfObject(this.dataProvider, _valueField, v[_valueField]);
                    if (arrDpIndex != -1) {
                        _states.forEach(function (state) {
                            this.dataProvider[arrDpIndex][state.dataProviderField] = state.states.off;
                        }.bind(this));
                    }
                }.bind(this));

                this.value.slice(0).forEach(function (v, i) {
                    let arrDpIndex = (v == null || v[_valueField] == null) ? -1 : ArrayUtils.indexOfObject(this.dataProvider, _valueField, v[_valueField]);
                    if (arrDpIndex != -1) {
                        _states.forEach(function (state) {
                            this.dataProvider[arrDpIndex][state.dataProviderField] = state.states.on;
                        }.bind(this));
                    } else {
                        _self.value.splice(i, 1);
                    }
                }.bind(this));
                if(this.attached){
                    this.trigger('change');
                }
                
                _myw.propertyChanged("value", oldValue, _value);
            }
        }
    });
    return r;
};
List.prototype.ctor = 'List';
DependencyContainer.getInstance().register("List", List, DependencyContainer.simpleResolve);
export {
    List
};