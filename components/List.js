/**
 * This is a List Element
 *
 * Kreatx 2019
 */

var List = function (_props) {
    var _self = this;

    this.beforeAttach = function () {
        _states = _states == null ?
            [
                {dataProviderField: _classesField, states: {on: _selectedClasses, off: _defaultClasses}}
            ] : _states;
        
        var lookUpValues = _value ? (!Array.isArray(_value) ? (_value=[_value], true):true):false;
        var ind = -1;
        for(var i=0;i<this.dataProvider.length;i++)
        {
            if(lookUpValues){
                ind = indexOfObject(_value, _valueField,  this.dataProvider[i][_valueField]);
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
    };

    this.selectComponent = function (e, repeaterEventArgs) {
        var componentID = this.id;
        var clickedComponent = repeaterEventArgs.currentRow[componentID];
        var index = repeaterEventArgs.currentIndex;

        var v = repeaterEventArgs.currentItem;
        var arrDpIndex = -1;
        var arrValueIndex = indexOfObject(_self.value, _valueField, v[_valueField]);
        var newValue = _self.value.slice();
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

    this.addRow = function (item, index, isPreventable = false, focusOnRowAdd = false) {
        if (index == undefined)
            index = this.repeater.currentIndex;
        this.repeater.addRow(item, index, isPreventable, focusOnRowAdd);
    };

    this.removeRow = function (index, isPreventable = false, focusOnRowDelete = false) {
        if (index == undefined)
            index = this.repeater.currentIndex;
        this.repeater.removeRow(index, isPreventable, focusOnRowDelete);
    };

    var _defaultParams = {
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

    _props = extend(false, false, _defaultParams, _props);

    let _multiselect = _props.multiselect;
    let _value = _props.value;
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

    let _click = function (e) {
        this.$el.trigger("itemClick", arguments);
        if (!e.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    let _dblclick = function (e) {
        this.$el.trigger("itemDblClick", arguments);
        if (!e.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    Repeater.call(this, _props);
    
    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function (value) {
            if((!_value && value) || (_value && !_value.equals(value))){
               var v = {};
                if (value == undefined || value == null) {
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
                _value = intersectOnKeyMatch(this.dataProvider, value, _valueField); //value;
                var unselect = this.dataProvider.difference(_value);

                unselect.forEach(function (v) {
                    var arrDpIndex = (v == undefined || v == null || v[_valueField] == undefined) ? -1 : indexOfObject(this.dataProvider, _valueField, v[_valueField]);
                    if (arrDpIndex != -1) {
                        _states.forEach(function (state) {
                            this.dataProvider[arrDpIndex][state.dataProviderField] = state.states.off;
                        }.bind(this));
                    }
                }.bind(this));

                this.value.slice(0).forEach(function (v, i) {
                    var arrDpIndex = (v == null || v[_valueField] == null) ? -1 : indexOfObject(this.dataProvider, _valueField, v[_valueField]);
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
            }
        }
    });

};

List.prototype.ctor = 'List';