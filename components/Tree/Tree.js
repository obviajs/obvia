/**
 * This is a Tree  Element
 *
 * Kreatx 2019
 */

//component definition
var Tree = function (_props, overrided = false) {
    //inner component data
    let _self = this;
    let _creationFinished;
    let _oldDataProvider;
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                if(_dpWatcher){
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange", _dpMemberChanged);
                }
                _dataProvider = !ArrayEx.isArrayEx(v)?new ArrayEx(v):v;
                _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                _dpWatcher.watch(_dataProvider, "length", _dpLengthChanged);
                _dataProvider.on("propertyChange", _dpMemberChanged);
                this.removeAllChildren();
                let cmps = _self.buildTree();
                _self.addComponents(cmps);
            }
        },
        enumerable: true
    });

    let _dpWatcher;
    let _dpLengthChanged = function(e)
    {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(_creationFinished)
            _self.dataProviderChanged();
    }
    let _dpMemberChanged = function(e)
    {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(_creationFinished && ["length","guid"].indexOf(e.property)==-1)
            _self.dataProviderChanged();
    }

    this.dataProviderChanged = function () 
    {
        //add or remove rows 
        for(let i=0;i<_dataProvider.length;i++){
            if(!this.dataProvider[i][_guidField])
                this.dataProvider[i][_guidField] = StringUtils.guid();
        }
        
        let toAdd = differenceOnKeyMatch(_dataProvider, _oldDataProvider, _guidField, false, true);
        let toRemove = differenceOnKeyMatch(_oldDataProvider, _dataProvider, _guidField, false, true);
        let toRefresh = intersect(toAdd.a1_indices, toRemove.a1_indices);
        for(let i=0;i<toRemove.a1_indices.length;i++){
            //let ind = this.rowItems.length + i;
            if(toRefresh.indexOf(toRemove.a1_indices[i])==-1)
                this.removeChildAtIndex(toRemove.a1_indices[i]);
        }
        
        for(let i=0;i<toAdd.a1_indices.length;i++){
            if(toRefresh.indexOf(toAdd.a1_indices[i])==-1)
            {
                let ind = toAdd.a1_indices[i];
                let cmp = this.buildTree([this.dataProvider[ind]]);
                this.addComponent(cmp[0], ind);
            }
        }
        
        for(let i = 0; i<toRefresh.length;i++){
            let cmp = this.children[this.components[toRefresh[i]].props.id];
            cmp.refreshBindings(this.dataProvider[toRefresh[i]]);
            cmp.$el.attr(_guidField, this.dataProvider[toRefresh[i]][_guidField]);
            cmp.attr[_guidField] = this.dataProvider[toRefresh[i]][_guidField];
        }
        _oldDataProvider = acExtend(this.dataProvider);
    };
    
    Object.defineProperty(this, "selectedClasses", 
    {
        get: function selectedClasses() 
        {
            return _selectedClasses;
        },
        set: function selectedClasses(v) 
        {
            if(_selectedClasses != v)
            {  
                _selectedClasses = v;
                this.select(_selectedItem);
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
        for(let cmdId in this.children){
            if(this.children[cmdId].components.length >0){
                let li = this.children[cmdId];
                let liIcon = li.children[li.components[0].props.id];
                let liIconClasses = liIcon.classes.slice(0);
                let ind = liIconClasses.indexOf(oldIcon);
                if(ind>-1){
                    liIconClasses.splice(ind, 1);
                    if(newIcon!=null && newIcon!=""){
                        liIconClasses.pushUnique(newIcon);
                    }
                }
                liIcon.classes = liIconClasses;
                let tree = li.children[li.components[2].props.id];
                tree.switchFasIcon(oldIcon, newIcon);
            }
        }
    }

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) 
        {
            if(!e.isDefaultPrevented()){
            }
        }
        //this.components = this.buildTree();
        //this.addComponents(this.components);
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
        if(_selectedItem){
            this.select(_selectedItem);
        }
        _creationFinished = true;
    }

    let _defaultParams = {
        dataProvider:[],
        labelField: "label",
        valueField: "value",
        classesField: undefined,
        componentsField: undefined,
        liComponents: undefined,
        childrenField: "children",
        expandIcon: 'fa-chevron-circle-right',
        collapseIcon: 'fa-chevron-circle-down',
        iconField: undefined,
        selectedClasses: ["active-node"],
        selectedClassesField: undefined,
        classes: ["list-group"],
        guidField: "guid",
        
        liClasses: [],
        liClassesField: undefined,
        ulClasses: [],
        ulClassesField: undefined,
    };
        
    _props = extend(false, false, _defaultParams, _props);
    let _dataProvider;
    //let _dataProvider = _props.dataProvider;
    let _expandIcon = _props.expandIcon;
    let _collapseIcon = _props.collapseIcon;
    let _labelField = _props.labelField;
    let _liClasses = _props.liClasses;
    let _liClassesField = _props.liClassesField;
    let _ulClassesField = _props.ulClassesField;
    let _ulClasses = _props.ulClasses;
    let _valueField = _props.valueField;
    let _childrenField = _props.childrenField;
    let _componentsField = _props.componentsField;
    let _selectedClasses = _props.selectedClasses;
    let _iconField = _props.iconField;
    let _selectedClassesField = _props.selectedClassesField;
    let _guidField = _props.guidField;
    let _selectedItem = _props.selectedItem;

    let _click = _props.click;
    let _toggleTree = function (e)
    {
        let match = getMatching(this.components, "ctor.prototype.ctor", "Tree", true);
        if(match.objects.length>0 && e.target == this.children[this.components[0].props.id].$el[0]){
            let liIcon = this.children[this.components[0].props.id];
            let liIconClasses = liIcon.classes.slice(0);
            let tree = this.children[this.components[match.indices[0]].props.id];
            let classes = tree.classes.slice(0);
            let ind = classes.indexOf("d-none");
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
        let liObj = {};
        liObj[_guidField] = this.$el.attr(_guidField);
        _self.selectedItem = arrayHierarchyGetMatching(_dataProvider, _guidField, liObj[_guidField], _childrenField);
        //_self.select(liObj);
        //e.stopPropagation();
    }   
    //to unselect all call with liObj null
    this.select = function(liObj, visited){
        let cLi; var visited = visited ? visited : [];
        if(liObj && liObj[_guidField])
        {
            let match = getMatching(this.components, "props.attr."+_guidField,  liObj.guid, true);
            if(match.objects.length>0)
            {
                cLi = this.children[match.objects[0].props.id];
                let liClasses = cLi.classes.slice(0);
                let diff = _selectedClasses.difference(liClasses);
                if(diff.length>0){
                    liClasses.splicea(liClasses.length, 0, diff);
                }
                cLi.classes = liClasses;
            }
        }
        for(let cid in this.children){
            let cc = this.children[cid];
            if(cc != cLi){
                liClasses = cc.classes.slice(0);
                let diff = liClasses.difference(_selectedClasses);
                cc.classes = diff;
            } 
            if(cc.components.length>2){
                let tree = cc.children[cc.components[2].props.id];
                if (visited.indexOf(tree) < 0)
                { 
                    visited.push(tree);
                    tree.select(liObj, visited);
                }
            }
        }
        if (this["parent"] && this.parent["parent"] && this.parent["parent"].ctor == "Tree")
        {
            if (visited.indexOf(this.parent.parent) < 0)
            {
                visited.push(this.parent.parent);
                this.parent.parent.select(liObj, visited);
            }
        }
    }

    let _componentLi = {
        ctor: Li,
        props:{
            id: "li",
            "value": '{?'+_valueField+'}',
            "click": _toggleTree,
            classes: ["list-group-item"]
        }
    };
    
    let _componentTree = {
        ctor: Tree,
        props:{
            id: "tree",
            "valueField": _valueField,
            "labelField": _labelField,
            "expandIcon": _expandIcon,
            "collapseIcon": _collapseIcon,
            "selectedClasses": _selectedClasses,
            "guidField": _guidField,
            classes: this.classes
        }
    };
    
    if (_componentsField)
    {
        _componentTree.props.componentsField = _componentsField;
        _componentLi.props.components = '{?' + _componentsField + '}';
    }
    if (_liClassesField)
    { 
        _componentTree.props.liClassesField = _liClassesField;
        _componentLi.props.classes = '{?' + _liClassesField + '}';
    }        
    else if (_liClasses)
    {
        _componentTree.props.liClasses = _liClasses;
        _componentLi.props.classes = _liClasses;
    }
    
    if (_ulClassesField)
    {
        _componentTree.props.ulClassesField = _ulClassesField;
        _componentTree.props.classes = '{?' + _ulClassesField + '}';
    }
    else if (_ulClasses)
    { 
        _componentTree.props.ulClasses = _ulClasses;
        _componentTree.props.classes = _ulClasses;
    }
    
    if (_iconField)
    { 
        _componentTree.props.iconField = _iconField;
    }
    if (_selectedClassesField)
    { 
        _componentTree.props.selectedClassesField = _selectedClassesField;
        _componentTree.props.selectedClasses = '{?'+_selectedClassesField+'}';
    }
    
    let _componentIconLbl = {
        ctor: Label,
        props: {
            id: 'fa',
            labelType: LabelType.i,
            classes: ["fas", _collapseIcon]
        }
    };
    
    let _nodeIconLbl = {
        ctor: Label,
        props: {
            id: 'fa',
            labelType: LabelType.i
        }
    };
    
    let _componentLbl = {
        ctor: Label,
        props: {
            id: 'label',
            labelType: LabelType.label,
            "label": '{?'+_labelField+'}',
        }
    };

    this.buildTree = function(dp)
    {
        var dp = dp || _dataProvider;
        let components = [];
        if(dp && dp.forEach)
        {
            console.log("buildTree: ", dp[_guidField]);
            if(dp.length>0)
            {
                for(let i=0;i<dp.length;i++)
                {
                    if(!dp[i][_guidField])
                    dp[i][_guidField] = StringUtils.guid();
                    let cmpLi = extend(true, _componentLi);
                    cmpLi.props.bindingDefaultContext = dp[i];
                    cmpLi.props.id = "li";
                    cmpLi.props.attr = {};
                    cmpLi.props.attr[_guidField] = dp[i][_guidField];
                    let cmps = [];
                    if (dp[i][_childrenField] && dp[i][_childrenField].length > 0)
                    {
                        let tree = extend(true, _componentTree);
                        if (_collapseIcon || _expandIcon)
                        { 
                            let cmpIcon = extend(true, _componentIconLbl);
                            cmps.push(cmpIcon);
                        }
                        let cmpLbl = extend(true, _componentLbl);
                        cmpLbl.props.bindingDefaultContext = dp[i];
                        cmps.push(cmpLbl);
                        tree.props.dataProvider = dp[i][_childrenField];
                        cmps.push(tree);
                        cmpLi.props.components = cmps;
                    } else
                    { 
                        if (_iconField)
                        {
                            
                            let cmpIcon = extend(true, _nodeIconLbl);
                            cmpIcon.props.bindingDefaultContext = dp[i];
                            cmpIcon.props.classes = '{?' + _iconField + '}';
                            cmps.push(cmpIcon);
                        }
                        if ((_componentLbl || _iconField) && !_componentsField) {
                            let cmpLbl = extend(true, _componentLbl);
                            cmpLbl.props.bindingDefaultContext = dp[i];
                            cmps.push(cmpLbl);
                            cmpLi.props.components = cmps;
                        } else if (_componentsField) { 
                            cmps.splicea(cmps.length, 0, dp[i][_componentsField]);
                            cmpLi.props.components = cmps;
                        } else
                            cmpLi.props.label = '{?' + _labelField + '}';
                    }	
                    components.push(cmpLi);
                }
            }else{
                _creationFinished = true;
            }
            _oldDataProvider = acExtend(_dataProvider);
        }
        return components;
    }

    _props.click=function(){
        //toggleChildren
        if(typeof _click=='function')
        _click.apply(this,arguments);
        let e = arguments[0];
        if(!e.isDefaultPrevented()){
            _self.clickHandler();
        }
    };
    
    if (_selectedClassesField)
    { 
        _props.selectedClasses = '{?'+_selectedClassesField+'}';
    }
    
    let r = Parent.call(this, _props);

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
        },
        enumerable: true
    });
    let _rPromise;
    this.renderPromise = function () 
    {  
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function(e){
                if (e.target.id == _self.domID) 
                {       
                    resolve(r); 
                }
            });                   
        });
        if(_props.dataProvider)
            this.dataProvider = _props.dataProvider;
        return _rPromise;
    };
    return r;
};

//component prototype
Tree.prototype.ctor = 'Tree';