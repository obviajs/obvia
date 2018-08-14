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
        this.$container = this.$el.find('#' + this.domID + '-container');
        this.multiselect = (this.multiselect!=undefined && this.multiselect!=null?this.multiselect:true);
        
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
        return "<div id='" + this.domID + "-wrapper' class='col-sm-" + this.colspan + " resizable'>" +
                    "<div id='" + this.domID + "-container' class='card' role='group' style='padding:10px'>" +
                        "<table class='table' id='" + this.domID + "-table'>"+
                            "<thead id='" + this.domID + "-header'>"+
                            "</thead>"+
                        "</table>"+
                    "</div>"+
                "</div>";
    },

    render: function () {
        var _self = this;
        var model = this.getModel();
        
        this.$el.trigger('onBeginDraw');

        this.$container = this.$el.find('#' + this.domID + '-container'); 
        this.$table = this.$el.find('#' + this.domID + '-table'); 
        this.$header = this.$el.find('#' + this.domID + '-header'); 
        
        _self.createHeader();

        // this.rowItems = {}; we need this if we create Repeater instances via Object.assign
        this.dataProvider.forEach(function (data, index) {  
            _self.addRow(data, index + 1);
        });
       
        this.$el.trigger('onEndDraw');

        return this.$el;
    },
    columnSort:function(columnIndex){
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
        for (var columnIndex=0;columnIndex<this.columns.length;columnIndex++) {
            var column = this.columns[columnIndex];
            
            $th = $("<th id='head_"+hi+"'>"+(column.sortable ? "<a href='#'>":"")+column.headerText+(column.sortable ? "<span class='fa fa-caret-down'></span></a>":"")+"</th>");    
            $th.find("a").bind('click', 
            (function(hIndex){
                return (function() { // a closure is created
                    _self.columnSort.call(_self, hIndex);
                    });	
            })(hi));

           


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
    defaultItemRenderer:{
        constructor: DataGridCellRenderer,
        props: {
            id: 'cell_',
            label: '',
            hyperlink: false,
            target:null
        }
    },
    cellItemRenders:[],
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
                if (_self["cellItemRenders"][columnIndex] == undefined)
                _self["cellItemRenders"][columnIndex] = [];

                var dataProviderField = column.dataField;

                if(column.itemRenderer == null)
                {
                    component = _self.defaultItemRenderer;        
                    //renderedRow.append('<td id=cell_'+index+'_'+columnIndex+'>'++'</td>');
                    component.props["label"] = "{"+dataProviderField+"}";
                }

                //clone objects
                var tempComponent = extend(true, true, component);
                tempComponent.props.id = column.dataField;


                var cmp = _self["cellItemRenders"][columnIndex];
                if (cmp[index - 1] == undefined)
                    cmp[index - 1] = {};

               

                /*
                cmp[index - 1]["label"] = data[dataProviderField];
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
                            cmp[index - 1][prop] = data[dataProviderField];
                            if(_self.bindings[dataProviderField]==undefined){
                                _self.bindings[dataProviderField] = {};
                                if(_self.bindings[dataProviderField][tempComponent.props.id]==undefined){
                                    _self.bindings[dataProviderField][tempComponent.props.id] = {"component":cmp, "property":prop, "dataProviderField":dataProviderField, "dataProviderIndex":index};
                                }
                            }
                            
                        } else {
                            //no binding
                            cmp[index - 1][prop] = tempComponent.props[prop];
                        }
                    }
                }    
            

                //construct the component
                if (typeof tempComponent.constructor == "string") {
                    tempComponent.constructor = eval(tempComponent.constructor);
                }
                var el = new tempComponent.constructor(cmp[index - 1]);
                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.repeaterIndex = index - 1;

                _self["cellItemRenders"][columnIndex].push(el); 
                rowItems[column.dataField] = el;
                _self.rowItems[index - 1] = rowItems;

                //handle component change event and delegate it to repeater
                el.on('creationComplete', function (e) { 
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    ccComponents.push(el.id);
                    
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

                //render component in row
                renderedRow.append($("<td></td>").append(el.render()));
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