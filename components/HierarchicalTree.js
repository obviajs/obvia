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
        this.$treeInstance = null;
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this)
                },
                
            },
            {
                registerTo: this.$treeInstance, events: { 
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
            
        ]
    },

    afterAttach: function (e) {
        var cmp = this;
        var config = {};
        var currentNode = {
            id_node: 0
        };
       
        if(this.lazy){
          config = {
                source: {
                    url: this.dataProvider,
                    dataType: "json",
                    method: "POST",
                    data: currentNode
                },
                init: function (event, data, flag) {

                },
                lazyLoad: function (event, data) {
                    data.result = {
                        url: this.dataProvider,
                        method: "POST",
                        data: currentNode,
                    };
                },
                click: function (event, data) {
                    currentNode = {
                        id_node: data.node.key,
                    }
                }
            }
        }else{
            config = {
                source: this.dataProvider
            }
        }
        this.$treeInstance = this.$tree.fancytree(config);

        this.trigger('creationComplete');
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
        if(typeof this.onclick == 'function')
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