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

    initModel: function () {
        return {
            displayAddButton: this.rendering.actions,
            displayRemoveButton: this.rendering.actions
        }
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

    //renders a new row, adds components in stack
    addRow: function (data, index, isPreventable = false) {
        var _self = this;
        var model = this.getModel();

        var renderedRow = $('<div ' + (_self.rendering.direction == 'vertical' ? "class='col-md-12'" : "") + '>')
        
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
                        if (p[prop][0] == '{' && p[prop][p[prop].length - 1] == '}') {
                            cmp[index - 1][prop] = data[p[prop].slice(1, -1)];
                        } else {
                            //no binding
                            cmp[index - 1][prop] = p[prop];
                        }
                    }
                }

                //construct the component
                var el = new tempComponent.constructor(cmp[index - 1]);
                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.repeaterIndex = index - 1;

                cmp[index - 1] = el;
                rowItems[cmpId] = el;
                _self.rowItems[index - 1] = rowItems;

                //handle component change event and delegate it to repeater
                el.on('creationComplete', function(e){  
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    
                    ccComponents.push(el.id);
                    var ax = -1;
                    while ((ax = ccComponents.indexOf(this.id)) !== -1) 
                        ccComponents.splice(ax, 1);
                    
                    if(ccComponents.length==0 && vcolIndex==(_self.components.length-1)){
                        //trigger row add event
                        _self.$el.trigger('onRowAdd', [_self, new RepeaterEventArgs(_self.rowItems, data, index)]);
                        //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                        
                        //manage dp
                        _self.currentItem = _self.defaultItem;
                        _self.currentIndex = index;
                        if (_self.currentIndex > 1 && _self.rendering.actions) {
                            model.displayRemoveButton = true;
                        }

                        //skip dp if it already exist
                        var addRowFlag = false;
                        if (index > _self.dataProvider.length) {
                            _self.dataProvider.push(_self.currentItem);
                            addRowFlag = true;
                        }
                        
                        
                        if(index == _self.dataProvider.length && !addRowFlag)
                            _self.trigger('creationComplete');
                    
                    }
                });

                el.on('change', function (e) {
                    console.log(this.value)
                    var currentItem = _self.dataProvider[index - 1];
                    if (tempComponent.props.value[0] == '{' && tempComponent.props.value[tempComponent.props.value.length - 1] == '}') {
                        var bindedValue = tempComponent.props.value.slice(1, -1);
                        data[bindedValue] = this.getValue();
                    }

                    _self.$el.trigger('onRowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                });

                // el.on('click', function (e, sender) {
                //     console.log('click event outside (in repeater) with value: ', sender.getValue());
                // });

                //render component in row
                renderedRow.append(el.render());
                    
            });   

            //render row in dom
            _self.$container  
                .append('<div id="' + _self.domID + '-repeated-block-' + index + '" ' + (_self.rendering.direction == 'vertical' ? "class='row'": "") + '></div>')
                .find("#" + _self.domID + "-repeated-block-" + index)
                .append((_self.rendering.seperator ? '<hr id="' + _self.domID + '-repeated-block-hr-' + index + '">' : ''))  
                .append(renderedRow);
                
       
            
            return rowItems;
        }

        //trigger before row add event
        if (isPreventable) {
            //the before add event is preventable
            var beforeRowAddEvent = jQuery.Event("onBeforeRowAdd");
            this.$el.trigger(beforeRowAddEvent, [this, new RepeaterEventArgs([], data, index)]);

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

    removeRow: function (index, isPreventable = false) {
        var _self = this;
        var rowItems = {};
        var model = this.getModel();
        

        var removeRow = function () {
            _self.$container.find('#' + _self.domID + '-repeated-block-' + index).remove();
            _self.$container.find('#' + _self.domID + '-repeated-block-hr-' + index).remove();

            //remove dp row
            var removedItem = _self.dataProvider.splice(index - 1, 1);

            //delete component instances on that row
            _self.components.forEach(function (component) {
                rowItems[component.props.id] = [_self[component.props.id][index - 1]];
                _self[component.props.id].splice(index - 1, 1);
            });

            //manage dp
            _self.currentIndex--;
            _self.currentItem = _self.dataProvider[_self.dataProvider.length - 1];
            if (_self.currentIndex == 1 && _self.rendering.actions) {
                model.displayRemoveButton = false;
            }

            _self.$el.trigger('onRowDelete', [_self, new RepeaterEventArgs([], _self.currentItem, index, rowItems)]);
            delete _self.rowItems[index - 1];

            return removedItem;
        }

        //trigger before row delete event
        if (isPreventable) {
            //trigger before row delete event
            var beforeRowDeleteEvent = jQuery.Event("onBeforeRowDelete");
            this.$el.trigger(beforeRowDeleteEvent, [_self, new RepeaterEventArgs(rowItems, model.currentItem, index)]);

            if (!beforeRowDeleteEvent.isDefaultPrevented()) {
                return removeRow();
            } else {
                return false;
            }
        } else {
            return removeRow();
        }
  
    },

    enable: function () {
        var _self = this;
        var model = this.getModel();
        
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
        return "<div id='" + this.domID + "-wrapper'>" +
                    "<div id='" + this.domID + "-container' class='col-md-12'></div>" +  
                    "<div id='actions_" + this.domID  + "' class='col-md-offset-10 col-lg-2' style='overflow:hidden;'>" +
                        "<button id='btnAddRow_" + this.domID  + "' type='button' class='btn btn-default' rv-if='model.displayAddButton'>" +
                            "<span class='glyphicon glyphicon-plus'></span>" +
                        "</button>" +
                        "<button id='btnRemoveRow_" + this.domID  + "' style='margin-left: 5px' type='button' class='btn btn-danger' rv-if='model.displayRemoveButton'>" +
                            "<span class='glyphicon glyphicon-remove'></span>" + 
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