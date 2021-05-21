/**
 * This is a DropEdit  Element
 *
 * Kreatx 2020
 */

import { Container } from "/flowerui/components/Container.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";
import { StringUtils } from "/flowerui/lib/StringUtils.js";
import { Repeater } from "/flowerui/components/Repeater/Repeater.js";
import { Button, ButtonSize } from "/flowerui/components/Button/Button.js";

var DropEdit = function (_props) {
    let _self = this;
    let _creationFinished;
    let _dataProvider, _inputDD, _componentRepeater, _label;

    Object.defineProperty(this, "labelField", {
        get: function labelField() {
            return _labelField;
        },
        set: function labelField(v) {
            if (_labelField != v) {
                _labelField = v;
                _componentRepeater.components = fnInitCmpLink();
                if (_dataProvider && _dataProvider.length > 0) {
                    let dpFields = Object.getOwnPropertyNames(_dataProvider[0]);
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

            if (v && v.length > 0) {
                let dpFields = Object.getOwnPropertyNames(v[0]);
                if (dpFields.includes(_labelField)) {
                    _componentRepeater.dataProvider = _dataProvider;
                }
            } else {
                _componentRepeater.dataProvider = _dataProvider;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "selectedItem", {
        get: function selectedItem() {

            return _selectedItem;
        },
        set: function selectedItem(v) {
            if (_selectedItem != v) {
                _selectedItem = v;
                this.trigger("change");
            }
        }
    });
    if (!this.hasOwnProperty("label")) {
        Object.defineProperty(this, "label", {
            get: function label() {
                return _label;
            },
            set: function label(v) {
                _inputDD.value = _label = v;
            },
            enumerable: true
        });
    }
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _inputDD = this.textInput;
            _componentRepeater = this.repeater;
            _componentRepeater.attr["aria-labelledby"] = _inputDD.domID;
        }
    };
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.label && !this.getBindingExpression("label")) {
                this.label = _props.label;
            }
        }
    };
    this.afterAttach = function (e) {
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
        _creationFinished = true;
    };
    let fnInitCmpLabel = function () {
        let _componentLabel = {
            ctor: Label,
            props: {
                id: "label",
                classes: ['dropdown-item'],
                "click": _clickHandler,
            }
        };
        if (_labelField) {
            _componentLabel.props.label = '{' + _labelField + '}';
        }
        return _componentLabel;
    };
    let fnContainerDelayInit = function () {

        let _componentInput = {
            ctor: TextInput,
            props: {
                id: "textInput",
                classes: ["dropdown-toggle"],
                attr: {
                    "data-toggle": 'dropdown',
                    "aria-haspopup": "true",
                    "aria-expanded": "false"
                }
            }
        };

        let _toggleButton = {
            ctor: Button,
            props: {
                id: "toggleButton",
                classes: [_size, _split, "btn", "dropdown-toggle", "caret"],
                click: _buttonClickHandler
            }
        };

        let _componentLink = fnInitCmpLabel();

        let _componentRepeaterLit = {
            ctor: Repeater,
            props: {
                id: "repeater",
                type: "",
                classes: ["dropdown-menu", "drop-edit"],
                components: [_componentLink],
                dataProvider: _dataProvider
            }
        };
        return [_componentInput, _toggleButton, _componentRepeaterLit];
    };

    let _defaultParams = {
        id: 'dropEdit',
        dataProvider: new ArrayEx([]),
        hrefField: undefined,
        labelField: undefined,
        keyField: "",
        value: null,
        classes: [DropMenuDirection.DROPDOWN],
        label: "",
        size: ButtonSize.SMALL,
        type: "",
        split: DropSplitType.SPLIT,
        guidField: "guid"
    };

    let _clickHandler = function (e, ra) {
        _inputDD.value = this.label;
        let linkObj = {};
        linkObj[_guidField] = ra.currentItem[_guidField];
        _self.selectedItem = ArrayUtils.getMatching(_dataProvider, _guidField, linkObj[_guidField]).objects[0];
        _componentRepeater.$el.removeClass("show");
        e.stopPropagation();
    };

    let _buttonClickHandler = function (e) {
        _inputDD.attr["aria-expanded"] = !_inputDD.attr["aria-expanded"];
        this.parent.$el.toggleClass("show");
        _componentRepeater.$el.toggleClass("show");
    };

    _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    _props.attr["data-triggers"] = "change";

    let _hrefField = _props.hrefField;
    let _labelField = _props.labelField;
    let _value = _props.value;
    let _change = _props.change;
    let _size = _props.size;
    let _split = _props.split;
    let _selectedItem = _props.selectedItem;
    let _guidField = _props.guidField;

    if (_props.dataProvider && !StringUtils.getBindingExp(_props.dataProvider)) {
        _dataProvider = _props.dataProvider;
    } else
        _dataProvider = new ArrayEx();
    _props.components = fnContainerDelayInit();

    Container.call(this, _props, true);
};
DropEdit.prototype.ctor = 'DropEdit';
export {
    DropEdit
};