/**
 * This is a DataGrid component
 * 
 * Kreatx 2018
 */

//component definition

import { Repeater } from "/flowerui/components/Repeater/Repeater.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";
import { TwoWayMap } from "/flowerui/lib/TwoWayMap.js";
import { ArrayEx } from "/flowerui/lib//ArrayEx.js";
import { debounce, debouncePromise, functionName, queue } from "/flowerui/lib/DecoratorUtils.js";
import { DataGridColumn } from "/flowerui/components/DataGrid/DataGridColumn.js";
import { Component } from "/flowerui/components/base/Component.js";
import { Th } from "/flowerui/components/Table/Th.js";
import { Literal } from "/flowerui/lib/Literal.js";
import { RepeaterEventArgs } from "/flowerui/components/Repeater/RepeaterEventArgs.js";
import { Env, EnvType } from "/flowerui/lib/Env.js";
import { StringUtils } from "/flowerui/lib/StringUtils.js";
import { ArrayUtils } from "/flowerui/lib/ArrayUtils.js";
import { DependencyContainer } from "/flowerui/lib/DependencyContainer.js";
var DataGrid = function (_props) {
    let _self = this;
    let _multiSelect;
    let _defaultItem;
    let _virtualHeight;
    
    Object.defineProperty(this, "defaultItem", {
        get: function defaultItem() {
            return _defaultItem;
        },
        set: function defaultItem(v) {
            if (_defaultItem != v)
                _defaultItem = v;
        }
    });
    Object.defineProperty(this, "cellItemRenderers", {
        get: function cellItemRenderers() {
            return _cellItemRenderers;
        },
        enumerable: false
    });
    Object.defineProperty(this, "cellItemEditors", {
        get: function cellItemEditors() {
            return _cellItemEditors;
        },
        enumerable: false
    });

    Object.defineProperty(this, "rowCount", {
        get: function rowCount() {
            return _rowCount != null ? Math.min(_rowCount, (_self.dataProvider && _self.dataProvider.length ? _self.dataProvider.length : 0)) : (_self.dataProvider && _self.dataProvider.length ? _self.dataProvider.length : 0);
        },
        enumerable: true
    });
    
    Object.defineProperty(this, "fitWidth", {
        get: function fitWidth() {
            return _fitWidth;
        },
        enumerable: true
    });
    Object.defineProperty(this, "allowNewItem", {
        get: function allowNewItem() {
            return _allowNewItem;
        },
        enumerable: true
    });
    Object.defineProperty(this, "allowRemoveItem", {
        get: function allowRemoveItem() {
            return _allowRemoveItem;
        },
        enumerable: true
    });    
    Object.defineProperty(this, "columns", {
        get: function columns() {
            return _columns;
        },
        configurable: true,
        enumerable: true
    });

    let _prevScrollTop = 0;
    let _avgRowHeight;
    let _virtualIndex = 0;
    let _scrollRowStep = 0;
    
    Object.defineProperty(this, "virtualIndex", {
        get: function virtualIndex() {
            return _virtualIndex;
        },
        enumerable: true
    });
    
    let _onScroll = function (e) {
        let scrollTop = e.target.scrollTop;
        return _scroll(scrollTop);
    };
    let _bindingsPromise;
    let _scroll = function (scrollTop) {
        let r = true;
        if (_editPosition != null) {
            _self.cellEditCanceled(_editPosition.rowIndex, _editPosition.columnIndex);                  
        }
        if (scrollTop >= 0) {
            console.log("scrollTop:", scrollTop);

            let virtualIndex = Math.ceil(scrollTop / _avgRowHeight);
            scrollTop = virtualIndex * _avgRowHeight;
            //this.scroll(scrollTop);

            let deltaScroll = _prevScrollTop - scrollTop;

            let scrollRowStep = Math.ceil(Math.abs(deltaScroll) / _avgRowHeight) * (deltaScroll / Math.abs(deltaScroll));

            if (deltaScroll < 0) {
                console.log("scroll down");

            } else {
                console.log("scroll up");

            }

            virtualIndex = (_self.rowCount + virtualIndex < _self.dataProvider.length) ? virtualIndex : (_self.dataProvider.length - _self.rowCount);
            if (_virtualIndex != virtualIndex) {
                _prevScrollTop = scrollTop;
                _self.$message.show();                
                _virtualIndex = virtualIndex;
                _bindingsPromise = _self.applyVirtualBindings(_virtualIndex);
                _self.$message.hide();
            } else {
                if (deltaScroll < 0) {
                    if (_self.dataProvider.nextPage && _self.dataProvider.totalRecords == Infinity) {
                        _prevScrollTop = scrollTop;
                        _self.dataProvider.nextPage().then(function () {
                            let vinc = Math.ceil(Math.abs(deltaScroll / _avgRowHeight));
                            virtualIndex += vinc;
                            virtualIndex = (_self.rowCount + virtualIndex < _self.dataProvider.length) ? virtualIndex : (_self.dataProvider.length - _self.rowCount);
                            if (_virtualIndex != virtualIndex) {
                                _virtualIndex = virtualIndex;
                                _self.$message.show();
                                _bindingsPromise = _self.applyVirtualBindings(_virtualIndex);
                            } else {
                                alert("ehlo");
                            }
                            _self.$message.hide();
                        });
                    } else {
                        _self.$table[0].style.marginTop = _prevScrollTop + "px";
                        r = false;
                        _self.$message.hide();
                    }

                } else {
                    r = false;
                    _self.$message.hide();
                }
            }
        }
        return r;
    };

    let _dataProviderLengthChanged = function (e) {
        console.log(arguments);
        /*
        _avgRowHeight = (this.$table.height() - this.$header.height()) / _rowCount;
        _avgRowHeight = 46;
        _virtualHeight = (_self.dataProvider.length - 2 * (_allowNewItem ? 1 : 0)) * _avgRowHeight;
        this.$scrollArea.css({ height: _virtualHeight + "px" });
        */
    };
    
    this.init = function (e) {

        this.$table = this.$el.find("#" + this.domID + '-table');
        this.$fixedTable = this.$el.find("#" + this.domID + '-fixed-table');
        this.$header = this.$el.find('#' + this.domID + '-header');        
        this.$bodyWrapper = this.$el.find('#' + this.domID + '-body-wrapper');
        this.$container = this.$table;
        
        this.delayScroll = debouncePromise(_onScroll, 10);
        this.$bodyWrapper.on("scroll", function (e) {
            this.$table[0].style.marginTop = e.target.scrollTop + "px";
            
            Promise.resolve(_bindingsPromise).then(function () {
                _self.delayScroll.apply(_self, [e]).then(function (r) {
                    if (!r) {
                        //_self.$table.css({ "margin-top": mtt + "px" });
                        //_self.$scrollArea.css({ "margin-top": smt + "px" });
                    } else {
                        // mtt = e.target.scrollTop;
                        // smt = (-(_self.realHeight) - e.target.scrollTop);
                    }
                });
            });
        }.bind(this));
    };

    this.beginDraw = function (e) {
        if (e.target.id == this.domID) {
            _self.on("dataProviderLengthChanged", _dataProviderLengthChanged);
        }
    };

    this.template = function () {
        let html =
            "<div id='" + this.domID + "'>" +
            "<table class='table' style='margin-bottom:0px;table-layout: fixed;' id='" + this.domID + "-fixed-table'>" +
            "<thead id='" + this.domID + "-header'></thead></table>" +
            "<div id='" + this.domID + "-body-wrapper' style='overflow-y: auto; overflow-x:hidden; position:relative;'>" +
            "<table class='table' id='" + this.domID + "-table' style='position:relative;table-layout: fixed;'></table>" +
            "</div></div>";
        return html;
    };
    let _thOptWidth = 50, _thNumberingWidth = 50;

    this.setCellsWidth = function () {
        //at least one row ?    
        this.$bodyWrapper.css({ "height": "calc(100% - " + this.$fixedTable.height() + "px" });

        let scrollAreaWidth = (this.$bodyWrapper.width() - this.$bodyWrapper[0].clientWidth);
        this.$fixedTable.css({ "width": "calc(100% - " + scrollAreaWidth + "px)" }); 
        let actualWidth = this.$table[0].clientWidth - _thOptWidth - (_thNumbering ? _thNumberingWidth : 0);
            
        if (_columns && _columns.length > 0 && actualWidth>0 && _headerCells.length>0) {
            let definedWidth = 0;
            let autoWidthColumns = [];
            let colsLen = _columns.length;
            for (let columnIndex = 0; columnIndex < colsLen; columnIndex++) {
                let column = _columns[columnIndex];
                if (column.width) {
                    definedWidth += column.calculatedWidth = column.width;
                } else {
                    autoWidthColumns.push(column);
                }
            }
            // definedWidth += 50; //numbering column
            // definedWidth += 50; //options column
            actualWidth -= Math.max(2*Math.ceil(scrollAreaWidth), 10);
        
            let delta = actualWidth - definedWidth;
            let autoWidthColsLen = autoWidthColumns.length;
            if (autoWidthColsLen > 0) {
                let autoWidth;
                if (delta > 0) {
                    autoWidth = delta / autoWidthColsLen;
                } else {
                    autoWidth = definedWidth / colsLen;
                }
                for (let columnIndex = 0; columnIndex < autoWidthColsLen; columnIndex++) {
                    let column = autoWidthColumns[columnIndex];
                    column.calculatedWidth = autoWidth;
                }
                definedWidth += autoWidthColsLen * autoWidth;
            }
            if (delta < 0 && _fitWidth) {
                //resize column widths to fit defined container width
                let factor = actualWidth / definedWidth;
                for (let columnIndex = 0; columnIndex < colsLen; columnIndex++) {
                    _columns[columnIndex].calculatedWidth = _columns[columnIndex].calculatedWidth * factor;
                }
            }
            if (_cells && _cells.length > 0 && _cells.length == colsLen){
                for (let columnIndex = 0; columnIndex < colsLen; columnIndex++) {
                    _cells[0][columnIndex].css({
                        "width": (_columns[columnIndex].calculatedWidth + 1 /*border*/) + "px"
                    });
                }
            }
            for (let columnIndex = 0; columnIndex < colsLen; columnIndex++) {               
                _headerCells[columnIndex].css.width = (_columns[columnIndex].calculatedWidth) + "px";
            }
        }
    };

    Object.defineProperty(this, "renders", {
        get: function renders() {
            return _comprenders;
        },
        enumerable: false,
        configurable: true
    });

    let _comprenders = [];
    
    this.isDefaultItem = function (o) {
        if (!_defaultItem) {
            _defaultItem = ArrayUtils.createEmptyObject(_columns, "field", "description");
        }
        return ObjectUtils.deepEqual(_defaultItem, o);
    };

    this.updateDataProvider = queue(async function () {
        let p = [];
        _self.trigger('beginDraw');
        _self.$hadow.empty();
        let oldValue = _rows.length;
    
        if (_self.attached)
            _self.updateDisplayList();
        let newValue = _self.rowCount;
        let rb = Math.min(oldValue, newValue);
        let dpLen = _self.dataProvider.length;
        let delta = oldValue - newValue;
        console.log("values: ",oldValue, " ", newValue, " ", dpLen);
        if (delta > 0) {
            let deltaScroll = delta * _avgRowHeight;
            while (delta > 0) {
                _self.removeRow(newValue + delta - 1);
                --delta;
            }
            let cs = _self.$bodyWrapper.scrollTop();
            _self.$bodyWrapper.scrollTop(Math.max(cs - deltaScroll, 0));
        } else if (delta < 0) {
            while (delta < 0) {
                let index = newValue + delta;
                ++delta;
                let rowComponentsPromises = await _self.addRow(_self.dataProvider[index], index);
                _comprenders.splicea(_comprenders.length, 0, rowComponentsPromises);
                let rcp = Promise.all(rowComponentsPromises);
                p.push(rcp);
                rcp.then(function () {
                    let rargs = new RepeaterEventArgs(_rowItems, _self.dataProvider[index], index);
                    rargs.virtualIndex = _virtualIndex;
                    _self.trigger('rowAdd', [_self, rargs]);
                });
            }
        }
        for (let i = 0; i < _self.dataProvider.length; i++) {
            _self.prepareBindingShortcuts(_self.dataProvider[i], i);
        }
        for (let i = 0; i < newValue && _self.dataProvider && (i + _virtualIndex) < dpLen; i++) {
            let vr = i + _virtualIndex;
            if (i < rb) {
                for (let cmpID in _rowItems[i]) {
                    let cmp = _rowItems[i][cmpID];
                    if (cmp.refreshBindings) {
                        cmp.refreshBindings(_self.dataProvider[vr]);
                        cmp.attr[_self.guidField] = _self.dataProvider[vr][_self.guidField];
                    }
                }
            }
        }

        let cr = Promise.all(_comprenders);
        p.push(cr);
        cr.then(function () {
            _self.$hadow.contents().appendTo(_self.$container);
            _comprenders = [];
            _self.setCellsWidth();
            _self.trigger('endDraw');
            let e = jQuery.Event("dataProviderUpdate");
            e.oldValue = oldValue;
            e.newValue = newValue;
            _self.trigger(e, [_self]);
            if (_futureEditPosition) {
                _self.cellEdit(_futureEditPosition.rowIndex, _futureEditPosition.columnIndex);
            }

            if (_allowNewItem) {
                if (!_defaultItem) {
                    _defaultItem = ArrayUtils.createEmptyObject(_columns, "field", "description");
                }

                if (!ObjectUtils.deepEqual(_defaultItem, _self.dataProvider[_self.dataProvider.length - 1])) {
                    if (ObjectUtils.deepEqual(_defaultItem, _self.dataProvider[oldValue - 1])) {
                        _self.dataProvider.splice(oldValue - 1, 1);
                    }
                    _self.dataProvider.splice(_self.dataProvider.length, 0, ObjectUtils.deepCopy(_defaultItem));
                }
            }
        });
        return Promise.all(p);
    });
    
    this.applyVirtualBindings = function (virtualIndex) {
        let rc = _self.rowCount, pb = new Array(rc);
        for (let rowIndex = 0; rowIndex < rc; rowIndex++) {
            for (let columnIndex = 0; columnIndex < _columns.length; columnIndex++) {
                let itemRenderer = _cellItemRenderers[rowIndex][columnIndex];
                _cellItemRenderers[rowIndex][columnIndex].repeaterIndex = rowIndex + virtualIndex;
                pb[rowIndex] = itemRenderer.refreshBindings(_self.dataProvider[rowIndex + virtualIndex]);
                let rargs = new RepeaterEventArgs(_rowItems[rowIndex], _self.dataProvider[rowIndex + virtualIndex], rowIndex);
                rargs.virtualIndex = virtualIndex;
                rargs.columnIndex = columnIndex;
                _self.trigger('columnBindingsRefreshed', [_self, rargs]);        
            }
            let rargs2 = new RepeaterEventArgs(_rowItems[rowIndex], _self.dataProvider[rowIndex + virtualIndex], rowIndex);
            rargs2.virtualIndex = virtualIndex;
            _self.trigger('rowBindingsRefreshed', [_self, rargs2]);  
            _cells[rowIndex][0].prev().text(rowIndex + virtualIndex + 1);
        }
        _self.trigger('bindingsRefreshed', [_self]);  
        return Promise.resolve(pb);
    };

    let _twMap = new TwoWayMap({
        "asc": "desc"
    });

    let _headerClickHandler = function (e, columnIndex, column) {
        let columnSortEvent = jQuery.Event("columnSort");
        columnSortEvent.originalEvent = e;
        let cls = _headerCells[columnIndex].sortSpan.classes;
        let ind = cls.indexOf("fa-caret-" + DataGridColumn.sortDirFADic[column.sortDirection.toLowerCase()]);
        if (ind > -1) {
            cls.splice(ind, 1);
        }
        column.sortDirection = DataGridColumn.twMap[column.sortDirection.toLowerCase()];
        cls.pushUnique("fa-caret-" + DataGridColumn.sortDirFADic[column.sortDirection.toLowerCase()]);
        _headerCells[columnIndex].sortSpan.classes = cls;
        this.trigger(columnSortEvent, [columnIndex, column]);
    };


    let _thOpt, _thNumbering;
    this.createHeader = async function () {
        let $header = $("<tr></tr>");   
        if (_showRowIndex) {
            _thNumbering = $("<th style='max-width:50px'>#</th>");
            $header.append(_thNumbering);
        }
        let len = _columns.length;
        let cr = new Array(len);
        for (let columnIndex = 0; columnIndex < len; columnIndex++) {
            let column = _columns[columnIndex] = new DataGridColumn(_columns[columnIndex]);
            column.headerRenderer.props.id = column.headerRenderer.props.id ? column.headerRenderer.props.id : "header";
            let headerRenderer = await Component.fromLiteral(column.headerRenderer);
            headerRenderer.on("click", function (e) {
                _headerClickHandler.call(_self, e, columnIndex, column);
            });
            cr[columnIndex] = headerRenderer.render();
            _headerCells[columnIndex] = headerRenderer;
        }
        let p = Promise.all(cr);
        p.then(function () {
            //put elements in an array so jQuery will use documentFragment which is faster
            cr = []; let els = new Array(len);
            for (let i = 0; i < len; i++) {
                let cmpInstance = _headerCells[i];
                els[i] = cmpInstance.$el;                
            }
            $header.append(els);
            _thOpt = $("<th style='max-width:50px'><i class='fa fa-chevron-circle-right' aria-hidden='true'></i></th>");
            $header.append(_thOpt);
            _self.$header.append($header);
        });
        return p;
    };

    this.cellEdit = async function (rowIndex, columnIndex) {
        let e = jQuery.Event('cellEditStarting');
        _self.trigger(e, [rowIndex, columnIndex]);        
        let column = _columns[columnIndex];
        if (!e.isDefaultPrevented()) {
            if (_editPosition != null && (_editPosition.rowIndex != rowIndex || _editPosition.columnIndex != columnIndex)
                && _editPosition.rowIndex < _self.dataProvider.length
                && _columns[_editPosition.columnIndex].editable) {

                let r = this.cellEditFinished(_editPosition.rowIndex, _editPosition.columnIndex, true);

                if (!r) {
                    return;
                }
                _cellItemRenderers[_editPosition.rowIndex][_editPosition.columnIndex].show();
            }
            if (_editPosition == null) {
                _editPosition = {};
            }

            let data = _self.dataProvider[rowIndex + _virtualIndex];

            _editPosition = {
                "rowIndex": rowIndex,
                "columnIndex": columnIndex,
                "column": column,
                "data": data,
                "event": 1
            };
            _futureEditPosition = null;

            _cellItemRenderers[rowIndex][columnIndex].hide();
            let itemEditorInfo = _cellItemEditors[columnIndex];
            let itemEditor;
            if (itemEditorInfo == null) {
                let ctor;
                if (typeof column.itemEditor.ctor == "string") {
                    ctor = await Literal.SimpleContainer.get(column.itemEditor.ctor);
                } else
                    ctor = column.itemEditor.ctor;
                let valueProp = ctor.prototype.valueProp ? ctor.prototype.valueProp : "value";
                if (column.itemEditor.props[valueProp] == null || StringUtils.getBindingExp(column.itemEditor.props[valueProp]) == null) {
                    column.itemEditor.props[valueProp] = "{?" + column.field + "}";
                }
                column.itemEditor.props.parentRepeater = _self.proxyMaybe;
                column.itemEditor.props.repeaterIndex = rowIndex;
                column.itemEditor.props.bindingDefaultContext = data;
                itemEditor = await Component.fromLiteral(column.itemEditor);
                column.itemEditor.props.label = column.description;
                //let props = extend(true, true, column.itemEditor.props);
                //delete props["value"];

                itemEditor.parent = this.proxyMaybe;
                itemEditor.parentType = 'repeater';
                itemEditor.parentForm = this.parentForm;
                itemEditor.$el.css({
                    "margin": "0px",
                    "outline": "none"
                });

                _cellItemEditors[columnIndex] = {
                    "itemEditor": itemEditor,
                    "rowIndex": rowIndex
                };

                itemEditor.on('endDraw', function () {
                    if (typeof itemEditor.focus === "function") {
                        // safe to use the function
                        itemEditor.focus();
                    }
                });
                itemEditor.on('keydown', function (e) {
                    switch (e.keyCode) {
                        case 9:
                            e.preventDefault();
                            break;
                    }
                });
                itemEditor.on('keyup', function (e) {
                    let rowIndex = _editPosition.rowIndex, columnIndex = _editPosition.columnIndex;
                    switch (e.keyCode) {
                        case 13: // ENTER - apply value
                            console.log("finished editing");
                            e.preventDefault();
                            _self.cellEditFinished(_editPosition.rowIndex, _editPosition.columnIndex, true);
                            break;
                        case 27: // ESC - get back to old value
                            e.preventDefault();
                            _self.cellEditCanceled(_editPosition.rowIndex, _editPosition.columnIndex);
                            break;
                        case 9:
                            // TAB - apply and move to next column on the same row
                            //_self.trigger('cellEditFinished', [rowIndex, columnIndex, column, data, true]);
                            //TODO: Check columnIndex boundaries and pass to next row if it is 
                            //the last one, if now rows remaining pass to first row(check repeater implementation)
                            let i, d = 1;
                            if (e.shiftKey) {
                                d = -1;
                            }
                            rowIndex += _virtualIndex;
                            columnIndex += 1 * d;
                            let found = false, future = false, r, c;
                            for (; (rowIndex <= _self.dataProvider.length) && (rowIndex > -1)  && !found; rowIndex += 1 * d) {
                                for (; (columnIndex < _columns.length) && (columnIndex > -1) && !found; columnIndex += 1 * d) {
                                    if (_columns[columnIndex].editable) {
                                        found = true;
                                        r = rowIndex;
                                        c = columnIndex;
                                    }
                                }
                                if(!found)
                                    columnIndex = 0;
                            }
                            rowIndex = r;
                            columnIndex = c;
                            if (rowIndex == _self.dataProvider.length) {
                                if (_allowNewItem) {
                                    future = true;
                                } else
                                    found = false;
                            }
                            if (found && !future) {
                                let cs = _self.$bodyWrapper.scrollTop();                                   
                                if (rowIndex < _virtualIndex) {
                                    _self.$bodyWrapper.scrollTop(cs - _avgRowHeight);
                                } else if (rowIndex > _virtualIndex + _self.rowCount)
                                {
                                    _self.$bodyWrapper.scrollTop(cs - _avgRowHeight);
                                }                                    
                                _self.cellEdit(rowIndex, columnIndex);
                            } else if (found && future) {
                                _futureEditPosition = {"rowIndex": Math.min(rowIndex, _rowCount - 1), "columnIndex": columnIndex};
                                _self.cellEditFinished(_editPosition.rowIndex, _editPosition.columnIndex, true); 
                            } else {
                                _self.cellEditFinished(_editPosition.rowIndex, _editPosition.columnIndex, true);                            
                            }
                            break;
                    }
                });

                // itemEditor.on('blur', function (e) { 
                //     e.preventDefault();
                //     _self.cellEditFinished(_editPosition.rowIndex, _editPosition.columnIndex, false);
                // });

            } else {
                itemEditor = itemEditorInfo.itemEditor;
                itemEditor.repeaterIndex = rowIndex;
                //itemEditor is in another position
                if (itemEditorInfo.rowIndex != rowIndex) {
                    itemEditorInfo.rowIndex = rowIndex;
                    itemEditor.$el.detach();
                }
                itemEditor.refreshBindings(data);
            }
            /*
            itemEditor.off('blur');
            itemEditor.on('blur', function(){
                _self.trigger('cellEditFinished', [rowIndex, columnIndex, column, data, true]);
            });
            */

            /*itemEditor.on('blur', (function(rowIndex, columnIndex, column, data){
                return (function(e) { // a closure is created
                    _self.cellEditFinished(rowIndex, columnIndex, column, data);
                    });	
            })(rowIndex, columnIndex, column, data));
    */
            itemEditor.repeaterIndex = rowIndex;

            //TODO: te evitojme v
            /*
            if (column.itemEditor.props["value"]!=null && column.itemEditor.props["value"][0] == '{' && column.itemEditor.props["value"][column.itemEditor.props["value"].length - 1] == '}') 
            {
                let dataProviderField = column.itemEditor.props["value"].slice(1, -1);
                _cellItemEditors[columnIndex]["dataProviderValueField"] = dataProviderField;
                itemEditor.value = data[dataProviderField];
            }else
                itemEditor.value = column.itemEditor.props["value"] || data[column.field];
            */
            itemEditor.render().then(function (cmpInstance) {
                let w = parseInt(_cells[rowIndex][columnIndex].width());
                let b = itemEditor.css["border-width"];

                itemEditor.css.width = "100%";
                _cells[rowIndex][columnIndex].append(cmpInstance.$el);
                itemEditor.show();
                let e = jQuery.Event('cellEditStarted');
                _self.trigger(e, [rowIndex, columnIndex, itemEditor]);
                if (itemEditorInfo != null) {
                    if (typeof itemEditor.focus === "function") {
                        // safe to use the function
                        itemEditor.focus();
                    }
                }
            });

        }
    };

    this.cellEditCanceled = function (rowIndex, columnIndex) {
        let e = jQuery.Event('cellEditCanceled');
        let rargs = new RepeaterEventArgs(_rowItems[rowIndex], _self.dataProvider[rowIndex + _virtualIndex], rowIndex);
        rargs.virtualIndex = _virtualIndex;
        rargs.columnIndex = columnIndex;
        _self.trigger(e, [_self, rargs]);

        let itemEditorInfo = _cellItemEditors[columnIndex];
        let itemEditor = itemEditorInfo.itemEditor;
        itemEditor.hide();
        _cellItemRenderers[rowIndex][columnIndex].show();
    };

    this.cellEditFinished = function (rowIndex, columnIndex, applyEdit) {
        let r = true;
        let e = jQuery.Event('cellEditFinishing');

        let rargs = new RepeaterEventArgs(_rowItems[rowIndex], _self.dataProvider[rowIndex + _virtualIndex], rowIndex);
        rargs.virtualIndex = _virtualIndex;
        rargs.columnIndex = columnIndex;
        _self.trigger(e, [_self, rargs]);

        if (!e.isDefaultPrevented()) {
            //console.trace();
            console.log("cellEditFinished:", rowIndex, " ", columnIndex);
            let column = _columns[columnIndex];
            let data = _self.dataProvider[rowIndex + _virtualIndex];
            let value = null,
                calledHandler = false;
            let itemEditorInfo = _cellItemEditors[columnIndex];
            let itemEditor = itemEditorInfo.itemEditor;

            e = jQuery.Event('cellEditFinished');
            _self.trigger(e, [rowIndex, columnIndex, itemEditor, applyEdit]);
            value = e.result;
            let valueProp = itemEditor.valueProp ? itemEditor.valueProp : "value";

            if (!applyEdit || !e.isDefaultPrevented()) {
                itemEditor.hide();
                _cellItemRenderers[rowIndex][columnIndex].show();
                if (applyEdit) {
                    if (!calledHandler) {
                        let exp = itemEditor.getBindingExpression(valueProp);
                        if (value == null) {                            
                            value = itemEditor[valueProp];
                        }

                        if (exp) {
                            if (exp == "currentItem") {
                                _self.dataProvider[rowIndex + _virtualIndex] = value;
                            } else {
                                ObjectUtils.setChainValue(_self.dataProvider[rowIndex + _virtualIndex], exp, value);
                            }
                        }
                        _cellItemRenderers[rowIndex][columnIndex].refreshBindings(_self.dataProvider[rowIndex + _virtualIndex]);

                    }
                    //TODO:dataProviderChanged or integrate Binding ? 
                    //_self.dataProvider[rowIndex+_virtualIndex][column.field] = value;
                }
            }

        } else
            r = false;
        return r;
    };
    
    let _notifyRemoveRow = function (index, focusOnRowDelete = false) {
        if (!_allowNewItem || !_self.isDefaultItem(_self.dataProvider[index + _virtualIndex])) {
            let beforeRowDeleteEvent = jQuery.Event("beforeRowDelete");
            let ra = new RepeaterEventArgs(_rowItems[index], _self.dataProvider[index + _virtualIndex], index);
            ra.virtualIndex = _virtualIndex;
            _self.trigger(beforeRowDeleteEvent, [_self, ra]);

            if (!beforeRowDeleteEvent.isDefaultPrevented()) {
                _self.dataProvider.splice(index + _virtualIndex, 1);
                if (focusOnRowDelete && index > 0 && _cellItemRenderers.length > 0)
                    _cellItemRenderers[index - 1][0].scrollTo();
            }
        }
    };

    this.removeRow = function (index) {       
        let ra = new RepeaterEventArgs(_rowItems[index], null, index);
        ra.virtualIndex = _virtualIndex;
        let rlen = _cellItemRenderers.length;
        for (let i = index; i < rlen; i++) {
            let clen = _cellItemRenderers[i].length;
            for (let j = 0; j < clen; j++){
                _cellItemRenderers[i][j].repeaterIndex -= 1;
            }
            _cells[i][0].prev().text(i);
        }
        _rows[index].detach();
        _rows.splice(index, 1);
        _rowItems.splice(index, 1);
        _cells.splice(index, 1);
        _cellItemRenderers.splice(index, 1);
        _self.trigger('rowDelete', [this, ra]);
    };

    let _bodyHeight, mtt, smt;
    this.updateDisplayList = function () {        
        if (!_props.rowCount) {
            this.$el.css("height", this.$el.height() + 'px');
            this.$table.css("height", (_self.rowCount * _props.defaultRowHeight) + 'px');
            _rowCount = Math.floor(this.$bodyWrapper.height() / _props.defaultRowHeight);            
        }
        if (_self.dataProvider.length > 0) {
            _bodyHeight = this.$table.height();
            _avgRowHeight = _bodyHeight / _self.rowCount;
        
            _virtualHeight = (_self.dataProvider.length + (_allowNewItem ? 1 : 0)) * _avgRowHeight;

            let pos = this.$table.position();
            let left = pos.left + this.$table.width() - 14;
            let top = pos.top + this.$el.height();
            if (!this.$message) {
                this.$message = $("<div style='display:none;position:absolute;bottom:0px;left:0px;z-index:9999'>Creating Rows</div>");
                //     "background-color": "white",
                this.$table.after(this.$message);
            }

            if (!this.$scrollArea) {
                this.$scrollArea = $("<div/>");
                this.$table.after(this.$scrollArea);
            }
            //<div style="opacity: 0; position: absolute; top: 0px; left: 0px; width: 1px; height: 3.1e+07px;"></div>
            this.$scrollArea.css({
                opacity: 0,
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "1px",
                height: _virtualHeight + "px"
            });
        }
        if(!_self.dataProvider || (_rowCount>_self.dataProvider.length))
            this.$bodyWrapper.scrollTop(0);
        if (_self.dataProvider && _self.dataProvider.length)
            _self.setCellsWidth();
    };

    Object.defineProperty(this, "multiSelect", {
        get: function multiSelect() {
            return _multiSelect;
        },
        set: function multiSelect(v) {
            if (_multiSelect != v)
                _multiSelect = v;
        },
        enumerable: true
    });

    Object.defineProperty(this, "selectedItems", {
        get: function selectedItems() {
            return _selectedItems;
        }
    });
    let _selectedItems = new ArrayEx();
    let _selectedIndices = [];
    let _rowClickHandler = function (e, dgInst, ra) {
        if (_ctrlIsPressed && _multiSelect) {
            let ind = _selectedIndices.indexOf(ra.currentIndex);
            if (ind < 0) {
                _selectedIndices.push(ra.currentIndex);
                _selectedItems.push(ra.currentItem);
            } else {
                _selectedIndices.splice(ind, 1);
                _selectedItems.splice(ind, 1);
            }

        } else {
            if (_selectedIndices.indexOf(ra.currentIndex) < 0) {
                _selectedIndices = [ra.currentIndex];
                _selectedItems.splice(0, _selectedItems.length, ra.currentItem);
            } else {
                _selectedIndices = [];
                _selectedItems.splice(0, _selectedItems.length);
            }
        }
        let len = _rows.length;
        for (let i = 0; i < len; i++) {
            let found = false;
            for (let j = 0; j < _selectedIndices.length; j++) {
                if (i == _selectedIndices[j] - ra.virtualIndex) {
                    found = true;
                    _rows[i].addClass("datagrid-row-selected");
                }
            }
            if (!found) {
                _rows[i].removeClass("datagrid-row-selected");
            }
        }
    };

    let _ctrlIsPressed = false;
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            if(_self.$bodyWrapper)
                _self.$bodyWrapper.scrollTop(_prevScrollTop);
            let av = e.target.style.getPropertyValue('display');
            if (av == "" || av != "none") {
                this.updateDisplayList();
            }

            $(_self.ownerDocument).keydown(function (event) {
                if ((Env.getInstance().current == EnvType.MAC && event.metaKey && !event.shiftKey) || event.ctrlKey)
                    _ctrlIsPressed = true;
            });

            $(_self.ownerDocument).keyup(function () {
                if ((Env.getInstance().current == EnvType.MAC && !event.metaKey) || event.which == "17")
                    _ctrlIsPressed = false;
            });
        }
    };

    let _defaultParams = {
        rendering: {
            direction: 'vertical',
            separator: true,
            actions: false
        },
        showRowIndex: true,
        dataProvider: new ArrayEx([]),
        rowCount: null,
        columns: [],
        allowNewItem: false,
        allowRemoveItem: false,
        multiSelect: false,
        fitWidth: true,
        defaultRowHeight: 60,
        height: 500
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }

    let _rowClick = _props.rowClick;
    _multiSelect = _props.multiSelect;

    _props.rowClick = function () {
        if (typeof _rowClick == 'function')
            _rowClick.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _rowClickHandler.apply(this, arguments);
        }
    };

    let myDtEvts = ["cellEditCanceled", "cellEditFinishing", "cellEditFinished", "cellEditStarted", "cellEditStarting", "rowEdit", "rowAdd", "rowDelete", "rowClick", "rowDblClick", "cellStyling", "rowStyling", "columnSort", "cellClick", "columnBindingsRefreshed", "rowBindingsRefreshed", "bindingsRefreshed"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    let _rendering = _props.rendering;
    let _showRowIndex = _props.showRowIndex;
    let _rowCount;
    if (_props.rowCount) {
        _rowCount = _props.rowCount;
        _props.height = (_props.rowCount * _props.defaultRowHeight) +  _props.defaultRowHeight /*the header*/;
    }
    _defaultItem = _props.defaultItem;
    let _allowNewItem = _props.allowNewItem;
    let _allowRemoveItem = _allowNewItem && _props.allowRemoveItem == null ? true : _props.allowRemoveItem;
    let _columns = _props.columns;
    let _cellItemRenderers = [];
    let _cellItemEditors = [];
    let _cells = [], _rows = [], _rowItems = []; // matrix
    let _headerCells = [];
    let _fitWidth = _props.fitWidth;
    let _editPosition = null, _futureEditPosition;

    let r = Repeater.call(this, _props, true);
    let base = this.base;
    //overrides
    let _rPromise;
    this.render = async function () {
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function (e) {
                if (e.target.id == _self.domID) {
                    resolve(this);
                }
            });
        });

        await this.createHeader();        
        if (!this.getBindingExpression("dataProvider") && _props.dataProvider) {
            let d = await Literal.fromLiteral(_props.dataProvider);
            Promise.resolve(d).then(function (dv) {
                if (dv.hasOwnProperty("parent")) {
                    dv.parent = _self;
                    dv.applyBindings();
                }
                _self.dataProvider = dv;
            });
        } else
            this.dataProvider = new ArrayEx([]);
        return _rPromise;
    };

    //renders a new row, adds components in stack
    this.addRow = async function (data, index, isPreventable = false, focusOnRowAdd = true) {
        let rp = [];
        let beforeRowAddEvent = jQuery.Event("beforeRowAdd");
        let rargs = new RepeaterEventArgs(_rowItems[index], data, index);
        rargs.virtualIndex = _virtualIndex;
        this.trigger(beforeRowAddEvent, [_self, rargs]);

        if (!isPreventable || (isPreventable && !beforeRowAddEvent.isDefaultPrevented())) {
            let renderedRow = $('<tr>');
            let rowItems = {};
            let style = "";
            if (_showRowIndex) {
                if (index == 0) {
                    style = "style='width:50px'";
                }
                renderedRow.append('<th scope="row" ' + style + '>' + (index + 1) + '</th>');
            }
            renderedRow.on("click", function (evt) {
                let rargs = new RepeaterEventArgs(_rowItems[index], _self.dataProvider[index + _virtualIndex], index);
                rargs.virtualIndex = _virtualIndex;
                _self.trigger("rowClick", [_self, rargs]);
            });

            renderedRow.on('dblclick', function (evt) {
                let rargs = new RepeaterEventArgs(_rowItems[index], _self.dataProvider[index + _virtualIndex], index);
                rargs.virtualIndex = _virtualIndex;
                _self.trigger("rowDblClick", [_self, rargs]);
            });
            let rargs = new RepeaterEventArgs(_rowItems[index], _self.dataProvider[index + _virtualIndex], index);
            rargs.virtualIndex = _virtualIndex;
            let rsEvt = jQuery.Event('rowStyling', [_self, rargs]);
            let clen = _columns.length;
            _cellItemRenderers[index] = new Array(clen);
            for (let columnIndex = 0; columnIndex < clen; columnIndex++)
            {
                let column = _columns[columnIndex];
                //column.sortInfo:{sortOrder:0, sortDirection:"ASC"},
                //column.cellStyleFunction,
                //column.cellValueFunction,
                //column.itemEditor    
                let component = {};
                column.itemRenderer.props.id = column.itemRenderer.props.id ? column.itemRenderer.props.id : "column";
                ObjectUtils.shallowCopy(column.itemRenderer, component, ["props"]);
                component.props = {};
                ObjectUtils.shallowCopy(column.itemRenderer.props, component.props, ["id", "bindingDefaultContext", "css", "attr"]);
                component.props.id = (column.itemRenderer.props.id ? column.itemRenderer.props.id : column.name) + "_" + index + "_" + columnIndex;
                component.props.bindingDefaultContext = data;
                component.props.ownerDocument = _props.ownerDocument;
                component.props.parentRepeater = _self.proxyMaybe;
                component.props.repeaterIndex = index;
                component.props.css = Object.assign({}, column.itemRenderer.props.css);
                component.props.attr = Object.assign({}, column.itemRenderer.props.attr);
                //build components properties, check bindings

                let dataProviderField = column.field;

                //construct the component
                let el = await Component.fromLiteral(component);
                el.parent = _self.proxyMaybe;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.bindingsManager.on("bindingExecuted", function (evt) {
                    if (index == _self.rowCount - 1 && evt.timesExecuted > 1) {
                        _self.updateDataProvider().then(function () {
                            let cs = _self.$bodyWrapper.scrollTop();
                            _self.$bodyWrapper.scrollTop(cs + _avgRowHeight);
                        });
                    }
                });
                _cellItemRenderers[index][columnIndex] = el;
                let columnName = column.name || `column_${columnIndex}`;
                rowItems[columnName] = el;

                let csEvt = jQuery.Event('cellStyling', [_self, index, columnIndex, _rowItems, column, data]);

                if (column.editable) {
                    el.on('dblclick', function () {
                        _self.cellEdit(index, columnIndex);
                    });
                }

                //handle component change event and delegate it to repeater
                el.on('change', function (e) {
                    let currentItem = _self.dataProvider[index];
                    if (component.props.value[0] == '{' && component.props.value[component.props.value.length - 1] == '}') {
                        let bindedValue = component.props.value.slice(1, -1);
                        data[bindedValue] = this.value;
                    }
                    let rargs = new RepeaterEventArgs(rowItems[index], _self.dataProvider[index + _virtualIndex], index);
                    rargs.virtualIndex = _virtualIndex;
                    _self.trigger('rowEdit', [_self, rargs]);
                });
                //width='"+column.calculatedWidth+"'
                let cell = $("<td id='cell_" + (index) + "_" + columnIndex + "'></td>");
                cell.on("click", function (evt) {
                    let rargs = new RepeaterEventArgs(_rowItems[index], _self.dataProvider[index + _virtualIndex], index);
                    rargs.virtualIndex = _virtualIndex;
                    rargs.columnIndex = columnIndex;
                    _self.trigger("cellClick", [_self, rargs]);
                });
                if (_cells[index] == undefined)
                    _cells[index] = [];
                _cells[index][columnIndex] = cell;
                //render component in row
                let cp = el.render().then(function (cmpInstance) {
                    renderedRow.append(cell.append(cmpInstance.$el));
                });
                rp.push(cp);
            }
            _rowItems[index] = rowItems;
            _rows[index] = renderedRow;

            Promise.all(rp).then(function () {
                let actionsTh = $('<th scope="row" ' + style + '></i></th>');
                if (_allowRemoveItem) {
                    let removeHref = $('<a href="javascript:void(0)" class="row-action-link action-delete"><i class="fa fa-times"></i></a>');
                    removeHref.on('click', () => {
                        _notifyRemoveRow(index);
                    })
                    actionsTh.append(removeHref);
                }
                renderedRow.append(actionsTh);
                _self.$hadow.append(renderedRow);
            });
        }
        return rp;
    };
};
DataGrid.prototype.ctor = 'DataGrid';
DependencyContainer.getInstance().register("DataGrid", DataGrid, DependencyContainer.simpleResolve);
export {
    DataGrid
};