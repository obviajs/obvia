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

    let _rowAdded = function (index, data) {
        ++_createdRows;
        //trigger row add event
        let era = jQuery.Event("rowAdd");
        _self.trigger(era, [_self, new RepeaterEventArgs(_rowItems[index], data, index)]);
        if (index + 1 == _self.dataProvider.length && _components.length > 0) {
            _rowItems[_rowItems.length - 1][_components[0].props.id].scrollTo();
        }
    };
    
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

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            if (_dataProvider != v || v==null) {
                if (_dpWatcher && _dataProvider) {
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange", _debouncedUpdateDataProvider);
                }
                _dataProvider = v == null || Array.isArray(v) ? new ArrayEx(v) : v;                
                this.updateDataProvider();
                if (_dataProvider) {
                    _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                    _dpWatcher.watch(_dataProvider, "length", _debouncedUpdateDataProvider);
                    _dataProvider.on("propertyChange", _debouncedUpdateDataProvider);
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    let _dpWatcher;
    if (!this.hasOwnProperty("updateDataProvider")) {
        this.updateDataProvider = function () {
            _self.trigger('beginDraw');
            let oldValue = _self.rows.length;
            let newValue = _dataProvider ? _dataProvider.length : 0;
            let p;
            let rb = Math.min(oldValue, newValue);
            for (let i = 0; i < newValue && _dataProvider; i++) {
                _self.prepareBindingShortcuts(_dataProvider[i], i);
                if (i < rb) {
                    for (let cmpID in _rowItems[i]) {
                        let cmp = _rowItems[i][cmpID];
                        if (cmp.refreshBindings) {
                            cmp.refreshBindings(_dataProvider[i]);
                            cmp.attr[_guidField] = _dataProvider[i][_guidField];
                        }
                    }
                }
            }
            let delta = oldValue - newValue;
            if (delta > 0) {
                while (delta > 0) {
                    _self.removeRow(newValue + delta - 1);
                    --delta;
                }
            } else if (delta < 0) {
                while (delta < 0) {
                    let index = newValue + delta
                    let rowComponentsPromises = _self.addRow(_dataProvider[index], index);
                    _comprenders.splicea(_comprenders.length, 0, rowComponentsPromises);
               
                    ++delta;
                }
            }
            p = Promise.all(_comprenders).then(function () {
                _$hadow.contents().appendTo(_self.$container);
                _comprenders = [];
                _self.trigger('endDraw');
            });

            let e = jQuery.Event("dataProviderUpdate");
            e.oldValue = oldValue;
            e.newValue = newValue;
            _self.trigger(e, [_self]);
            return Promise.resolve(p);
        };
    }
    let _debouncedUpdateDataProvider = debounce(this.updateDataProvider, 1);

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
    
    this.prepareBindingShortcuts = function (data, index) {
        if (!data[_self.guidField]) {
            Object.defineProperty(data, _self.guidField, {
                value: StringUtils.guid(),
                enumerable: false,
                configurable: true
            });
        }

        if (!("currentRow" in data)) {
            Object.defineProperty(data, "currentRow", {
                get: function () { return _rowItems[index]; },
                enumerable: false,
                configurable: true
            });
        }

        if (!("currentItem" in data)) {
            Object.defineProperty(data, "currentItem", {
                get: function () { return data; },
                enumerable: false,
                configurable: true                
            });
        }

        if (!("currentIndex" in data)) {
            Object.defineProperty(data, "currentIndex", {
                value: index,
                enumerable: false,
                configurable: true
            });
        }
    };

    let _createdRows = 0;
    //renders a new row, adds components in stack
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) {
        let rp = [];
        index = index == null ? _rows.length : index;
        let renderedRow = $('<div/>');
        let rowItems = {};
        _rowItems.splice(index, 0, rowItems);
        //_prepareBindingShortcuts(data, index);       

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
                component.props.parentRepeater = _self.proxyMaybe;

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

                el.parent = _self.proxyMaybe;
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
            _rows.push(renderedRow);
        }
       
        Promise.all(rp).then(function () {
            if (_rendering.wrap) {
                _$hadow.insertAt(renderedRow, index);
            }            
            _rowAdded(index, data);
        });
        
        return rp;
    };

    this.removeAllRows = function () {
        let i = _self.rows.length - 1;
        while (i >= 0) {
            this.removeRow(i);
            i--;
        }
        _self.rows.splice(0, _self.rows.length);
    };

    let _notifyRemoveRow = function (index, focusOnRowDelete=false) {
        let beforeRowDeleteEvent = jQuery.Event("beforeRowDelete");
        let ra = new RepeaterEventArgs(_self.rowItems[index], null, index);
        _self.trigger(beforeRowDeleteEvent, [_self, ra]);

        if (!beforeRowDeleteEvent.isDefaultPrevented()) {
            _self.dataProvider.splice(index, 1);
            if (focusOnRowDelete && index > 0 &&_cellItemRenderers.length > 0)                
                _self.rowItems[index - 1][_components[0].props.id].scrollTo();
        }
    };

    if (!this.hasOwnProperty("removeRow")) {
        this.removeRow = function (index) {
            let ra = new RepeaterEventArgs(_self.rowItems[index], null, index);        
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
        };
    }
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            if ((_dataProvider && _dataProvider.forEach && _dataProvider.length > 0) || e.isDefaultPrevented())
                e.preventDefault();
        }
    };
    
    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };
    
    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _init == 'function')
                _init.apply(this, arguments);
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
    let myDtEvts = ["rowAdd", "rowEdit", "beforeRowAdd", "rowDelete", "beforeRowDelete", "dataProviderUpdate"];
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

    this.render = async function () {
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function (e) {
                if (e.target.id == _self.domID) {
                    resolve(this);
                }
            });
        });
        //if(_props.dataProvider)
        if (!this.getBindingExpression("dataProvider")) {
            let d = Literal.fromLiteral(_props.dataProvider);
            this.dataProvider = await Promise.resolve(d).then(function (dv) {
                if (dv.hasOwnProperty("parent")) {
                    dv.parent = _self;
                }
                return dv;
            });
        }
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

    Object.defineProperty(this, "guidField", {
        get: function guidField() {
            return _guidField;
        },
        configurable: true
    });
    
    return r;
};
Repeater.prototype.ctor = 'Repeater';