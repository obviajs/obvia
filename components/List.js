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
                var arrDpFieldsChanged = [];
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
                            _dataProvider[arrDpIndex][state.dataProviderField] = state.states.off;
                            arrDpFieldsChanged.pushUnique(state.dataProviderField);
                        }.bind(this));
                    }
                }.bind(this));

                this.value.slice(0).forEach(function (v, i) {
                    var arrDpIndex = (v == undefined || v == null || v[_valueField] == undefined) ? -1 : indexOfObject(_dataProvider, _valueField, v[_valueField]);
                    if (arrDpIndex != -1) {
                        _states.forEach(function (state) {
                            _dataProvider[arrDpIndex][state.dataProviderField] = state.states.on;
                            arrDpFieldsChanged.pushUnique(state.dataProviderField);
                        }.bind(this));
                    } else {
                        self.value.splice(i, 1);
                    }
                }.bind(this));

                this.trigger('change');
                // this.repeater.dataProviderChanged(arrDpFieldsChanged);
            }
        }
    });

    this.beforeAttach = function () {
        this.$container = this.$el.filter('#' + this.domID + '-list');

        _components[0].props.click = click.bind(this);
        // this.components[0].props.ondblclick = this.doubleClickHandler.bind(this);
        // this.components[0].props.onmousedown = this.mouseDownHandler.bind(this);

        _direction = _direction == undefined || _direction == null ? 'horizontal' : _direction;
        _states = _states == undefined || _states == null ?
            [
                {dataProviderField: _classField, states: {on: _selectedClass, off: _defaultClass}}
            ] : _states;

        this.repeater = new Repeater({
            id: 'listRepeater',
            defaultItem: this.defaultItem,
            rendering: {
                direction: this.direction,
                seperator: this.seperator || false,
                actions: false
            },
            dataProvider: _dataProvider,
            components: _components
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            if (self.value == undefined || self.value == "")
                self.value = [];
            var v = this.value.slice();
            //trick to pass property value updated check on the first setValue call below (initial value)
            this.value = [];
            this.value = v;
            this.trigger('creationComplete');
        }.bind(this));
    };

    this.handleComponentClick = function (e, repeaterEventArgs) {
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
        return "<label>" + _label + " </label>" +
            "<br>" +
            "<div id='" + this.domID + "-list' role='group' style='padding:0'>" +

            "</div>";
    };

    var _defaultParams = {
        id: 'list',
        colspan: '6',
        label: 'Ministrite',
        fieldName: 'list',
        blockProcessAttr: this.blockProcessAttr,
        required: true,
        direction: 'horizontal',
        multiselect: false,
        dataProvider: [],
        valueField: "id",
        classField: "buttonClass",
        defaultClass: "btn btn-sm btn-default",
        selectedClass: "btn btn-sm btn-success",
        value: [],
        components: [
            {
                constructor: Button,
                props: {
                    id: 'button',
                    type: "button",
                    value: "{text}",
                    label: "",
                    class: "{buttonClass}",
                    style: "float: left; border-radius: 0px"
                }
            }
        ],
    };

    _props = extend(false, false, _defaultParams, _props);

    var _id = _props.id;
    var _multiselect = _props.multiselect;
    var _dataProvider = _props.dataProvider;
    var _label = _props.label;
    var _components = _props.components;
    var _value = _props.value;
    var _states = _props.states;
    var _direction = _props.direction;
    var _valueField = _props.valueField;
    var _classField = _props.classField;
    var _selectedClass = _props.selectedClass;
    var _defaultClass = _props.defaultClass;
    var _embedded = _props.embedded;
    // var _change = _props.change;
    // var _mousedown = _props.mouseDownHandler;
    var _click = _props.click;
    var _dblclick = _props.dblclick;
    //
    // _props.change = function (e) {
    //     if (typeof _change == 'function')
    //         _change.apply(this, arguments);
    // };
    // // //
    // _props.mouseDownHandler = function (e) {
    //     if (typeof this.onmousedown == 'function')
    //         this.onmousedown.apply(this, arguments);
    // };
    click = function (e) {
        if (typeof this.click == 'function')
            this.click.apply(this, arguments);

        if (!e.isDefaultPrevented()) {
            _self.handleComponentClick.apply(this, arguments);
        }
    };

    _props.dblclick = function (e) {
        if (typeof _dblclick == 'function')
            _dblclick.apply(this, arguments);

        if (!e.isDefaultPrevented()) {
            _self.handleComponentClick.apply(this, arguments);
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