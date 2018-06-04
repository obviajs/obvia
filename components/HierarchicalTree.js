/**
 * This is a Hierarchical Tree  Element
 * 
 * Kreatx 2018
 */

//component definition
var HierarchicalTree = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            enabled: true
        }
    },
    
    beforeAttach: function () {
        this.$tree = this.$el.find("#tree-"+this.domID);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            
        ]
    },

    afterAttach: function (e) {
        $("#tree-"+this.domID).fancytree({
            source: this.dataProvider
            
        });
        //this.trigger('creationComplete');
    },

    enable: function () {
        var model = this.getModel();
        model.enabled = true;
        this.enabled = true;
        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;
        this.enabled = false;
        return this;
    },

    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },

    doubleClickHandler: function () {
        if (typeof this.ondblclick == 'function')
            this.ondblclick.apply(this, arguments);
    },

    template: function () {         
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<div id='tree-"+this.domID + "'>" +
                    "</div>" +
                "</div>";    
    },
    
    render: function () {
        return this.$el;
    }
    
});

//component prototype
HierarchicalTree.type = 'hierarchical_tree';

//register dom element for this component
KxGenerator.registerDOMElement(HierarchicalTree, 'kx-tree');