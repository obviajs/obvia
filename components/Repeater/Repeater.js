/**
 * This is an Repeater Element
 * 
 * Kreatx 2018
 */

//component definition
var Repeater = function (_props, _hideComponents = false) {
    let _rowItems = [],
        _rows = [];
    let _self = this;
    let _creationFinished = false;
    let _$hadow = $("<div/>");
    let _autoUpdateDisplay;

    this.containerKeyDown = function (e) {
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

    this.focusComponent = function (rowIndex, cIndex) {
        if (rowIndex > this.dataProvider.length - 1) {
            rowIndex = 0;
        } else if (rowIndex < 0) {
            rowIndex = this.dataProvider.length - 1;
        }
        if (!isNaN(cIndex)) {
            if (cIndex > Object.keys(this.rowItems[rowIndex]).length - 1) {
                cIndex = 0;
                ++rowIndex;
            } else if (cIndex < 0) {
                cIndex = Object.keys(this.rowItems[rowIndex]).length - 1;
                --rowIndex;
            }
            if (rowIndex > this.dataProvider.length - 1) {
                rowIndex = 0;
            } else if (rowIndex < 0) {
                rowIndex = this.dataProvider.length - 1;
            }
            cIndex = Object.keys(this.rowItems[rowIndex])[cIndex];
        }

        if (typeof this.rowItems[rowIndex][cIndex].$el.focus === "function") {

            this.rowItems[rowIndex][cIndex].$el.focus();
        }
    };
    let _comprenders = [];
    if (!this.hasOwnProperty("createRows")) {
        this.createRows = function () {
            _self.trigger('beginDraw');
            //this.$container.empty();
            _focusedRow = 0;
            _focusedComponent = 0;
            if (_dataProvider && _dataProvider.forEach) {
                let len = _dataProvider.length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let data = _dataProvider[i];
                        if (data != null) {
                            if (!data[_guidField])
                                Object.defineProperty(data, _guidField, {
                                    value: StringUtils.guid(),
                                    enumerable: false,
                                    configurable: true
                                });
                            let rowComponentsPromises = _self.addRow(data, i);
                            Promise.all(rowComponentsPromises).then(function () {
                                _rowAdded(i, data);
                            });
                            _comprenders.splicea(_comprenders.length, 0, rowComponentsPromises);
                        }
                    }
                } else
                    _creationFinished = true;
            } else
                _creationFinished = true;
            return Promise.all(_comprenders).then(function () {
                _$hadow.contents().appendTo(_self.$container);
                _comprenders = [];
                _self.trigger('endDraw');
            });
        };
    }

    let _rowAdded = function (index, data) {
        ++_createdRows;
        //trigger row add event
        let era = jQuery.Event("rowAdd");
        _self.trigger(era, [_self, new RepeaterEventArgs(_rowItems[index], data, index)]);

        if (_createdRows == _self.dataProvider.length) {
            if (!_creationFinished) {
                _creationFinished = true;
                _self.trigger('creationComplete');
            }
        }
        if (index + 1 == _self.dataProvider.length && _components.length > 0) {
            _rowItems[_rowItems.length - 1][_components[0].props.id].scrollTo();
        }
    };
    if (!this.hasOwnProperty("dataProviderChanged")) {
        this.dataProviderChanged = function (toAdd, toRemove, toRefresh) {
            acSort(toRemove.a1_indices, null, 2);
            for (let i = 0; i < toRemove.a1_indices.length; i++) {
                //var ind = this.rowItems.length + i;
                if (toRefresh.indexOf(toRemove.a1_indices[i]) == -1 && toAdd.a1_indices.indexOf(toRemove.a1_indices[i]) == -1)
                    if (toRemove.a1_indices[i] < _rows.length)
                        this.removeRow(toRemove.a1_indices[i], false, true);
                //this.removeChildAtIndex(toRemove.a1_indices[i]);
            }
            if (toAdd.a1_indices.length > 0) {
                acSort(toAdd.a1_indices);
                let transferNodes = false;
                for (let i = 0; i < toAdd.a1_indices.length; i++) {
                    if (toRefresh.indexOf(toAdd.a1_indices[i]) == -1 && toRemove.a1_indices.indexOf(toAdd.a1_indices[i]) == -1) {
                        if (!transferNodes) {
                            _self.$container.contents().appendTo(_$hadow);
                            transferNodes = true;
                        }
                        let ind = toAdd.a1_indices[i];
                        let rowComponentsPromises = this.addRow(this.dataProvider[ind], ind);
                        Promise.all(rowComponentsPromises).then(function () {
                            _rowAdded(ind, _self.dataProvider[ind]);
                        });
                        _comprenders.splicea(_comprenders.length, 0, rowComponentsPromises);
                    }
                }
                if (_comprenders.length > 0) {
                    let cLen = _comprenders.length;
                    Promise.all(_comprenders).then(function () {
                        if (_comprenders.length > 0) {
                            console.log('prevLength:', cLen, ' currentLength: ', _comprenders.length);
                            _$hadow.contents().appendTo(_self.$container);
                            _comprenders = [];


                        }
                    });
                }
            }

            for (let i = 0; i < toRefresh.length; i++) {
                let ri = toRefresh[i];
                Object.defineProperty(_self.dataProvider[ri], "currentRow", {
                    value: _rowItems[ri],
                    enumerable: false,
                    configurable: true
                });
                for (let cmpID in _rowItems[ri]) {
                    let cmp = _rowItems[ri][cmpID];
                    if (cmp.refreshBindings) {
                        cmp.refreshBindings(_self.dataProvider[ri]);
                        cmp.$el.attr(_guidField, _self.dataProvider[ri][_guidField]);
                        cmp.attr[_guidField] = _self.dataProvider[ri][_guidField];
                    }
                }
            }


        };
    }
    Object.defineProperty(this, "rendering", {
        get: function rendering() {
            return _rendering;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "$hadow", {
        get: function $hadow() {
            return _$hadow;
        },
        enumerable: false
    });

    let _oldDataProvider;
    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            if (!_dataProvider || _dataProvider != v) {
                if (_dpWatcher && _dataProvider) {
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange", _dpMemberChanged);
                }
                if (v == null || v.length == 0) {
                    if (_oldDataProvider && _oldDataProvider.length > 0)
                        this.removeAllRows();
                    _dataProvider = !ArrayEx.isArrayEx(v) ? new ArrayEx(v) : v;
                    _creationFinished = true;
                    this.createRows();
                } else if (_oldDataProvider && _oldDataProvider.length > 0 && _oldDataProvider.length == this.rowItems.length) {
                    let delta = (v.length ? v.length : 0) - (_oldDataProvider.length ? _oldDataProvider.length : 0);
                    for (let ri = 0; ri < Math.min(v.length, _oldDataProvider.length); ri++) {
                        if (v[ri] != null && !v[ri][_guidField])
                            Object.defineProperty(v[ri], _guidField, {
                                value: StringUtils.guid(),
                                enumerable: false,
                                configurable: true
                            });
                        for (let cmpID in this.rowItems[ri]) {
                            let cmp = this.rowItems[ri][cmpID];
                            cmp.refreshBindings(v[ri]);
                            cmp.$el.attr(_guidField, v[ri][_guidField]);
                            cmp.attr[_guidField] = v[ri][_guidField];
                        }

                    }
                    if (delta > 0) {
                        for (let i = _oldDataProvider.length; i < v.length; i++) {
                            if (v[i] != null && !v[i][_guidField])
                                Object.defineProperty(v[i], _guidField, {
                                    value: StringUtils.guid(),
                                    enumerable: false,
                                    configurable: true
                                });

                            let rowComponentsPromises = this.addRow(v[i], i);
                            Promise.all(rowComponentsPromises).then(function () {
                                _rowAdded(i, v[i]);
                            });
                            _comprenders.splicea(_comprenders.length, 0, rowComponentsPromises);
                        }
                        if (_comprenders.length > 0) {
                            Promise.all(_comprenders).then(function () {
                                _$hadow.contents().appendTo(_self.$container);
                                _comprenders = [];
                            });
                        }

                    } else if (delta < 0) {
                        for (let i = _oldDataProvider.length - 1; i >= v.length; i--) {
                            this.removeRow(i, false, true);
                        }
                    }
                    _dataProvider = !ArrayEx.isArrayEx(v) ? new ArrayEx(v) : v;
                } else if (_oldDataProvider == null || _oldDataProvider.length == 0 || _oldDataProvider.length != this.rowItems.length) {
                    _dataProvider = !ArrayEx.isArrayEx(v) ? new ArrayEx(v) : v;
                    this.createRows();
                    //temp hack
                    _creationFinished = true;
                }
                if (_dataProvider) {
                    _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                    _dpWatcher.watch(_dataProvider, "length", _debouncedLengthChanged);
                    _dataProvider.on("propertyChange", _dpMemberChanged);
                }
                _oldDataProvider = acExtend(_dataProvider);
            } else if (_dataProvider == v) {
                this.removeAllRows();
                this.createRows();
            }
        },
        enumerable: true,
        configurable: true
    });

    let _dpWatcher;
    let _dpLengthChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        let len = _dataProvider.length;
        let oldValue = _oldDataProvider.length;
        let newValue = _dataProvider.length;

        for (let i = 0; i < len; i++) {
            if (!_dataProvider[i][_guidField])
                Object.defineProperty(_dataProvider[i], _guidField, {
                    value: StringUtils.guid(),
                    enumerable: false,
                    configurable: true
                });
        }
        if (_creationFinished) {
            let toAdd = {
                result: [],
                a1_indices: []
            };
            toAdd = differenceOnKeyMatch(_dataProvider, _oldDataProvider, _guidField, false, true);
            let swap = [];
            for (let i = 0; i < toAdd.swap.length; i++) {
                swap.push(toAdd.swap[i].a1_index);
                if (toAdd.swap[i].a2_index < _dataProvider.length) {
                    swap.push(toAdd.swap[i].a2_index);
                }
            }
            let toRemove = {
                result: [],
                a1_indices: []
            };
            toRemove = differenceOnKeyMatch(_oldDataProvider, _dataProvider, _guidField, false, true);
            for (let i = 0; i < toRemove.swap.length; i++) {
                swap.push(toRemove.swap[i].a2_index);
                if (toRemove.swap[i].a1_index < _dataProvider.length) {
                    swap.push(toRemove.swap[i].a1_index);
                }
            }
            swap.dedupe();

            if (newValue < oldValue && toRemove.result.length != oldValue - newValue) {
                let r = _oldDataProvider.dedupe(_guidField);
                toRemove.result.splicea(toRemove.result.length, 0, r.result);
                toRemove.a1_indices.splicea(toRemove.a1_indices.length, 0, r.indices);
            }
            let toRefresh = [];
            swap = swap.difference(toAdd.a1_indices);
            swap = swap.difference(toRemove.a1_indices);
            let cc = intersect(toAdd.a1_indices, toRemove.a1_indices).concat(swap);
            toRefresh.splicea(toRefresh.length, 0, cc);

            if (_autoUpdateDisplay)
                _self.dataProviderChanged(toAdd, toRemove, toRefresh);
            _oldDataProvider = acExtend(_dataProvider);
        }

        let dataProviderLengthChangedEvent = jQuery.Event("dataProviderLengthChanged");
        dataProviderLengthChangedEvent.oldValue = oldValue;
        dataProviderLengthChangedEvent.newValue = newValue;
        _self.trigger(dataProviderLengthChangedEvent, [_self]);
    };
    let _debouncedLengthChanged = debounce(_dpLengthChanged, 1);

    let _dpMemberChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (_creationFinished && ["length", "guid", "filterData"].indexOf(e.property) == -1) {
            if (!_dataProvider[parseInt(e.property)][_guidField])
                Object.defineProperty(_dataProvider[parseInt(e.property)], _guidField, {
                    value: StringUtils.guid(),
                    enumerable: false,
                    configurable: true
                });
            let toAdd = {
                a1_indices: [],
                result: []
            };
            let toRemove = {
                a1_indices: [],
                result: []
            };

            if (e.oldValue != null && e.newValue != null) {
                //toRefresh = [parseInt(e.property)];
                //te shtohet param e
                _debouncedLengthChanged(e);
            }
        }
    };

    if (!this.hasOwnProperty("value")) {
        Object.defineProperty(this, "value", {
            get: function value() {
                let value = {};
                for (var i = 0; i < _components.length; i++) {
                    value[_components[i].props.id] = [];
                    for (let j = 0; j < this[_components[i].props.id].length; j++) {
                        value[_components[i].props.id].push(this[_components[i].props.id][j].value);
                    }
                }
                return value;
            },
            configurable: true
        });
    }
    let _createdRows = 0;
    //renders a new row, adds components in stack
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) {
        let rp = [];
        index = index == null ? _rows.length : index;
        let renderedRow = $('<div/>');
        let rowItems = {};

        Object.defineProperty(data, "currentRow", {
            value: rowItems,
            enumerable: false,
            configurable: true
        });

        if (!("currentIndex" in data)) {
            Object.defineProperty(data, "currentIndex", {
                value: index,
                enumerable: false,
                configurable: true
            });
        }

        let beforeRowAddEvent = jQuery.Event("beforeRowAdd");
        this.trigger(beforeRowAddEvent, [_self, new RepeaterEventArgs(_rowItems, data, index)]);

        if (!isPreventable || (isPreventable && !beforeRowAddEvent.isDefaultPrevented())) {
            let len = _components.length;
            for (let cIndex = 0; cIndex < len; cIndex++) {
                let component = {};
                if (!_components[cIndex].props.id) {
                    _components[cIndex].props.id = functionName(_components[cIndex].ctor) + "_" + (Component[_components[cIndex].ctor] ? Component[_components[cIndex].ctor].instanceInc : 0);
                }
                shallowCopy(_components[cIndex], component, ["props"]);
                component.props = {};
                shallowCopy(_components[cIndex].props, component.props, ["id", "bindingDefaultContext"]);
                component.props.id = _components[cIndex].props.id + "_" + index + "_" + cIndex;
                if (_components[cIndex].props.bindingDefaultContext == null) {
                    component.props.bindingDefaultContext = data;
                }
                component.props.repeaterIndex = index;
                component.props.parentRepeater = _self;

                component.props.ownerDocument = _props.ownerDocument;
                let el = Component.fromLiteral(component, data);
                let cmpId = _components[cIndex].props.id;

                //build components properties, check bindings
                if (_self[cmpId] == undefined) {
                    Object.defineProperty(_self, cmpId, {
                        value: [],
                        enumerable: false,
                        configurable: true
                    });
                }

                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;

                //update repeaterIndex
                if (_self[cmpId][index]) {
                    for (let u = index; u < _self[cmpId].length; u++) {
                        _self[cmpId][u].repeaterIndex += 1;
                        data.currentIndex += 1;
                    }
                }

                _self[cmpId].splice(index, 0, el);
                rowItems[cmpId] = el;


                //handle component change event and delegate it to repeater

                if (_rendering.direction == 'vertical') {
                    renderedRow.addClass("wrap");
                }

                el.on('focus', function (e, repeaterEventArgs) {
                    _focusedRow = repeaterEventArgs.currentIndex;
                    _focusedComponent = Object.keys(repeaterEventArgs.currentRow).indexOf(this.id);
                    console.log("focused repeated component", _focusedRow, _focusedComponent);
                });

                el.on('change', function (e, rargs) {
                    let currentItem = _self.dataProvider[index];
                    if (component.props.value && isString(component.props.value) && component.props.value[0] == '{' && component.props.value[component.props.value.length - 1] == '}') {
                        var bindingExp = this.getBindingExpression("value");
                        if (bindingExp == "currentItem") {
                            _self.dataProvider[rargs.currentIndex] = data = this.value;
                        } else {
                            setChainValue(_dataProvider[rargs.currentIndex], bindingExp, this.value);
                            data = _dataProvider[rargs.currentIndex];
                        }


                    }
                    _self.trigger('rowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                });
                //rowItems = {};
                //render component in row
                let cp = el.render().then(function (cmpInstance) {
                    if (!_rendering.wrap) {
                        // if(_self.mode =="append")
                        // {
                        //     _$hadow.append(cmpInstance.$el);
                        // }else{
                        //     _$hadow.prepend(cmpInstance.$el);
                        // }
                        _$hadow.insertAt(cmpInstance.$el, index * len + cIndex);
                    } else {
                        renderedRow
                            .addClass("repeated-block")
                            .css((_rendering.direction == 'horizontal' ? {
                                display: 'inline-block'
                            } : {}))
                            .insertAt(cmpInstance.$el, cIndex);

                        if (_rendering.separator && (index > 0)) {
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
            _rowItems.splice(index, 0, rowItems);
            _rows.push(renderedRow);
        }
        if (_rendering.wrap) {
            Promise.all(rp).then(function () {
                _$hadow.insertAt(renderedRow, index);
            });
        }
        return rp;
    };

    this.removeAllRows = function () {
        let i = _self.rows.length - 1;
        while (i >= 0) {
            this.removeRow(i, false, false);
            i--;
        }
        _self.rows.splice(0, _self.rows.length);
    };
    if (!this.hasOwnProperty("removeRow")) {
        this.removeRow = function (index, isPreventable = false, focusOnRowDelete = true) {
            var rowItems = {};
            let beforeRowDeleteEvent = jQuery.Event("beforeRowDelete");
            let ra = new RepeaterEventArgs(_self.rowItems[index], _oldDataProvider[index], index);
            this.trigger(beforeRowDeleteEvent, [_self, ra]);

            if (!isPreventable || (isPreventable && !beforeRowDeleteEvent.isDefaultPrevented())) {
                //remove dp row
                let rlen = this.rowItems.length;
                let clen = _components.length;
                //delete component instances on that row
                for (let cI = 0; cI < clen; cI++) {
                    let component = _components[cI];
                    //remove repeated block from dom
                    if (cI == 0 && _rendering.wrap) {
                        this[component.props.id][index].$el.closest('.repeated-block').remove();
                        this[component.props.id][index].$el.closest('.repeated-block-hr').remove();
                    } else if (!_rendering.wrap) {
                        this[component.props.id][index].destruct(1);
                    }
                    //modify new cmp repeater indexes, row is still not removed so start at index + 1
                    for (let i = index + 1; i < rlen; i++) {
                        let item = this[component.props.id][i];
                        item.repeaterIndex -= 1;
                    }

                    rowItems[component.props.id] = [this[component.props.id][index]];
                    this[component.props.id].splice(index, 1);
                }
                //dp element has been removed so start at index
                let dplen = this.dataProvider.length;
                for (let i = index; i < dplen; i++) {
                    this.dataProvider[i].currentIndex -= 1;
                }
                this.trigger('rowDelete', [this, ra]);
                this.rowItems.splice(index, 1);
                _rows.splice(index, 1);
                //animate
                if (focusOnRowDelete && (index - 1) >= 0)
                    this.rowItems[index - 1][_components[0].props.id].scrollTo();
            }
        };
    }
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            if ((!_creationFinished && (_dataProvider && _dataProvider.forEach && _dataProvider.length > 0)) || e.isDefaultPrevented())
                e.preventDefault();
        }
    };
    var _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    var _defaultParams = {
        rendering: {
            direction: 'vertical',
            separator: false,
            wrap: true,
            mode: "append" //prepend
        },
        autoUpdateDisplay: true,
        type: ContainerType.NONE,
        dataProvider: new ArrayEx([]),
        guidField: "guid",
        components: []
    };
    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["rowAdd", "rowEdit", "beforeRowAdd", "rowDelete", "beforeRowDelete", "dataProviderLengthChanged"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    var _dataProvider;
    var _rendering = _props.rendering;
    var _enabled = _props.enabled;
    var _guidField = _props.guidField;
    var _components = _props.components;
    var _keydown = _props.keydown;
    _props.keydown = this.containerKeyDown;

    let _rPromise;
    _autoUpdateDisplay = _props.autoUpdateDisplay;
    let r = Container.call(this, _props, _hideComponents);
    /*
        var click =  props.click;
        _props.click = function(e)
        {
            if (typeof _click == 'function')
                _click.apply(this, arguments);

            alert("overrided")
        };*/

    this.render = function () {
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function (e) {
                if (e.target.id == _self.domID) {
                    resolve(this);
                }
            });
        });
        //if(_props.dataProvider)
        if (!this.getBindingExpression("dataProvider"))
            this.dataProvider = _props.dataProvider;
        else
            this.dataProvider = new ArrayEx([]);
        return _rPromise;
    };

    Object.defineProperty(this, "enabled", {
        get: function enabled() {
            return _enabled;
        },
        set: function enabled(v) {
            if (_enabled != v) {
                _enabled = v;
                let len = this.dataProvider.length;
                for (let i = 0; i < len; i++) {
                    let clen = this.components.length;
                    for (let j = 0; j < clen; j++) {
                        let component = this.components[j];
                        _self[component.props.id][i].enabled = v;
                    }
                }
            }
        }
    });

    Object.defineProperty(this, "components", {
        get: function components() {
            return _components;
        },
        set: function components(c) {
            _components = c;
        },
        enumerable: true
    });

    Object.defineProperty(this, "rowItems", {
        get: function rowItems() {
            return _rowItems;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "rows", {
        get: function rows() {
            return _rows;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "renders", {
        get: function renders() {
            return _comprenders;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "props", {
        get: function props() {
            return new Props(_self, _props);
        },
        configurable: true
    });

    return r;
};
Repeater.prototype.ctor = 'Repeater';