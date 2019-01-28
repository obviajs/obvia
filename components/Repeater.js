/**
 * This is an Repeater Element
 * 
 * Kreatx 2018
 */

//component definition
var Repeater = function(_props)
{
    this.currentIndex = 1;
    this.currentItem = {};
    this.rowItems = [];
    this.dataProviderKeys = [];

    this.initModel = function () 
    {
        console.log("Init Model func thirret sa here krijoet nje repeater i ri")
        if(this.defaultItem!=undefined && this.defaultItem!=null){
            this.dataProviderKeys = Object.keys(this.defaultItem);
        }else if(this.dataProvider.length>0){
            this.dataProviderKeys = Object.keys(this.dataProvider[0]);
            this.defaultItem = this.buildDefaultItem(this.dataProvider);
        }

        return {
            displayAddButton: _rendering.actions,
            displayRemoveButton: _rendering.actions
        }
    };

    this.buildDefaultItem = function (dp) {
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
        console.log("Default Item is created here",dI)
        return dI;
    };



    

    this.containerKeyDown = function(e)
    {
        if (typeof this.keydown == 'function')
            this.keydown.apply(this, arguments);
            console.log("containerKeyDown")
    
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
            //             this.focusComponent(++this.focusedRow, this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //         case 39: // 
            //             console.log("Repeater Right Arrow");
            //             this.focusComponent(this.focusedRow, ++this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //         case 38: // 
            //             console.log("Repeater Up Arrow");
            //             this.focusComponent(--this.focusedRow, this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //         case 37: // 
            //             console.log("Repeater Left Arrow");
            //             this.focusComponent(this.focusedRow, --this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //     }
            // }
    }; 

    this.focusedRow = 0;
    this.focusedComponent = 0;

    this.focusComponent = function(rowIndex, cIndex)
    {
        console.log("focus Component function")
        console.log("focus component param")
        console.log(rowIndex) // 0
        console.log(cIndex) // 0
       
        if(rowIndex>this.dataProvider.length-1)
        {
            rowIndex = 0;
        }else if(rowIndex<0)
        {
            rowIndex = this.dataProvider.length-1;
        }
        if(!isNaN(cIndex))
        {
            if(cIndex > Object.keys(this.rowItems[rowIndex]).length-1)
            {
                cIndex = 0;
                ++rowIndex;
            }else if(cIndex < 0)
            {
                cIndex = Object.keys(this.rowItems[rowIndex]).length-1;
                --rowIndex;
            }
            if(rowIndex>this.dataProvider.length-1)
            {
                rowIndex = 0;
            }else if(rowIndex<0)
            {
                rowIndex = this.dataProvider.length-1;
            }
            cIndex = Object.keys(this.rowItems[rowIndex])[cIndex];
        }
        
        if(typeof this.rowItems[rowIndex][cIndex].$el['focus'] === "function") { 
       
            this.rowItems[rowIndex][cIndex].$el.focus();
        }
    };
   
    // validate: function () {
    //     var _self = this;
    //     var valid = true;
    //     this.errorList = [];
    //     console.log("_self",_self)
    //     this.components.forEach(function (component) {
    //         _self[component.props.id].forEach(function (instance) {
    //             if (!instance.validate()) {
    //                 _self.errorList = _self.errorList.concat(instance.errorList)
    //                 valid = false;
    //             }
    //         });
    //     });

    //     return valid;
    // },



    
    //handle row add click
    var _addRowHandler = function () 
    {
        this.addRow(this.defaultItem, this.currentIndex + 1, true)
    };

    this.bindings = {};
    
    this.dataProviderChanged = function (arrFields) 
    {
        console.log("dataProviderChanged thirret saapo krijohet nje el repeater")
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
    };

    this.getValue = function () 
    {
        var value = {};
        this.components.forEach(function (components) {
            value[components.props.id] = [];
            this[components.props.id].forEach(function (component, index) {
                value[components.props.id].push(this[components.props.id][index].getValue());
            }.bind(this));
        }.bind(this));

        return value;
    };

    //renders a new row, adds components in stack
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) 
    {
        console.log("addRow func")
        var _self = this;
        index = index || this.rows.length+1;
        /* model check
        var model = this.getModel();
        */
        //row col-sm-12
        var renderedRow = $('<div>').addClass('');
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
                
                var bindings = [];
                for (var prop in p) {
                    if (typeof prop == 'string') {
                        //check for binding
                        if (p[prop] && p[prop][0] == '{' && p[prop][p[prop].length - 1] == '}') {
                            var dataProviderField = p[prop].slice(1, -1);
                            bindings.push({"expression":dataProviderField, "property":prop});
                            
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

                if(!_self.watchers[index-1])
                    _self.watchers[index-1] = [];
                _self.watchers[index-1][cmpId] = _self.applyItemRendererBindings(bindings, data, el);


                //handle component change event and delegate it to repeater
                el.on('creationComplete', (function (ci) { 
                    return (function(e) { // a closure is created
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        ccComponents.push(el.id);
                        
                        if (ccComponents.length == _self.components.length) {
                            //trigger row add event
                            _self.$el.trigger('onRowAdd', [_self, new RepeaterEventArgs(_self.rowItems, data, ci)]);
                            //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                            
                            //manage dp
                            _self.currentItem = data;

                            _self.currentIndex <= ci ? _self.currentIndex = ci : _self.currentIndex = _self.currentIndex;
                            /* model check
                            if (_self.currentIndex > 1 && _self.rendering.actions) {
                                model.displayRemoveButton = true;
                            }
                            if (_self.currentIndex == 1) {
                                model.displayRemoveButton = false;
                            }*/

                            //skip dp if it already exist
                            var addRowFlag = false;
                            if (ci > _self.dataProvider.length) {
                                _self.dataProvider.push(_self.currentItem);
                                addRowFlag = true;
                            }
                            
                            if (_self.currentIndex == _self.dataProvider.length && !addRowFlag) {
                                _self.trigger('creationComplete');
                                _self.focusComponent(0, 0);
                            }

                            //animate
                            if (addRowFlag && focusOnRowAdd) {
                                _self.rowItems[_self.rowItems.length - 1][_self.components[0].props.id].scrollTo();
                            }         
                        
                        }
                    });	
                })(index));


                if (_rendering.direction == 'horizontal') {
                   // el.$el.addClass('float-left');
                }
                el.on('focus', function (e, repeaterEventArgs) {
                    _self.focusedRow = repeaterEventArgs.currentIndex;
                    _self.focusedComponent = Object.keys(repeaterEventArgs.currentRow).indexOf(this.id);
                    console.log("focused repeated component", _self.focusedRow , _self.focusedComponent);
                });
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
           /*_self.$container
                .append(
                    $('<div>')
                        .addClass("repeated-block")
                        .css((_self.rendering.direction == 'horizontal' ? {display: 'inline-block'} : {}))
                        .append((_self.rendering.seperator && (index > 1) ? '<hr id="repeated-block-hr">' : ''))
                        .append(renderedRow)
                );   
               */
            renderedRow
              .addClass("repeated-block")
              .css((_rendering.direction == 'horizontal' ? {display: 'inline-block'} : {}))
              .append((_rendering.seperator && (index > 1) && (index < _self.dataProvider.length-1) ? '<hr id="repeated-block-hr">' : ''));            
           
            if(_self.mode =="append")
            {
                if(_self.rows.length>0)
                {
                    _self.rows[_self.rows.length-1].after(renderedRow);
                }
                else
                    _self.$container.prepend(renderedRow);
            }else{
                _self.$container.prepend(renderedRow);
            }
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
                return buildRow();
            } else {
                //the event default is canceled outside
                return false;
            }

        } else {
            //the before add event is not preventable so buildRow anyway
            return buildRow();    
        }
        
    };

    this.applyItemRendererBindings = function(bindings, data, el)
    {
        var watchers = [];
        for(var bi=0;bi<bindings.length;bi++){
            (function(currentItem, bindingExp, site, site_chain){
                return (function(e) { // a closure is created
                    //this here refers to window context
                    var defaultBindTo = "currentItem_"+el.guid;
                    this[defaultBindTo] = currentItem;
                   // var context = extend(false, true, this, obj);
                    watchers.splicea(watchers.length, 0, BindingUtils.getValue(this, bindingExp, site, site_chain, defaultBindTo));
                })();	
            })(data, bindings[bi].expression, el, [bindings[bi].property]);
        }
        return watchers;
    };

    //handle row delete click, nese i shtojme te register events remove dhe add kemi mundesine te heqim/shtojme ne cdo index
    //remove dhe add duhet te modifikojne dhe dataProvider - splice
    var _removeRowHandler = function () 
    {
        this.removeRow(this.currentIndex, true);
        console.log("removerowHandler")
    };
    this.watchers = [];
    this.rows = [];
    this.mode = "append"; //TODO: prepend will add rows to the beginning, but if we are about to iterate the rows or use rowIndex we need to take this into consideration (using reverse of array is the easiest solution)
    this.removeAllRows = function()
    {
        for(var i=this.rows.length;i>0;i--)
        {
            this.removeRow(i, false, false);
        }
        this.rows = [];
    };

    this.removeRow = function (index, isPreventable = false, focusOnRowDelete = true) 
    {
        var rowItems = {};
        /* model check
        var model = this.getModel();
        */

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
            /* model check
            if (this.currentIndex == 1 && _rendering.actions) {
                model.displayRemoveButton = false;
            }*/

            this.$el.trigger('onRowDelete', [this, new RepeaterEventArgs([], this.currentItem, index, rowItems)]);
            this.rowItems.splice(index - 1, 1);
            this.rows.splice(index - 1, 1);
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
  
    };

    Object.defineProperty(this, "label", 
    {
        get: function label() 
        {
            return _label;
        },
        set: function label(v) 
        {
            if(_label != v)
            {
                _label = v;
                if(this.$label)
                    this.$label.html(v);
            }
        }
    });

    this.template = function () 
    {
        return "<div id='" + this.domID + "' class='"+(this.colspan?"col-sm-" + this.colspan:"")+ " form-group resizable'>" +
    (!_embedded?("<label id='" + this.domID + "_label'>"+_label+"</label>"):"") +    
                    "<div id='" + this.domID + "_container'></div>" +  
    (_rendering.actions?("<div id='actions_" + this.domID  + "' class='col-sm-offset-10 col-sm-2 px-0 float-right' style='overflow:hidden;'>" +
                        "<button id='" + this.domID  + "_btnAddRow' type='button' class='float-right btn btn-sm btn-secondary'>" +
                            "<i class='fas fa-plus'></i> Add" +
                        "</button>" +
                        "<button id='" + this.domID  + "_btnRemoveRow' type='button' class='mx-1 float-right btn btn-sm btn-danger'>" +
                            "<i class='fas fa-minus'></i> Remove" + 
                        "</button>" +
                    "</div>"):"");
                "</div>";
    };
    this.userCanManageItems = true;

    var _defaultParams = {
        rendering: {
			direction: 'vertical',
			seperator: true,
			actions: false
        },
        dataProvider:[],
        embedded:true
    };
    _props = extend(false, false, _defaultParams, _props);
    var _dataProvider = _props.dataProvider;
    var _rendering = _props.rendering;
    var _label = _props.label;
    var _embedded = _props.embedded;
    this.components = _props.components;

    Component.call(this, _props, true);
    var base = this.base;
    // this.initModel();
/*
    var click =  props.click;
    _props.click = function(e)
    {
        if (typeof _click == 'function')
            _click.apply(this, arguments);

        alert("overrided")
    };*/

    this.render = function () 
    {
        var _self = this;

        var parent = this.$el.parent();
       // if(parent.length>0)
       //     this.$el.remove();
        this.$el.trigger('onBeginDraw');

        this.$container = this.$container || this.$el.find('#' + this.domID + '_container'); 
        this.$btnAddRow = this.$btnAddRow || this.$el.find('#' + this.domID+'_btnAddRow');
        this.$btnRemoveRow = this.$btnRemoveRow || this.$el.find('#' + this.domID);
        this.$label = this.$label || this.$el.find('#'+this.domID+'_label'+'_btnRemoveRow');

        this.$container.empty();
        this.rows = [];
        this.focusedRow = 0,
        this.focusedComponent = 0;

        // this.rowItems = {}; we need this if we create Repeater instances via Object.assign
        this.dataProvider.forEach(function (data, index) {  
            _self.addRow(data, index + 1);
        });
       
        this.$el.trigger('onEndDraw');
     //   if(parent.length>0)
     //       parent.append(this.$el);
        return this.$el;
    };

    this.registerEvents = function () 
    {
        console.log("register events is called every time that a repeater is created")
        return ([].concat((_rendering.actions ? 
        [
            {
                registerTo: this.$btnRemoveRow, events: { 
                    'click': _removeRowHandler.bind(this)
                }
            },
            {
                registerTo: this.$btnAddRow, events: { 
                    'click': _addRowHandler.bind(this)
                }
            }
        ]:[
            {
                registerTo: this.$container, events: {
                    'keydown': this.containerKeyDown.bind(this)
                }
            }
        ])));        
    };
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                _dataProvider = v;
            }
        }
    });
    Object.defineProperty(this, "enabled", 
    {
        get: function enabled() 
        {
            return _enabled;
        },
        set: function enabled(v) 
        {
            if(_enabled != v)
            {
                _enabled = v;
                var _self = this;
                /* model check
                var model = this.getModel();
                if (_rendering.actions) {
                    model.displayAddButton = false;
                    model.displayRemoveButton = false;
                }*/

                for (var i = 0; i < this.dataProvider.length; i++)
                {
                    this.components.forEach(function (component) {
                        _self[component.props.id][i].enabled = v;
                    });
                }

            }
        }
    });
};
Repeater.type = 'repeater';