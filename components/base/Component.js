var Component = function(_props, overrided=false, _isSurrogate=false)
{
    var _self = this;
    if(!Component[this.ctor]){
        Component[this.ctor] = {};
        Component[this.ctor].instanceCnt = 0;
    }
    ++Component[this.ctor].instanceCnt;

    var _defaultParams = {
        id: this.ctor+"_"+Component[this.ctor].instanceCnt,
        classes: [],
        guid: StringUtils.guid(),
        bindingDefaultContext:Component.defaultContext,
        ownerDocument:document,
        attr:{},
        visible:true,
        enabled:true,
        index:0    
    };
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    var ppb =  Component.processPropertyBindings(_props);
    for(var prop in _props){
        if(!ppb.processedProps.hasOwnProperty(prop))
            delete _props[prop];
    }
    
    var _bindingDefaultContext = _props.bindingDefaultContext;
    var _guid = _props.guid;
    var _attr;
    var _id = _props.id = ((!_props.id) || (_props.id =="")) ? _defaultParams.id : _props.id;
    var _enabled, _draggable, _visible;
    var _classes = [];
    var _parent = _props.parent;
    var _mousedown = _props.mousedown;
    var _mouseover = _props.mouseover;
    var _mouseout = _props.mouseout;
    var _mouseup = _props.mouseout;
    var _click = _props.click;
    var _dblclick = _props.dblclick;
    var _blur = _props.blur;    
    var _keydown = _props.keydown;
    var _keyup = _props.keyup;
    var _creationComplete = _props.creationComplete;
    var _change = _props.change;
    var _drop = _props.drop;
    var _dragover = _props.dragover;
    var _dragstart = _props.dragstart;
    var _dragenter = _props.dragenter;
    var _dragleave = _props.dragleave;
    var _DOMMutation = _props.DOMMutation;
    var _ownerDocument = _props.ownerDocument;
    var _watchers = [];
    var _bindings = ppb.bindings;
    var _attached = false;
    let _index = _props.index;

    if(Component.usedComponentIDS[_id]==1) {
        _id += "_" +Component[this.ctor].instanceCnt;
    }
    var _domID = _id + '_' + _guid;

    Component.usedComponentIDS[_id] = 1;
    Component.domID2ID[_domID] = _id;
    Component.instances[_id] = this;

    //var _propUpdateMap = {"label":{"o":$el, "fn":"html", "p":[] }, "hyperlink":{}};
    //generate GUID for this component
    Object.defineProperty(this, "guid",
    {
        get: function guid() 
        {
            return _guid;
        }
    });
    Object.defineProperty(this, "_attached",
    {
        get: function attached() 
        {
            return _attached;
        }
    });
    Object.defineProperty(this, "bindingDefaultContext",
    {
        get: function bindingDefaultContext() 
        {
            return _bindingDefaultContext;
        },
        enumerable:false
    });
    
    //domID property
    Object.defineProperty(this, 'id',
    {
        get: function () {
            return _id;
        },
        set: function(v){
            if(v && v.trim() && (_id != v)){
                let oldId = _id;
                delete Component.usedComponentIDS[_id];
                delete Component.domID2ID[_domID];
                delete Component.instances[_id];
                
                _id = v;
                if(Component.usedComponentIDS[_id]==1) {
                    _id += "_" +Component[this.ctor].instanceCnt;
                }
                _domID = _id + '_' + _guid;
            
                Component.usedComponentIDS[_id] = 1;
                Component.domID2ID[_domID] = _id;
                Component.instances[_id] = this;

                if(this.parent){
                    if(this.parent.ctor=="Repeater"){
                        this.parent[_id] = this.parent[oldId];
                        delete this.parent[oldId];
                    }else{
                        this.parent.children[_id] = this.parent.children[oldId];
                        delete this.parent.children[oldId];
                    }
                }
                this.$el.attr("id", _domID);
                _props.id = _id;
            }
        },
        enumerable:true
    });

    Object.defineProperty(this, "index",
    {
        get: function index()
        {
            return _index;
        },
        enumerable:true
    });

    Object.defineProperty(this, 'ownerDocument',
    {
        get: function () {
            return _ownerDocument;
        }, 
        set: function ownerDocument(v)
        {
            if(!_ownerDocument || _ownerDocument!=v)
            {
                _ownerDocument = v;
                Component.ready(this, function(element){
                    if(!_isSurrogate)
                        _self.trigger('afterAttach');
                }, _ownerDocument);
            }
        }
    });

    Object.defineProperty(this, 'isSurrogate',
    {
        get: function () {
            return _isSurrogate;
        }
    });

    Object.defineProperty(this, 'domID',
    {
        get: function () {
            return _domID;
        }
    });

    Object.defineProperty(this, "spacing", 
    {
        get: function spacing() 
        {
            return _spacing;
        },
        enumerable:true
    });
    Object.defineProperty(this, "attr", 
    {
        get: function attr() 
        {
            return _attr;
        },
        enumerable:true
    });
    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props){
                if(this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop) && (typeof _props[prop] != 'function') && (prop != "ownerDocument"))
                    if(!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                        obj[prop] = this[prop];
            }
            return obj;
        },
        configurable: true
    });  
    Object.defineProperty(this, "literal", {
        get: function literal() {
            return {ctor:this.ctor, props:this.props};
        },
        configurable: true
    });  
   

    Object.defineProperty(this, "parent",
    {
        get: function parent() 
        {
            return _parent;
        },
        set: function parent(v)
        {
            if(_parent != v)
            {
                if(_parent)
                {
                    if(_self.$el)
                    {
                        if(_parent)
                            _parent.$el.detach(_self.$el);
                        if(v)
                            v.$el.append(_self.$el);
                    }
                }
                _parent = v;
            }
        }
    });

    Object.defineProperty(this, "watchers",
    {
        get: function watchers()
        {
            return _watchers;
        }
    });

    Object.defineProperty(this, "bindings",
    {
        get: function bindings()
        {
            return _bindings;
        }
    });

    Object.defineProperty(this, "visible",
    {
        get: function visible()
        {
            return _visible;
        },
        set: function visible(v)
        {
            if(_visible != v)
            {
                _visible = v;
                if(this.$el){
                    if(_visible)
                        this.show();
                    else    
                        this.hide();
                }
            }
        },
        configurable: true,
        enumerable:true
    });
    
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
                if(this.$el)
                    this.$el.find("input, select, textarea, button").addBack("input, select, textarea, button").each(function(){
                        if(!v)
                            $(this).prop('disabled', 'disabled');
                        else
                            $(this).removeAttr('disabled');
                    });
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "readonly",
    {
        get: function readonly()
        {
            return _readonly;
        },
        set: function readonly(v)
        {
            if(_readonly != v)
            {
                _readonly = v;
                if(this.$el)
                    this.$el.find("input, select, textarea, button").addBack("input, select, textarea, button").each(function(){
                        if(!v)
                            $(this).prop('readonly', 'readonly');
                        else
                            $(this).removeAttr('readonly');
                    });
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "draggable",
    {
        get: function draggable()
        {
            return _draggable;
        },
        set: function draggable(v)
        {
            if(_draggable!=v){
                _draggable = v;
                if(!v)
                    this.$el.prop('draggable', 'false');
                else
                    this.$el.prop('draggable', 'true');
            }
        }
    });
    Object.defineProperty(this, "classes",
    {
        get: function classes()
        {
            let r = _classes;
            if(this.children){
                let p;
                for(var _cid in this.children){
                    if(this[this.childrenRID[_cid]] && this[this.childrenRID[_cid]]["ctor"]){
                        if(!p)
                            r = {};
                        r[this.childrenRID[_cid]] = this[this.childrenRID[_cid]].classes;
                        p = true;
                    }
                }
                if(p){
                    r["self"] = _classes;
                }
            }
            return r;
        },
        set: function classes(v)
        {
            var _toggle = _toggleStack.pop();
                    
            if((!_classes && v) || (_classes && (!_classes.equals(v) || _toggle)))
            {
                if(this.$el)
                {
                    if(Array.isArray(v))
                    {
                        if(_toggle)
                        { 
                            _classes = v;
                            for(var i =0;i<_classes.length;i++)
                            {
                                var _class = _classes[i];
                                if(this.$el.hasClass(_class))
                                    this.$el.removeClass(_class);
                                else
                                    this.$el.addClass(_class);
                            }
                        }else{
                            _classes = _classes.difference(v);
                            for(var i =0;i<_classes.length;i++)
                            {
                                var _class = _classes[i];
                                if(this.$el.hasClass(_class))
                                    this.$el.removeClass(_class);
                            }
                            _classes = v;
                            this.$el.addClass(_classes);
                        } 
                    }else{
                        for(var _cid in v){
                            if(_cid=="self")
                                this.classes = v[_cid];
                            else if(this[_cid] && this[_cid]["ctor"]){
                                this[_cid].classes = v[_cid];
                            }
                        }
                    }
                }
                    
            }
        }
    });

    var _toggleStack = [];
    Object.defineProperty(this, "toggle", {
        get: function toggle()
        {
            return _toggleStack[_toggleStack.length-1];
        },
        set: function toggle(v)
        {
            _toggleStack.push(v);
        }
    });

    this.my = function(id){
        return id+"_"+this.guid;
    } 
    
    this.$el = null;
    this.embedded = false;

    
    var tpl = this.template();
    if('jquery' in Object(tpl))
        this.$el = tpl;
    else if(tpl && tpl!="")
        this.$el = $(tpl);
    
    _attr = new Attr(_props.attr, this.$el);
    
    if(_isSurrogate && this.$el){
        Component.surrogates[this.$el.attr('id')] = this.domID;
    }

    var _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _props.beforeAttach == 'function')
                _props.beforeAttach.apply(this, arguments);
            //TODO: not neccessary ? 
            if(!e.isDefaultPrevented()){
                if (typeof _beforeAttach == 'function')
                    _beforeAttach.apply(this, arguments);
            }
            if(_props.classes)
            {
                this.classes = _props.classes;
            }
        }
    }
    
    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID) 
        {
            _attached = true;
            if (typeof _props.afterAttach == 'function')
                _props.afterAttach.apply(this, arguments);
            if(!e.isDefaultPrevented()){
                this.trigger('creationComplete');
                console.log("CreationComplete : Type:",this.ctor+" id:"+ this.$el.attr("id"));
            }
            console.log("AfterAttach : Type:",this.ctor+" id:"+ this.$el.attr("id"));
        }
    };

    var _defaultHandlers =
    [
        {
            registerTo: this.$el, events: {
                'mousedown': _mousedown && typeof _mousedown == 'function' ? _mousedown.bind(_self) : undefined,
                'mouseover': _mouseover && typeof _mouseover == 'function' ? _mouseover.bind(_self) : undefined,
                'mouseout': _mouseout && typeof _mouseout == 'function' ? _mouseout.bind(_self) : undefined,
                'mouseup': _mouseup && typeof _mouseup == 'function' ? _mouseup.bind(_self) : undefined,
                'click': _click && typeof _click == 'function' ? _click.bind(_self) : undefined,
                'dblclick': _dblclick && typeof _dblclick == 'function' ? _dblclick.bind(_self) : undefined,
                'blur': _blur && typeof _blur == 'function' ? _blur.bind(_self) : undefined,
                'keydown': _keydown && typeof _keydown == 'function' ? _keydown.bind(_self) : undefined,
                'keyup': _keyup && typeof _keyup == 'function' ? _keyup.bind(_self) : undefined,
                'creationComplete': _creationComplete && typeof _creationComplete == 'function' ? _creationComplete.bind(_self) : undefined,
                'change': _change && typeof _change == 'function' ? _change.bind(_self) : undefined,
                'drop': _drop && typeof _drop == 'function' ? _drop.bind(_self) : undefined,
                'dragover': _dragover && typeof _dragover == 'function' ? _dragover.bind(_self) : undefined,
                'dragstart': _dragstart && typeof _dragstart == 'function' ? _dragstart.bind(_self) : undefined,
                'dragenter': _dragenter && typeof _dragenter == 'function' ? _dragenter.bind(_self) : undefined,
                'dragleave': _dragleave && typeof _dragleave == 'function' ? _dragleave.bind(_self) : undefined,
                'DOMMutation': _DOMMutation && typeof _DOMMutation == 'function' ? _DOMMutation.bind(_self) : undefined,
                'afterAttach': this.afterAttach && typeof this.afterAttach == 'function' ? this.afterAttach.bind(_self) : undefined,
                'beforeAttach': this.beforeAttach && typeof this.beforeAttach == 'function' ? this.beforeAttach.bind(_self) : undefined,
            }
        }
    ];

    this.dataTriggerEvents = function () {
        var customEvents = _defaultHandlers;

        this.$el.find('[data-triggers]').addBack('[data-triggers]').each(function () {
            var eventsObj = {};
            var events = $(this).data('triggers');
            var eventsArr = events.split(" ");

            for (var i = 0; i < eventsArr.length; i++) 
            {
                var eventType = eventsArr[i];
                if(customEvents[0].events[eventType])
                {
                    //overrided listener, so remove default listener on $el
                    delete customEvents[0].events[eventType];
                }
                var privateEvent = _props[eventType];
                eventsObj[eventsArr[i]] = privateEvent && typeof privateEvent == 'function' ? privateEvent.bind(_self) : undefined;
            }
            var found = false;
            for(var i=0;i<customEvents.length;i++)
            {
                if(customEvents[i].registerTo.attr('id') == $(this).attr('id'))
                {
                    customEvents[i].events = extend(false, false, eventsObj, customEvents[i].events);
                    found = true;
                    break;
                }
            }
            if(!found)
            {
                customEvents = customEvents.concat([{
                    registerTo: $(this),
                    events: eventsObj
                }]);
            }

        });

        return customEvents;
    };

   // var _dataTriggerEventList = _isSurrogate?_defaultHandlers:this.dataTriggerEvents();
    var _dataTriggerEventList = this.dataTriggerEvents();
    this.registerEvents = function ()
    {
        return _dataTriggerEventList;
    };//

    this.render = function ()
    {
        return this.$el;
    };

    //action methods on component
    this.show = function ()
    {
        if(this.$el)
            this.$el.show();
        return this;
    }

    this.hide = function ()
    {
        if(this.$el)
            this.$el.hide();
        return this;
    }
    this.blur = function ()
    {
        if(this.$el)
            this.$el.blur();
        return this;
    }
    this.scrollTo = function () 
    {
        if(this.$el)
        {
            $(this.ownerDocument.body).animate({
                scrollTop: this.$el.offset().top - 100
            }, 1200);
        }
        return this;
    }

    this.destruct = function (mode=1)
    {
        if(this.$el)
            mode==1?this.$el.remove():this.$el.detach();
        _attached = false;
    }

    //register outside handlers
    //event handling
    this.on = function (eventType, fnc)
    {
        var _self = this;
        if (typeof fnc !== 'function')
        {
            throw Error("The specified parameter is not a callback");
        } else
        {
            if (typeof fnc == 'function')
            {
                if(this.$el)
                {
                    if(_handlers[eventType]==null)
                        _handlers[eventType] = [];
                    var proxyHandler = function ()
                    {
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }

                        if (_self.parentType == 'repeater') {
                            args = args.concat([
                                new RepeaterEventArgs(
                                    _self.parent.rowItems[_self.repeaterIndex],
                                    _self.parent.dataProvider[_self.repeaterIndex],
                                    _self.repeaterIndex
                                )
                            ]);
                        }
                        //console.log(_self.$el.attr('id'), arguments[0]);
                        return fnc.apply(_self, args);
                    };
                    _handlers[eventType].push({"proxyHandler":proxyHandler, "originalHandler":fnc});
                    this.$el.on(eventType, proxyHandler);
                }
                else
                    console.log("$el in not defined");
            }
        }
        return this;
    }
    
    var _handlers = {};

    this.trigger = function ()
    {
        if(this.$el)
            this.$el.trigger.apply(this.$el, arguments);
    }

    this.off = function ()
    {
        if(this.$el){
            this.$el.off.apply(this.$el, arguments);
            var evt = arguments[0], handler, ind;
            if(!Array.isArray(evt))
                evt = [evt]
            if(typeof arguments[1] == 'function'){
                handler = arguments[1];
                ind = 1;
            } 
            else if(typeof arguments[2] == 'function'){
                handler = arguments[2];
                ind = 2;
            }
            var found;
            for(var i=0;i<evt.length;i++){
                found = getMatching(_handlers[evt[i]], "originalHandler", handler, true);
                if(found.objects.length>0){
                    arguments[ind] = found.objects[0].proxyHandler;
                    this.$el.off.apply(this.$el, arguments);
                    _handlers[evt[i]].splice(found.indices[0], 1);
                }
            }
        }            
    }
    
    this.getBindingExpression = function(property)
    {
        var match = getMatching(_bindings, "property",  property, true);
        var expression = null;
        if(match.objects.length>0){
            expression = match.objects[0]["expression"];
        }
        return expression;
    },

    this.resetBindings = function()
    {
        for(var i=0;i<_watchers.length;i++)
        {
            _watchers[i].reset();        
        }
    };
    var _bindedTo;
    this.refreshBindings = function(data)
    {
        if(_bindedTo!=data){
            this.resetBindings();
            _watchers = [];
            this.applyBindings(data);
            if(this.children){
                for(var cid in this.children){
                    this.children[cid].refreshBindings(data);
                }
            }
            
        }
    };

    this.applyBindings = function(data)
    {
        _bindedTo = data;
        var _self = this, w = [];
        for(var bi=0;bi<_bindings.length;bi++){
            (function(currentItem, bindingExp, site, site_chain, nullable){
                return (function(e) { // a closure is created
                    //this here refers to window context
                    var defaultBindTo = "currentItem_"+_self.guid;
                    this[defaultBindTo] = (currentItem || Component.defaultContext);
                    if(!("currentItem" in this[defaultBindTo])){
                        this[defaultBindTo]["currentItem"] = this[defaultBindTo];
                    }
                   // var context = extend(false, true, this, obj);
                    var fn = function(){
                        w.splicea(w.length, 0, BindingUtils.getValue(this, bindingExp, site, site_chain, defaultBindTo));
                    };
                    if(nullable){
                        var fnDelayed = whenDefined(this[defaultBindTo], bindingExp, fn);
                        fnDelayed();
                    }else{
                        fn();
                    }
                })();	
            })(data, _bindings[bi].expression, this, [_bindings[bi].property], _bindings[bi].nullable);
        }
        return w;
    };

    this.keepBase = function()
    {
        this.base = {};
        for(var prop in this)
        {
            if(isGetter(this, prop))
                copyAccessor(prop, this, this.base);
            else    
                this.base[prop] = this[prop];
        }
    }
    if(overrided)
    {
        this.keepBase();
    }

   //"#" + this.$el.attr('id'), 
    this.initEvents = function (element) //1:real component, 0:surrogate i.e no real DOM element 
    {
        //execute inner handlers if theres any registered
        var handlers = [];
       
        if (_self['registerEvents'] && (typeof _self.registerEvents == 'function'))
        {
            handlers = _self.registerEvents();
            //call inner event
            handlers.forEach(function (handler, i) {
                for (var innerEventIn in handler.events) {
                    if (typeof handler.events[innerEventIn] == 'function') {
                        if(handler.registerTo != null){
                            if(_handlers[innerEventIn]==null)
                                _handlers[innerEventIn] = [];
                            
                            var proxyHandler = (function (innerEventIn, component) { // a closure is created
                                return function () {
                                    var args = [];
                                    for (var i = 0; i < arguments.length; i++) {
                                        args.push(arguments[i]);
                                    }

                                    //append RepeaterEventArgs to event
                                    if (component.parentType && component.parentType == 'repeater') {
                                        args = args.concat(
                                            [
                                                new RepeaterEventArgs(
                                                    component.parent.rowItems[component.repeaterIndex],
                                                    component.parent.dataProvider[component.repeaterIndex],
                                                    component.repeaterIndex
                                                )
                                            ]
                                        );
                                    }
                                    args[0].originalContext = this;
                                    handler.events[innerEventIn].apply(component, args);
                                }
                            })(innerEventIn, _self);    
                            _handlers[innerEventIn].push({"proxyHandler":proxyHandler, "originalHandler":handler.events[innerEventIn]});
                            handler.registerTo.on(innerEventIn, proxyHandler);
                            
                        }else
                        {
                            console.log("Event handler registration on '"+_self.id+"' failed because the target is undefined");
                        }
                    }
                }
            });
        }
    }

    if(_props.enabled!=null)
        this.enabled = _props.enabled;
    if(_props.visible!=null)
        this.visible = _props.visible;
    if(_props.draggable!=null)
        this.draggable = _props.draggable;
    var _spacing = new Spacing(_props.spacing, this.$el);
    
    _self.initEvents(this.$el);
    if(!_isSurrogate)
        _self.trigger('beforeAttach');
    //execute functions before component attached on dom
    if(_ownerDocument){
        Component.ready(this, function(element){
            if(!_isSurrogate)
                _self.trigger('afterAttach');
        }, _ownerDocument);
    }   
    
    if(_props.applyBindings==null || _props.applyBindings==true)
        _watchers = this.applyBindings(_bindingDefaultContext);
}

Component.processPropertyBindings = function(props)
{
    var _bindings = [];
    //build components properties, check bindings
    var _processedProps = {};
    
    for (var prop in props) {
        if (typeof prop == 'string') {
            //check for binding
            var b = getBindingExp(props[prop])
            if (b) {
                _bindings.push({"expression":b.expression, "property":prop, "nullable":b.nullable});
            } else {
                //no binding
                _processedProps[prop] = props[prop];
            }
        }
    }
    return {"bindings":_bindings, "processedProps":_processedProps};
}

Component.instanceCnt = 0;
Component.fromLiteral = function(_literal)
{
    var _literal = Object.assign({}, _literal);
    var props = Object.assign({}, _literal.props);
    //var ppb =  Component.processPropertyBindings(props);
    //var _bindings = ppb.bindings;
    //build components properties, check bindings
    //var _processedProps = ppb.processedProps;
    //construct the component
    if(_literal.ctor)
    {
        if (typeof _literal.ctor == "string") {
            _literal.ctor = window[_literal.ctor];
        }
        var el = new _literal.ctor(props);
        return el;
    }
}
Component.listeners = {};
Component.objListeners = {};
Component.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

Component.ready = function(cmp, fn, ownerDocument=document) 
{
    // Store the selector and callback to be monitored
    if(!ownerDocument["id"]){
        ownerDocument["id"] = StringUtils.guid();
    }
    if(cmp.$el)
    {
        if(Component.listeners[ownerDocument["id"]]==null){
            Component.listeners[ownerDocument["id"]] = [];
        }
        Component.listeners[ownerDocument["id"]].push({
            element: cmp,
            fn: fn
        });
        if(Component.objListeners[cmp.domID]==null){
            Component.objListeners[cmp.domID] = [];
        }
        Component.objListeners[cmp.domID].push({"element":cmp, "fn":fn});
    }
    if (!Component.observer[ownerDocument["id"]]) 
    {
        Component.observer[ownerDocument["id"]] = new MutationObserver(Component.check);
        // Watch for changes in the document window.document.documentElement
        Component.observer[ownerDocument["id"]].observe(ownerDocument, {
            childList: true,
            subtree: true
        });
    }
// Check if the element is currently in the DOM
    //Component.check();
}

Component.check = function(mutations) 
{
    if (mutations && mutations.length > 0) 
    {
        for(var g=0;g<mutations.length;g++)
        {
            if(Component.domID2ID[mutations[g].target.id]){
                if(Component.instances[Component.domID2ID[mutations[g].target.id]]){
                    var evt = new jQuery.Event("DOMMutation");
                    evt.mutation = mutations[g];
                    Component.instances[Component.domID2ID[mutations[g].target.id]].trigger(evt);
                }
            }
            for(var h=0;h<mutations[g].addedNodes.length;h++)
            {
                var DOMNode = mutations[g].addedNodes[h];
                if(DOMNode.querySelectorAll)
                {
                    // Check the DOM for elements matching a stored selector
                    if(Component.listeners[DOMNode.ownerDocument.id])
                    {
                        for (var i = 0, len = Component.listeners[DOMNode.ownerDocument.id].length, listener, elements; i < len; i++) 
                        {
                            listener = Component.listeners[DOMNode.ownerDocument.id][i];
                            if(!listener.element.attached)
                            {
                                var $el = listener.element.$el;
                                var id = $el[0].id;
                                //console.log(DOMNode.id);
                                var resultNodes = DOMNode.id==id?[DOMNode]:DOMNode.querySelectorAll("#"+id);

                                // Make sure the callback isn't invoked with the 
                                // same element more than once
                            // if (mutations.addedNodes[h]==element && !element.ready) 
                                if(resultNodes.length>0 && !resultNodes[0].ready)
                                {
                                    resultNodes[0].ready = true;
                                    // Invoke the callback with the element
                                    //listener.element.addedOnDOM();
                                    listener.fn.call(listener.element, $el);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
Component.defaultContext = window;
Component.surrogates = {};
Component.registered = {};
Component.usedComponentIDS = {};
Component.domID2ID = {};
Component.instances = {};
Component.observer = {};