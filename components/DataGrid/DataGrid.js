/**
 * This is a DataGrid component
 * 
 * Kreatx 2018
 */

//component definition
var DataGrid = KxGenerator.createComponent({
    currentIndex: 1,
    currentItem: {},
    rowItems: [],
    dataProviderKeys: [],
    rowIndex:true,

    initModel: function () {
        if(this.defaultItem!=undefined && this.defaultItem!=null){
            this.dataProviderKeys = Object.keys(this.defaultItem);
        }else if(this.dataProvider.length>0){
            this.dataProviderKeys = Object.keys(this.dataProvider[0]);
        }
    },
    bindings: {},
    beforeAttach: function () {
        this.checkedField = "checked_"+this.id;
        this.states = [
            {dataProviderField:this.classField, states:{on:this.selectedClass, off:this.defaultClass}},
            {dataProviderField:this.checkedField, states:{on:true, off:false}}
        ];
        this.direction = this.direction==undefined||this.direction==null?'vertical':this.direction;
        this.multiSelect = (this.multiSelect?this.multiSelect:false);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'cellEditFinished': this.cellEditFinished.bind(this),
                    'cellEdit': this.cellEdit.bind(this)
                }
            }
        ];
    },

    afterAttach: function (e) {
        if(e.target == this.$el[0]){
            //we now know the parent and element dimensions
            this.avgRowHeight = (this.$table.height() - this.$header.height())/ this.rowCount;
            this.virtualHeight = this.dataProvider.length * this.avgRowHeight;

            this.bufferedRowsCount = this.rowCount;

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

            this.delayScroll = debounce(this.onScroll, 400);

            this.$el.on("scroll", function(e){
                if(this.virtualHeight > (e.target.scrollTop+this.realHeight)-2*this.avgRowHeight){
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
    },
    prevScrollTop:0,
    avgRowHeight: undefined,
    virtualIndex:0,
    scrollRowStep:0,

    onScroll: function(e) {
        var scrollTop = e.target.scrollTop;
        this.scroll(scrollTop);
    },

    scroll(scrollTop){
        if(scrollTop>=0){
            console.log("scrollTop:",scrollTop);
                
            var virtualIndex = Math.ceil(scrollTop / this.avgRowHeight);
            scrollTop = virtualIndex * this.avgRowHeight;
            //this.scroll(scrollTop);

            var deltaScroll =  this.prevScrollTop - scrollTop;
        

            var scrollRowStep = Math.ceil(Math.abs(deltaScroll) / this.avgRowHeight) * (deltaScroll/Math.abs(deltaScroll));

            if(deltaScroll < 0){
                console.log("scroll down");
                
            }else{
                console.log("scroll up");  
                    
            }
        
            virtualIndex = (this.rowCount+virtualIndex < this.dataProvider.length) ? virtualIndex : (this.dataProvider.length-this.rowCount);        
            this.prevScrollTop = scrollTop;
            if(this.virtualIndex != virtualIndex){
                this.applyBindings(virtualIndex);
                this.virtualIndex = virtualIndex;

                if(scrollRowStep!=0){
                    if(this.editPosition!=null){
                        var newEditPosition = (this.editPosition.rowIndex + scrollRowStep);
                        if(this.editPosition.event == 1 || this.editPosition.event==3){
                        
                            if(this.editPosition.event == 1){
                                var cellEditFinishedEvent = jQuery.Event("cellEditFinished");
                                this.trigger(cellEditFinishedEvent, [this.editPosition.rowIndex, this.editPosition.columnIndex, false]);
                                this.cellItemRenderers[this.editPosition.rowIndex][this.editPosition.columnIndex].show();  
                            }
                            
                            this.editPosition.rowIndex = newEditPosition;

                            if((newEditPosition >=0) && (newEditPosition<this.rowCount)){
                                console.log("show editor phase", this.editPosition.event, " at: ", newEditPosition," ",this.editPosition.rowIndex," ",scrollRowStep);
                                this.trigger('cellEdit', [newEditPosition, this.editPosition.columnIndex]);
                                //TODO:need to add a parameter to cellEdit handler 
                                //so that we do not set the value of the editor to the value in the dp, but just keep the not-yet stored value.
                            }else{
                                //edited cell is out of view
                                console.log("event = 3");
                                this.editPosition.event = 3;
                                this.scrollRowStep = scrollRowStep;
                                
                            }
                        
                        }else{
                            //normalize edit row index
                            this.editPosition.rowIndex = newEditPosition;
                        }
                    }
                }
            }
            this.$message.remove();
        }
    },
    setValue: function (value) {
        this.value = value;
        this.list.setValue(value);        
        this.trigger('change');
        return this;
    },
    changeHandler : function(e){
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    },
    clickHandler: function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },

    enable: function () {         
        this.list.enable();
        return this; 
    },

    disable: function () {
        this.list.disable();
        return this;  
    },
    template: function () {
        var html = 
            "<div id='" + this.domID + "-wrapper' style='overflow-y: scroll'>" +
                "<table class='table' id='" + this.domID + "'>"+
                    "<thead id='" + this.domID + "-header'>"+
                    "</thead>"+
                "</table>"+
            "</div>";    
        return html;
    },

    render: function () {
        var _self = this;
        var model = this.getModel();
        
        this.$el.trigger('onBeginDraw');
      

        this.$table = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
        this.$header = this.$el.find('#' + this.domID + '-header'); 
        
        this.createHeader();
        var len = this.rowCount? Math.min(this.rowCount, this.dataProvider.length): this.dataProvider.length;
        this.renderRows(0, len);
        //this.dataProvider.forEach(function (data, index) {  
            
       // });
       
        
        this.$el.trigger('onEndDraw');

        return this.$el;
    },
    setCellsWidth: function(){
        //at least one row ?
        if(this.cells.length>0){
            var definedWidth = 0; var autoWidthColumns = [];
            for (var columnIndex=0;columnIndex<this.columns.length;columnIndex++) {
                var column = this.columns[columnIndex];
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
                this.cells[0][columnIndex].css({"width":(this.columns[columnIndex].calculatedWidth)+"px"}); 
            }
        }
    },
    renderRows:function(startIndex, endIndex) {
       
        endIndex = endIndex > this.dataProvider.length ? this.dataProvider.length: endIndex;
        startIndex = startIndex < 0 ? 0: startIndex;
        // this.rowItems = {}; we need this if we create Repeater instances via Object.assign
        
        for(var i=startIndex;i<endIndex;i++)
        {
            this.addRow(extend(false, false, this.dataProvider[i]), i + 1);
        } 
        if(this.allowNewItem && endIndex==this.dataProvider.length)
        { 
            this.addEmptyRow();
        }
    },
    addEmptyRow:function(){
        var emptyObj = this.defaultItem = createEmptyObject(this.columns, "dataField", "headerText");
        this.dataProvider.pad(emptyObj, 1);
        this.addRow(extend(false, false, this.dataProvider[i]), i + 1);
    },
    applyBindings: function(virtualIndex){
        for(var rowIndex=0;rowIndex<this.rowCount;rowIndex++){
            for(var columnIndex=0;columnIndex<this.columns.length;columnIndex++){
                for(var i=0;i<this.watchers[rowIndex][columnIndex].length;i++){
                    this.watchers[rowIndex][columnIndex][i].reset();
                }
                this.cellItemRenderers[rowIndex][columnIndex].repeaterIndex = rowIndex + virtualIndex;
                this.watchers[rowIndex][columnIndex] = this.applyItemRendererBindings(this.bindingExpressions[columnIndex], this.dataProvider[rowIndex + virtualIndex], this.cellItemRenderers[rowIndex][columnIndex]);
            }

            this.cells[rowIndex][0].prev().text(rowIndex + virtualIndex + 1);
        }
    },
    applyItemRendererBindings: function(bindings, data, el){
        var watchers = [];
        for(var bi=0;bi<bindings.length;bi++){
            (function(currentItem, bindingExp, site, site_chain){
                return (function(e) { // a closure is created
                    this["currentItem"] = currentItem;
                   // var context = extend(false, true, this, obj);
                    watchers.splicea(watchers.length, 0, BindingUtils.getValue(this, bindingExp, site, site_chain, "currentItem"));
                })();	
            })(data, bindings[bi].expression, el, [bindings[bi].property]);
        }
        return watchers;
    },
    headerClickHandler: function (e, hIndex, column) {
        if (typeof this.onheaderclick == 'function')
            this.onheaderclick.apply(this, arguments);
        alert("headerClickHandler");
            if(!e.isDefaultPrevented() && column.sortable){
                this.columnSort.call(this, hIndex, column);
            }    
    },
    columnSort:function(columnIndex, column){
        /*
        addClass() - Adds one or more classes to the selected elements
        removeClass() - Removes one or more classes from the selected elements
        toggleClass() - Toggles between adding/removing classes from the selected elements
        */
        alert("stub for columnSort :"+columnIndex);
    },

    createHeader: function () {
        var headerHtml = "<tr>";
        var hi = 0;
        if(this.rowIndex){
            headerHtml += "<th>#</th>";
        }
        headerHtml += "</tr>";
        var $header = $(headerHtml);
        var _self = this;
        var sortDirFADic = {"asc":"down", "desc":"up"};
        var colElements = new Array(this.columns.length);
        for (var columnIndex=0;columnIndex<this.columns.length;columnIndex++) {
            var column = this.columns[columnIndex] = new DataGridColumn(this.columns[columnIndex]);
            
            $th = $("<th id='head_"+hi+"'>"+column.headerText+(column.sortable ? "<span class='fa fa-caret-"+(sortDirFADic[column.sortDirection.toLowerCase()])+"'></span></a>":"")+"</th>");    
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
    cellEdit: function(e, rowIndex, columnIndex){

        if(this.editPosition!=null && this.editPosition.event==1 && (this.editPosition.rowIndex != rowIndex || this.editPosition.columnIndex != columnIndex)){
           
            var cellEditFinishedEvent = jQuery.Event("cellEditFinished");
            this.trigger(cellEditFinishedEvent, [this.editPosition.rowIndex, this.editPosition.columnIndex, true]);
            
            if (cellEditFinishedEvent.isDefaultPrevented()) {
                return;
            }
            this.editPosition.event = 1;
            this.cellItemRenderers[this.editPosition.rowIndex][this.editPosition.columnIndex].show();
        }

        if(columnIndex > this.columns.length-1)
        {
            columnIndex = 0;
            ++rowIndex;
        }else if(columnIndex < 0)
        {
            columnIndex = this.columns.length-1;
            --rowIndex;
        }
        var column = this.columns[columnIndex];
        var data;

        if(rowIndex > this.rowCount - 1){
            this.editPosition.rowIndex = rowIndex;
            this.editPosition.columnIndex = columnIndex;

            rowIndex = this.rowCount - 1;
            this.editPosition.event = this.editPosition.event==1?3:this.editPosition.event;
            
            //this.$el.scrollTop(this.prevScrollTop + this.avgRowHeight);
            var ps = this.prevScrollTop ;
            this.scroll(ps + this.avgRowHeight);
            //this.$table.css({"margin-top":(ps + this.avgRowHeight)});
           // this.$scroller.css({"margin-top": (-(this.realHeight)-(ps + this.avgRowHeight))+"px"});

            data = this.dataProvider[rowIndex+this.virtualIndex];
            
            
        }else if(rowIndex < 0){
            this.editPosition.rowIndex = rowIndex;
            this.editPosition.columnIndex = columnIndex;

            rowIndex = 0;
            this.editPosition.event = this.editPosition.event==1?3:this.editPosition.event;
            this.$el.scrollTop(this.prevScrollTop - this.avgRowHeight);
           
            //this.scroll(this.prevScrollTop - this.avgRowHeight);

            data = this.dataProvider[rowIndex+this.virtualIndex];
            
        }else{
            data = this.dataProvider[rowIndex+this.virtualIndex];
        }

        this.editPosition = {"rowIndex":rowIndex, "columnIndex":columnIndex, "column":column, "data":data, "event":1}; 
        
        this.cellItemRenderers[rowIndex][columnIndex].hide();
        var itemEditorInfo = this.cellItemEditors[columnIndex];
        var itemEditor;
        if(itemEditorInfo == undefined)
        {
            if (typeof column.itemEditor.constructor == "string") {
                column.itemEditor.constructor = eval(column.itemEditor.constructor);
            }
            column.itemEditor.props.embedded = true;
            column.itemEditor.props.label = column.headerText; 
            var props = extend(true, true, column.itemEditor.props);
            delete props["value"];
            itemEditor = new column.itemEditor.constructor(props);
            itemEditor.parent = this;
            itemEditor.parentType = 'repeater';
            itemEditor.parentForm = this.parentForm;
            itemEditor.$el.css("margin","0px");
            //itemEditor.$el.addClass("form-control-sm");
            itemEditor.$el.removeClass('form-group');
            itemEditor.$el.removeClass('form-control');
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
            itemEditor.on('keydown', function(e) { 
                    e.preventDefault();
                     
                    switch (e.keyCode) {
                        case 13: // ENTER - apply value
                            console.log("finished editing");
                            _self.trigger('cellEditFinished', [_self.editPosition.rowIndex, _self.editPosition.columnIndex, true]);
                            break;
                        case 27: // ESC - get back to old value
                            _self.trigger('cellEditFinished', [_self.editPosition.rowIndex, _self.editPosition.columnIndex, false]);
                            break;
                        case 9: // TAB - apply and move to next column on the same row 
                            //_self.trigger('cellEditFinished', [rowIndex, columnIndex, column, data, true]);
                            //TODO: Check columnIndex boundaries and pass to next row if it is 
                            //the last one, if now rows remaining pass to first row(check repeater implementation)
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
        if (column.itemEditor.props["value"]!=null && column.itemEditor.props["value"][0] == '{' && column.itemEditor.props["value"][column.itemEditor.props["value"].length - 1] == '}') 
        {
            var dataProviderField = column.itemEditor.props["value"].slice(1, -1);
            this.cellItemEditors[columnIndex]["dataProviderValueField"] = dataProviderField;
            itemEditor.setValue(data[dataProviderField]);
        }else
            itemEditor.setValue(column.itemEditor.props["value"] || data[column.dataField]);
        
        
        this.cells[rowIndex][columnIndex].append(itemEditor.render());
        itemEditor.show();
        if(itemEditorInfo != undefined)
        {
            if (typeof itemEditor['focus'] === "function") { 
                // safe to use the function
                itemEditor.focus();
            }
        }
        
      
        
    },
    cellEditFinished: function(e, rowIndex, columnIndex, applyEdit){
        //console.trace();
        console.log("cellEditFinished:", rowIndex, " ", columnIndex);
        var column = this.columns[columnIndex];
        var data = this.dataProvider[rowIndex+this.virtualIndex];
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
                    value = itemEditor.getValue();
                    if(itemEditor["labelField"] && isObject(value) && value[itemEditor.labelField]){
                        value = value[itemEditor.labelField];
                    }
                }
                //TODO:dataProviderChanged or integrate Binding ? 
                this.dataProvider[rowIndex+this.virtualIndex][column.dataField] = value;
            }
            this.editPosition.event = 2;
        }
    },
    cellItemRenderers:[[]],
    cellItemEditors:[],
    cells:[],// matrix
    editPosition:null,
    bindingExpressions:[], //array of bindings arrays (bindings for each column)
    watchers:[], //array of watchers arrays (watchers for each row for each column item renderer property binding)
     //renders a new row, adds components in stack
    addRow: function (data, index, isPreventable = false, focusOnRowAdd = true) {
        var _self = this;
        var model = this.getModel();
        
        var renderedRow = $('<tr>')
        
        var ccComponents = [];
        var buildRow = function () {
            var rowItems = {};
        
            if(_self.rowIndex){
                renderedRow.append('<th scope="row">'+index+'</th>')
            }
            var columnIndex = 0;

            var rowBindingFunctions = [], bIndex = 0;
            for (var columnIndex=0;columnIndex<_self.columns.length;columnIndex++) {
                var column = _self.columns[columnIndex];
                //column.sortInfo:{sortOrder:0, sortDirection:"ASC"},
                //column.cellStyleFunction,
                //column.cellValueFunction,
                //column.itemEditor    
                var component = column.itemRenderer;

                
                //build components properties, check bindings
                if (_self.cellItemRenderers[index-1] == undefined)
                    _self.cellItemRenderers[index-1] = [];

                var dataProviderField = column.dataField;
                component.props["label"] = "{"+dataProviderField+"}";
                //clone objects
                var tempComponent = extend(true, true, component);
                tempComponent.props.id = column.dataField;


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
                var bindings = [];
                
                if(!_self.bindingExpressions[columnIndex]){
                    for (var prop in tempComponent.props) {    
                        if (typeof prop == 'string') {
                            //check for binding
                            if (tempComponent.props[prop]!=null && tempComponent.props[prop][0] == '{' && tempComponent.props[prop][tempComponent.props[prop].length - 1] == '}') {
                                
                                var dataProviderField = tempComponent.props[prop].slice(1, -1);
                                
                                console.log(prop," dp field:", dataProviderField, " dp field value:",data[dataProviderField])
                                //cmp[columnIndex][prop] = data[dataProviderField];
                                
                                bindings.push({"expression":dataProviderField, "property":prop});
                            
                                
                                if(_self.bindings[dataProviderField]==undefined){
                                    _self.bindings[dataProviderField] = {};
                                    if(_self.bindings[dataProviderField][tempComponent.props.id]==undefined){
                                        _self.bindings[dataProviderField][tempComponent.props.id] = {"component":cmp, "property":prop, "dataProviderField":dataProviderField, "dataProviderIndex":index};
                                    }
                                }
                                
                            } //else {
                                //no binding
                              //  cmp[columnIndex][prop] = tempComponent.props[prop];
                           // }
                        }
                    }    
                    _self.bindingExpressions[columnIndex] = bindings;
                }else{
                    bindings = _self.bindingExpressions[columnIndex];
                }
                
               
                


                //construct the component
                if (typeof tempComponent.constructor == "string") {
                    tempComponent.constructor = eval(tempComponent.constructor);
                }
                var el = new tempComponent.constructor(tempComponent.props);//cmp[columnIndex]);
                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.repeaterIndex = index - 1;

                _self.cellItemRenderers[index-1][columnIndex] = el; 
                rowItems[column.dataField] = el;
                _self.rowItems[index - 1] = rowItems;
                
                if(!_self.watchers[index-1])
                    _self.watchers[index-1] = [];
                _self.watchers[index-1][columnIndex] = _self.applyItemRendererBindings(bindings, data, el);
               
                /*
                 applyBindings: function(bindings){
                    for(var bi=0;bi<bindings.length;bi++){
                        (function(currentItem, bindingExp, site, site_chain){
                            return (function(e) { // a closure is created
                                var obj = {"currentItem": currentItem};
                                var context = extend(false, true, _self, obj);
                                BindingUtils.getValue(context, bindingExp, site, site_chain, "currentItem");


                            })();	
                        })(data, bindings[bi].expression, el, [bindings[bi].property]);
                    }
                }
                */


                //
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
                    e.stopPropagation();
                    ccComponents.push(el.id);
                    console.log("creation Complete", this.id);
                    if (ccComponents.length == _self.columns.length) {
                        //trigger row add event
                        _self.$el.trigger('onRowAdd', [_self, new RepeaterEventArgs(_self.rowItems, data, index)]);
                        //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                        
                        //manage dp
                        _self.currentItem = data;

                        _self.currentIndex <= index ? _self.currentIndex = index : _self.currentIndex = _self.currentIndex;
                        

                        //skip dp if it already exist
                        var addRowFlag = false;
                        if (index > _self.dataProvider.length) {
                            _self.dataProvider.push(_self.currentItem);
                            addRowFlag = true;
                        }
                        
                        if (_self.currentIndex == Math.min(_self.rowCount, _self.dataProvider.length) && !addRowFlag) {
                            _self.trigger('creationComplete');
                        }

                        //animate
                        if (addRowFlag && focusOnRowAdd) {
                            _self.rowItems[index - 1][_self.components[0].props.id].scrollTo();
                        }         
                    
                    }
                });

                el.on('change', function (e) {
                    var currentItem = _self.dataProvider[index - 1];
                    if (tempComponent.props.value[0] == '{' && tempComponent.props.value[tempComponent.props.value.length - 1] == '}') {
                        var bindedValue = tempComponent.props.value.slice(1, -1);
                        data[bindedValue] = this.getValue();
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
    }, 
    rows:[],
    removeAllRows: function(){
        for(var i=this.rows.length;i>0;i--)
        {
            this.removeRow(i, false, false, false);
        }
        this.rows = [];
    },
    removeRow: function (index, isPreventable = false, focusOnRowDelete = true, removeFromDp = false) {
        var rowItems = {};
        var model = this.getModel();
        
        var removeRow = function () {
            //remove dp row
            var removedItem = null;
            if(removeFromDp){
                this.dataProvider.splice(index - 1, 1);
            }
            for(var i=index-1;i<this.cellItemRenderers.length;i++){
                
                this.cellItemRenderers[i].repeaterIndex -= 1;
                this.cells[i][0].prev().text(i);
            }
            //manage dp
            this.currentIndex--;
            this.currentItem = this.dataProvider[index - 1];
            if (this.currentIndex == 1 && this.allowNewItem) {
                //model.displayRemoveButton = false;
            }
            this.rows[index-1].remove();
            this.rows.splice(index - 1, 1);
            this.rowItems.splice(index - 1, 1);
            this.cells.splice(index - 1, 1);
            this.cellItemRenderers.splice(index - 1, 1);
            
            this.$el.trigger('onRowDelete', [this, new RepeaterEventArgs([], this.currentItem, index, rowItems)]);
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
  
    }    
});

//component prototype
DataGrid.type = 'datagrid';

//register dom element for this component
KxGenerator.registerDOMElement(DataGrid, 'kx-datagrid');