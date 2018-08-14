/**
 * This is an Repeater Element
 * 
 * Kreatx 2018
 */

//component definition
var Repeater = KxGenerator.createComponent({
    currentIndex: 1,
    currentItem: {},
    rowItems: {},
    dataProviderKeys: [],

    initModel: function () {
        if(this.defaultItem!=undefined && this.defaultItem!=null){
            this.dataProviderKeys = Object.keys(this.defaultItem);
        }else if(this.dataProvider.length>0){
            this.dataProviderKeys = Object.keys(this.dataProvider[0]);
            this.defaultItem = this.buildDefaultItem(this.dataProvider);
        }
		
		var _defaultRendering = 
		{
			direction: 'vertical',
			seperator: true,
			actions: true
		};
		
		extend(_defaultRendering, this.rendering);
        return {
            displayAddButton: this.rendering.actions,
            displayRemoveButton: this.rendering.actions
        }
    },

    buildDefaultItem: function (dp) {
        var dI = {};
        for (var key in dp[0]) {
            if (typeof dp[0][key] == "object")
                dI[key] = null;
            else if (typeof dp[0][key] == "array")
                dI[key] = [];   
            else if (typeof dp[0][key] == "boolean")
                dI[key] = false;   
            else
                dI[key] = "";
        }

        return dI;
    },

    registerEvents: function () {
        return ([].concat((this.rendering.actions ? 
        [
            {
                registerTo: this.$btnRemoveRow, events: { 
                    'click': this.removeRowHandler.bind(this)
                }
            },
            {
                registerTo: this.$btnAddRow, events: { 
                    'click': this.addRowHandler.bind(this)
                }
            }
        ]:[])));
    },

    validate: function () {
        var _self = this;
        var valid = true;
        this.errorList = [];

        this.components.forEach(function (component) {
            _self[component.props.id].forEach(function (instance) {
                if (!instance.validate()) {
                    _self.errorList = _self.errorList.concat(instance.errorList)
                    valid = false;
                }
            });
        });

        return valid;
    },

    //handle row add click
    addRowHandler: function () {
        this.addRow(this.defaultItem, this.currentIndex + 1, true)
    },

    bindings: {},
    
    dataProviderChanged: function (arrFields) {
        if (arrFields.length == 0)
            return;    
        //{"component":cmp, "property":prop, "dataProviderField":dataProviderField, "dataProviderIndex":index}
        var fieldsSpecified = (arrFields!=undefined) && (arrFields!=null) && (arrFields.length>0);
        var componentBindings = Object.keys(this.bindings);
        
        if(fieldsSpecified) { 
            componentBindings = intersect(componentBindings, arrFields);
            if(arrFields.length!=componentBindings.length){
                console.log("You have specified a field for which there is no binding - possible misstype?")
            }
        }
        
        for(var c=0; c<componentBindings.length; c++){
            var dataProviderField = componentBindings[c];
            for(var cmp in this.bindings[dataProviderField]){
                for(var i=0;i<this.dataProvider.length;i++){
                    var property = this.bindings[dataProviderField][cmp]["property"];
                    this[cmp][i][property] = this.dataProvider[i][dataProviderField];
                }
            }
        }
    },

    getValue: function () {
        var value = {};
        this.components.forEach(function (components) {
            value[components.props.id] = [];
            this[components.props.id].forEach(function (component, index) {
                value[components.props.id].push(this[components.props.id][index].getValue());
            }.bind(this));
        }.bind(this));

        return value;
    },

    //renders a new row, adds components in stack
    addRow: function (data, index, isPreventable = false, focusOnRowAdd = true) {
        var _self = this;
        var model = this.getModel();
        
        var renderedRow = $('<div>').addClass('row col-sm-12');
        
        var ccComponents = [];
        var buildRow = function () {
            var rowItems = {};
            _self.components.forEach(function (component, vcolIndex) {
                //clone objects
                var tempComponent = Object.assign({}, component);
                var p = Object.assign({}, tempComponent.props);

                //build components properties, check bindings
                if (_self[p.id] == undefined)
                    _self[p.id] = [];
                var cmp = _self[p.id];
                var cmpId = p.id;
                if (cmp[index - 1] == undefined)
                    cmp[index - 1] = {};
        
                for (var prop in p) {
                    if (typeof prop == 'string') {
                        //check for binding
                        if (p[prop] && p[prop][0] == '{' && p[prop][p[prop].length - 1] == '}') {
                            var dataProviderField = p[prop].slice(1, -1);
                            var path = dataProviderField.split(".");
                            if (path.length > 1) {
                                var dataProviderValue = data;
                                path.forEach(function (key) {
                                    dataProviderValue = dataProviderValue[key];
                                });
                                cmp[index - 1][prop] = dataProviderValue;
                            }else
                                cmp[index - 1][prop] = data[dataProviderField];
                            if(_self.bindings[dataProviderField]==undefined){
                                _self.bindings[dataProviderField] = {};
                                if(_self.bindings[dataProviderField][p.id]==undefined){
                                    _self.bindings[dataProviderField][p.id] = {"component":cmp, "property":prop, "dataProviderField":dataProviderField, "dataProviderIndex":index};
                                }
                            }
                            
                        } else {
                            //no binding
                            cmp[index - 1][prop] = p[prop];
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

                cmp[index - 1] = el;
                rowItems[cmpId] = el;
                _self.rowItems[index - 1] = rowItems;

                //handle component change event and delegate it to repeater
                el.on('creationComplete', function (e) { 
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    ccComponents.push(el.id);
                    
                    if (ccComponents.length == _self.components.length) {
                        //trigger row add event
                        _self.$el.trigger('onRowAdd', [_self, new RepeaterEventArgs(_self.rowItems, data, index)]);
                        //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                        
                        //manage dp
                        _self.currentItem = data;

                        _self.currentIndex <= index ? _self.currentIndex = index : _self.currentIndex = _self.currentIndex;
                        if (_self.currentIndex > 1 && _self.rendering.actions) {
                            model.displayRemoveButton = true;
                        }
                        if (_self.currentIndex == 1) {
                            model.displayRemoveButton = false;
                        }

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

                if (_self.rendering.direction == 'horizontal') {
                    el.$el.addClass('float-left');
                }

                el.on('change', function (e) {
                    var currentItem = _self.dataProvider[index - 1];
                    if (tempComponent.props.value[0] == '{' && tempComponent.props.value[tempComponent.props.value.length - 1] == '}') {
                        var bindedValue = tempComponent.props.value.slice(1, -1);
                        var path = bindedValue.split(".");
                        if (path.length > 1) {
                            var bindedValue = data;
                            path.forEach(function (key) {
                                bindedValue = bindedValue[key];
                            });
                        }
                        data[bindedValue] = this.getValue();
                    }

                    _self.$el.trigger('onRowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                });

                //render component in row
                renderedRow.append(el.render());
            });   

            //render row in dom
            _self.$container
                .append(
                    $('<div>')
                        .addClass("repeated-block")
                        .css((_self.rendering.direction == 'horizontal' ? {display: 'inline-block'} : {}))
                        .append((_self.rendering.seperator && (index > 1) ? '<hr id="repeated-block-hr">' : ''))
                        .append(renderedRow)
                );                   
            
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
        
    },

    //handle row delete click, nese i shtojme te register events remove dhe add kemi mundesine te heqim/shtojme ne cdo index
    //remove dhe add duhet te modifikojne dhe dataProvider - splice
    removeRowHandler: function () {
        this.removeRow(this.currentIndex, true);
    },

    removeRow: function (index, isPreventable = false, focusOnRowDelete = true) {
        var rowItems = {};
        var model = this.getModel();
        
        var removeRow = function () {
            //remove dp row
            var removedItem = this.dataProvider.splice(index - 1, 1);

            //delete component instances on that row
            this.components.forEach(function (component, cI) {  
                //remove repeated block from dom
                if (cI == 0) {
                    this[component.props.id][index - 1].$el.closest('.repeated-block').remove();
                    this[component.props.id][index - 1].$el.closest('.repeated-block-hr').remove();
                }
            
                //modify new cmp repeater indexes
                this[component.props.id].forEach(function (item, i) {
                    if (i < index)
                        return false;
                    item.repeaterIndex -= 1;
                });

                rowItems[component.props.id] = [this[component.props.id][index - 1]];
                this[component.props.id].splice(index - 1, 1);

            }.bind(this));

            //manage dp
            this.currentIndex--;
            this.currentItem = this.dataProvider[index - 1];
            if (this.currentIndex == 1 && this.rendering.actions) {
                model.displayRemoveButton = false;
            }

            this.$el.trigger('onRowDelete', [this, new RepeaterEventArgs([], this.currentItem, index, rowItems)]);
            delete this.rowItems[index - 1];

            //animate
            if (focusOnRowDelete)
                this.rowItems[index - 2][this.components[0].props.id].scrollTo();

            return removedItem;
        }

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
  
    },

    enable: function () {
        var _self = this;
        var model = this.getModel();
        this.enabled = true;
        
        if (this.rendering.actions) {
            model.displayAddButton = true;
            model.displayRemoveButton = true;
        }
        
        for (var i = 0; i < this.dataProvider.length; i++) {
            this.components.forEach(function (component) {
                _self[component.props.id][i].enable();
            });
        }

        return this; 
    },

    disable: function () {
        var _self = this;
        var model = this.getModel();
        this.enabled = false;

        if (this.rendering.actions) {
            model.displayAddButton = false;
            model.displayRemoveButton = false;
        }

        for (var i = 0; i < this.dataProvider.length; i++){
            this.components.forEach(function (component) {
                _self[component.props.id][i].disable();
            });
        }

        return this;  
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='col-sm-" + this.colspan + " form-group rowspan" + this.rowspan + " resizable'>" +
                    "<label><b>{label}</b></label>" +    
                    "<div id='" + this.domID + "-container'></div>" +  
                    "<div id='actions_" + this.domID  + "' class='col-sm-offset-10 col-sm-2 px-0 float-right' style='overflow:hidden;'>" +
                        "<button id='btnAddRow_" + this.domID  + "' type='button' class='float-right btn btn-sm btn-secondary' rv-if='model.displayAddButton'>" +
                            "<i class='fas fa-plus'></i> Add" +
                        "</button>" +
                        "<button id='btnRemoveRow_" + this.domID  + "' type='button' class='mx-1 float-right btn btn-sm btn-danger' rv-if='model.displayRemoveButton'>" +
                            "<i class='fas fa-minus'></i> Remove" + 
                        "</button>" +
                    "</div>";
                "</div>";
    },

    render: function () {
        var _self = this;
        var model = this.getModel();
        
        this.$el.trigger('onBeginDraw');

        this.$container = this.$el.find('#' + this.domID + '-container'); 
        this.$btnAddRow = this.$el.find('#btnAddRow_' + this.domID);
        this.$btnRemoveRow = this.$el.find('#btnRemoveRow_' + this.domID);
     
        // this.rowItems = {}; we need this if we create Repeater instances via Object.assign
        this.dataProvider.forEach(function (data, index) {  
            _self.addRow(data, index + 1);
        });
       
        this.$el.trigger('onEndDraw');

        return this.$el;
    }
});

//component prototype
Repeater.type = 'repeater';

//register dom element for this component
KxGenerator.registerDOMElement(Repeater, 'kx-repeater');