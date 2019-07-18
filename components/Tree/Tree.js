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
                var li = this.children[cmdId];
                var liIcon = li.children[li.components[0].props.id];
                var liIconClasses = liIcon.classes.slice(0);
                var ind = liIconClasses.indexOf(oldIcon);
                if(ind>-1){
                    liIconClasses.splice(ind, 1);
                    if(newIcon!=null && newIcon!=""){
                        liIconClasses.pushUnique(newIcon);
                    }
                }
                liIcon.classes = liIconClasses;
                var tree = li.children[li.components[2].props.id];
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

    this.afterAttach = function (e) {
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
        if(_selectedItem){
            this.select(_selectedItem);
        }
    }

    var _defaultParams = {
        dataProvider:[],
        labelField: "label",
        valueField: "value",
        childrenField: "children",
        expandIcon: 'fas fa-chevron-circle-right',
        collapseIcon: 'fas fa-chevron-circle-down',
        selectedClasses: ["active-node"],
        classes:["list-group"],
        guidField:"guid"
    };
        
    _props = extend(false, false, _defaultParams, _props);

    var _dataProvider = _props.dataProvider;
    var _expandIcon = _props.expandIcon;
    var _collapseIcon = _props.collapseIcon;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;
    var _childrenField = _props.childrenField;
    var _selectedClasses = _props.selectedClasses;
    var _guidField = _props.guidField;
    var _selectedItem = _props.selectedItem;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;

    var _click = _props.click;
    var _toggleTree = function(e){
        if(this.components.length>0 && e.target == this.children[this.components[0].props.id].$el[0]){
            var liIcon = this.children[this.components[0].props.id];
            var liIconClasses = liIcon.classes.slice(0);
            var tree = this.children[this.components[2].props.id];
            var classes = tree.classes.slice(0);
            var ind = classes.indexOf("d-none");
            if(ind>-1){
                classes.splice(ind, 1);
                liIconClasses.splice(liIconClasses.indexOf(_expandIcon), 1);
                liIconClasses.pushUnique(_collapseIcon);
            }else{
                classes.pushUnique("d-none");
                liIconClasses.splice(liIconClasses.indexOf(_collapseIcon), 1);
                liIconClasses.pushUnique(_expandIcon);
            }
            tree.classes = classes; 
            liIcon.classes = liIconClasses;
        }
        var liObj = {};
        liObj[_guidField] = this.id.split("_")[1];
        _self.selectedItem = arrayHierarchyGetMatching(_dataProvider, _guidField, liObj[_guidField], _childrenField);
        //_self.select(liObj);
        e.stopPropagation();
    }   
    //to unselect all call with liObj null
    this.select = function(liObj, visited){
        var cLi;
        if(liObj && liObj[_guidField])
        {
            cLi = this.children["id_"+liObj.guid];
            if(cLi)
            {
                var liClasses = cLi.classes.slice(0);
                var diff = _selectedClasses.difference(liClasses);
                if(diff.length>0){
                    liClasses.splicea(liClasses.length, 0, diff);
                }
                cLi.classes = liClasses;
            }
        }
        for(var cid in this.children){
            var cc = this.children[cid];
            if(cc != cLi){
                liClasses = cc.classes.slice(0);
                var diff = liClasses.difference(_selectedClasses);
                cc.classes = diff;
            } 
            if(cc.components.length>0){
                var tree = cc.children[cc.components[2].props.id];
                if(tree!=visited)
                    tree.select(liObj);
            }
        }
        if(this["parent"] && this.parent["parent"]){
            this.parent.parent.select(liObj, this);
        }
    }

    var _componentLi = {
        constructor: Li,
        props:{
            id: "li",
            "value": '{'+_valueField+'}',
            "label": '{'+_labelField+'}',
            "click": _toggleTree,
            "classes":["list-group-item"]
        }
    };
    
    var _componentTree = {
        constructor: Tree,
        props:{
            id: "tree",
            "valueField": _valueField,
            "labelField": _labelField,
            "expandIcon": _expandIcon,
            "collapseIcon": _collapseIcon,
            "selectedClasses": _selectedClasses,
            "guidField":_guidField
        }
    };
    
    var _componentIconLbl = {
        constructor: Label,
        props: {
            id: 'fa',
            labelType: LabelType.i,
            classes: ["fas", _collapseIcon]
        }
    };

    var _componentLbl = {
        constructor: Label,
        props: {
            id: 'label',
            labelType: LabelType.label,
            "label": '{'+_labelField+'}',
        }
    };

    this.buildTree = function(dp)
    {
        var components = [];
        if(dp && dp.forEach)
        {
            for(var i=0;i<dp.length;i++)
            {
                if(!dp[i][_guidField])
                    dp[i][_guidField] = guid();
                var cmpLi = extend(true, _componentLi);
                cmpLi.props.bindingDefaultContext = dp[i];
                cmpLi.props.id = "id_"+dp[i][_guidField];
                if(dp[i][_childrenField] && dp[i][_childrenField].length>0)
                {
                    var tree = extend(true, _componentTree);
                    var cmpIcon = extend(true, _componentIconLbl);
                    var cmpLbl = extend(true, _componentLbl);
                    cmpLbl.props.bindingDefaultContext = dp[i];

                    tree.props.dataProvider = dp[i][_childrenField];
                    cmpLi.props.components = [cmpIcon, cmpLbl, tree];
                }	
                components.push(cmpLi);
            }
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
    
    Object.defineProperty(this, "selectedItem", {
        get: function selectedItem() {
            return _selectedItem;
        },
        set: function selectedItem(v) {
            if (_selectedItem!=v) {
                _selectedItem = v;
                if(!this.parent || (this.parent && this.parent.ctor !="Li"))
                    this.select(_selectedItem);
                else if(this.parent && this.parent.ctor =="Li")
                    this.parent.parent.selectedItem = _selectedItem;
            }
        }
    });
};

//component prototype
Tree.prototype.ctor = 'Tree';