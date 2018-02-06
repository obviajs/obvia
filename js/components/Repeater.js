/**
 * This is an Repeater Element
 * 
 * Kreatx 2018
 */

//component definition
var Repeater = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            map: {},
    
            addRowHandler: this.addRowHandler.bind(this),
            removeRowHandler: this.removeRowHandler.bind(this),
            displayAddButton: this.rendering.actions,
            displayRemoveButton: this.rendering.actions
        }
    },

    beforeAttach: function () {
        this.currentIndex = 1;
        this.currentItem = {};
        this.rowItems = {};
    },

    genRandomId: function () {
        var model = this.getModel();
        var id = Math.floor(Math.random() * 1000000);
        for (var index in model.map) {
            if (model.map[index] == id)
                return this.genRandomId();    
        }
        
        return id;
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
        var container = this.$el.find('#' + this.id + '-container');
        var hash = this.genRandomId();

        var renderedRow = $('<div ' + (_self.rendering.direction == 'vertical' ? "class='col-md-12'" : "") + '>')
        var rowItems = {};

        var buildRow = function () {
            _self.components.forEach(function (component) {
                //clone objects
                var tempComponent = Object.assign({}, component);
                var p = Object.assign({}, tempComponent.props);

                //build components properties, check bindings
                if (_self[p.id] == undefined)
                    _self[p.id] = [];
                var cmp = _self[p.id];
                var cmpId = p.id;
                if (cmp[index - 1] == undefined)
                    cmp[index - 1] = {}

                p.id += "_" + hash;
                p.fieldName += "_" + hash;

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

                //render component in row
                renderedRow.append(el.render());

                //handle component change event and delegate it to repeater
                el.$el.on('onchange', function (e, sender) {
                    var currentItem = _self.dataProvider.items[index - 1];
                    if (tempComponent.props.value[0] == '{' && tempComponent.props.value[tempComponent.props.value.length - 1] == '}') {
                        var bindedValue = tempComponent.props.value.slice(1, -1);
                        data[bindedValue] = sender.getValue();
                    }

                    _self.$el.trigger('onRowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                });

            });

            //render row in dom
            container  
                .append('<div id="' + _self.id + '-repeated-block-' + hash + '" ' + (_self.rendering.direction == 'vertical' ? "class='row'": "") + '></div>')
                .find("#" + _self.id + "-repeated-block-" + hash)
                .append((_self.rendering.seperator ? '<hr id="' + _self.id + '-repeated-block-hr-' + hash + '">' : ''))  
                .append(renderedRow)
                
            
            //trigger row add event
            _self.$el.trigger('onRowAdd', [_self, new RepeaterEventArgs(rowItems, data, index)]);

            //manage dp
            _self.currentItem = _self.defaultItem;
            _self.currentIndex = index;
            model.map[index] = hash;
            if (_self.currentIndex > 1 && _self.rendering.actions) {
                model.displayRemoveButton = true;
            }

            //skip dp if it already exist
            if (index > _self.dataProvider.items.length) {
                _self.dataProvider.items.push(_self.currentItem);
            }
            
            _self.rowItems[index - 1] = rowItems;
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

    //handle row delete click
    removeRowHandler: function () {
        this.removeRow(this.currentIndex, true);
    },

    removeRow: function (index, isPreventable = false) {
        var _self = this;
        var rowItems = {};
        var model = this.getModel();
        hash = model.map[index];
        var container = this.$el.find('#' + this.id + '-container');

        var removeRow = function () {
            container.find('#' + _self.id + '-repeated-block-' + hash).remove();
            container.find('#' + _self.id + '-repeated-block-hr-' + hash).remove();

            //remove dp row
            var removedItem = _self.dataProvider.items.splice(index - 1, 1);

            //delete component instances on that row
            _self.components.forEach(function (component) {
                rowItems[component.props.id] = [_self[component.props.id][index - 1]];
                _self[component.props.id].splice(index - 1, 1);
            });

            //manage dp
            _self.currentIndex--;
            _self.currentItem = _self.dataProvider.items[_self.dataProvider.items.length - 1];
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
        
        for (var i = 0; i < this.dataProvider.items.length; i++) {
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

        for (var i = 0; i < this.dataProvider.items.length; i++){
            this.components.forEach(function (component) {
                _self[component.props.id][i].disable();
            });
        }

        return this;  
    },

    template: function () {
        return  "<div id='" + this.id + "'>" +
                    "<div id='" + this.id + "-container' class='col-md-12'></div>" +  
                    "<div id='actions_" + this.id  + "' class='col-md-offset-10 col-lg-2' style='overflow:hidden;'>" +
                        "<button type='button' class='btn btn-default' rv-if='displayAddButton' rv-on-click='addRowHandler'>" +
                            "<span class='glyphicon glyphicon-plus'></span>" +
                        "</button>" +
                        "<button style='margin-left: 5px' type='button' class='btn btn-danger' rv-if='displayRemoveButton' rv-on-click='removeRowHandler'>" +
                            "<span class='glyphicon glyphicon-remove'></span>" + 
                        "</button>" +
                    "</div>";
                "</div>";
    },

    render: function () {
        var _self = this;
        var model = this.getModel();
        
        this.$el.trigger('onBeginDraw');

        var container = this.$el.find('#' + this.id + '-container'); 
        //container.append("<hr>");
        
        var dp = this.dataProvider.items;

        dp.forEach(function (data, index) {  
            _self.addRow(data, index + 1);
        });
       
        this.$el.trigger('onEndDraw');

        return this.$el;
    }
});

//component prototype
Repeater.type = 'repeater';

var RepeaterEventArgs = function (row, item, index, deletedRows) {
    this.currentRow = row;
    this.currentIndex = index;
    this.currentItem = item;
    this.deletedRows = deletedRows;
}

//register dom element for this component
KxGenerator.registerDOMElement(Repeater, 'kx-repeater');