/**
 * This is a List Element
 *
 * Kreatx 2019
 */
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";
import { ArrayUtils } from "/flowerui/lib/ArrayUtils.js";
import { Repeater } from "/flowerui/components/Repeater/Repeater.js";
import { ChangeWatcher } from "/flowerui/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/flowerui/lib/DependencyContainer.js";

var List = function (_props) {
    let _self = this;

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
            if (_multiselect) {
                newValue.push(v);
            } else
                newValue = [v];
        } else {
            if (_multiselect) {
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
        multiselect: false,
        valueField: "id",
        classesField: "",
        defaultClasses: ["btn btn-sm btn-default"],
        selectedClasses: ["btn btn-sm btn-success"],
        value: []
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let _multiselect = _props.multiselect;
    let _value;
    let _states = _props.states;
    let _valueField = _props.valueField;
    let _classesField = _props.classesField;
    let _selectedClasses = _props.selectedClasses;
    let _defaultClasses = _props.defaultClasses;
    let _components = _props.components;
    let _rowAdd = _props.rowAdd;

    if (_classesField) { 
        _components[0].props.classes = `{?${_classesField}}`;
    }
    _props.rowAdd = function(e, r, ra){
        if (e.target.id == _self.domID) 
        {
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
        this.trigger.apply(this, [itemClickEvent, ra]);
        if (!itemClickEvent.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    let _dblclick = function (e) {
        let itemDblClickEvent = jQuery.Event("itemDblClick");
        itemDblClickEvent.originalEvent = e;
        this.trigger.apply(this, [itemDblClickEvent, ra]);
        if (!itemDblClickEvent.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    let r = Repeater.call(this, _props);
    let _myw = ChangeWatcher.getInstance(r);
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