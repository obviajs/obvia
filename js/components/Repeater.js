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
            currentIndex: 1,
            currentItem: {},
            map: {}
        }
    },

    beforeAttach: function () {
        this.$el.trigger('onBeginDraw');
    },

    genRandomId: function(){
        return Math.random().toString(36).substring(12);
    },

    afterAttach: function () {
        var _self = this;
        var model = this.getModel();
        var container = this.$el.find('#' + this.id + '-container');
   
        //handle row add click
        $('#add_' + this.id).on('click', function () {
            //add dataProvider Row
<<<<<<< HEAD
            model.currentItem = _self.defaultItem;
            _self.dataProvider.items.push(model.currentItem);  
            _self.addRow(model.currentItem, ++model.currentIndex, container);    
=======
            model.currentItem = _self.dataProvider.defaultItem;
            _self.dataProvider.items.push(model.currentItem); 
            model.map[++model.currentIndex] = _self.genRandomId();
            _self.addRow(model.currentItem, model.currentIndex, model.map[model.currentIndex], container);    
>>>>>>> 197133f73730ed95d16382793bfd718d72c4360a
        });

        //handle row add delete
        $('#remove_' + this.id).on('click', function () {
            _self.removeRow(model.currentIndex, model.map[model.currentIndex], container);
            model.currentItem = _self.dataProvider.items[--model.currentIndex];
        });
    },

    //renders a new row, adds components in stack
    addRow: function (data, index, hash, container) {
        var rowItems = [];
        var _self = this;
        container.append('<div id="' + this.id + '-repeated-block-' + hash + '" class="col-md-12"></div><hr id="' + this.id + '-repeated-block-hr-' + hash + '">');

        this.components.forEach(function (component) {
            //clone objects
            var tempComponent = Object.assign({}, component);
            var p = Object.assign({}, tempComponent.props);
            
            //build components properties, check bindings
            if (_self[p.id] == undefined)
                _self[p.id] = [];
            var cmp = _self[p.id];
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
            cmp[index - 1] = el;
            rowItems.push(el);
        
            //handle component change event and delegate it to repeater
            el.$el.on('onchange', function (e, sender) {
                var currentItem = _self.dataProvider.items[index - 1];
                if (tempComponent.props.value[0] == '{' && tempComponent.props.value[tempComponent.props.value.length - 1] == '}') {
                    var bindedValue = tempComponent.props.value.slice(1, -1);
                    data[bindedValue] = sender.getValue();
                }

            });

            //render component
            container.find("#" + _self.id + "-repeated-block-" + hash)
                .append(el.render());
        });

        //this.$el.trigger('onRowAdd', );

        return { items: rowItems }; 
    },

    removeRow: function (index, hash, container) {
        var _self = this;
        container.find('#' + this.id + '-repeated-block-' + hash).remove();
        container.find('#' + this.id + '-repeated-block-hr-' + hash).remove();

        //remove dp row
        this.dataProvider.items.splice(index - 1, 1);

        //delete component instances on that row
        this.components.forEach(function (component) {
            _self[component.props.id].splice(index - 1, 1);
        });

        this.$el.trigger('onRowDelete');
        return null;
    },

    template: function () {
        return  "<div id='" + this.id + "'>" +
                    "<div id='" + this.id + "-container'></div>" +  
                    "<div id='actions_" + this.id  + "' class='col-md-offset-10 col-lg-2'>" +
                        "<button type='button' class='btn btn-default' id='add_" + this.id  + "'>" +
                            "<span class='glyphicon glyphicon-plus'></span>" +
                        "</button>" +
                        "<button style='margin-left: 5px' type='button' class='btn btn-danger' id='remove_" + this.id + "'>" +
                            "<span class='glyphicon glyphicon-remove'></span>" + 
                        "</button>" +
                    "</div>";
                "</div>";
    },

    render: function () {
        var _self = this;
        var model = this.getModel();
        
        var container = this.$el.find('#' + this.id + '-container'); 
        var dp = this.dataProvider.items;

        dp.forEach(function (data, index) {  
            model.currentIndex = index + 1;
            model.currentItem = data;
            model.map[model.currentIndex] = _self.genRandomId();
            _self.addRow(data, model.currentIndex, model.map[model.currentIndex], container);
        });
       
        this.$el.trigger('onEndDraw');

        return this.$el;
    }
});

//component prototype
Repeater.type = 'repeater';

