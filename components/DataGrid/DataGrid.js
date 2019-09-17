/**
 * This is a DataGrid component
 * 
 * Kreatx 2018
 */

//component definition
var DataGrid = function(_props)
{
    var _currentIndex = 1;
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
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        }
    });

    Object.defineProperty(this, "columns", {
        get: function columns() {
            return _columns;
        },
        configurable: true,
        enumerable:true
    });  

    var _currentItem = {};
    var _rowItems = [];
    
    var _showRowIndex;
    var _prevScrollTop = 0;
    var _avgRowHeight = undefined;
    var _virtualIndex = 0;
    var _scrollRowStep = 0;

    var _onScroll = function(e) 
    {
        var scrollTop = e.target.scrollTop;
        _scroll(scrollTop);
    };

    _scroll = function (scrollTop)
    {
        if(scrollTop>=0){
            console.log("scrollTop:",scrollTop);
                
            var virtualIndex = Math.ceil(scrollTop / _avgRowHeight);
            scrollTop = virtualIndex * _avgRowHeight;
            //this.scroll(scrollTop);

            var deltaScroll =  _prevScrollTop - scrollTop;
        

            var scrollRowStep = Math.ceil(Math.abs(deltaScroll) / _avgRowHeight) * (deltaScroll/Math.abs(deltaScroll));

            if(deltaScroll < 0){
                console.log("scroll down");
                
            }else{
                console.log("scroll up");  
                    
            }
        
            virtualIndex = (_rowCount+virtualIndex < _dataProvider.length) ? virtualIndex : (_dataProvider.length-_rowCount);        
            _prevScrollTop = scrollTop;
            if(_virtualIndex != virtualIndex){
                _self.applyVirtualBindings(virtualIndex);
                _virtualIndex = virtualIndex;

                if(scrollRowStep!=0){
                    if(_self.editPosition!=null){
                        var newEditPosition = (_self.editPosition.rowIndex + scrollRowStep);
                        if(_self.editPosition.event == 1 || _self.editPosition.event==3){
                        
                            if(_self.editPosition.event == 1){
                                var cellEditFinishedEvent = jQuery.Event("cellEditFinished");
                                _self.trigger(cellEditFinishedEvent, [_self.editPosition.rowIndex, _self.editPosition.columnIndex, false]);
                                _self.cellItemRenderers[_self.editPosition.rowIndex][_self.editPosition.columnIndex].show();  
                            }
                            
                            _self.editPosition.rowIndex = newEditPosition;

                            if((newEditPosition >=0) && (newEditPosition<_rowCount)){
                                console.log("show editor phase", _self.editPosition.event, " at: ", newEditPosition," ",_self.editPosition.rowIndex," ",scrollRowStep);
                                _self.trigger('cellEdit', [newEditPosition, _self.editPosition.columnIndex]);
                                //TODO:need to add a parameter to cellEdit handler 
                                //so that we do not set the value of the editor to the value in the dp, but just keep the not-yet stored value.
                            }else{
                                //edited cell is out of view
                                console.log("event = 3");
                                _self.editPosition.event = 3;
                                _scrollRowStep = scrollRowStep;
                                
                            }
                        
                        }else{
                            //normalize edit row index
                            _self.editPosition.rowIndex = newEditPosition;
                        }
                    }
                }
            }
            _self.$message.remove();
        }
    };
   
    this.template = function () 
    {
        var html = 
            "<div id='" + this.domID + "' data-triggers='cellEditFinished cellEdit rowClick rowDblClick cellStyling rowStyling'  style='overflow-y: scroll'>" +
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
            var definedWidth = 0; var autoWidthColumns = [];
            for (var columnIndex=0;columnIndex<_columns.length;columnIndex++) {
                var column = _columns[columnIndex];
                if(column["width"]){
                    definedWidth += column.calculatedWidth = column.width;
                }else{
                    autoWidthColumns.push(column);
                }
            }
            var autoWidth = (this.$table.width() - definedWidth) / autoWidthColumns.length;
            for (var columnIndex=0;columnIndex<autoWidthColumns.length;columnIndex++) {
                var column = autoWidthColumns[columnIndex];
                column.calculatedWidth = autoWidth;
            }
            for (var columnIndex=0;columnIndex<this.cells[0].length;columnIndex++) {
                this.cells[0][columnIndex].css({"width":(_columns[columnIndex].calculatedWidth)+"px"}); 
            }
        }
    };

    this.renderRows = function(startIndex, endIndex) 
    {
        endIndex = endIndex > _dataProvider.length ? _dataProvider.length: endIndex;
        startIndex = startIndex < 0 ? 0: startIndex;
        // _rowItems = {}; we need this if we create Repeater instances via Object.assign
        
        for(var i=startIndex;i<endIndex;i++)
        {
            this.addRow(extend(false, false, _dataProvider[i]), i + 1);
        } 
        if(this.allowNewItem && endIndex==_dataProvider.length)
        { 
            this.addEmptyRow();
        }
    };

    this.addEmptyRow = function()
    {
        var emptyObj = this.defaultItem = createEmptyObject(_columns, "field", "description");
        _dataProvider.pad(emptyObj, 1);
        this.addRow(extend(false, false, _dataProvider[i]), i + 1);
    };

    this.applyVirtualBindings = function(virtualIndex)
    {
        for(var rowIndex=0;rowIndex<_rowCount;rowIndex++)
        {
            for(var columnIndex=0;columnIndex<_columns.length;columnIndex++)
            {
                var itemRenderer = this.cellItemRenderers[rowIndex][columnIndex];
                this.cellItemRenderers[rowIndex][columnIndex].repeaterIndex = rowIndex + virtualIndex;
                itemRenderer.refreshBindings(_dataProvider[rowIndex + virtualIndex]);
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
        var headerHtml = "<tr>";
        var hi = 0;
        if(_showRowIndex){
            headerHtml += "<th>#</th>";
        }
        headerHtml += "</tr>";
        var $header = $(headerHtml);
        var _self = this;
        var sortDirFADic = {"asc":"down", "desc":"up"};
        var colElements = new Array(_columns.length);
        for (var columnIndex=0;columnIndex<_columns.length;columnIndex++) {
            var column = _columns[columnIndex] = new DataGridColumn(_columns[columnIndex]);
            
            $th = $("<th id='head_"+hi+"'>"+column.description+(column.sortable ? "<span class='fa fa-caret-"+(sortDirFADic[column.sortDirection.toLowerCase()])+"'></span></a>":"")+"</th>");    
            $th.bind('click', 
            (function(hIndex, column){
                return (function(e) { // a closure is created
                    _self.headerClickHandler.call(_self, e, hIndex, column);
                    });	
            })(hi, column));
            //put elements in an array so jQuery will use documentFragment which is faster
            colElements[columnIndex] = $th
            ++hi;  
        }
        $header.append(colElements);
        this.$header.append($header);
    },
    this.cellEdit = function(e, rowIndex, columnIndex)
    {
       /* if (typeof _cellEdit == 'function')
            _cellEdit.apply(this, arguments);
        var e = arguments[0];
        if(!e.isDefaultPrevented())
        {*/
        

            if(this.editPosition!=null && this.editPosition.event==1 && (this.editPosition.rowIndex != rowIndex || this.editPosition.columnIndex != columnIndex)){
            
                var cellEditFinishedEvent = jQuery.Event("cellEditFinished");
                this.trigger(cellEditFinishedEvent, [this.editPosition.rowIndex, this.editPosition.columnIndex, true]);
                
                if (cellEditFinishedEvent.isDefaultPrevented()) {
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
            var column = _columns[columnIndex];
            var data;

            if(rowIndex > _rowCount - 1){
                this.editPosition.rowIndex = rowIndex;
                this.editPosition.columnIndex = columnIndex;

                rowIndex = _rowCount - 1;
                this.editPosition.event = this.editPosition.event==1?3:this.editPosition.event;
                
                //this.$el.scrollTop(_prevScrollTop + _avgRowHeight);
                var ps = _prevScrollTop ;
                this.scroll(ps + _avgRowHeight);
                //this.$table.css({"margin-top":(ps + _avgRowHeight)});
            // this.$scroller.css({"margin-top": (-(this.realHeight)-(ps + _avgRowHeight))+"px"});

                data = _dataProvider[rowIndex+_virtualIndex];
                
                
            }else if(rowIndex < 0){
                this.editPosition.rowIndex = rowIndex;
                this.editPosition.columnIndex = columnIndex;

                rowIndex = 0;
                this.editPosition.event = this.editPosition.event==1?3:this.editPosition.event;
                this.$el.scrollTop(_prevScrollTop - _avgRowHeight);
            
                //this.scroll(_prevScrollTop - _avgRowHeight);

                data = _dataProvider[rowIndex+_virtualIndex];
                
            }else{
                data = _dataProvider[rowIndex+_virtualIndex];
            }

            this.editPosition = {"rowIndex":rowIndex, "columnIndex":columnIndex, "column":column, "data":data, "event":1}; 
            
            this.cellItemRenderers[rowIndex][columnIndex].hide();
            var itemEditorInfo = this.cellItemEditors[columnIndex];
            var itemEditor;
            if(itemEditorInfo == undefined)
            {
                if(column.itemEditor.props["value"]==null)
                {
                    column.itemEditor.props["value"] = "{?"+column.field+"}";
                }
                column.itemEditor.props.bindingDefaultContext = data;
                itemEditor = Component.fromLiteral(column.itemEditor);
                column.itemEditor.props.label = column.description; 
                //var props = extend(true, true, column.itemEditor.props);
                //delete props["value"];

                itemEditor.parent = this;
                itemEditor.parentType = 'repeater';
                itemEditor.parentForm = this.parentForm;
                itemEditor.$el.css("margin","0px");
            // var itemEditorWidth = column.calculatedWidth-(this.cells[rowIndex][columnIndex].outerWidth() - this.cells[rowIndex][columnIndex].innerWidth()) - 2;
                var itemEditorWidth = column.calculatedWidth-46;
                itemEditor.$el.css({"outline":"none", "font-size":"14px", "width":itemEditorWidth+"px"});

                this.cellItemEditors[columnIndex] = {"itemEditor":itemEditor, "rowIndex":rowIndex}; 

                itemEditor.on('creationComplete', function(){

                    if (typeof itemEditor['focus'] === "function") { 
                        // safe to use the function
                        itemEditor.focus();
                    }
                });  
                var _self = this;
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
                            case 9: // TAB - apply and move to next column on the same row 
                                //_self.trigger('cellEditFinished', [rowIndex, columnIndex, column, data, true]);
                                //TODO: Check columnIndex boundaries and pass to next row if it is 
                                //the last one, if now rows remaining pass to first row(check repeater implementation)
                                e.preventDefault();
                                if(e.shiftKey)
                                    _self.trigger('cellEdit', [_self.editPosition.rowIndex, _self.editPosition.columnIndex-1]);
                                else
                                    _self.trigger('cellEdit', [_self.editPosition.rowIndex, _self.editPosition.columnIndex+1]);
                            
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
                itemEditor.value = null;
                itemEditor.refreshBindings(data);
            }
            var _self = this;
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
                var dataProviderField = column.itemEditor.props["value"].slice(1, -1);
                this.cellItemEditors[columnIndex]["dataProviderValueField"] = dataProviderField;
                itemEditor.value = data[dataProviderField];
            }else
                itemEditor.value = column.itemEditor.props["value"] || data[column.field];
            */
            
            this.cells[rowIndex][columnIndex].append(itemEditor.render());
            itemEditor.show();
            if(itemEditorInfo != null)
            {
                if (typeof itemEditor['focus'] === "function") { 
                    // safe to use the function
                    itemEditor.focus();
                }
            } 
       // }       
    };

    this.cellEditFinished = function(rowIndex, columnIndex, applyEdit)
    {
        var e = jQuery.Event('cellEditFinished');
        _self.trigger(e, [rowIndex, columnIndex, applyEdit]);
        if(!e.isDefaultPrevented())
        {
            //console.trace();
            console.log("cellEditFinished:", rowIndex, " ", columnIndex);
            var column = _columns[columnIndex];
            var data = _dataProvider[rowIndex+_virtualIndex];
            var value = null, calledHandler = false;
            var itemEditorInfo = this.cellItemEditors[columnIndex];
            var itemEditor = itemEditorInfo.itemEditor;
        

            if((typeof column.oncelleditfinished == 'function') && applyEdit){
                var args = [];
                for (var i = 0; i < arguments.length-1; i++) {
                    args.push(arguments[i]);
                }
                //we dont need applyEdit argument any more
                args.push(itemEditorInfo);
                value = column.oncelleditfinished.apply(this, args);
                calledHandler = true;
            }
            
            if(!applyEdit || !e.isDefaultPrevented()){           
                itemEditor.hide();
                this.cellItemRenderers[rowIndex][columnIndex].show();
                if(applyEdit){
                    if(!calledHandler){
                        value = itemEditor.value;
                        if(itemEditor["labelField"] && isObject(value) && value[itemEditor.labelField]){
                            value = value[itemEditor.labelField];
                        }
                    }
                    //TODO:dataProviderChanged or integrate Binding ? 
                    _dataProvider[rowIndex+_virtualIndex][column.field] = value;
                }
                this.editPosition.event = 2;
            }
        }
    };
    
     //renders a new row, adds components in stack
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) 
    {
        var _self = this;
        
        var renderedRow = $('<tr>')
        
        
        var ccComponents = [];
        var buildRow = function () {
            var rowItems = {};
        
            if(_showRowIndex){
                renderedRow.append('<th scope="row">'+index+'</th>')
            }
            var columnIndex = 0;
            renderedRow.click(function(evt)
            {
                _self.trigger("rowClick",  [_self, new RepeaterEventArgs(_rowItems, data, index)]);
            });

            renderedRow.dblclick(function(evt)
            {
                _self.trigger("rowDblClick", [_self, new RepeaterEventArgs(_rowItems, data, index)]);
            });
            let rsEvt = jQuery.Event('rowStyling', [_self, new RepeaterEventArgs(_rowItems, data, index)]);

            var rowBindingFunctions = [], bIndex = 0;
            for (var columnIndex=0;columnIndex<_self.columns.length;columnIndex++) 
            {
                var column = _self.columns[columnIndex];
                //column.sortInfo:{sortOrder:0, sortDirection:"ASC"},
                //column.cellStyleFunction,
                //column.cellValueFunction,
                //column.itemEditor    
                var component = extend(true, true, column.itemRenderer);

                
                //build components properties, check bindings
                if (_self.cellItemRenderers[index-1] == undefined)
                    _self.cellItemRenderers[index-1] = [];

                var dataProviderField = column.field;
                //
                component.props["label"] = "{?"+dataProviderField+"}";
                //might not be wanted
                component.props.id = column.field;


                var cmp = _self["cellItemRenderers"][index-1];
                if (cmp[columnIndex] == undefined)
                    cmp[columnIndex] = {};

               

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
                component.props.bindingDefaultContext = data;
                var el = Component.fromLiteral(component);
                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.repeaterIndex = index - 1;

                _self.cellItemRenderers[index-1][columnIndex] = el; 
                rowItems[column.field] = el;
                _rowItems[index - 1] = rowItems;
                
                //
                
                let csEvt = jQuery.Event('cellStyling', [_self, index, columnIndex, _rowItems, column, data]);
                
                if(column.editable){
                    el.on('dblclick', (function(rowIndex, columnIndex, column, data){
                        return (function(e) { // a closure is created
                            //alert(JSON.stringify(column)+" "+JSON.stringify(data)+" "+(index-1));
                            _self.trigger('cellEdit', [rowIndex, columnIndex]);
                        });	
                    })(index - 1, columnIndex, column, data));
                }

                //handle component change event and delegate it to repeater
                el.on('creationComplete', function (e) { 
                    e.stopImmediatePropagation();
                    //e.stopPropagation();
                    ccComponents.push(el.id);
                    //console.log("creation Complete", this.id);
                    if (ccComponents.length == _self.columns.length) {
                        //trigger row add event
                        _self.$el.trigger('onRowAdd', [_self, new RepeaterEventArgs(_rowItems, data, index)]);
                        //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                        
                        //manage dp
                        _currentItem = data;

                        _currentIndex <= index ? _currentIndex = index : _currentIndex = _currentIndex;
                        

                        //skip dp if it already exist
                        var addRowFlag = false;
                        if (index > _dataProvider.length) {
                            _dataProvider.push(_currentItem);
                            addRowFlag = true;
                        }
                        
                        if (_currentIndex == Math.min(_rowCount, _dataProvider.length) && !addRowFlag) {
                            _self.trigger('creationComplete');
                        }

                        //animate
                        if (addRowFlag && focusOnRowAdd) {
                            _rowItems[index - 1][_self.components[0].props.id].scrollTo();
                        }         
                    
                    }
                    return false;
                });

                el.on('change', function (e) {
                    var currentItem = _dataProvider[index - 1];
                    if (tempComponent.props.value[0] == '{' && tempComponent.props.value[tempComponent.props.value.length - 1] == '}') {
                        var bindedValue = tempComponent.props.value.slice(1, -1);
                        data[bindedValue] = this.value;
                    }

                    _self.$el.trigger('onRowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                });
                //width='"+column.calculatedWidth+"'
                var cell = $("<td id='cell_"+(index-1)+"_"+columnIndex+"'></td>");
                if(_self.cells[index-1]== undefined)
                    _self.cells[index-1] = [];
                _self.cells[index-1][columnIndex] = cell;
                //render component in row

                renderedRow.append(cell.append(el.render()));
            }   

            //render row in dom
            _self.$table.append(renderedRow);
            _self["rows"].push(renderedRow); 
            return rowItems;
        }
      
        //trigger before row add event
        if (isPreventable) {
            //the before add event is preventable
            var beforeRowAddEvent = jQuery.Event("onBeforeRowAdd");
            this.trigger(beforeRowAddEvent);
         
            if (!beforeRowAddEvent.isDefaultPrevented()) {
                //the event is not canceled outside
                var rowItems = buildRow();
                return rowItems;
            } else {
                //the event default is canceled outside
                return false;
            }

        } else {
            //the before add event is not preventable so buildRow anyway
            return buildRow();    
        }
    }; 
    
    this.removeAllRows = function()
    {
        for(var i=this.rows.length;i>0;i--)
        {
            this.removeRow(i, false, false, false);
        }
        this.rows = [];
    };

    this.removeRow = function (index, isPreventable = false, focusOnRowDelete = true, removeFromDp = false) 
    {
        var rowItems = {};
        
        var removeRow = function () {
            //remove dp row
            var removedItem = null;
            if(removeFromDp){
                _dataProvider.splice(index - 1, 1);
            }
            for(var i=index-1;i<this.cellItemRenderers.length;i++){
                
                this.cellItemRenderers[i].repeaterIndex -= 1;
                this.cells[i][0].prev().text(i);
            }
            //manage dp
            _currentIndex--;
            _currentItem = _dataProvider[index - 1];
            if (_currentIndex == 1 && this.allowNewItem) {
                //model.displayRemoveButton = false;
            }
            this.rows[index-1].remove();
            this.rows.splice(index - 1, 1);
            _rowItems.splice(index - 1, 1);
            this.cells.splice(index - 1, 1);
            this.cellItemRenderers.splice(index - 1, 1);
            
            this.$el.trigger('onRowDelete', [this, new RepeaterEventArgs([], _currentItem, index, rowItems)]);
            //animate
            if (focusOnRowDelete)
                this.cellItemRenderers[index-2][0].scrollTo();
            return removedItem;
        }.bind(this);

        //trigger before row delete event
        if (isPreventable) {
            //trigger before row delete event
            var beforeRowDeleteEvent = jQuery.Event("onBeforeRowDelete");
            this.$el.trigger(beforeRowDeleteEvent);

            if (!beforeRowDeleteEvent.isDefaultPrevented()) {
                return removeRow.call(this);
            } else {
                return false;
            }
        } else {
            return removeRow.call(this);
        }
  
    };   

    var _defaultParams = {
        rendering: {
			direction: 'vertical',
			separator: true,
			actions: false
        },
        showRowIndex:true,
        dataProvider:[],
        rowCount:5,
        columns:[]
    };
    _props = extend(false, false, _defaultParams, _props);
    var _dataProvider = _props.dataProvider;
    var _rendering = _props.rendering;
    var _showRowIndex = _props.showRowIndex;
    var _rowCount = _props.rowCount;
    var _self = this;
    //var _cellEditFinished = _props.cellEditFinished;
    var _cellEdit = _props.cellEdit;


    this.components = _props.components;
    let _columns = _props.columns;
    this.rows = [];
    this.cellItemRenderers = [[]];
    this.cellItemEditors = [];
    this.cells = [];// matrix
    this.editPosition = null;
    this.bindingExpressions = []; //array of bindings arrays (bindings for each column)
   
    Component.call(this, _props, true);
    var base = this.base;
    //overrides
    this.afterAttach = function (e) 
    {
        if(e.target == this.$el[0])
        {
            //we now know the parent and element dimensions
            _avgRowHeight = (this.$table.height() - this.$header.height())/ _rowCount;
            this.virtualHeight = _dataProvider.length * _avgRowHeight;

            this.bufferedRowsCount = _rowCount;

            var pos = this.$table.position();
            var left = pos.left + this.$table.width() - 14;
            var top = pos.top + this.$header.height();
            this.realHeight = (this.$table.height()+this.$header.height()-16);
            this.$message = $("<div>Creating Rows</div>");

            this.$scroller = $("<div/>");
            this.$scroller.css({border: "1px", opacity:100, "margin-top":-this.realHeight+"px", float: "right",position:"relative", "margin-left": "-16px", width:"10px", height : this.virtualHeight + "px"});
            
            this.$el.css({border: "1px solid black"});
            this.$el.css({height:this.$table.height()});
            this.$table.after(this.$scroller);

            this.delayScroll = debounce(_onScroll, 400);

            this.$el.on("scroll", function(e){
                if(this.virtualHeight > (e.target.scrollTop+this.realHeight)-2*_avgRowHeight){
                    this.loading = true;
                    this.$message.css({position:"absolute", top:150+"px", left:150+"px", "background-color":"white","z-index":9999});
                    this.$el.append(this.$message);
                    this.$table.css({"margin-top":e.target.scrollTop});
                    this.$scroller.css({"margin-top": (-(this.realHeight)-e.target.scrollTop)+"px"})
                    var cScrollHeight =  this.$scroller.css("height");
                    this.delayScroll.apply(this, arguments)
                //this.onScroll.apply(this, arguments);
                }
            }.bind(this));


            this.setCellsWidth();
        }
    };
    this.render = function () 
    {
        var _self = this;
        
        this.$el.trigger('onBeginDraw');
      

        this.$table = this.$el.find("#" + this.domID + '-table');
        this.$header = this.$el.find('#' + this.domID + '-header'); 
        
        this.createHeader();
        var len = _rowCount? Math.min(_rowCount, _dataProvider.length): _dataProvider.length;
        this.renderRows(0, len);
        //this.dataProvider.forEach(function (data, index) {  
            
       // });
       
        
        this.$el.trigger('onEndDraw');

        return this.$el;
    };
};
DataGrid.prototype.ctor = 'DataGrid';