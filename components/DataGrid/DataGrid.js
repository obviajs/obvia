/**
 * This is a DataGrid component
 * 
 * Kreatx 2018
 */

//component definition
var DataGrid = KxGenerator.createComponent({
    currentIndex: 1,
    currentItem: {},
    rowItems: {},
    dataProviderKeys: [],
    rowIndex:true,

    initModel: function () {
        if(this.defaultItem!=undefined && this.defaultItem!=null){
            this.dataProviderKeys = Object.keys(this.defaultItem);
        }else if(this.dataProvider.length>0){
            this.dataProviderKeys = Object.keys(this.dataProvider[0]);
            this.defaultItem = this.buildDefaultItem(this.dataProvider);
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
                    'afterAttach': this.afterAttach.bind(this)
                }
            }
        ];
    },

    afterAttach: function (e) {

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
        return "<table class='table' id='" + this.domID + "'>"+
                    "<thead id='" + this.domID + "-header'>"+
                    "</thead>"+
                "</table>";
    },

    render: function () {
        var _self = this;
        var model = this.getModel();
        
        this.$el.trigger('onBeginDraw');
      

        this.$table = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
        this.$header = this.$el.find('#' + this.domID + '-header'); 
        
        _self.createHeader();

        // this.rowItems = {}; we need this if we create Repeater instances via Object.assign
        this.dataProvider.forEach(function (data, index) {  
            _self.addRow(data, index + 1);
        });
       
        this.$el.trigger('onEndDraw');

        return this.$el;
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
        for (var columnIndex=0;columnIndex<this.columns.length;columnIndex++) {
            var column = this.columns[columnIndex] = new DataGridColumn(this.columns[columnIndex]);
            
            $th = $("<th id='head_"+hi+"'>"+column.headerText+(column.sortable ? "<span class='fa fa-caret-"+(sortDirFADic[column.sortDirection.toLowerCase()])+"'></span></a>":"")+"</th>");    
            $th.bind('click', 
            (function(hIndex, column){
                return (function(e) { // a closure is created
                    _self.headerClickHandler.call(_self, e, hIndex, column);
                    });	
            })(hi, column));

           


            $header.append($th);
            ++hi;  
        }
        
        this.$header.append($header);
    },
    buildDefaultItem: function (dp) {
        var dI = {};
        for (var column in this.columns) {
            dI[column.dataField] = column.headerText;
        }
        return dI;
    },
    cellEdit: function(rowIndex, columnIndex, column, data){

        if(this.editPosition!=null && (this.editPosition.rowIndex != rowIndex || this.editPosition.columnIndex != columnIndex)){
            this.cellItemRenderers[this.editPosition.rowIndex][this.editPosition.columnIndex].show();
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
            itemEditor.$el.css({"outline":"none", "font-size":"14px"});

            this.cellItemEditors[columnIndex] = {"itemEditor":itemEditor, "rowIndex":rowIndex}; 

            itemEditor.on('creationComplete', function(){

                if (typeof itemEditor['focus'] === "function") { 
                    // safe to use the function
                    itemEditor.focus();
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
        itemEditor.on('blur', (function(rowIndex, columnIndex, column, data){
            return (function(e) { // a closure is created
                _self.cellEditFinished(rowIndex, columnIndex, column, data);
                });	
        })(rowIndex, columnIndex, column, data));


        itemEditor.on('keydown', (function(rowIndex, columnIndex, column, data){
            return (function(e) { // a closure is created
                e.preventDefault();
                switch (e.keyCode) {
                    case 13: // ENTER - apply value
                        console.log("finished editing");
                        _self.cellEditFinished(rowIndex, columnIndex, column, data, true);
                        break;
                    case 27: // ESC - get back to old value
                        _self.cellEditFinished(rowIndex, columnIndex, column, data, false);
                        break;
                    case 9: // TAB - apply and move to next column on the same row 
                        _self.cellEditFinished(rowIndex, columnIndex, column, data, true);
                        _self.cellEdit(rowIndex, columnIndex+1, _self.columns[columnIndex+1] , data);
                        break;
                }


                });	
        })(rowIndex, columnIndex, column, data));

        this.cells[rowIndex][columnIndex].css("width", this.cells[rowIndex][columnIndex].innerWidth()+"px")
        itemEditor.repeaterIndex = rowIndex;
        //TODO: te evitojme v
        if (column.itemEditor.props["value"]!=null && column.itemEditor.props["value"][0] == '{' && column.itemEditor.props["value"][column.itemEditor.props["value"].length - 1] == '}') 
        {
            var dataProviderField = column.itemEditor.props["value"].slice(1, -1);
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
    cellEditFinished: function(rowIndex, columnIndex, column, data, applyEdit){
        var itemEditorInfo = this.cellItemEditors[columnIndex];
        var itemEditor = itemEditorInfo.itemEditor;
        itemEditor.hide();
        this.cellItemRenderers[rowIndex][columnIndex].show();
        this.cells[rowIndex][columnIndex].css("width","");
        if(applyEdit){
            this.dataProvider[column.dataField] = itemEditor.getValue();
        }
        this.editPosition.event = 2;
    },
    cellItemRenderers:[[]],
    cellItemEditors:[],
    cells:[[]],// matrix
    editPosition:null,
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
             

                
                
                for (var prop in tempComponent.props) {    
                    if (typeof prop == 'string') {
                        //check for binding
                        if (tempComponent.props[prop]!=null && tempComponent.props[prop][0] == '{' && tempComponent.props[prop][tempComponent.props[prop].length - 1] == '}') {
                            var dataProviderField = tempComponent.props[prop].slice(1, -1);
                            console.log(prop," dp field:", dataProviderField, " dp field value:",data[dataProviderField])
                            cmp[columnIndex][prop] = data[dataProviderField];
                            if(_self.bindings[dataProviderField]==undefined){
                                _self.bindings[dataProviderField] = {};
                                if(_self.bindings[dataProviderField][tempComponent.props.id]==undefined){
                                    _self.bindings[dataProviderField][tempComponent.props.id] = {"component":cmp, "property":prop, "dataProviderField":dataProviderField, "dataProviderIndex":index};
                                }
                            }
                            
                        } else {
                            //no binding
                            cmp[columnIndex][prop] = tempComponent.props[prop];
                        }
                    }
                }    
            

                //construct the component
                if (typeof tempComponent.constructor == "string") {
                    tempComponent.constructor = eval(tempComponent.constructor);
                }
                var el = new tempComponent.constructor(cmp[columnIndex]);
                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.repeaterIndex = index - 1;

                _self.cellItemRenderers[index-1][columnIndex] = el; 
                rowItems[column.dataField] = el;
                _self.rowItems[index - 1] = rowItems;
                
                //
                if(column.editable){
                    el.on('dblclick', (function(rowIndex, columnIndex, column, data){
                        return (function(e) { // a closure is created
                            //alert(JSON.stringify(column)+" "+JSON.stringify(data)+" "+(index-1));
                            _self.cellEdit(rowIndex, columnIndex, column, data);
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
                        
                        if (_self.currentIndex == _self.dataProvider.length && !addRowFlag) {
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
                var cell = $("<td id='cell_"+(index-1)+"_"+columnIndex+"'></td>");
                if(_self.cells[index-1]== undefined)
                    _self.cells[index-1] = [];
                _self.cells[index-1][columnIndex] = cell;
                //render component in row
                renderedRow.append(cell.append(el.render()));
            }   

            //render row in dom
            _self.$table.append(renderedRow);
            
            return rowItems;
        }

        //trigger before row add event
        if (isPreventable) {
            //the before add event is preventable
            var beforeRowAddEvent = jQuery.Event("onBeforeRowAdd");
            this.trigger(beforeRowAddEvent);
         
            if (!beforeRowAddEvent.isDefaultPrevented()) {
                //the event is not canceled outside
                return buildRow();
            } else {
                //the event default is canceled outside
                return false;
            }

        } else {
            //the before add event is not preventable so buildRow anyway
            return buildRow();    
        }
    }   
});

//component prototype
DataGrid.type = 'datagrid';

//register dom element for this component
KxGenerator.registerDOMElement(DataGrid, 'kx-datagrid');