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
        this.treeInstance = null;
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this)
                },
                
            }        
        ]
    },

    afterAttach: function (e) {
        var _self = this;
        var cmp = this;
        var config = {};
        var currentNode = {
            id_node: 0
        };
       
        if(this.lazy){
            config = {
                extensions: this.extensions || [],
                source: {
                    url: this.dataProvider,
                    dataType: "json",
                    method: "POST",
                    data: currentNode
                },
                init: function (event, data, flag) {

                },
                renderNode: function (event, data) {
                    if (typeof this.renderNode == "function") {
                        this.renderNode(event, data);
                    }
                }.bind(this),
                lazyLoad: function (event, data) {
                    data.result = {
                        url: this.dataProvider,
                        method: "POST",
                        data: currentNode,
                    };
                }.bind(this),
                click: function (event, data) {
                    currentNode = {
                        id_node: data.node.key,
                    }
                    if (typeof _self.onclick == "function") {
                        _self.onclick(event, data);
                    }
                },
                renderColumns: function (event, data) {
                    if (typeof _self.renderColumns == "function")
                        _self.renderColumns(event, data);
                }
            }
        }else{
            config = {
                source: this.dataProvider
            }
        }
        this.treeInstance = this.$tree.fancytree(config);

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

    getSelectedNode: function () {
        var node = this.$tree.fancytree("getActiveNode");
        return (node != null) ? node.key : 0;
    },

    getNodeByKey: function (key) {
        return this.$tree.fancytree("getTree").getNodeByKey(key);
    },

    expandNode: function (node) {
        this.getNodeByKey(node.key).setExpanded();
    },

    doubleClickHandler: function () {
        if (typeof this.ondblclick == 'function')
            this.ondblclick.apply(this, arguments);
    },

    template: function () {   
        if (this.extensions != undefined && this.extensions.indexOf("table") != "-1") {
             return  "<div id='" + this.domID + "-wrapper' class='col-sm-12 p-0'>" +
                            '<table id="tree-' +this.domID + '" class="table table-hover">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th> DataView  </th>' +
                                        '<th style="width:25%"> Actions </th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>' +
                                    '<tr>' +
                                        '<td> </td>' +
                                        '<td> </td>' +
                                    '</tr>' +
                                '</tbody>' +
                            '</table>' +
                    "</div>";   
        } else {
            return  "<div id='" + this.domID + "-wrapper'>" +
                        "<div id='tree-"+this.domID + "'>" +
                            "</div>" +
                        "</div>";   
        }
        
    },
    
    render: function () {
        return this.$el;
    }
    
});

//component prototype
HierarchicalTree.type = 'hierarchical_tree';

//register dom element for this component
KxGenerator.registerDOMElement(HierarchicalTree, 'kx-hierarchicaltree');