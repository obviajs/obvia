/**
 * This is a List Element
 *
 * Kreatx 2019
 */

var List = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function (value) {
            if (!_value.equals(value)) {
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
                _value = intersectOnKeyMatch(_dataProvider, value, _valueField); //value;
                var unselect = _dataProvider.difference(_value);

                unselect.forEach(function (v) {
                    var arrDpIndex = (v == undefined || v == null || v[_valueField] == undefined) ? -1 : indexOfObject(_dataProvider, _valueField, v[_valueField]);
                    if (arrDpIndex != -1) {
                        _states.forEach(function (state) {
                            if(state.dataProviderField == _classesField){
                                this.repeater[_component.props.id][arrDpIndex].$el.removeClass(state.states.on);
                            }
                            _dataProvider[arrDpIndex][state.dataProviderField] = state.states.off;
                        }.bind(this));
                    }
                }.bind(this));

                this.value.slice(0).forEach(function (v, i) {
                    var arrDpIndex = (v == null || v[_valueField] == null) ? -1 : indexOfObject(_dataProvider, _valueField, v[_valueField]);
                    if (arrDpIndex != -1) {
                        _states.forEach(function (state) {
                            if(state.dataProviderField == _classesField){
                                this.repeater[_component.props.id][arrDpIndex].$el.removeClass(state.states.off);
                            }
                            _dataProvider[arrDpIndex][state.dataProviderField] = state.states.on;
                        }.bind(this));
                    } else {
                        _self.value.splice(i, 1);
                    }
                }.bind(this));

                this.trigger('change');
            }
        }
    });

    this.beforeAttach = function () {
        this.$container = this.$el;
        if(_component) {
            _component.props.click = _click.bind(this);
            _component.props.dblclick = _dblclick.bind(this);
        }
       

        this.repeater = new Repeater({
            id: 'listRepeater',
            defaultItem: this.defaultItem,
            rendering: {
                direction: _direction,
                separator: this.separator || false,
                actions: false
            },
            dataProvider: _dataProvider,
            components: [_component]
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            if (_self.value == undefined || _self.value == "")
                _self.value = [];
            var v = this.value.slice();
            //trick to pass property value updated check on the first setValue call below (initial value)
            _states = _states == null ?
            [
                {dataProviderField: _classesField, states: {on: _selectedClasses, off: _defaultClasses}}
            ] : _states;
            if(_classesField==null  && this.repeater[_component.props.id] && this.repeater[_component.props.id].length>0){
                _classesField = this.repeater[_component.props.id][0].getBindingExpression("classes");
            }
            this.value = [];
            this.value = v; 
            this.trigger('creationComplete');
        }.bind(this));
    };

    this.selectComponent = function (e, repeaterEventArgs) {
        var componentID = _self.repeater.components[0].props.id;
        var clickedComponent = repeaterEventArgs.currentRow[componentID];
        var index = repeaterEventArgs.currentIndex;

        var v = repeaterEventArgs.currentItem;
        var arrDpIndex = -1;
        var arrValueIndex = indexOfObject(this.value, _valueField, v[_valueField]);
        var newValue = this.value.slice();
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
        this.value = newValue;
    };

    this.addRow = function (item, index, isPreventable = false, focusOnRowAdd = false) {
        if (index == undefined)
            index = this.repeater.currentIndex + 1;
        this.repeater.addRow(item, index, isPreventable, focusOnRowAdd);
    };

    this.removeRow = function (index, isPreventable = false, focusOnRowDelete = false) {
        if (index == undefined)
            index = this.repeater.currentIndex + 1;
        this.repeater.removeRow(index, isPreventable, focusOnRowDelete);
    };

    this.template = function () {
        return "<div data-triggers='change' id='" + this.domID + "' role='group' style='padding:0'>" +
            "</div>";
    };

    var _defaultParams = {
        id: 'list',
        direction: 'horizontal',
        multiselect: false,
        dataProvider: [],
        valueField: "id",
        defaultClasses: ["btn btn-sm btn-default"],
        selectedClasses: ["btn btn-sm btn-success"],
        value: [],
    };

    _props = extend(false, false, _defaultParams, _props);

    var _multiselect = _props.multiselect;
    var _dataProvider = _props.dataProvider;
    var _component = _props.component;
    var _value = _props.value;
    var _states = _props.states;
    var _direction = _props.direction;
    var _valueField = _props.valueField;
    var _classesField = _props.classesField;
    var _selectedClasses = _props.selectedClasses;
    var _defaultClasses = _props.defaultClasses;
    var _change = _props.change;
 
    var _cmpClick = _component.props.click;
    var _cmpDblClick = _component.props.dblclick;

    var _click = function (e) {
        if (typeof _cmpClick == 'function')
            _cmpClick.apply(this, arguments);

        if (!e.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    var _dblclick = function (e) {
        if (typeof _cmpDblClick == 'function')
            _cmpDblClick.apply(this, arguments);

        if (!e.isDefaultPrevented()) {
            _self.selectComponent.apply(this, arguments);
        }
    };

    Component.call(this, _props);

    this.afterAttach = function (e) {

    };

    this.render = function () {
        this.$container.append(this.repeater.render());
        return this.$el;
    };

    if (overrided) {
        this.keepBase();
    }

};

List.type = 'list';