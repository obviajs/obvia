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
            // currentIndex: 1,
            // currentItem: {},
            map: {}
        }
    },

    beforeAttach: function () {
        this.currentIndex = 1;
        this.currentItem = {};
        this.$el.trigger('onBeginDraw');
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

    registerEvents: function () {
        var _self = this;
        var model = this.getModel();
        var container = this.$el.find('#' + this.id + '-container');

        //handle row add click
        this.$el.find('#add_' + this.id).on('click', function () {
            //add dataProvider Row
            _self.currentItem = _self.defaultItem;
            _self.dataProvider.items.push(_self.currentItem);
            model.map[++_self.currentIndex] = _self.genRandomId();
            _self.addRow(_self.currentItem, _self.currentIndex, model.map[_self.currentIndex], container);
        });

        //handle row add delete
        this.$el.find('#remove_' + this.id).on('click', function () {
            _self.removeRow(_self.currentIndex, model.map[_self.currentIndex], container);
            _self.currentItem = _self.dataProvider.items[--_self.currentIndex];
        });

        this.$el.on('onRowEdit', function (e, repeater, args) {
           
        })
    },

    afterAttach: function () {
       
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
        
            //render component
            container.find("#" + _self.id + "-repeated-block-" + hash)
                .append(el.render());
            
            //handle component change event and delegate it to repeater
            el.$el.on('onchange', function (e, sender) {
                console.log(sender);
                var currentItem = _self.dataProvider.items[index - 1];
                if (tempComponent.props.value[0] == '{' && tempComponent.props.value[tempComponent.props.value.length - 1] == '}') {
                    var bindedValue = tempComponent.props.value.slice(1, -1);
                    data[bindedValue] = sender.getValue();
                }

                _self.$el.trigger('onRowEdit', [ _self, new RepeaterEventArgs(rowItems, data, index) ]);
            });

        });

        //trigger row add event
        this.$el.trigger('onRowAdd', [ _self, new RepeaterEventArgs(rowItems, data, index) ]);

        return { items: rowItems }; 
    },

    removeRow: function (index, hash, container) {
        var _self = this;
        var rowItems = [];
        var model = this.getModel();

        container.find('#' + this.id + '-repeated-block-' + hash).remove();
        container.find('#' + this.id + '-repeated-block-hr-' + hash).remove();

        //remove dp row
        this.dataProvider.items.splice(index - 1, 1);

        //delete component instances on that row
        this.components.forEach(function (component) {
            rowItems.push(_self[component.props.id][index - 1]);
            _self[component.props.id].splice(index - 1, 1);
        });

        this.$el.trigger('onRowDelete', [ _self, new RepeaterEventArgs(rowItems, model.currentItem, index) ]);
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
            _self.currentIndex = index + 1;
            _self.currentItem = data;
            model.map[_self.currentIndex] = _self.genRandomId();
            _self.addRow(data, _self.currentIndex, model.map[_self.currentIndex], container);
        });
       
        this.$el.trigger('onEndDraw');

        return this.$el;
    }
});

//component prototype
Repeater.type = 'repeater';

var RepeaterEventArgs = function (row, item, index) {
    this.currentRow = row;
    this.currentIndex = index;
    this.currentItem = item;    
}

//register dom element for this component
KxGenerator.registerDOMElement(Repeater, 'kx-repeater');