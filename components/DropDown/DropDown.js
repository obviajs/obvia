/**
 * This is a DropDown  Element
 *
 * Kreatx 2019
 */

//component definition
var DropDown = function (_props, overrided = false) {
    var _self = this;
    var _creationFinished;
    var _dataProvider;
    var _oldDataProvider;
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
                    _dataProvider.off("propertyChange",_dpMemberChanged);
                }
    
                _dataProvider = !ArrayEx.isArrayEx(v)?new ArrayEx(v):v;
                _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                _dpWatcher.watch(_dataProvider,"length",_dpLengthChanged);
                _dataProvider.on("propertyChange",_dpMemberChanged);
                _linkContainer.removeAllChildren();
                _linkContainer.components = _self.buildLink();
                _linkContainer.addComponents(_linkContainer.components);
            }
        }
    });
    
    Object.defineProperty(this,"selectedItem",{
        get: function selectedItem() {
    
           return _selectedItem;
        },
        set: function selectedItem(v) {
            if (_selectedItem != v) {
                _selectedItem = v;
            }  
        }
    });

    var _btnDD,_linkContainer;
    var _dpWatcher;
    var _dpLengthChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(_creationFinished)
            _self.dataProviderChanged();
    }

    var _dpMemberChanged = function(e)
    {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(_creationFinished && ["length","guid"].indexOf(e.property)==-1)
            _self.dataProviderChanged();
    }

    this.dataProviderChanged = function ()
    {
        //add or remove rows
        for(var i=0;i<_dataProvider.length;i++){
            if(!this.dataProvider[i][_guidField])
                this.dataProvider[i][_guidField] = StringUtils.guid();
        }
        var toAdd = differenceOnKeyMatch(_dataProvider,_oldDataProvider,_guidField,false,true);
        var toRemove = differenceOnKeyMatch(_oldDataProvider, _dataProvider,_guidField,false,true);
        var toRefresh = intersect(toAdd.a1_indices, toRemove.a1_indices);
        
        for(var i=toRemove.a1_indices.length;i>=0;i--) {
            if(toRefresh.indexOf(toRemove.a1_indices[i])==-1)
            this.children["divContent"].removeChildAtIndex(toRemove.a1_indices[i]);
        }
        for(var i=0;i<toAdd.a1_indices.length;i++){
            if(toRefresh.indexOf(toAdd.a1_indices[i])==-1){
                var ind = toAdd.a1_indices[i]; 
                var cmp = this.buildLink([this.dataProvider[ind]]);
                this.children["divContent"].addComponent(cmp[0],ind);
            }
        }    
        //for the rows that we just added there is no need to refreshBindings
        for(var i=0; i<toRefresh.length;i++)
        {
            var cmp = this.children["divContent"].children[this.children["divContent"].components[toRefresh[i]].props.id];
            cmp.refreshBindings(this.dataProvider[toRefresh[i]]);
            cmp.$el.attr(_guidField, this.dataProvider[toRefresh[i]][_guidField]);
            cmp.attr[_guidField] = this.dataProvider[toRefresh[i]][_guidField];
        }
        _oldDataProvider = extend(true,false,this.dataProvider);
    };

    this.afterAttach = function (e) {
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
        _creationFinished = true;
    }

    var _defaultParams = {
        id: 'dropdown',
        dataProvider: [],
        hrefField: "href",
        labelField: "label",
        keyField:"",
        value: null,
        classes:[DropMenuDirection.DROPDOWN],
        label:"",
        size:ButtonSize.SMALL,
        type:ContainerType.NONE,
        split:DropSplitType.SPLIT,  
        guidField:"guid"
    };

    var _clickHandler = function (e) 
    {
            _btnDD.label = this.label;
            var linkObj={};
            linkObj[_guidField] = this.$el.attr(_guidField);
            _self.selectedItem = getMatching(_dataProvider, _guidField, linkObj[_guidField]);
            console.log("SelectedItem",_selectedItem);
            e.stopPropagation();
    };

    _props = extend(false, false,_defaultParams, _props);

    var _dataProvider;
    var _hrefField = _props.hrefField;
    var _labelField = _props.labelField;
    var _value = _props.value;
    var _change = _props.change;
    var _label = _props.label;
    var _size = _props.size;
    var _split = _props.split;
    var _selectedItem = _props.selectedItem;
    var _beforeAttach = _props.beforeAttach;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
    var _guidField = _props.guidField;


    _props.beforeAttach = function (e) {
        this.$container = this.$el;
        _btnDD = this.addComponent(_componentButton);
        _linkContainer = this.addComponent(_componentContainer);
        _linkContainer.$el.attr('aria-labelledby', _btnDD.domID);
        this.dataProvider = _props.dataProvider;
        e.preventDefault();
    };

    var _componentContainer = {
        constructor: Container,
        props:{
            id:"divContent",
            type:ContainerType.NONE,
            classes:["dropdown-menu"],
        }
    }

    var _componentButton = {
        constructor: Button,
        props:{
            id:"button",
            classes:[_size,_split,"btn", "btn-secondary","dropdown-toggle"],
            label:_label,
            attr: { 
                "data-toggle":'dropdown',
                "aria-haspopup":"true",
                "aria-expanded":"false"
                }
        }
    }

    var _componentLink = {
        constructor:Link,
        props: {
            id:"link",
            "href":'{'+_hrefField+'}',
            "label":'{'+_labelField+'}',
            classes:['dropdown-item'],
            "click": _clickHandler,
        }
    };
  
    this.buildLink = function(dp)
    {
        var dp = dp || _dataProvider, components = [];
        if(dp && dp.forEach)
        {
            if(dp.length>0)
            {
                for(var i=0 ; i< dp.length;i++)
                {
                    if(!dp[i][_guidField]) {
                        dp[i][_guidField] = StringUtils.guid();
                    }
                    
                    if(dp[i]) {
                        var cmpLink=extend(true,_componentLink);
                        cmpLink.props.bindingDefaultContext = dp[i];
                        cmpLink.props.id = "link";
                        cmpLink.props.attr = {};
                        cmpLink.props.attr[_guidField] = dp[i][_guidField];
                        components.push(cmpLink);  
                    }
                }
                
            }else {
                _creationFinished = true;
            }
            _oldDataProvider = extend(true,_dataProvider);
        }  
        return components;
    }

    Container.call(this, _props);
}
DropDown.prototype.ctor = 'DropDown' ;




