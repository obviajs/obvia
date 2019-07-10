/**
 * This is a Tree  Element
 *
 * Kreatx 2019
 */

//component definition
var Tree = function (_props, overrided = false) {
    //inner component data
    var _self = this;
    Object.defineProperty(this,"dataProvider",
    {
        get:function dataProvider()
        {
            return _dataProvider;
        },
        set:function dataProvider(v){
            if(_dataProvider !=v)
            {
                _dataProvider=v;
            }
        }
    });

    Object.defineProperty(this, "expandIcon", 
    {
        get: function expandIcon() 
        {
            return _expandIcon;
        },
        set: function expandIcon(v) 
        {
            if(_expandIcon != v)
            {  
                this.switchFasIcon(_expandIcon, v);
                _expandIcon = v;
            }
        }
    });

    Object.defineProperty(this, "collapseIcon", 
    {
        get: function collapseIcon() 
        {
            return _collapseIcon;
        },
        set: function collapseIcon(v) 
        {
            if(_collapseIcon != v)
            {  
                this.switchFasIcon(_collapseIcon, v);
                _collapseIcon = v;
            }
        }
    });

    this.switchFasIcon = function (oldIcon, newIcon){
        for(var cmdId in this.children){
            if(this.children[cmdId].components.length >0){
                var liClasses = this.children[cmdId].classes.slice(0);
                var ind = liClasses.indexOf(oldIcon);
                if(ind>-1){
                    liClasses.splice(ind, 1);
                    if(newIcon!=null && newIcon!=""){
                        liClasses.pushUnique(newIcon);
                    }
                }
                this.children[cmdId].classes = liClasses;
                var tree = this.children[cmdId].children[this.children[cmdId].components[0].props.id];
                tree.switchFasIcon(oldIcon, newIcon);
            }
        }
    }

    this.beforeAttach = function () {
        this.$container = this.$el;
        var cmp = this.buildTree(_dataProvider);
        this.addComponents(cmp);
    };
         
    this.clickHandler=function(e){
        //  if(_dataProvider)
        // this.$el.data('dataProvider',_dataProvider);
    };
    
    this.template = function () 
    {
        return "<ul id='" + this.domID + "'></ul>";
    };

    var _defaultParams = {
        dataProvider:[],
        labelField: "label",
        valueField: "value",
        childrenField: "children",
        expandIcon: 'fas fa-chevron-circle-right',
        collapseIcon: 'fas fa-chevron-circle-down',
        classes:["list-group"]
    };
        
    _props = extend(false, false, _defaultParams, _props);

    var _dataProvider = _props.dataProvider;
    var _expandIcon = _props.expandIcon;
    var _collapseIcon = _props.collapseIcon;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;
    var _childrenField = _props.childrenField;

    var _click = _props.click;
    var _toggleTree = function(){
        if(this.components.length>0){
            var li = this;
            var liClasses = li.classes.slice(0);
            var tree = this.children[this.components[0].props.id];
            var classes = tree.classes.slice(0);
            var ind = classes.indexOf("d-none");
            if(ind>-1){
                classes.splice(ind, 1);
                liClasses.splice(liClasses.indexOf(_expandIcon), 1);
                liClasses.pushUnique(_collapseIcon);
            }else{
                classes.pushUnique("d-none");
                liClasses.splice(liClasses.indexOf(_collapseIcon), 1);
                liClasses.pushUnique(_expandIcon);
            }
            tree.classes = classes; 
            li.classes = liClasses;
        }
    }   

    _componentLi = _component = {
        constructor: Li,
        props:{
            id: "li",
            "value": '{'+_valueField+'}',
            "label": '{'+_labelField+'}',
            "click": _toggleTree,
            classes: ["fas", "list-group-item"]
        }
    };
    
    _componentTree = _component = {
        constructor: Tree,
        props:{
            id: "tree",
            "valueField": _valueField,
            "labelField": _labelField,
            "expandIcon": _expandIcon,
            "collapseIcon": _collapseIcon,
        }
    };
   
    this.buildTree = function(dp)
    {
        var components = [];
        for(var i=0;i<dp.length;i++)
        {
            var cmpLi = extend(true,_componentLi);
            cmpLi.props.bindingDefaultContext = dp[i];
            if(dp[i][_childrenField] && dp[i][_childrenField].length>0)
            {
                var tree = extend(true, _componentTree);
                tree.props.dataProvider = dp[i][_childrenField];
                cmpLi.props.components=[tree];
                cmpLi.props.classes.push(_collapseIcon);
            }	
            components.push(cmpLi);
        }
        return components;
    }

    _props.click=function(){
        //toggleChildren
        if(typeof _click=='function')
        _click.apply(this,arguments);
        var e = arguments[0];
        if(!e.isDefaultPrevented()){
            _self.clickHandler();
        }
    };

    Parent.call(this, _props);

    
    if (overrided) {
        this.keepBase();
    }
    
};

//component prototype
Tree.prototype.ctor = 'Tree';