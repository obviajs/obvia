/**
 * This is an Repeater Element
 * 
 * Kreatx 2018
 */

//component definition
var Repeater = function(_props)
{
    this.currentIndex = 1;
    this.rowItems = [];
    let _self = this;
    let _creationFinished = false;
    let _$hadow = $("<div/>");
    let _autoUpdateDisplay;
    
    this.containerKeyDown = function(e)
    {
        if (typeof _keydown == 'function')
                _keydown.apply(this, arguments);
            // if(!e.isDefaultPrevented()){
                
            //     switch (e.keyCode) {
            //         case 13: // ENTER - apply value
            //             console.log("Repeater ENTER");
            //             break;
            //         case 27: // ESC - get back to old value
            //             console.log("Repeater ESCAPE");
            //             break;
            //         case 9: // TAB - apply and move to next column on the same row 
            //             console.log("Repeater TAB");
            //             break;
            //         case 40: //  
            //             console.log("Repeater DOWN Arrow");
            //             this.focusComponent(++this.focusedRow, this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //         case 39: // 
            //             console.log("Repeater Right Arrow");
            //             this.focusComponent(this.focusedRow, ++this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //         case 38: // 
            //             console.log("Repeater Up Arrow");
            //             this.focusComponent(--this.focusedRow, this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //         case 37: // 
            //             console.log("Repeater Left Arrow");
            //             this.focusComponent(this.focusedRow, --this.focusedComponent);
            //             e.preventDefault();
               
            //             break;
            //     }
            // }
    }; 

    this.focusedRow = 0;
    this.focusedComponent = 0;

    this.focusComponent = function(rowIndex, cIndex)
    {
        if(rowIndex>this.dataProvider.length-1)
        {
            rowIndex = 0;
        }else if(rowIndex<0)
        {
            rowIndex = this.dataProvider.length-1;
        }
        if(!isNaN(cIndex))
        {
            if(cIndex > Object.keys(this.rowItems[rowIndex]).length-1)
            {
                cIndex = 0;
                ++rowIndex;
            }else if(cIndex < 0)
            {
                cIndex = Object.keys(this.rowItems[rowIndex]).length-1;
                --rowIndex;
            }
            if(rowIndex>this.dataProvider.length-1)
            {
                rowIndex = 0;
            }else if(rowIndex<0)
            {
                rowIndex = this.dataProvider.length-1;
            }
            cIndex = Object.keys(this.rowItems[rowIndex])[cIndex];
        }
        
        if(typeof this.rowItems[rowIndex][cIndex].$el.focus === "function") { 
       
            this.rowItems[rowIndex][cIndex].$el.focus();
        }
    };
    let _compRenderPromises = [];
    if (!this.hasOwnProperty("createRows"))
    {
        this.createRows = function () {
            _self.trigger('beginDraw');
            //this.$container.empty();
            _self.focusedRow = 0;
            _self.focusedComponent = 0;
            if (_dataProvider && _dataProvider.forEach) {
                let len = _dataProvider.length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let data = _dataProvider[i];
                        if (data != null) {
                            if (!data[_guidField])
                                data[_guidField] = StringUtils.guid();
                            _compRenderPromises.splicea(_compRenderPromises.length, 0, _self.addRow(data, i));
                        }
                    }
                } else
                    _creationFinished = true;
            } else
                _creationFinished = true;
            Promise.all(_compRenderPromises).then(function () {
                _$hadow.contents().appendTo(_self.$container);
                _compRenderPromises = [];
                _self.trigger('endDraw');
            });
        };
    }

    this.dataProviderChanged = function (toAdd, toRemove, toRefresh) 
    {
        acSort(toRemove.a1_indices, null, 2);
        for (let i = 0; i < toRemove.a1_indices.length; i++)
        {
            //var ind = this.rowItems.length + i;
            if(toRefresh.indexOf(toRemove.a1_indices[i])==-1 && toAdd.a1_indices.indexOf(toRemove.a1_indices[i])==-1)
                this.removeRow(toRemove.a1_indices[i], false, true, dpRemove = false); 
                //this.removeChildAtIndex(toRemove.a1_indices[i]);
        }
        if (toAdd.a1_indices.length > 0)
        { 
            acSort(toAdd.a1_indices);
            let transferNodes = false;
            for (let i = 0; i < toAdd.a1_indices.length; i++)
            {
                if(toRefresh.indexOf(toAdd.a1_indices[i])==-1 && toRemove.a1_indices.indexOf(toAdd.a1_indices[i])==-1)
                {
                    if (!transferNodes)
                    { 
                        _self.$container.contents().appendTo(_$hadow);    
                        transferNodes = true;
                    }
                    let ind = toAdd.a1_indices[i];
                    _compRenderPromises.splicea(_compRenderPromises.length, 0, this.addRow(this.dataProvider[ind], ind));
                }
            }
            if (_compRenderPromises.length > 0)
            {
                let cLen = _compRenderPromises.length;
                Promise.all(_compRenderPromises).then(function ()
                {
                    if (_compRenderPromises.length > 0)
                    {
                        console.log('prevLength:', cLen, ' currentLength: ', _compRenderPromises.length);
                        _$hadow.contents().appendTo(_self.$container);
                        _compRenderPromises = [];
                        
                        
                    }
                });
            }
        }
       
        for(let i = 0; i<toRefresh.length;i++){
            let ri = toRefresh[i];
            for(let cmpID in _self.rowItems[ri]){
                let cmp = _self.rowItems[ri][cmpID];
                cmp.refreshBindings(_self.dataProvider[ri]);
                cmp.$el.attr(_guidField, _self.dataProvider[ri][_guidField]);
                cmp.attr[_guidField] = _self.dataProvider[ri][_guidField];
            }
        }
 
       
    };

    Object.defineProperty(this, "rendering", 
    {
        get: function rendering() 
        {
            return _rendering;
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "$hadow", 
    {
        get: function $hadow() 
        {
            return _$hadow;
        },
        enumerable:false
    });
    
    let _oldDataProvider;
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(!_dataProvider || _dataProvider != v)
            {
                if(_dpWatcher && _dataProvider){
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange", _dpMemberChanged);
                } 
                if(v==null || v.length==0){
                    if(_oldDataProvider && _oldDataProvider.length>0)
                        this.removeAllRows(false);
                    _dataProvider = v;
                    _creationFinished = true;
                    this.createRows();
                }else if(_oldDataProvider && _oldDataProvider.length>0)
                {
                    let delta = (v.length?v.length:0) - (_oldDataProvider.length?_oldDataProvider.length:0);
                    for(let ri=0;ri<Math.min(v.length, _oldDataProvider.length);ri++){
                        if(v[ri]!=null && !v[ri][_guidField])
                            v[ri][_guidField] = StringUtils.guid();
                        for(let cmpID in this.rowItems[ri]){
                            let cmp = this.rowItems[ri][cmpID];
                            cmp.refreshBindings(v[ri]);
                            cmp.$el.attr(_guidField, v[ri][_guidField]);
                            cmp.attr[_guidField] = v[ri][_guidField];
                        }
            
                    }
                    if(delta>0){
                        for(let i=_oldDataProvider.length;i<v.length;i++){
                            if(v[i]!=null && !v[i][_guidField])
                                v[i][_guidField] = StringUtils.guid();
                            _compRenderPromises.splicea(_compRenderPromises.length, 0, this.addRow(v[i], i));
                        }
                        if (_compRenderPromises.length > 0)
                        {
                            Promise.all(_compRenderPromises).then(function() {
                                _$hadow.contents().appendTo(_self.$container);
                                _compRenderPromises = [];
                            });
                        }
                        
                    }else if(delta<0){
                        for(let i=_oldDataProvider.length-1;i>=v.length;i--){
                            this.removeRow(i, false, true, dpRemove = false); 
                        }
                    }
                    _dataProvider = !ArrayEx.isArrayEx(v)?new ArrayEx(v):v;
                }else if(_oldDataProvider==null || _oldDataProvider.length==0){
                    _dataProvider = !ArrayEx.isArrayEx(v)?new ArrayEx(v):v;
                    this.createRows();
                    //temp hack
                    _creationFinished = true;
                }
                if(_dataProvider){
                    _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                    _dpWatcher.watch(_dataProvider, "length", _debouncedLengthChanged);
                    _dataProvider.on("propertyChange", _dpMemberChanged);
                }
                _oldDataProvider = acExtend(_dataProvider);
            }
        },
        enumerable: true,
        configurable: true
    });

    let _dpWatcher;
    let _dpLengthChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        let len = _dataProvider.length;
        let oldValue = _oldDataProvider.length;
        let newValue = _dataProvider.length;
        
        for (let i = 0; i < len; i++) {
            if (!_dataProvider[i][_guidField])
                _dataProvider[i][_guidField] = StringUtils.guid();
        }
        if (_creationFinished) {
            let toAdd = { result: [], a1_indices: [] };
            toAdd = differenceOnKeyMatch(_dataProvider, _oldDataProvider, _guidField, false, true);
            
            let toRemove = { result: [], a1_indices: [] };
            toRemove = differenceOnKeyMatch(_oldDataProvider, _dataProvider, _guidField, false, true);
            
            if (newValue < oldValue && toRemove.result.length != oldValue - newValue) {
                let r = _oldDataProvider.dedupe(_guidField);
                toRemove.result.splicea(toRemove.result.length, 0, r.result);
                toRemove.a1_indices.splicea(toRemove.a1_indices.length, 0, r.indices);
            }
            let toRefresh = [];
            toRefresh.splicea(toRefresh.length, 0, intersect(toAdd.a1_indices, toRemove.a1_indices));
            if(_autoUpdateDisplay)
                _self.dataProviderChanged(toAdd, toRemove, toRefresh);
            _oldDataProvider = acExtend(_dataProvider);
        }
        
        let dataProviderLengthChangedEvent = jQuery.Event("dataProviderLengthChanged");
        dataProviderLengthChangedEvent.oldValue = oldValue;
        dataProviderLengthChangedEvent.newValue = newValue;
        _self.trigger("dataProviderLengthChanged", [_self]);
    };
    let _debouncedLengthChanged = debounce(_dpLengthChanged, 1);
    
    let _dpMemberChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (_creationFinished && ["length", "guid"].indexOf(e.property) == -1) {
            if (!_dataProvider[parseInt(e.property)][_guidField])
                _dataProvider[parseInt(e.property)][_guidField] = StringUtils.guid();
            let toAdd = { a1_indices: [], result: [] };
            let toRemove = { a1_indices: [], result: [] };
           
            if (e.oldValue != null && e.newValue != null) {
                //toRefresh = [parseInt(e.property)];
                //te shtohet param e
                _debouncedLengthChanged();
            }
        }
    };
    
    if(!this.hasOwnProperty("value")){
        Object.defineProperty(this, "value", {
            get: function value() {
                let value = {};
                for(var i=0;i<_components.length;i++)
                {
                    value[_components[i].props.id] = [];        
                    for(let j=0;j<this[_components[i].props.id].length;j++)
                    {
                        value[_components[i].props.id].push(this[_components[i].props.id][j].value);
                    }
                }
                return value;
            },
            configurable:true
        });
    }
    let _createdRows = 0;
    //renders a new row, adds components in stack
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) 
    {
        let rp = [];
        index = index==null?this.rows.length:index;
        let renderedRow = $('<div/>');
        var ccComponents = [];
        var rowItems = {};

        let beforeRowAddEvent = jQuery.Event("beforeRowAdd");
        this.trigger(beforeRowAddEvent, [_self, new RepeaterEventArgs(_self.rowItems, data, index)]);

        if (!isPreventable || (isPreventable && !beforeRowAddEvent.isDefaultPrevented())) 
        {
            let len = _components.length;
            for(var cIndex=0;cIndex<len;cIndex++)
            {
                let component = {};
                if (_components[cIndex].props.id) {
                    shallowCopy(_components[cIndex], component, ["props"]);
                    component.props = {};
                    shallowCopy(_components[cIndex].props, component.props, ["id", "bindingDefaultContext"]);
                    component.props.id = _components[cIndex].props.id + "_" + index + "_" + cIndex;
                    component.props.bindingDefaultContext = data;
                }
                
                component.props.ownerDocument = _props.ownerDocument;
                let el = Component.fromLiteral(component, data);
                let cmpId = _components[cIndex].props.id;

                //build components properties, check bindings
                if (_self[cmpId] == undefined)
                    _self[cmpId] = [];

                el.parent = _self;
                el.parentType = 'repeater';
                el.parentForm = _self.parentForm;
                el.repeaterIndex = index;
                
                //update repeaterIndex
                if (_self[cmpId][index])
                { 
                    for (let u = index; u < _self[cmpId].length; u++)
                    { 
                        _self[cmpId][u].repeaterIndex += 1;
                    }
                }
                
                _self[cmpId].splice(index, 0, el);
                rowItems[cmpId] = el;
                _self.rowItems.splice(index, 0, rowItems);

                //handle component change event and delegate it to repeater
                let ci = index+1;
                el.on('creationComplete', function(e) { // a closure is created
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    ccComponents.push(el.id);
                    _createdRows++;
                    if (ccComponents.length == _components.length) {
                        //trigger row add event
                        let era = jQuery.Event("rowAdd");
                        era.row = renderedRow;
                        _self.trigger(era, [_self, new RepeaterEventArgs(_self.rowItems[ci-1], data, ci-1)]);
                        //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                        
                        //manage dp
                        _self.currentIndex <= ci ? _self.currentIndex = ci : _self.currentIndex = _self.currentIndex;
                        
                        //skip dp if it already exist
                        var addRowFlag = false;
                        if (ci > _self.dataProvider.length) {
                            _self.dataProvider.push(data);
                            addRowFlag = true;
                        }
                        
                        if (_createdRows == _self.dataProvider.length && !addRowFlag) {
                            if(!_creationFinished){
                                _creationFinished = true;
                                _self.trigger('creationComplete');
                            }
                            //_self.focusComponent(0, 0);
                        }

                        //animate
                        if (addRowFlag && focusOnRowAdd) {
                            _self.rowItems[_self.rowItems.length - 1][_components[0].props.id].scrollTo();
                        }         
                    
                    }
                });	

                if (_rendering.direction == 'vertical') {
                    renderedRow.addClass("wrap");
                }
                
                el.on('focus', function (e, repeaterEventArgs) {
                    _self.focusedRow = repeaterEventArgs.currentIndex;
                    _self.focusedComponent = Object.keys(repeaterEventArgs.currentRow).indexOf(this.id);
                    console.log("focused repeated component", _self.focusedRow , _self.focusedComponent);
                });
                
                el.on('change', function (e, rargs) {
                    let currentItem = _self.dataProvider[index];
                    if (component.props.value && isString(component.props.value) && component.props.value[0] == '{' && component.props.value[component.props.value.length - 1] == '}') {
                        var bindingExp = this.getBindingExpression("value");
                        if(bindingExp=="currentItem"){
                            _self.dataProvider[rargs.currentIndex] = data = this.value;
                        }else{
                            setChainValue(_dataProvider[rargs.currentIndex], bindingExp, this.value);
                            data = _dataProvider[rargs.currentIndex];
                        }
                            
                        
                    }
                    _self.trigger('rowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                });
                
                //render component in row
                if(el.renderPromise){
                    let cp = el.renderPromise().then(function(cmpInstance){
                        if(!_rendering.wrap)
                        {
                            // if(_self.mode =="append")
                            // {
                            //     _$hadow.append(cmpInstance.$el);
                            // }else{
                            //     _$hadow.prepend(cmpInstance.$el);
                            // }
                            _$hadow.insertAt(cmpInstance.$el, index);
                        }else   
                        {
                            renderedRow
                            .addClass("repeated-block")
                            .css((_rendering.direction == 'horizontal' ? {display: 'inline-block'} : {}))
                            .append(cmpInstance.$el);
                                 
                            if(_rendering.separator && (index > 0)){
                                renderedRow.addClass("separator");  
                            }        
                            // if(_self.mode =="append")
                            // {
                            //     _$hadow.append(renderedRow);
                            // }else{
                            //     _$hadow.prepend(renderedRow);
                            // }
                            _$hadow.insertAt(renderedRow, index);
                        }                     
                                                   
                    });
                    rp.push(cp);
                }
            }
            _self.rows.push(renderedRow); 
        }
        return rp;
    };

    this.watchers = [];
    this.rows = [];
    this.mode = "append"; //TODO: prepend will add rows to the beginning, but if we are about to iterate the rows or use rowIndex we need to take this into consideration (using reverse of array is the easiest solution)
    this.removeAllRows = function(dpRemove = true)
    {
        var i=this.rows.length-1;
        while(i>=0)
        {
            this.removeRow(i, false, false, dpRemove);
            i--;
        }
        this.rows = [];
    };

    this.removeRow = function (index, isPreventable = false, focusOnRowDelete = true, dpRemove = true) 
    {
        var rowItems = {};
        let beforeRowDeleteEvent = jQuery.Event("beforeRowDelete");
        this.trigger(beforeRowDeleteEvent, [_self, new RepeaterEventArgs(_self.rowItems, _oldDataProvider[index], index)]);

        if (!isPreventable || (isPreventable && !beforeRowDeleteEvent.isDefaultPrevented())) 
        {
            //remove dp row
            var removedItem;
            if(dpRemove){
                removedItem = this.dataProvider.splice(index, 1);
            } 

            //delete component instances on that row
            for(var cI=0;cI<_components.length;cI++){  
                var component = _components[cI];
                //remove repeated block from dom
                if (cI == 0 && _rendering.wrap) {
                    this[component.props.id][index].$el.closest('.repeated-block').remove();
                    this[component.props.id][index].$el.closest('.repeated-block-hr').remove();
                }
                if (!_rendering.wrap)
                {
                    for (let c = 0; c < _components.length; c++)
                    {
                        this[_components[c].props.id][index].destruct(1);
                    }
                }
                //modify new cmp repeater indexes
                for(var i=0;i<this[component.props.id].length;i++){
                    var item = this[component.props.id][i];
                    if (i > index)
                        item.repeaterIndex -= 1;
                }

                rowItems[component.props.id] = [this[component.props.id][index]];
                this[component.props.id].splice(index, 1);
                
            }
            //manage dp
            this.currentIndex--;
            this.trigger('rowDelete', [this, new RepeaterEventArgs(rowItems, this.dataProvider[index], index)]);
            this.rowItems.splice(index, 1);
            this.rows.splice(index, 1);
            //animate
            if (focusOnRowDelete && (index-1)>=0)
                this.rowItems[index - 1][_components[0].props.id].scrollTo();

            return removedItem;
        }
    };
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            if((!_creationFinished && (_dataProvider && _dataProvider.forEach && _dataProvider.length>0)) || e.isDefaultPrevented())    
                e.preventDefault();
        }
    };
    var _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    var _defaultParams = {
        rendering: {
			direction: 'vertical',
            separator: false,
            wrap: true
        },
        autoUpdateDisplay: true,
        type: ContainerType.NONE,
        dataProvider: new ArrayEx([]),
        guidField: "guid",
        components:[]
    };
    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) { 
        _props.attr = {};
    }
    let myDtEvts = ["rowAdd", "rowEdit", "beforeRowAdd", "rowDelete", "beforeRowDelete", "dataProviderLengthChanged"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {   
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    
    var _dataProvider;
    var _rendering = _props.rendering;
    var _enabled = _props.enabled;
    var _guidField = _props.guidField;
    var _components = _props.components;
    var _keydown = _props.keydown;
    _props.keydown = this.containerKeyDown;

    let _rPromise;
    _autoUpdateDisplay = _props.autoUpdateDisplay;
    let r = Container.call(this, _props, true, true);
    var base = this.base;
/*
    var click =  props.click;
    _props.click = function(e)
    {
        if (typeof _click == 'function')
            _click.apply(this, arguments);

        alert("overrided")
    };*/
    
    this.render = function () 
    {  
        return this.$el;
    };
    
    this.renderPromise = function () 
    {  
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function(e){
                if (e.target.id == _self.domID) 
                {       
                    resolve(this); 
                }
            });                   
        });
        //if(_props.dataProvider)
        if(!this.getBindingExpression("dataProvider"))
            this.dataProvider = _props.dataProvider;
        return _rPromise;
    };
    
    Object.defineProperty(this, "enabled", 
    {
        get: function enabled() 
        {
            return _enabled;
        },
        set: function enabled(v) 
        {
            if(_enabled != v)
            {
                _enabled = v;

                for (var i = 0; i < this.dataProvider.length; i++)
                {
                    this.components.forEach(function (component) {
                        _self[component.props.id][i].enabled = v;
                    });
                }

            }
        }
    });
    
    Object.defineProperty(this, "components", 
    {
        get: function components() 
        {
            return _components;
        },
        enumerable:true
    });
    Object.defineProperty(this, "renderPromises",
    {
        get:function renderPromises(){
            return _compRenderPromises;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(this, "propsLite", {
        get: function props() {
            let obj = {};
            for (let prop in _props) {
                if (typeof _props[prop] != 'function' && (this[prop]==null || !this[prop].$el)) {
                    switch (prop) {
                        case "components":
                            obj[prop] = _components;
                            break;
                        case "dataProvider":
                            if (this.dataProvider) {
                                let len = this.dataProvider.length;
                                let dpCopy = new window[this.dataProvider.constructor.name](len);
                                for (let i = 0; i < len; i++) {
                                    dpCopy[i] = extend(false, false, [], ["currentItem"], this.dataProvider[i]);
                                }
                                obj[prop] = dpCopy;
                            }
                            break;
                        case "ownerDocument":
                            break;
                        case "rendering":
                            obj[prop] = {};
                            shallowCopy(_rendering, obj[prop], ["currentItem"]);
                            break;
                        default:
                            if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if (!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });
    Object.defineProperty(this, "props", {
        get: function props() {
            let obj = {};
            for (let prop in _props) {
                if (typeof _props[prop] != 'function') {
                    switch (prop) {
                        case "components":
                            obj[prop] = _components;
                            break;
                        case "dataProvider":
                            if (this.dataProvider) {
                                let len = this.dataProvider.length;
                                let dpCopy = new window[this.dataProvider.constructor.name](len);
                                for (let i = 0; i < len; i++) {
                                    dpCopy[i] = extend(false, false, [], ["currentItem"], this.dataProvider[i]);
                                }
                                obj[prop] = dpCopy;
                            }
                            break;
                        case "ownerDocument":
                            break;
                        default:
                            if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if (!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });
    return r;
};
Repeater.prototype.ctor = 'Repeater';