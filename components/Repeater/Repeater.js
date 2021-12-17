/**
 * This is an Repeater Element
 * 
 * Kreatx 2018
 */
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { debounce, functionName } from "/obvia/lib/DecoratorUtils.js";
import { ArrayEx } from "/obvia/lib//ArrayEx.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { RepeaterEventArgs } from "/obvia/components/Repeater/RepeaterEventArgs.js";
import { Component } from "/obvia/components/base/Component.js";
import { Literal } from "/obvia/lib/Literal.js";
import { Props } from "/obvia/components/base/Props.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var Repeater = function (_props)
{
    let _rowItems = [],
        _rows = [];
    let _self = this;
    let _$hadow = $("<div/>");
    let _autoUpdateDisplay;

    this.containerKeyDown = function (e)
    {
        if (typeof _keydown == 'function')
            _keydown.apply(this, arguments);
        // if(!e.isDefaultPrevented()){

        //     switch (e.keyCode) {
        //         case 13: // ENTER - apply value
        //             console.log("Repeater ENTER");
        //             break;
        //         case 27: // ESC - get back to old value
        //             console.log("Repeater ESCAPE");
        //             break;
        //         case 9: // TAB - apply and move to next column on the same row 
        //             console.log("Repeater TAB");
        //             break;
        //         case 40: //  
        //             console.log("Repeater DOWN Arrow");
        //             this.focusComponent(++_focusedRow, _focusedComponent);
        //             e.preventDefault();

        //             break;
        //         case 39: // 
        //             console.log("Repeater Right Arrow");
        //             this.focusComponent(_focusedRow, ++_focusedComponent);
        //             e.preventDefault();

        //             break;
        //         case 38: // 
        //             console.log("Repeater Up Arrow");
        //             this.focusComponent(--_focusedRow, _focusedComponent);
        //             e.preventDefault();

        //             break;
        //         case 37: // 
        //             console.log("Repeater Left Arrow");
        //             this.focusComponent(_focusedRow, --_focusedComponent);
        //             e.preventDefault();

        //             break;
        //     }
        // }
    };

    let _focusedRow = 0;
    let _focusedComponent = 0;

    this.focusComponent = function (rowIndex, cIndex)
    {
        if (rowIndex > this.dataProvider.length - 1)
        {
            rowIndex = 0;
        } else if (rowIndex < 0)
        {
            rowIndex = this.dataProvider.length - 1;
        }
        if (!isNaN(cIndex))
        {
            if (cIndex > Object.keys(this.rowItems[rowIndex]).length - 1)
            {
                cIndex = 0;
                ++rowIndex;
            } else if (cIndex < 0)
            {
                cIndex = Object.keys(this.rowItems[rowIndex]).length - 1;
                --rowIndex;
            }
            if (rowIndex > this.dataProvider.length - 1)
            {
                rowIndex = 0;
            } else if (rowIndex < 0)
            {
                rowIndex = this.dataProvider.length - 1;
            }
            cIndex = Object.keys(this.rowItems[rowIndex])[cIndex];
        }

        if (typeof this.rowItems[rowIndex][cIndex].$el.focus === "function")
        {

            this.rowItems[rowIndex][cIndex].$el.focus();
        }
    };
    let _comprenders = [];

    let _rowAdded = function (index, data)
    {
        ++_createdRows;
        //trigger row add event
        let era = jQuery.Event("rowAdd");
        _self.trigger(era, [_self, new RepeaterEventArgs(_rowItems[index], data, index)]);
        if (index + 1 == _self.dataProvider.length && _components.length > 0)
        {
            _rowItems[_rowItems.length - 1][_components[0].props.id].scrollTo();
        }
    };

    Object.defineProperty(this, "rendering", {
        get: function rendering()
        {
            return _rendering;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "$hadow", {
        get: function $hadow()
        {
            return _$hadow;
        },
        enumerable: false
    });

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider()
        {
            return _dataProvider;
        },
        set: function dataProvider(v)
        {
            if ((_dataProvider != v && v) || (v == null && _dataProvider.length > 0))
            {
                if (_dataProvider)
                {
                    _dataProvider.off("propertyChange", _debouncedUpdateDataProvider);
                }
                _dataProvider = v == null || Array.isArray(v) ? new ArrayEx(v) : v;
                this.updateDataProvider();
                if (_dataProvider)
                {
                    _dataProvider.on("propertyChange", _debouncedUpdateDataProvider);
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    if (!this.hasOwnProperty("updateDataProvider"))
    {
        this.updateDataProvider = async function ()
        {
            _self.trigger('beginDraw');
            let oldValue = _self.rows.length;
            let newValue = _dataProvider ? _dataProvider.length : 0;
            let p;
            let rb = Math.min(oldValue, newValue);
            for (let i = 0; i < newValue && _dataProvider; i++)
            {
                _self.prepareBindingShortcuts(_dataProvider[i], i);
                if (i < rb)
                {
                    for (let cmpID in _rowItems[i])
                    {
                        let cmp = _rowItems[i][cmpID];
                        if (cmp.refreshBindings)
                        {
                            cmp.refreshBindings(_dataProvider[i]);
                            cmp.attr[_guidField] = _dataProvider[i][_guidField];
                        }
                    }
                }
            }
            let delta = oldValue - newValue;
            if (delta > 0)
            {
                while (delta > 0)
                {
                    _self.removeRow(newValue + delta - 1);
                    --delta;
                }
            } else if (delta < 0)
            {
                while (delta < 0)
                {
                    let index = newValue + delta
                    let rowComponentsPromises = await _self.addRow(_dataProvider[index], index);
                    _comprenders.splicea(_comprenders.length, 0, rowComponentsPromises);
                    ++delta;
                }
            }
            p = Promise.all(_comprenders).then(function ()
            {
                _$hadow.contents().appendTo(_self.$container);
                _comprenders = [];
                _self.trigger('endDraw');
                let e = jQuery.Event("dataProviderUpdate");
                e.oldValue = oldValue;
                e.newValue = newValue;
                _self.trigger(e, [_self]);
            });

            return Promise.resolve(p);
        };
    }
    let _debouncedUpdateDataProvider = debounce(this.updateDataProvider, 1);

    if (!this.hasOwnProperty("value"))
    {
        Object.defineProperty(this, "value", {
            get: function value()
            {
                let value = {};
                for (let i = 0; i < _components.length; i++)
                {
                    value[_components[i].props.id] = [];
                    for (let j = 0; j < this[_components[i].props.id].length; j++)
                    {
                        value[_components[i].props.id].push(this[_components[i].props.id][j].value);
                    }
                }
                return value;
            },
            configurable: true
        });
    }

    this.prepareBindingShortcuts = function (data, index)
    {
        if (!data[_self.guidField])
        {
            Object.defineProperty(data, _self.guidField, {
                value: StringUtils.guid(),
                enumerable: false,
                configurable: true
            });
        }

        if (!("currentRow" in data))
        {
            Object.defineProperty(data, "currentRow", {
                get: function () { return _rowItems[data.currentIndex]; },
                enumerable: false,
                configurable: true
            });
        }

        if (!("currentItem" in data))
        {
            Object.defineProperty(data, "currentItem", {
                get: function () { return _self.dataProvider[data.currentIndex]; },
                enumerable: false,
                configurable: true
            });
        }

        if (!("currentIndex" in data))
        {
            Object.defineProperty(data, "currentIndex", {
                value: index,
                enumerable: false,
                configurable: true,
                writable: true
            });
        } else
            data.currentIndex = index;
    };

    let _createdRows = 0;
    //renders a new row, adds components in stack
    this.addRow = async function (data, index, isPreventable = false, focusOnRowAdd = true)
    {
        let rp = [];
        index = index == null ? _rows.length : index;
        let renderedRow = $('<div/>');
        let rowItems = {};
        _rowItems.splice(index, 0, rowItems);
        //_prepareBindingShortcuts(data, index);       

        let beforeRowAddEvent = jQuery.Event("beforeRowAdd");
        this.trigger(beforeRowAddEvent, [_self, new RepeaterEventArgs(_rowItems, data, index)]);

        if (!isPreventable || (isPreventable && !beforeRowAddEvent.isDefaultPrevented()))
        {
            let len = _components.length;
            for (let cIndex = 0; cIndex < len; cIndex++)
            {
                let component = {};
                if (!_components[cIndex].props.id)
                {
                    _components[cIndex].props.id = functionName(_components[cIndex].ctor) + "_" + (Component[_components[cIndex].ctor] ? Component[_components[cIndex].ctor].instanceInc : 0);
                }
                ObjectUtils.shallowCopy(_components[cIndex], component, ["props"]);
                component.props = {};
                ObjectUtils.shallowCopy(_components[cIndex].props, component.props, ["id", "bindingDefaultContext", "css", "attr"]);
                component.props.id = _components[cIndex].props.id + "_" + index + "_" + cIndex;
                if (_components[cIndex].props.bindingDefaultContext == null)
                {
                    component.props.bindingDefaultContext = data;
                }
                component.props.ownerDocument = _props.ownerDocument;
                component.props.parentRepeater = _self.proxyMaybe;
                component.props.repeaterIndex = index;
                component.props.css = Object.assign({}, _components[cIndex].props.css);
                component.props.attr = Object.assign({}, _components[cIndex].props.attr);

                let el = await Component.fromLiteral(component, data);
                let cmpId = _components[cIndex].props.id;

                //build components properties, check bindings
                if (_self[cmpId] == undefined)
                {
                    Object.defineProperty(_self, cmpId, {
                        value: [],
                        enumerable: false,
                        configurable: true
                    });
                }

                el.parent = _self.proxyMaybe;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;

                //update repeaterIndex
                if (_self[cmpId][index])
                {
                    for (let u = index; u < _self[cmpId].length; u++)
                    {
                        _self[cmpId][u].repeaterIndex += 1;
                    }
                }

                _self[cmpId].splice(index, 0, el);
                rowItems[cmpId] = el;


                //handle component change event and delegate it to repeater

                if (_rendering.direction == 'vertical')
                {
                    renderedRow.addClass("wrap");
                }

                el.on('focus', function (e, repeaterEventArgs)
                {
                    _focusedRow = repeaterEventArgs.currentIndex;
                    _focusedComponent = Object.keys(repeaterEventArgs.currentRow).indexOf(this.id);
                    console.log("focused repeated component", _focusedRow, _focusedComponent);
                });

                el.on('change', function (e, rargs)
                {
                    let currentItem = _self.dataProvider[index];
                    if (component.props.value && StringUtils.isString(component.props.value) && component.props.value[0] == '{' && component.props.value[component.props.value.length - 1] == '}')
                    {
                        let bindingExp = this.getBindingExpression("value");
                        if (bindingExp == "currentItem")
                        {
                            _self.dataProvider[rargs.currentIndex] = data = this.value;
                        } else
                        {
                            ObjectUtils.setChainValue(_dataProvider[rargs.currentIndex], bindingExp, this.value);
                            data = _dataProvider[rargs.currentIndex];
                        }


                    }
                    _self.trigger('rowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                });
                //rowItems = {};
                //render component in row
                let cp = el.render().then(function (cmpInstance)
                {
                    if (!_rendering.wrap)
                    {
                        // if(_self.mode =="append")
                        // {
                        //     _$hadow.append(cmpInstance.$el);
                        // }else{
                        //     _$hadow.prepend(cmpInstance.$el);
                        // }
                        _$hadow.insertAt(cmpInstance.$el, index * len + cIndex);
                    } else
                    {
                        renderedRow
                            .addClass("repeated-block")
                            .css((_rendering.direction == 'horizontal' ? {
                                display: 'inline-block'
                            } : {}))
                            .insertAt(cmpInstance.$el, cIndex);

                        if (_rendering.separator && (index > 0))
                        {
                            renderedRow.addClass("separator");
                        }
                        // if(_self.mode =="append")
                        // {
                        //     _$hadow.append(renderedRow);
                        // }else{
                        //     _$hadow.prepend(renderedRow);
                        // }
                    }
                });
                rp.push(cp);
            }
            _rows.push(renderedRow);
        }

        Promise.all(rp).then(function ()
        {
            if (_rendering.wrap)
            {
                _$hadow.insertAt(renderedRow, index);
            }
            _rowAdded(index, data);
        });

        return rp;
    };

    this.removeAllRows = function ()
    {
        let i = _self.rows.length - 1;
        while (i >= 0)
        {
            this.removeRow(i);
            i--;
        }
        _self.rows.splice(0, _self.rows.length);
    };

    let _notifyRemoveRow = function (index, focusOnRowDelete = false)
    {
        let beforeRowDeleteEvent = jQuery.Event("beforeRowDelete");
        let ra = new RepeaterEventArgs(_self.rowItems[index], null, index);
        _self.trigger(beforeRowDeleteEvent, [_self, ra]);

        if (!beforeRowDeleteEvent.isDefaultPrevented())
        {
            _self.dataProvider.splice(index, 1);
            if (focusOnRowDelete && index > 0 && _cellItemRenderers.length > 0)
                _self.rowItems[index - 1][_components[0].props.id].scrollTo();
        }
    };

    if (!this.hasOwnProperty("removeRow"))
    {
        this.removeRow = function (index)
        {
            let ra = new RepeaterEventArgs(_self.rowItems[index], null, index);
            let rlen = this.rowItems.length;
            let clen = _components.length;
            //delete component instances on that row
            for (let cI = 0; cI < clen; cI++)
            {
                let component = _components[cI];
                //remove repeated block from dom
                if (cI == 0 && _rendering.wrap)
                {
                    this[component.props.id][index].$el.closest('.repeated-block').remove();
                    this[component.props.id][index].$el.closest('.repeated-block-hr').remove();
                } else if (!_rendering.wrap)
                {
                    this[component.props.id][index].destruct(1);
                }
                //modify new cmp repeater indexes, row is still not removed so start at index + 1
                for (let i = index + 1; i < rlen; i++)
                {
                    let item = this[component.props.id][i];
                    item.repeaterIndex -= 1;
                }
                this[component.props.id].splice(index, 1);
            }
            this.trigger('rowDelete', [this, ra]);
            this.rowItems.splice(index, 1);
            _rows.splice(index, 1);
        };
    }
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            if ((_dataProvider && _dataProvider.forEach && _dataProvider.length > 0) || e.isDefaultPrevented())
                e.preventDefault();
        }
    };

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if (_props.enabled != null)
                this.enabled = _props.enabled;
        }
    };

    let _init = this.init;
    this.init = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _init == 'function')
                _init.apply(this, arguments);
            let len = _components.length;
            for (let i = 0; i < len; i++)
            {
                let id = _components[i].props.id;
                if (_props.props && _props.props[id] && ObjectUtils.isObject(_props.props[id]))
                {
                    let cprops = ObjectUtils.deepCopy(_props.props[id]);
                    _components[i].props = ObjectUtils.fromDefault(_components[i].props, cprops);
                }
            }
        }
    };

    let _defaultParams = {
        rendering: {
            direction: 'vertical',
            separator: false,
            wrap: true,
            mode: "append" //prepend
        },
        autoUpdateDisplay: true,
        type: "",
        dataProvider: new ArrayEx([]),
        guidField: "guid",
        components: []
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (Array.isArray(_props.dataProvider))
    {
        _props.dataProvider = new ArrayEx(_props.dataProvider);
    }
    if (!_props.attr)
    {
        _props.attr = {};
    }
    let myDtEvts = ["rowAdd", "rowEdit", "beforeRowAdd", "rowDelete", "beforeRowDelete", "dataProviderUpdate"];
    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    let _dataProvider;
    let _rendering = _props.rendering;
    let _enabled;
    let _guidField = _props.guidField;
    let _components = _props.components;
    let _keydown = _props.keydown;
    _props.keydown = this.containerKeyDown;

    let _rPromise;
    _autoUpdateDisplay = _props.autoUpdateDisplay;
    let r = Container.call(this, _props);
    /*
        var click =  props.click;
        _props.click = function(e)
        {
            if (typeof _click == 'function')
                _click.apply(this, arguments);

            alert("overrided")
        };*/

    this.render = async function ()
    {
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) =>
        {
            _self.on("endDraw", function (e)
            {
                if (e.target.id == _self.domID)
                {
                    resolve(this);
                }
            });
        });
        if (!this.getBindingExpression("dataProvider") && _props.dataProvider)
        {
            let d = Literal.fromLiteral(_props.dataProvider);
            Promise.resolve(d).then(function (dv)
            {
                if (dv.hasOwnProperty("parent"))
                {
                    dv.parent = _self;
                    dv.applyBindings();
                }
                _self.dataProvider = dv;
            });
        }
        else
            this.dataProvider = new ArrayEx([]);
        return _rPromise;
    };

    Object.defineProperty(this, "enabled", {
        get: function enabled()
        {
            return _enabled;
        },
        set: function enabled(v)
        {
            if (_enabled != v)
            {
                _enabled = v;
                if (!v)
                    this.$el.attr('disabled', 'disabled');
                else
                    this.$el.removeAttr('disabled');
                if (this.dataProvider)
                {
                    let len = this.dataProvider.length;
                    for (let i = 0; i < len; i++)
                    {
                        let clen = this.components.length;
                        for (let j = 0; j < clen; j++)
                        {
                            let component = this.components[j];
                            if (_self[component.props.id])
                            {
                                _self[component.props.id][i].enabled = v;
                            }
                        }
                    }
                }
            }
        }
    });

    Object.defineProperty(this, "components", {
        get: function components()
        {
            return _components;
        },
        set: function components(c)
        {
            _components = c;
        },
        enumerable: true
    });

    Object.defineProperty(this, "rowItems", {
        get: function rowItems()
        {
            return _rowItems;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "rows", {
        get: function rows()
        {
            return _rows;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "renders", {
        get: function renders()
        {
            return _comprenders;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "props", {
        get: function props()
        {
            return new Props(_self, _props);
        },
        configurable: true
    });

    Object.defineProperty(this, "guidField", {
        get: function guidField()
        {
            return _guidField;
        },
        configurable: true
    });

    return r;
};
Repeater.prototype.ctor = 'Repeater';
DependencyContainer.getInstance().register("Repeater", Repeater, DependencyContainer.simpleResolve);
export
{
    Repeater
};