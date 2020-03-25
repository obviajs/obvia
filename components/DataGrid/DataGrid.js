/**
 * This is a DataGrid component
 * 
 * Kreatx 2018
 */

//component definition
var DataGrid = function(_props)
{
    let _self = this;
    let _currentIndex = 1;
    let _multiSelect;
    
    Object.defineProperty(this, "currentIndex",
    {
        get: function currentIndex()
        {
            return _currentIndex;
        }
    });

    Object.defineProperty(this, "rowItems",
    {
        get: function rowItems()
        {
            return _rowItems;
        }
    });
    
    Object.defineProperty(this, "rowCount",
    {
        get: function rowCount()
        {
            _rowCount = _rowCount != null? Math.min(_rowCount, (_self.dataProvider && _self.dataProvider.length ? _self.dataProvider.length:0)): _self.dataProvider.length;   
            return _rowCount;
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "allowNewItem",
    {
        get: function allowNewItem()
        {
            return _allowNewItem;
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "columns", {
        get: function columns() {
            return _columns;
        },
        configurable: true,
        enumerable:true
    });  

    let _currentItem = {};
    let _rowItems = [];
    
    let _prevScrollTop = 0;
    let _avgRowHeight;
    let _virtualIndex = 0;
    let _scrollRowStep = 0;

    let _onScroll = function(e) 
    {
        let scrollTop = e.target.scrollTop;
        _scroll(scrollTop);
    };

    let _scroll = function (scrollTop)
    {
        if(scrollTop>=0){
            console.log("scrollTop:",scrollTop);
                
            let virtualIndex = Math.ceil(scrollTop / _avgRowHeight);
            scrollTop = virtualIndex * _avgRowHeight;
            //this.scroll(scrollTop);

            let deltaScroll = _prevScrollTop - scrollTop;

            let scrollRowStep = Math.ceil(Math.abs(deltaScroll) / _avgRowHeight) * (deltaScroll/Math.abs(deltaScroll));

            if(deltaScroll < 0){
                console.log("scroll down");
                
            }else{
                console.log("scroll up");  
                    
            }
        
            virtualIndex = (_rowCount+virtualIndex < _self.dataProvider.length) ? virtualIndex : (_self.dataProvider.length-_rowCount);        
            _prevScrollTop = scrollTop;
            if (_virtualIndex != virtualIndex) {
                _self.applyVirtualBindings(virtualIndex);
                _virtualIndex = virtualIndex;

                if (scrollRowStep != 0) {
                    if (_self.editPosition != null) {
                        let newEditPosition = (_self.editPosition.rowIndex + scrollRowStep);
                        if (_self.editPosition.event == 1 || _self.editPosition.event == 3) {
                        
                            if (_self.editPosition.event == 1) {
                                _self.cellEditFinished(_self.editPosition.rowIndex, _self.editPosition.columnIndex, false);
                                _self.cellItemRenderers[_self.editPosition.rowIndex][_self.editPosition.columnIndex].show();
                            }
                            
                            _self.editPosition.rowIndex = newEditPosition;

                            if ((newEditPosition >= 0) && (newEditPosition < _rowCount)) {
                                console.log("show editor phase", _self.editPosition.event, " at: ", newEditPosition, " ", _self.editPosition.rowIndex, " ", scrollRowStep);
                                _self.cellEdit(newEditPosition, _self.editPosition.columnIndex);
                                //TODO:need to add a parameter to cellEdit handler 
                                //so that we do not set the value of the editor to the value in the dp, but just keep the not-yet stored value.
                            } else {
                                //edited cell is out of view
                                console.log("event = 3");
                                _self.editPosition.event = 3;
                                _scrollRowStep = scrollRowStep;
                                
                            }
                        
                        } else {
                            //normalize edit row index
                            _self.editPosition.rowIndex = newEditPosition;
                        }
                    }
                }
                _self.$message.remove();
            } else { 
                if (deltaScroll < 0) {
                    if (_self.dataProvider.nextPage) {
                        _self.dataProvider.nextPage().then(function () {
                            _self.$message.remove();
                        });
                    } else { 
                        _self.$message.remove();
                    }
                       
                } else
                    _self.$message.remove();
            }
        }
    };

    let _dataProviderLengthChanged = function (e) {
        console.log(arguments);
    };

    this.beginDraw = function (e) {
        if (e.target.id == this.domID) {
            _self.on("dataProviderLengthChanged", _dataProviderLengthChanged);
        }
    };

    this.template = function () 
    {
        let html = 
            "<div id='" + this.domID + "' style='overflow-y: scroll'>" +
                "<table class='table' id='" + this.domID + "-table'>"+
                    "<thead id='" + this.domID + "-header'>"+
                    "</thead>"+
                "</table>"+
            "</div>";    
        return html;
    };

    this.setCellsWidth = function()
    {
        //at least one row ?
        if(this.cells.length>0){
            let definedWidth = 0; let autoWidthColumns = [];
            for (let columnIndex=0;columnIndex<_columns.length;columnIndex++) {
                let column = _columns[columnIndex];
                if(column.width){
                    definedWidth += column.calculatedWidth = column.width;
                }else{
                    autoWidthColumns.push(column);
                }
            }
            let autoWidth = (this.$table.width() - definedWidth) / autoWidthColumns.length;
            for (let columnIndex=0;columnIndex<autoWidthColumns.length;columnIndex++) {
                let column = autoWidthColumns[columnIndex];
                column.calculatedWidth = autoWidth;
            }
            for (let columnIndex=0;columnIndex<this.cells[0].length;columnIndex++) {
                this.cells[0][columnIndex].css({"width":(_columns[columnIndex].calculatedWidth)+"px"}); 
            }
        }
    };

    Object.defineProperty(this, "renderPromises",
    {
        get:function renderPromises(){
            return _compRenderPromises;
        },
        enumerable: false,
        configurable: true
    });
    
    let _compRenderPromises = [];
    this.createRows = function() 
    {
        this.$el.trigger('beginDraw');
        if (_self.dataProvider && _self.dataProvider.length)
        { 
            let endIndex = this.rowCount;
            // _rowItems = {}; we need this if we create Repeater instances via Object.assign
            for(let i=0;i<endIndex;i++)
            {
                _compRenderPromises.splicea(_compRenderPromises.length, 0, this.addRow(_self.dataProvider[i], i));
            } 
            if(_allowNewItem && endIndex==_self.dataProvider.length)
            { 
                let emptyObj = this.defaultItem = createEmptyObject(_columns, "field", "description");
                _self.dataProvider.pad(emptyObj, 1);
                _compRenderPromises.splicea(_compRenderPromises.length, 0, this.addRow(_self.dataProvider[_self.dataProvider.length-1], _self.dataProvider.length-1));
            }
        }
        Promise.all(_compRenderPromises).then(function() {
           _self.$hadow.contents().appendTo(_self.$table);
            _compRenderPromises = [];
            _self.$el.trigger('endDraw');
        });
    };

    this.addEmptyRow = function()
    {
        let emptyObj = this.defaultItem = createEmptyObject(_columns, "field", "description");
        _self.dataProvider.pad(emptyObj, 1);
        _compRenderPromises = this.addRow(_self.dataProvider[_self.dataProvider.length-1], _self.dataProvider.length-1);
        return Promise.all(_compRenderPromises).then(function () {
            _compRenderPromises = [];
           _self.$hadow.contents().appendTo(_self.$table);
        });
    };

    this.applyVirtualBindings = function(virtualIndex)
    {
        for(let rowIndex=0;rowIndex<_rowCount;rowIndex++)
        {
            for(let columnIndex=0;columnIndex<_columns.length;columnIndex++)
            {
                let itemRenderer = this.cellItemRenderers[rowIndex][columnIndex];
                this.cellItemRenderers[rowIndex][columnIndex].repeaterIndex = rowIndex + virtualIndex;
                itemRenderer.refreshBindings(_self.dataProvider[rowIndex + virtualIndex]);
            }
            this.cells[rowIndex][0].prev().text(rowIndex + virtualIndex + 1);
        }
    };

    this.headerClickHandler = function (e, hIndex, column) 
    {
        if (typeof this.onheaderclick == 'function')
            this.onheaderclick.apply(this, arguments);
        alert("headerClickHandler");
            if(!e.isDefaultPrevented() && column.sortable){
                this.columnSort.call(this, hIndex, column);
            }    
    };

    this.columnSort = function(columnIndex, column)
    {
        /*
        addClass() - Adds one or more classes to the selected elements
        removeClass() - Removes one or more classes from the selected elements
        toggleClass() - Toggles between adding/removing classes from the selected elements
        */
        alert("stub for columnSort :"+columnIndex);
    };

    this.createHeader = function () 
    {
        let headerHtml = "<tr>";
        let hi = 0;
        if(_showRowIndex){
            headerHtml += "<th>#</th>";
        }
        headerHtml += "</tr>";
        let $header = $(headerHtml);
        let sortDirFADic = {"asc":"down", "desc":"up"};
        let colElements = new Array(_columns.length);
        for (let columnIndex=0;columnIndex<_columns.length;columnIndex++) {
            let column = _columns[columnIndex] = new DataGridColumn(_columns[columnIndex]);
            
            $th = $("<th id='head_"+hi+"'>"+column.description+(column.sortable ? "<span class='fa fa-caret-"+(sortDirFADic[column.sortDirection.toLowerCase()])+"'></span></a>":"")+"</th>");    
            $th.bind('click', 
            (function(hIndex, column){
                return (function(e) { // a closure is created
                    _self.headerClickHandler.call(_self, e, hIndex, column);
                    });	
            })(hi, column));
            //put elements in an array so jQuery will use documentFragment which is faster
            colElements[columnIndex] = $th;
            ++hi;  
        }
        $header.append(colElements);
        this.$header.append($header);
    },
    this.cellEdit = function(rowIndex, columnIndex)
    {
        let e = jQuery.Event('cellEdit');
        _self.trigger(e, [rowIndex, columnIndex]);
        if(!e.isDefaultPrevented())
        {
            if(this.editPosition!=null && this.editPosition.event==1 && (this.editPosition.rowIndex != rowIndex || this.editPosition.columnIndex != columnIndex)){
            
                let r = this.cellEditFinished(this.editPosition.rowIndex, this.editPosition.columnIndex, true);
                
                if (!r) {
                    return;
                }
                this.editPosition.event = 1;
                this.cellItemRenderers[this.editPosition.rowIndex][this.editPosition.columnIndex].show();
            }

            if(columnIndex > _columns.length-1)
            {
                columnIndex = 0;
                ++rowIndex;
            }else if(columnIndex < 0)
            {
                columnIndex = _columns.length-1;
                --rowIndex;
            }
            let column = _columns[columnIndex];
            let data;

            if(rowIndex > _rowCount - 1){
                this.editPosition.rowIndex = rowIndex;
                this.editPosition.columnIndex = columnIndex;

                rowIndex = _rowCount - 1;
                this.editPosition.event = this.editPosition.event==1?3:this.editPosition.event;
                
                //this.$el.scrollTop(_prevScrollTop + _avgRowHeight);
                let ps = _prevScrollTop ;
                this.scroll(ps + _avgRowHeight);
                //this.$table.css({"margin-top":(ps + _avgRowHeight)});
            // this.$scroller.css({"margin-top": (-(this.realHeight)-(ps + _avgRowHeight))+"px"});

                data = _self.dataProvider[rowIndex+_virtualIndex];
                
                
            }else if(rowIndex < 0){
                this.editPosition.rowIndex = rowIndex;
                this.editPosition.columnIndex = columnIndex;

                rowIndex = 0;
                this.editPosition.event = this.editPosition.event==1?3:this.editPosition.event;
                this.$el.scrollTop(_prevScrollTop - _avgRowHeight);
            
                //this.scroll(_prevScrollTop - _avgRowHeight);

                data = _self.dataProvider[rowIndex+_virtualIndex];
                
            }else{
                data = _self.dataProvider[rowIndex+_virtualIndex];
            }

            this.editPosition = {"rowIndex":rowIndex, "columnIndex":columnIndex, "column":column, "data":data, "event":1}; 
            
            this.cellItemRenderers[rowIndex][columnIndex].hide();
            let itemEditorInfo = this.cellItemEditors[columnIndex];
            let itemEditor;
            if(itemEditorInfo == undefined)
            {
                if(column.itemEditor.props.value==null)
                {
                    column.itemEditor.props.value = "{?"+column.field+"}";
                }
                column.itemEditor.props.bindingDefaultContext = data;
                itemEditor = Component.fromLiteral(column.itemEditor);
                column.itemEditor.props.label = column.description; 
                //let props = extend(true, true, column.itemEditor.props);
                //delete props["value"];

                itemEditor.parent = this;
                itemEditor.parentType = 'repeater';
                itemEditor.parentForm = this.parentForm;
                itemEditor.$el.css("margin","0px");
            // let itemEditorWidth = column.calculatedWidth-(this.cells[rowIndex][columnIndex].outerWidth() - this.cells[rowIndex][columnIndex].innerWidth()) - 2;
                let itemEditorWidth = column.calculatedWidth-46;
                itemEditor.$el.css({"outline":"none", "font-size":"14px", "width":itemEditorWidth+"px"});

                this.cellItemEditors[columnIndex] = {"itemEditor":itemEditor, "rowIndex":rowIndex}; 

                itemEditor.on('creationComplete', function(){

                    if (typeof itemEditor.focus === "function") { 
                        // safe to use the function
                        itemEditor.focus();
                    }
                });  
                itemEditor.on('keydown', function(e) { 
                    switch (e.keyCode) {
                        case 9: // TAB - apply and move to next column on the same row 
                            //_self.trigger('cellEditFinished', [rowIndex, columnIndex, column, data, true]);
                            //TODO: Check columnIndex boundaries and pass to next row if it is 
                            //the last one, if now rows remaining pass to first row(check repeater implementation)
                            e.preventDefault();
                            _self.cellEdit(_self.editPosition.rowIndex, _self.editPosition.columnIndex + (e.shiftKey?-1:1));
                            break;    
                    }
                });
                itemEditor.on('keyup', function(e) { 
                        switch (e.keyCode) {
                            case 13: // ENTER - apply value
                                console.log("finished editing");
                                e.preventDefault();
                                _self.cellEditFinished(_self.editPosition.rowIndex, _self.editPosition.columnIndex, true);
                                break;
                            case 27: // ESC - get back to old value
                                e.preventDefault();
                                _self.cellEditFinished(_self.editPosition.rowIndex, _self.editPosition.columnIndex, false);
                                break;
                            
                        }
                });	

            }else
            {
                itemEditor = itemEditorInfo.itemEditor;
                //itemEditor is in another position
                if(itemEditorInfo.rowIndex != rowIndex)
                {
                    itemEditorInfo.rowIndex = rowIndex;
                    itemEditor.$el.detach();
                    //itemEditor.$el.detach();
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
                this.cellItemEditors[columnIndex]["dataProviderValueField"] = dataProviderField;
                itemEditor.value = data[dataProviderField];
            }else
                itemEditor.value = column.itemEditor.props["value"] || data[column.field];
            */
            itemEditor.renderPromise().then(function (cmpInstance)
            {
                _self.cells[rowIndex][columnIndex].append(cmpInstance.$el);
                itemEditor.show();
                if(itemEditorInfo != null)
                {
                    if (typeof itemEditor.focus === "function") { 
                        // safe to use the function
                        itemEditor.focus();
                    }
                } 
            });
        }       
    };

    this.cellEditFinished = function(rowIndex, columnIndex, applyEdit)
    {
        let r = true;
        let e = jQuery.Event('cellEditFinished');
        _self.trigger(e, [rowIndex, columnIndex, applyEdit]);
        if(!e.isDefaultPrevented())
        {
            //console.trace();
            console.log("cellEditFinished:", rowIndex, " ", columnIndex);
            let column = _columns[columnIndex];
            let data = _self.dataProvider[rowIndex+_virtualIndex];
            let value = null, calledHandler = false;
            let itemEditorInfo = this.cellItemEditors[columnIndex];
            let itemEditor = itemEditorInfo.itemEditor;
        

            if((typeof column.cellEditFinished == 'function') && applyEdit){
                let args = [];
                for (let i = 0; i < arguments.length-1; i++) {
                    args.push(arguments[i]);
                }
                //we dont need applyEdit argument any more
                args.push(itemEditorInfo);
                value = column.cellEditFinished.apply(this, args);
                calledHandler = true;
            }
            
            if(!applyEdit || !e.isDefaultPrevented()){           
                itemEditor.hide();
                this.cellItemRenderers[rowIndex][columnIndex].show();
                if(applyEdit){
                    if(!calledHandler){
                        value = itemEditor.value;
                        let exp = itemEditor.getBindingExpression("value");
                        if(exp){
                            if(exp=="currentItem"){
                                _self.dataProvider[rowIndex+_virtualIndex] = value;
                            }else{
                                setChainValue(_self.dataProvider[rowIndex+_virtualIndex], exp, value);
                            }
                        }
                        this.cellItemRenderers[rowIndex][columnIndex].refreshBindings(_self.dataProvider[rowIndex+_virtualIndex]);
                        
                    }
                    //TODO:dataProviderChanged or integrate Binding ? 
                    //_self.dataProvider[rowIndex+_virtualIndex][column.field] = value;
                }
                this.editPosition.event = 2;
            }
        }else
            r = false;
        return r;
    };
    
    this.removeAllRows = function()
    {
        for(let i=this.rows.length-1;i>=0;i--)
        {
            this.removeRow(i, false, false, false);
        }
        this.rows = [];
    };

    this.removeRow = function (index, isPreventable = false, focusOnRowDelete = true, removeFromDp = false) 
    {
        let rowItems = {};
        let beforeRowDeleteEvent = jQuery.Event("beforeRowDelete");
        this.trigger(beforeRowDeleteEvent, [_self, new RepeaterEventArgs(_self.rowItems, {}, index)]);

        if (!isPreventable || (isPreventable && !beforeRowDeleteEvent.isDefaultPrevented())) 
        {
            //remove dp row
            let removedItem = null;
            if(removeFromDp){
                _self.dataProvider.splice(index, 1);
            }
            for(let i=index;i<this.cellItemRenderers.length;i++){
                
                this.cellItemRenderers[i].repeaterIndex -= 1;
                this.cells[i][0].prev().text(i);
            }
            //manage dp
            _currentIndex--;
            _currentItem = _self.dataProvider[index];
            if (_currentIndex == 1 && _allowNewItem) {
                //model.displayRemoveButton = false;
            }
            this.rows[index].remove();
            this.rows.splice(index, 1);
            _rowItems.splice(index, 1);
            this.cells.splice(index, 1);
            this.cellItemRenderers.splice(index, 1);
            
            this.$el.trigger('rowDelete', [this, new RepeaterEventArgs([], _currentItem, index, rowItems)]);
            //animate
            if (focusOnRowDelete)
                this.cellItemRenderers[index-1][0].scrollTo();
            return removedItem;
        }  
    };   

    this.updateDisplayList = function () {
        _displayed = true;
        //we now know the parent and element dimensions
        _avgRowHeight = (this.$table.height() - this.$header.height()) / _rowCount;
        this.virtualHeight = (_self.dataProvider.length - 2 * (_allowNewItem ? 1 : 0)) * _avgRowHeight;

        this.bufferedRowsCount = _rowCount;

        let pos = this.$table.position();
        let left = pos.left + this.$table.width() - 14;
        let top = pos.top + this.$header.height();
        this.realHeight = (this.$table.height() + this.$header.height() - 16);
        this.$message = $("<div>Creating Rows</div>");

        this.$scrollArea = $("<div/>");
        this.$scroller = $("<div style='border:1px solid black;position:relative; height:40px;top:15px'></div>");
        this.$scrollArea.append(this.$scroller);
        this.$scrollArea.css({ border: "1px", opacity: 100, "margin-top": -this.realHeight + "px", float: "right", position: "relative", "margin-left": "-16px", width: "10px", height: this.virtualHeight + "px" });
        
        this.$el.css({ border: "1px solid black" });
        this.$el.css({ height: this.$table.height() });
        this.$table.after(this.$scrollArea);

        this.delayScroll = debounce(_onScroll, 400);

        this.$el.on("scroll", function (e) {
            if (this.virtualHeight > (e.target.scrollTop + this.realHeight) - 2 * _avgRowHeight) {
                this.loading = true;
                this.$message.css({ position: "absolute", top: 150 + "px", left: 150 + "px", "background-color": "white", "z-index": 9999 });
                this.$el.append(this.$message);
                this.$table.css({ "margin-top": e.target.scrollTop });
                this.$scrollArea.css({ "margin-top": (-(this.realHeight) - e.target.scrollTop) + "px" });
                //let top = this.$scroller.position().top;
                let h = this.$scrollArea.height();
                this.$scroller.css({ "top": (16 + 1.2 * (h - (h - e.target.scrollTop))) + "px" });
                let cScrollHeight = this.$scrollArea.css("height");
                this.delayScroll.apply(this, arguments);
                //this.onScroll.apply(this, arguments);
            }
        }.bind(this));
        this.setCellsWidth();
    };
    
    Object.defineProperty(this, "multiSelect", 
    {
        get: function multiSelect() 
        {
            return _multiSelect;
        },
        set: function multiSelect(v) 
        {
            if(_multiSelect != v)
                _multiSelect = v;
        },
        enumerable:true
        });
    
    Object.defineProperty(this, "selectedItems",
    {
        get: function selectedItems()
        {
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
        let len = _self.rows.length;
        for (let i = 0; i < len; i++) {
            let found = false;
            for (let j = 0; j < _selectedIndices.length; j++) {
                if (i == _selectedIndices[j] - ra.virtualIndex) {
                    found = true;
                    _self.rows[i].addClass("datagrid-row-selected");
                }
            }
            if (!found) {
                _self.rows[i].removeClass("datagrid-row-selected");
            }
        }
    };
    
    let _displayed = false;
    let _ctrlIsPressed = false;
    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            let av = e.target.style.getPropertyValue('display');
            if(av!="" && av!="none" && !_displayed){
                this.updateDisplayList();
            }
            
            $(_self.ownerDocument).keydown(function(event){
                if ((Env.getInstance().current == EnvType.MAC && event.metaKey && !event.shiftKey) || event.ctrlKey)
                    _ctrlIsPressed = true;
            });
            
            $(_self.ownerDocument).keyup(function ()
            {
                if((Env.getInstance().current == EnvType.MAC && !event.metaKey) || event.which == "17")
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
        showRowIndex:true,
        dataProvider: new ArrayEx([]),
        rowCount:5,
        columns: [],
        allowNewItem: false,
        multiSelect: false
    };
    _props = extend(false, false, _defaultParams, _props);    
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
    
    let myDtEvts = ["cellEditFinished", "cellEdit", "rowEdit", "rowAdd", "rowDelete", "rowClick", "rowDblClick", "cellStyling", "rowStyling"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {   
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    
    let _rendering = _props.rendering;
    let _showRowIndex = _props.showRowIndex;
    let _rowCount = _props.rowCount;
    _rowCount = _rowCount != null? Math.min(_rowCount, (_props.dataProvider && _props.dataProvider.length ? _props.dataProvider.length:0)): _props.dataProvider.length;
        
    let _allowNewItem = _props.allowNewItem;
    
    this.components = _props.components;
    let _columns = _props.columns;
    this.rows = [];
    this.cellItemRenderers = [[]];
    this.cellItemEditors = [];
    this.cells = [];// matrix
    this.editPosition = null;
    this.bindingExpressions = []; //array of bindings arrays (bindings for each column)
    let r = Repeater.call(this, _props, true);
    let base = this.base;
    //overrides
    let _rPromise;
    this.renderPromise = function () 
    { 
        this.$table = this.$el.find("#" + this.domID + '-table');
        this.$header = this.$el.find('#' + this.domID + '-header'); 
        this.$container = this.$table;
        
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function(e){
                if (e.target.id == _self.domID) 
                {
                    resolve(this); 
                }
            });                   
        });
        
        this.createHeader();
        //if(_props.dataProvider)
        if(!this.getBindingExpression("dataProvider"))
            this.dataProvider = _props.dataProvider;
        return _rPromise;
    };
    //renders a new row, adds components in stack
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) 
    {
        let rp = [];
        let beforeRowAddEvent = jQuery.Event("beforeRowAdd");
        let rargs = new RepeaterEventArgs(_self.rowItems, data, index - 1);
        rargs.virtualIndex = _virtualIndex;
        this.trigger(beforeRowAddEvent, [_self, rargs]);

        if (!isPreventable || (isPreventable && !beforeRowAddEvent.isDefaultPrevented())) 
        {
            let renderedRow = $('<tr>');
            let ccComponents = [];
            let rowItems = {};
        
            if(_showRowIndex){
                renderedRow.append('<th scope="row">' + (index + 1) + '</th>');
            }
            let columnIndex = 0;
            renderedRow.click(function(evt)
            {
                let rargs = new RepeaterEventArgs(_rowItems, _self.dataProvider[index + _virtualIndex], index + _virtualIndex);
                rargs.virtualIndex = _virtualIndex;
                _self.trigger("rowClick",  [_self, rargs]);
            });

            renderedRow.on('dblclick', function(evt)
            {
                let rargs = new RepeaterEventArgs(_rowItems, _self.dataProvider[index + _virtualIndex], index + _virtualIndex);
                rargs.virtualIndex = _virtualIndex;
                _self.trigger("rowDblClick", [_self, rargs]);
            });
            let rargs = new RepeaterEventArgs(_rowItems, _self.dataProvider[index + _virtualIndex], index + _virtualIndex);
            rargs.virtualIndex = _virtualIndex;
            let rsEvt = jQuery.Event('rowStyling', [_self, rargs]);

            let rowBindingFunctions = [], bIndex = 0;
            _self.cellItemRenderers.splice(index, 0, []);
            for (let columnIndex=0;columnIndex<_self.columns.length;columnIndex++) 
            {
                let column = _self.columns[columnIndex];
                //column.sortInfo:{sortOrder:0, sortDirection:"ASC"},
                //column.cellStyleFunction,
                //column.cellValueFunction,
                //column.itemEditor    
                let component = {};
                column.itemRenderer.props.id = column.itemRenderer.props.id ? column.itemRenderer.props.id : "column";
                shallowCopy(column.itemRenderer, component, ["props"]);
                component.props = {};
                shallowCopy(column.itemRenderer.props, component.props, ["id", "bindingDefaultContext"]);
                component.props.id = (column.itemRenderer.props.id?column.itemRenderer.props.id:column.name) + "_" + index + "_" + columnIndex;
                component.props.bindingDefaultContext = data;
                component.props.ownerDocument = _props.ownerDocument;
                
                //build components properties, check bindings
                
                let dataProviderField = column.field;
                //might not be wanted
                
                let cmp = _self.cellItemRenderers[index];               

                /*
                cmp[columnIndex]["label"] = data[dataProviderField];
                if(_self.bindings[dataProviderField]==undefined){
                    _self.bindings[dataProviderField] = {};
                    if(_self.bindings[dataProviderField][columnIndex]==undefined){
                        //TODO: check this out
                        _self.bindings[dataProviderField][columnIndex] = {"component":cmp, "property":prop, "dataProviderField":dataProviderField, "dataProviderIndex":index};
                    }
                }
                */
                //construct the component
                let el = Component.fromLiteral(component);
                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.repeaterIndex = index;

                _self.cellItemRenderers[index][columnIndex] = el; 
                rowItems[column.name] = el;
                _rowItems[index] = rowItems;
                
                //
                
                let csEvt = jQuery.Event('cellStyling', [_self, index, columnIndex, _rowItems, column, data]);
                
                if(column.editable){
                    el.on('dblclick', (function(rowIndex, columnIndex, column, data){
                        return (function(e) { // a closure is created
                            //alert(JSON.stringify(column)+" "+JSON.stringify(data)+" "+(index-1));
                            _self.cellEdit(rowIndex, columnIndex);
                        });	
                    })(index, columnIndex, column, data));
                }

                //handle component change event and delegate it to repeater
                el.on('creationComplete', function (e) { 
                    e.stopImmediatePropagation();
                    //e.stopPropagation();
                    ccComponents.push(el.id);
                    //console.log("creation Complete", this.id);
                    if (ccComponents.length == _self.columns.length) {
                        //trigger row add event
                        _self.$el.trigger('rowAdd', [_self, new RepeaterEventArgs(_rowItems, data, index)]);
                        //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                        
                        //manage dp
                        _currentItem = data;

                        _currentIndex <= index ? _currentIndex = index : _currentIndex = _currentIndex;
                        

                        //skip dp if it already exist
                        let addRowFlag = false;
                        if (index > _self.dataProvider.length-1) {
                            _self.dataProvider.push(_currentItem);
                            addRowFlag = true;
                        }
                        
                        if (_currentIndex == Math.min(_rowCount, _self.dataProvider.length) && !addRowFlag) {
                            _self.trigger('creationComplete');
                        }

                        //animate
                        if (addRowFlag && focusOnRowAdd) {
                            _rowItems[index][_self.components[0].props.id].scrollTo();
                        }         
                    
                    }
                    return false;
                });

                el.on('change', function (e) {
                    let currentItem = _self.dataProvider[index];
                    if (component.props.value[0] == '{' && component.props.value[component.props.value.length - 1] == '}') {
                        let bindedValue = component.props.value.slice(1, -1);
                        data[bindedValue] = this.value;
                    }
                    let rargs = new RepeaterEventArgs(rowItems, _self.dataProvider[index + _virtualIndex], index + _virtualIndex);
                    rargs.virtualIndex = _virtualIndex;
                    _self.$el.trigger('rowEdit', [_self, rargs]);
                });
                //width='"+column.calculatedWidth+"'
                let cell = $("<td id='cell_"+(index)+"_"+columnIndex+"'></td>");
                if(_self.cells[index]== undefined)
                    _self.cells[index] = [];
                _self.cells[index][columnIndex] = cell;
                //render component in row
                let cp = el.renderPromise().then(function (cmpInstance)
                {
                    renderedRow.append(cell.append(cmpInstance.$el));
                   _self.$hadow.append(renderedRow);
                });
                rp.push(cp);
            }   
            _self.rows.push(renderedRow); 
        }
        return rp;
    }; 
};
DataGrid.prototype.ctor = 'DataGrid';