/**
 * This is a HierarchialTree  Element
 *
 * Kreatx 2019
 */

var HierarchialTree = function(_props){
    var _self = this;
    

    var _defaultParams = {
        id:"hierarchialTree",
        dataProvider:[],
    };

    _props = extend(false,false,_defaultParams,_props);
    var _tree;

    this.beforeAttach = function(e){
        if(e.target.id == this.domID){
            this.$container = this.$el;
            fnContaierDelayInit();
            this.components = [_organisationChartComponent];
            this.addComponents();
            _tree = _self.children[_self.my("container")].children[_self.my("tree")];
            var classes = _tree.classes.slice(0);
            classes.pushUnique("tree-ul");
            _tree.classes = classes;
            e.preventDefault();
        }
    }

    var _organisationChartComponent;
    var fnContaierDelayInit = function(){
        _organisationChartComponent = {
            ctor:Container,
            props:{
                id:"container_"+_self.guid,
                type:ContainerType.NONE,
                guid:_self.guid,
                components:[
                    {
                        ctor:Tree,
                        props:{
                            id:"tree_"+_self.guid,
                            valueField:"key",
                            labelField:"title",
                            childrenField:"children",
                            listClasses: ["tree-li"],
                            classes:["tree-ul"],
                            labelClasses:["tree-li-a"],
                            ulClasses:["tree-ul"],
                            selectedClasses:"li-none",
                            expandIcon:'',
                            collapseIcon:'',
                            dataProvider:new ArrayEx()
                        }
                    }
                ]
            }
        }
        _organisationChartComponent.props.ownerDocument = _self.ownerDocument;
    }





    _props = extend(false,false,_defaultParams,_props);
    Container.call(this,_props);
}
HierarchialTree.prototype.ctor = "HierarchialTree";