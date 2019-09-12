/**
 * This is an Repeater Element
 * 
 * Kreatx 2018
 */

//component definition
var Repeater = function(_props)
{
    this.currentIndex = 1;
    this.currentItem = {};
    this.rowItems = [];
    var _self = this;
    var _creationFinished = false;

    this.containerKeyDown = function(e)
    {
        if (typeof this.keydown == 'function')
            this.keydown.apply(this, arguments);
            console.log("containerKeyDown")
    
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
        console.log("focus Component function")
        console.log("focus component param")
        console.log(rowIndex) // 0
        console.log(cIndex) // 0
       
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
        
        if(typeof this.rowItems[rowIndex][cIndex].$el['focus'] === "function") { 
       
            this.rowItems[rowIndex][cIndex].$el.focus();
        }
    };
   
    // validate: function () {
    //     var _self = this;
    //     var valid = true;
    //     this.errorList = [];
    //     console.log("_self",_self)
    //     this.components.forEach(function (component) {
    //         _self[component.props.id].forEach(function (instance) {
    //             if (!instance.validate()) {
    //                 _self.errorList = _self.errorList.concat(instance.errorList)
    //                 valid = false;
    //             }
    //         });
    //     });

    //     return valid;
    // },

    var _createRows = function(){
        _self.$el.trigger('onBeginDraw');
         //this.$container.empty();
        _self.focusedRow = 0,
        _self.focusedComponent = 0;

        if(_dataProvider && _dataProvider.forEach)
        {
            if(_dataProvider.length>0){
                _self.dataProvider.forEach(function (data, index) {  
                    if(_dataProvider[index]!=null){
                        if(!_dataProvider[index][_guidField])
                            _dataProvider[index][_guidField] = StringUtils.guid();
                        _self.addRow(data, index + 1);
                    }
                });
            }else
                _creationFinished = true;
            _oldDataProvider = extend(true, _dataProvider);
        }else
            _creationFinished = true;
    }
    //handle row add click
    var _addRowHandler = function () 
    {
        this.addRow(this.defaultItem, this.currentIndex + 1, true)
    };

    this.dataProviderChanged = function () 
    {
        for(var i=0;i<_dataProvider.length;i++){
            if(!this.dataProvider[i][_guidField])
                this.dataProvider[i][_guidField] = StringUtils.guid();
        }
        
        var toAdd = differenceOnKeyMatch(_dataProvider, _oldDataProvider, _guidField, false, true);
        var toRemove = differenceOnKeyMatch(_oldDataProvider, _dataProvider, _guidField, false, true);
        var toRefresh = intersect(toAdd.a1_indices, toRemove.a1_indices);
        for(var i=0;i<toRemove.a1_indices.length;i++){
            //var ind = this.rowItems.length + i;
            if(toRefresh.indexOf(toRemove.a1_indices[i])==-1)
                this.removeRow(toRemove.a1_indices[i]+1, false, true, dpRemove = false); 
                //this.removeChildAtIndex(toRemove.a1_indices[i]);
        }
        
        for(var i=0;i<toAdd.a1_indices.length;i++){
            if(toRefresh.indexOf(toAdd.a1_indices[i])==-1)
            {
                var ind = toAdd.a1_indices[i];
                this.addRow(this.dataProvider[ind], ind+1); 
                //this.addComponent(cmp[0], ind);
            }
        }
        
        for(var i = 0; i<toRefresh.length;i++){
            var ri = toRefresh[i];
            for(var cmpID in this.rowItems[ri]){
                var cmp = this.rowItems[ri][cmpID];
                cmp.refreshBindings(this.dataProvider[ri]);
                cmp.$el.attr(_guidField, this.dataProvider[ri][_guidField]);
                cmp.attr[_guidField] = this.dataProvider[ri][_guidField];
            }

        }
        _oldDataProvider = extend(true, false, _dataProvider);
    };

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
                if(_dpWatcher && _dataProvider){
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange", _dpMemberChanged);
                } 
                if(v==null || v.length==0){
                    this.removeAllRows(false);
                    _dataProvider = v;
                    _creationFinished = true;
                }else if(_dataProvider && _dataProvider.length>0)
                {
                    for(var i=0;i<v.length;i++){
                        if(v[i]!=null){
                            if(!v[i][_guidField])
                                v[i][_guidField] = StringUtils.guid();
                        }
                    }
                    var delta = (v.length?v.length:0) - (_dataProvider.length?_dataProvider.length:0);
                    for(var ri=0;ri<Math.min(v.length, _dataProvider.length);ri++){
                        for(var cmpID in this.rowItems[ri]){
                            var cmp = this.rowItems[ri][cmpID];
                            cmp.refreshBindings(v[ri]);
                            cmp.$el.attr(_guidField, v[ri][_guidField]);
                            cmp.attr[_guidField] = v[ri][_guidField];
                        }
            
                    }
                    if(delta>0){
                        for(var i=_dataProvider.length;i<v.length;i++){
                            this.addRow(v[i], i+1); 
                        }
                    }else if(delta<0){
                        for(var i=_dataProvider.length;i>v.length;i--){
                            this.removeRow(i, false, true, dpRemove = false); 
                        }
                    }
                    _dataProvider = !ArrayEx.isArrayEx(v)?new ArrayEx(v):v;
                }else if(_dataProvider==null || _dataProvider.length==0){
                    _dataProvider = !ArrayEx.isArrayEx(v)?new ArrayEx(v):v;
                    _createRows();
                    //temp hack
                    _creationFinished = true;
                }
                if(_dataProvider){
                    _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                    _dpWatcher.watch(_dataProvider, "length", _dpLengthChanged);
                    _dataProvider.on("propertyChange", _dpMemberChanged);
                }
               
            }
        }
    });

    var _dpWatcher;
    var _dpLengthChanged = function(e)
    {
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
    Object.defineProperty(this, "value", {
        get: function value() {
            var value = {};
            for(var i=0;i<this.components.length;i++)
            {
                value[components[i].props.id] = [];        
                for(var j=0;j<this[components[i].props.id].length;j++)
                {
                    value[components[i].props.id].push(this[components[i].props.id][j].value);
                }
            }
            return value;
        }
    });
    var _createdRows = 0;
    //renders a new row, adds components in stack
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) 
    {
        console.log("addRow func "+this.id);
        
        index = index || this.rows.length+1;
        /* model check
        var model = this.getModel();
        */
        //row col-sm-12
        var renderedRow = $('<div>').addClass('');
        var ccComponents = [];
        var buildRow = function () {
            var rowItems = {};

            for(var cIndex=0;cIndex<_self.components.length;cIndex++)
            {
                let comp = _self.components[cIndex];

                (function (component, vcolIndex) {
                    return function(){
                        //clone objects
                        component = extend(true, component);
                        component.props.bindingDefaultContext = data;
                        var el = Component.fromLiteral(component, data);
                        var cmpId = component.props.id;

                        //build components properties, check bindings
                        if (_self[cmpId] == undefined)
                            _self[cmpId] = [];

                        var cmp = _self[cmpId];
                        if (cmp[index - 1] == undefined)
                            cmp[index - 1] = {};
                        
                        el.parent = _self;
                        el.parentType = 'repeater';
                        el.parentForm = _self.parentForm;
                        el.repeaterIndex = index - 1;

                        cmp[index - 1] = el;
                        rowItems[cmpId] = el;
                        _self.rowItems[index - 1] = rowItems;

                        //handle component change event and delegate it to repeater
                        el.on('creationComplete', (function (ci) { 
                            return (function(e) { // a closure is created
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                                ccComponents.push(el.id);
                                _createdRows++;
                                if (ccComponents.length == _self.components.length) {
                                    //trigger row add event
                                    _self.$el.trigger('onRowAdd', [_self, new RepeaterEventArgs(_self.rowItems, data, ci)]);
                                    //duhet te shtojme nje flag qe ne rast se metoda addRow eshte thirrur nga addRowHangler te mos e exec kodin meposhte
                                    
                                    //manage dp
                                    _self.currentItem = data;

                                    _self.currentIndex <= ci ? _self.currentIndex = ci : _self.currentIndex = _self.currentIndex;
                                    /* model check
                                    if (_self.currentIndex > 1 && _self.rendering.actions) {
                                        model.displayRemoveButton = true;
                                    }
                                    if (_self.currentIndex == 1) {
                                        model.displayRemoveButton = false;
                                    }*/

                                    //skip dp if it already exist
                                    var addRowFlag = false;
                                    if (ci > _self.dataProvider.length) {
                                        _self.dataProvider.push(_self.currentItem);
                                        addRowFlag = true;
                                    }
                                    
                                    if (_createdRows == _self.dataProvider.length && !addRowFlag) {
                                        if(!_creationFinished){
                                            _creationFinished = true;
                                            _self.trigger('creationComplete');
                                        }
                                        _self.focusComponent(0, 0);
                                        _self.$el.trigger('onEndDraw');
                                    }

                                    //animate
                                    if (addRowFlag && focusOnRowAdd) {
                                        _self.rowItems[_self.rowItems.length - 1][_self.components[0].props.id].scrollTo();
                                    }         
                                
                                }
                            });	
                        })(index));


                        if (_rendering.direction == 'horizontal') {
                        // el.$el.addClass('float-left');
                        }
                        el.on('focus', function (e, repeaterEventArgs) {
                            _self.focusedRow = repeaterEventArgs.currentIndex;
                            _self.focusedComponent = Object.keys(repeaterEventArgs.currentRow).indexOf(this.id);
                            console.log("focused repeated component", _self.focusedRow , _self.focusedComponent);
                        });
                        el.on('change', function (e, rargs) {
                            var currentItem = _self.dataProvider[index - 1];
                            if (component.props.value && isString(component.props.value) && component.props.value[0] == '{' && component.props.value[component.props.value.length - 1] == '}') {
                                var bindingExp = component.props.value.slice(1, -1);
                                if(bindingExp=="currentItem"){
                                    _self.dataProvider[rargs.currentIndex] = data = this.value;
                                }else{
                                    setChainValue(_self.dataProvider[rargs.currentIndex], bindingExp, this.value);
                                    data = _self.dataProvider[rargs.currentIndex];
                                }
                                    
                                
                            }
                            _self.$el.trigger('onRowEdit', [_self, new RepeaterEventArgs(rowItems, data, index)]);
                        });

                        //render component in row
                        renderedRow.append(el.render());
                    };
                })(comp, cIndex)();   
        }

            //render row in dom
           /*_self.$container
                .append(
                    $('<div>')
                        .addClass("repeated-block")
                        .css((_self.rendering.direction == 'horizontal' ? {display: 'inline-block'} : {}))
                        .append((_self.rendering.separator && (index > 1) ? '<hr id="repeated-block-hr">' : ''))
                        .append(renderedRow)
                );   
               */
            _self["rows"].push(renderedRow); 
            renderedRow
              .addClass("repeated-block")
              .css((_rendering.direction == 'horizontal' ? {display: 'inline-block'} : {}))
              .append((_rendering.separator && (index > 1) && (index < _self.dataProvider.length-1) ? '<hr id="repeated-block-hr">' : ''));            
           
            if(_self.mode =="append")
            {
                /*if(_self.rows.length>0)
                {
                    _self.rows[_self.rows.length-1].after(renderedRow);
                }
                else
                */
                    _self.$container.append(renderedRow);
            }else{
                _self.$container.prepend(renderedRow);
            }
            
            return rowItems;
        }

        //trigger before row add event
        if (isPreventable) {
            //the before add event is preventable
            var beforeRowAddEvent = jQuery.Event("onBeforeRowAdd");
            this.trigger(beforeRowAddEvent);
         
            if (!beforeRowAddEvent.isDefaultPrevented()) {
                //the event is not canceled outside
                return buildRow();
            } else {
                //the event default is canceled outside
                return false;
            }

        } else {
            //the before add event is not preventable so buildRow anyway
            return buildRow();    
        }
        
    };

    //handle row delete click, nese i shtojme te register events remove dhe add kemi mundesine te heqim/shtojme ne cdo index
    //remove dhe add duhet te modifikojne dhe dataProvider - splice
    var _removeRowHandler = function () 
    {
        this.removeRow(this.currentIndex, true);
        console.log("removerowHandler")
    };
    this.watchers = [];
    this.rows = [];
    this.mode = "append"; //TODO: prepend will add rows to the beginning, but if we are about to iterate the rows or use rowIndex we need to take this into consideration (using reverse of array is the easiest solution)
    this.removeAllRows = function(dpRemove = true)
    {
        var i=this.rows.length;
        while(i>0)
        {
            this.removeRow(i, false, false, dpRemove);
            i--;
        }
        this.rows = [];
    };

    this.removeRow = function (index, isPreventable = false, focusOnRowDelete = true, dpRemove = true) 
    {
        var rowItems = {};
        /* model check
        var model = this.getModel();
        */

        var removeRow = function (dpRemove = true) {
            //remove dp row
            var removedItem;
            if(dpRemove){
                removedItem = this.dataProvider.splice(index - 1, 1);
            } 

            //delete component instances on that row
            for(var cI=0;cI<this.components.length;cI++){  
                var component = this.components[cI];
                //remove repeated block from dom
                if (cI == 0) {
                    this[component.props.id][index - 1].$el.closest('.repeated-block').remove();
                    this[component.props.id][index - 1].$el.closest('.repeated-block-hr').remove();
                }
            
                //modify new cmp repeater indexes
                for(var i=0;i<this[component.props.id].length;i++){
                    var item = this[component.props.id][i];
                    if (i < index)
                        return false;
                    item.repeaterIndex -= 1;
                }

                rowItems[component.props.id] = [this[component.props.id][index - 1]];
                this[component.props.id].splice(index - 1, 1);
                
            }

            //manage dp
            this.currentIndex--;
            this.currentItem = this.dataProvider[index - 1];
            /* model check
            if (this.currentIndex == 1 && _rendering.actions) {
                model.displayRemoveButton = false;
            }*/

            this.$el.trigger('onRowDelete', [this, new RepeaterEventArgs([], this.currentItem, index, rowItems)]);
            this.rowItems.splice(index - 1, 1);
            this.rows.splice(index - 1, 1);
            //animate
            if (focusOnRowDelete && (index-2)>=0)
                this.rowItems[index - 2][this.components[0].props.id].scrollTo();

            return removedItem;
        }

        //trigger before row delete event
        if (isPreventable) {
            //trigger before row delete event
            var beforeRowDeleteEvent = jQuery.Event("onBeforeRowDelete");
            this.$el.trigger(beforeRowDeleteEvent);

            if (!beforeRowDeleteEvent.isDefaultPrevented()) {
                return removeRow.call(this, dpRemove);
            } else {
                return false;
            }
        } else {
            return removeRow.call(this, dpRemove);
        }
  
    };

    this.template = function () 
    {
        if(_container)
            if(_container.jquery)
                this.$el = _container
            else{
                _container.props.guid = this.guid;
                this.$el = Component.fromLiteral(_container).$el;
            }
        this.$container = this.$el;
        return null;
    };
    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _props.afterAttach == 'function')
                _props.afterAttach.apply(this, arguments);
            if((!_creationFinished && (_dataProvider && _dataProvider.forEach && _dataProvider.length>0)) || e.isDefaultPrevented())    
                e.preventDefault();
            _registerSurrogate();
        }
    };
    this.userCanManageItems = true;
    var _registerSurrogate = function(e){
        //init events for this surrogate component.
       _self.initEvents(this.$el, 0);
    }
    var _defaultParams = {
        rendering: {
			direction: 'vertical',
			separator: false
        },
        dataProvider:[],
        container:{
            constructor: Container,
            props: {
                id: _props.id,
                type: ContainerType.NONE,
                afterAttach: this.afterAttach,
                ownerDocument: _props.ownerDocument
            }
        },
        guidField:"guid"
    };
    _props = extend(false, false, _defaultParams, _props);
    var _dataProvider;
    var _rendering = _props.rendering;
    var _enabled = _props.enabled;
    var _container = _props.container;
    var _guidField = _props.guidField;
    this.components = _props.components;

    Component.call(this, _props, true, true);
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
        if(_props.dataProvider)
            this.dataProvider = _props.dataProvider;
        return this.$el;
    };

    this.registerEvents = function () 
    {
        return [
            {
                registerTo: this.$container, events: {
                    'keydown': this.containerKeyDown.bind(this)
                }
            }
        ];        
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
};
Repeater.prototype.ctor = 'Repeater';