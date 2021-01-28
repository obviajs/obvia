/**
 * This is a DropDown  Element
 *
 * Kreatx 2019
 */

//component definition
var DropDown = function (_props) {
    let _self = this;

    let _dataProvider, _btnDD, _componentRepeater, _label, _selectedItem, _allowNewItem, myw;

    Object.defineProperty(this, "labelField", {
        get: function labelField() {
            return _labelField;
        },
        set: function labelField(v) {
            if (_labelField != v) {
                _labelField = v;
                _componentRepeater.components = fnInitCmpLink();
                _componentRepeater.removeAllRows();
                if (_dataProvider && _dataProvider.length > 0) {
                    let dpFields = Object.keys(_dataProvider[0]);
                    if (dpFields.includes(_labelField)) {
                        _componentRepeater.dataProvider = _dataProvider;
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            _dataProvider = v;
            _componentRepeater.removeAllRows();

            if (v.length > 0) {
                let dpFields = Object.keys(v[0]);
                if (dpFields.includes(_labelField)) {
                    _componentRepeater.dataProvider = _dataProvider;
                }
            } else {
                _componentRepeater.dataProvider = _dataProvider;
            }
        },
        enumerable: true
    });
    Object.defineProperty(this, "valueField", {
        get: function valueField() {
            return _valueField;
        },
        enumerable: true
    });

    Object.defineProperty(this, "selectedItem", {
        get: function selectedItem() {

            return _selectedItem;
        },
        set: function selectedItem(v) {
            if (_selectedItem != v) {
                let oldValue = _selectedItem;
                if (!isObject(v)) {
                    let o = {};
                    o[_valueField] = v;
                    v = o;
                }
                if (v.hasOwnProperty(_valueField)) {
                    let m = getMatching(_dataProvider, _valueField, v[_valueField]).objects;
                    if (m.length > 0) {
                        v = m[0];
                        _selectedItem = v;
                        _btnDD.label = v[_labelField];
                    } else if (_allowNewItem) {
                        _dataProvider.splicea(_dataProvider.length, 0, v);
                        _selectedItem = v;
                        _btnDD.label = v[_labelField];

                    } else {
                        _selectedItem = null;
                        _btnDD.label = _label;
                    }
                    this.trigger("change");
                    myw.propertyChanged("selectedItem", oldValue, _selectedItem);
                }
            }
        }
    });
    if (!this.hasOwnProperty("label")) {
        Object.defineProperty(this, "label", {
            get: function label() {
                return _label;
            },
            set: function label(v) {
                _label = v;
            },
            enumerable: true
        });
    }
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _btnDD = this.button;
            _componentRepeater = this.repeater;
            _componentRepeater.attr["aria-labelledby"] = _btnDD.domID;
            if (_props.label && !this.getBindingExpression("label")) {
                _btnDD.label = this.label = _props.label;
            }
            if (_props.selectedItem && !this.getBindingExpression("selectedItem")) {
                this.selectedItem = _props.selectedItem;
            }
        }
    };

    this.init = function (e) {
        myw = ChangeWatcher.getInstance(_self);
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {

        }
    };

    this.afterAttach = function (e) {};

    let fnInitCmpLink = function () {
        let _componentLink = {
            ctor: Link,
            props: {
                id: "link",
                classes: ['dropdown-item'],
                "click": _clickHandler,
            }
        };
        if (_hrefField) {
            _componentLink.props.href = '{' + _hrefField + '}';
        }
        if (_labelField) {
            _componentLink.props.label = '{' + _labelField + '}';
        }
        return _componentLink;
    };
    let fnContainerDelayInit = function () {
        let _componentButton = {
            ctor: Button,
            props: {
                id: "button",
                classes: [_size, _split, "btn", "btn-secondary", "dropdown-toggle"],
                attr: {
                    "data-toggle": 'dropdown',
                    "aria-haspopup": "true",
                    "aria-expanded": "false"
                },
                width: "100%"
            }
        };

        let _componentLink = fnInitCmpLink();

        let _componentRepeaterLit = {
            ctor: Repeater,
            props: {
                id: "repeater",
                type: ContainerType.NONE,
                classes: ["dropdown-menu"],
                components: [_componentLink],
                dataProvider: _dataProvider
            }
        };
        return [_componentButton, _componentRepeaterLit];
    };

    let _defaultParams = {
        id: 'dropdown',
        dataProvider: new ArrayEx([]),
        hrefField: undefined,
        labelField: undefined,
        valueField: undefined,
        allowNewItem: false,
        keyField: "",
        value: null,
        classes: [DropMenuDirection.DROPDOWN],
        label: "",
        size: ButtonSize.SMALL,
        type: ContainerType.NONE,
        split: DropSplitType.SPLIT,
        guidField: "guid"
    };

    let _clickHandler = function (e, ra) {
        let linkObj = {};
        linkObj[_guidField] = ra.currentItem[_guidField];
        _self.selectedItem = getMatching(_dataProvider, _guidField, linkObj[_guidField]).objects[0];
        _componentRepeater.$el.removeClass("show");
        e.stopPropagation();
    };

    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    _props.attr["data-triggers"] = "change";

    _allowNewItem = _props.allowNewItem;
    let _hrefField = _props.hrefField;
    let _labelField = _props.labelField;
    let _valueField = _props.valueField;
    let _value = _props.value;
    let _change = _props.change;
    let _size = _props.size;
    let _split = _props.split;
    let _guidField = _props.guidField;

    if (_props.dataProvider && !getBindingExp(_props.dataProvider)) {
        _dataProvider = _props.dataProvider;
    }
    _props.components = fnContainerDelayInit();

    Container.call(this, _props, true);
};
DropDown.prototype.ctor = 'DropDown';
DropDown.prototype.valueProp = 'selectedItem';