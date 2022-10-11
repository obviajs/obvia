/**
 * This is a DropEdit  Element
 *
 * Kreatx 2020
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { Button, ButtonSize } from "/obvia/components/Button/Button.js";
import { DropMenuDirection, } from "/obvia/components/DropDown/DropMenuDirection.js";
import { DropSplitType } from "/obvia/components/DropDown/DropSplitType.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { TextInput } from "/obvia/components/TextInput/TextInput.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { Label } from "/obvia/components/Label.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
var DropEdit = function (_props)
{
    let _self = this;
    let _creationFinished;
    let _dataProvider, _inputDD, _componentRepeater, _label, myw;

    Object.defineProperty(this, "labelField", {
        get: function labelField()
        {
            return _labelField;
        },
        set: function labelField(v)
        {
            if (_labelField != v)
            {
                _labelField = v;
                _componentRepeater.components = fnInitCmpLink();
                if (_dataProvider && _dataProvider.length > 0)
                {
                    let dpFields = Object.getOwnPropertyNames(_dataProvider[0]);
                    if (dpFields.includes(_labelField))
                    {
                        _componentRepeater.dataProvider = _dataProvider;
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider()
        {
            return _dataProvider;
        },
        set: function dataProvider(v)
        {
            _dataProvider = v;
            if (v && v.length > 0)
            {
                let dpFields = Object.getOwnPropertyNames(v[0]);
                if (dpFields.includes(_labelField))
                {
                    _componentRepeater.dataProvider = _dataProvider;
                    _dataProvider.unshift({ [_labelField]: "Select", [_valueField]: null });
                }
            } else
            {
                _componentRepeater.dataProvider = _dataProvider;
                _dataProvider.unshift({ _labelField: "Select", _valueField: null });
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "selectedItem", {
        get: function selectedItem()
        {

            return _selectedItem;
        },
        set: function selectedItem(v)
        {

            if (_selectedItem != v)
            {
                let oldValue = _selectedItem;
                if (!ObjectUtils.isObject(v))
                {
                    let o = {};
                    o[_valueField] = v;
                    v = o;
                }
                if (v.hasOwnProperty(_valueField))
                {
                    let m = ArrayUtils.getMatching(_componentRepeater.dataProvider, _valueField, v[_valueField]).objects;
                    if (m.length > 0)
                    {
                        v = m[0];
                        _selectedItem = v;
                        _inputDD.value = v[_labelField];
                    } else if (_allowNewItem)
                    {
                        _componentRepeater.dataProvider.splice(_componentRepeater.dataProvider.length, 0, v);
                        _selectedItem = v;
                        _inputDD.value = v[_labelField];

                    } else
                    {
                        _selectedItem = null;
                        _inputDD.value = _label;
                    }
                    this.trigger("change");
                    myw.propertyChanged("selectedItem", oldValue, _selectedItem);
                }
            }
        }
    });
    if (!this.hasOwnProperty("label"))
    {
        Object.defineProperty(this, "label", {
            get: function label()
            {
                return _label;
            },
            set: function label(v)
            {
                _inputDD.value = _label = v;
            },
            enumerable: true
        });
    }
    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            _inputDD = this.textInput;
            _componentRepeater = this.repeater;
            _componentRepeater.attr["aria-labelledby"] = _inputDD.domID;
        }
    };
    this.init = function (e)
    {
        myw = ChangeWatcher.getInstance(_self);
    };
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (_props.label && !this.getBindingExpression("label"))
            {
                this.label = _props.label;
            }
        }
    };
    this.afterAttach = function (e)
    {
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
        _creationFinished = true;
    };
    let fnInitCmpLabel = function ()
    {
        let _componentLabel = {
            ctor: Label,
            props: {
                id: "label",
                classes: ['dropdown-item'],
                "click": _clickHandler,
            }
        };
        if (_labelField)
        {
            _componentLabel.props.label = '{' + _labelField + '}';
        }
        return _componentLabel;
    };


    let fnContainerDelayInit = function ()
    {

        let _componentInput = {
            ctor: TextInput,
            props: {
                id: "textInput",
                classes: ["dropdown-toggle"],
                css: {
                    "width": '100%',
                    "border": "none",
                    "border-bottom": "2px solid gray"
                },
                attr: {
                    "data-toggle": 'dropdown',
                    "aria-haspopup": 'true',
                    "aria-expanded": 'false'
                },
                keyup: _filter
            }
        };

        let _toggleButton = {
            ctor: Button,
            props: {
                id: "toggleButton",
                classes: ["fa", "fa-caret-down"],
                css: {
                    "background-color": "white",
                    "border": "none",
                    "border-bottom": "2px solid gray",
                    "outline": "none"
                },
                click: _buttonClickHandler,
                blur: _buttonClickHandler
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
                dataProvider: [..._dataProvider]
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
        allowNewItem: false,
        classes: [DropMenuDirection.DROPDOWN],
        label: "",
        size: ButtonSize.SMALL,
        type: "",
        css: {
            display: "flex"
        },
        split: DropSplitType.SPLIT,
        guidField: "guid"
    };

    const _filter = async function (e)
    {
        let val = e.target.value.toLowerCase().trim();
        _componentRepeater.dataProvider = [..._dataProvider];
        if (val.length > 0)
        {
            _componentRepeater.$el.addClass("show");
            _componentRepeater.dataProvider.filter((element) =>
            {
                return element[_labelField].toLowerCase().includes(val);
            });
        } else
        {
            _componentRepeater.$el.removeClass("show");
        }
    };

    let _clickHandler = function (e, ra)
    {
        _inputDD.value = this.label;
        let linkObj = {};
        linkObj[_guidField] = ra.currentItem[_guidField];
        _self.selectedItem = ArrayUtils.getMatching(_componentRepeater.dataProvider, _guidField, linkObj[_guidField]).objects[0];
        _componentRepeater.$el.removeClass("show");
        e.stopPropagation();
    };

    let _buttonClickHandler = function (e)
    {
        _inputDD.attr["aria-expanded"] = !_inputDD.attr["aria-expanded"];
        if (_componentRepeater.$el[0].classList.contains("show"))
            _componentRepeater.$el.removeClass("show");
        else
            _componentRepeater.$el.addClass("show");
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    if (!_props.attr)
    {
        _props.attr = {};
    }
    _props.attr["data-triggers"] = "change";

    let _hrefField = _props.hrefField;
    let _labelField = _props.labelField;
    let _valueField = _props.valueField;
    let _value = _props.value;
    let _change = _props.change;
    let _size = _props.size;
    let _split = _props.split;
    let _selectedItem = _props.selectedItem;
    let _guidField = _props.guidField;
    let _allowNewItem = _props.allowNewItem;

    if (_props.dataProvider && !StringUtils.getBindingExp(_props.dataProvider))
    {
        _dataProvider = _props.dataProvider;
    } else
        _dataProvider = new ArrayEx();
    _props.components = fnContainerDelayInit();
    let r = Container.call(this, _props, true);
    return r;
};
DependencyContainer.getInstance().register("DropEdit", DropEdit, DependencyContainer.simpleResolve);
DropEdit.prototype.ctor = 'DropEdit';
DropEdit.prototype.valueProp = 'selectedItem';
export
{
    DropEdit
};