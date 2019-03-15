var Component = function(_props, overrided=false)
{
    var _defaultParams = {
        id: "Component_"+Component.instanceCnt,
        enabled: true,
        classes: [],
        guid: guid()
    };

    _props = extend(false, false, _defaultParams, _props);
    var _guid = _props.guid;
    var _id = _props.id;
    var _enabled = _props.enabled;
    var _classes;
    var _parent = _props.parent;
    var _mousedown = _props.mousedown;
    var _mouseover = _props.mouseover;
    var _mouseup = _props.mouseup;
    var _click = _props.click;
    var _dblclick = _props.dblclick;
    var _keydown = _props.keydown;
    var _keyup = _props.keyup;
    
    var _watchers = [];
    var _bindings = [];
    var _attached = false;

    //var _propUpdateMap = {"label":{"o":$el, "fn":"html", "p":[] }, "hyperlink":{}};
    //generate GUID for this component
    Object.defineProperty(this, "guid",
    {
        get: function guid() 
        {
            return _guid;
        }
    });

    //domID property
    Object.defineProperty(this, 'id',
    {
        get: function () {
            return _id;
        }
    });

    Object.defineProperty(this, 'domID',
    {
        get: function () {
            return _id + '_' + _guid;
        }
    });

    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props){
                if(this.hasOwnProperty(prop))
                    obj[prop] = this[prop];
            }
            return obj;
        }
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
                        _parent.detach(_self.$el);
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
                    this.$el.prop('disabled', !v);
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "classes",
    {
        get: function classes()
        {
            return _classes;
        },
        set: function classes(v)
        {
            if((!_classes && v) || (_classes && !_classes.equals(v)))
            {
                _classes = v;
                if(this.$el)
                    this.$el.addClass(_classes);
            }
        }
    });

    this.$el = null;
    this.embedded = false;
    var tpl = this.template();
    if('jquery' in Object(tpl))
        this.$el = tpl;
    else if(tpl && tpl!="")
        this.$el = $(tpl);
    if(_props.classes)
    {
        this.classes = _props.classes;
    }
    var _defaultHandlers =
    [
        {
            registerTo: this.$el, events: {
                'mousedown': _mousedown && typeof _mousedown == 'function' ? _mousedown.bind(this) : undefined,
                'mouseover': _mouseover && typeof _mouseover == 'function' ? _mouseover.bind(this) : undefined,
                'mouseup': _mouseup && typeof _mouseup == 'function' ? _mouseup.bind(this) : undefined,
                'click': _click && typeof _click == 'function' ? _click.bind(this) : undefined,
                'dblclick': _dblclick && typeof _dblclick == 'function' ? _dblclick.bind(this) : undefined,
                'keydown': _keydown && typeof _keydown == 'function' ? _keydown.bind(this) : undefined,
                'keyup': _keyup && typeof _keyup == 'function' ? _keyup.bind(this) : undefined
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
                eventsObj[eventsArr[i]] = privateEvent && typeof privateEvent == 'function' ? privateEvent.bind(this) : undefined;
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

    var _dataTriggerEventList = this.dataTriggerEvents();
   
    this.registerEvents = function ()
    {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach && typeof this.afterAttach == 'function' ? this.afterAttach.bind(this) : undefined,
                }
            }
        ].concat(_dataTriggerEventList);
    };//

    this.render = function ()
    {
        return this.$el;
    };

    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _props.afterAttach == 'function')
                _props.afterAttach.apply(this, arguments);
            if(!e.isDefaultPrevented()){
                this.trigger('creationComplete');
                console.log("creation Complete", this.$el.attr("id"));
            }
        }
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
   
    this.scrollTo = function () 
    {
        if(this.$el)
        {
            $("body").animate({
                scrollTop: this.$el.offset().top - 100
            }, 1200);
        }
        return this;
    }

    this.destruct = function ()
    {
        if(this.$el)
            this.$el.remove();
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
                    this.$el.on(eventType, function ()
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
                        return fnc.apply(_self, args);
                    });
                else
                    throw Error("$el in not defined");
            }
        }
        return this;
    }

    this.trigger = function ()
    {
        if(this.$el)
            this.$el.trigger.apply(this.$el, arguments);
    }

    this.off = function ()
    {
        if(this.$el)
            this.$el.off.apply(this.$el, arguments);
    }
    ++Component.instanceCnt;

 
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

    this.refreshBindings = function(data)
    {
        this.resetBindings();
        this.applyBindings(_bindings, data);
    };

    this.applyBindings = function(bindings, data)
    {
        _bindings = bindings;
        var _self = this;
        for(var bi=0;bi<bindings.length;bi++){
            (function(currentItem, bindingExp, site, site_chain){
                return (function(e) { // a closure is created
                    //this here refers to window context
                    var defaultBindTo = "currentItem_"+_self.guid;
                    this[defaultBindTo] = (currentItem || Component.defaultContext);
                   // var context = extend(false, true, this, obj);
                   _watchers.splicea(_watchers.length, 0, BindingUtils.getValue(this, bindingExp, site, site_chain, defaultBindTo));
                })();	
            })(data, bindings[bi].expression, this, [bindings[bi].property]);
        }
    };

    this.keepBase = function()
    {
        this.base = {};
        for(var prop in this)
        {
            this.base[prop] = this[prop];
        }
    }
    if(overrided)
    {
        this.keepBase();
    }

    //execute functions before component attached on dom
    if (this['beforeAttach'] && (typeof this.beforeAttach == 'function'))
    this.beforeAttach();

   //"#" + this.$el.attr('id'), 
   Component.ready(this, function (element) {
       //execute inner handlers if theres any registered
       var handlers = [];
       var _self = this;
       if (_self['registerEvents'] && (typeof _self.registerEvents == 'function'))
       {
           handlers = _self.registerEvents();
           //call inner event
           handlers.forEach(function (handler, i) {
               for (var innerEventIn in handler.events) {
                   if (typeof handler.events[innerEventIn] == 'function') {
                       if(handler.registerTo != undefined && handler.registerTo != null){
                           handler.registerTo.on(innerEventIn, (function (innerEventIn, component) { // a closure is created
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
                                   handler.events[innerEventIn].apply(component, args);
                               }
                           })(innerEventIn, _self));
                       }else
                       {
                           console.log("Event handler registration on '"+_self.id+"' failed because the target is undefined");
                       }
                   }
               }
           });
       }
       _self.trigger('afterAttach');
   });
   
}
Component.instanceCnt = 0;
Component.fromLiteral = function(_literal, bindingDefaultContext=null)
{
    var _literal = Object.assign({}, _literal);
    var props = Object.assign({}, _literal.props);
    var _bindings = [];
    //build components properties, check bindings
    var _processedProps = {};
    
    for (var prop in props) {
        if (typeof prop == 'string') {
            //check for binding
            if (props[prop] && props[prop][0] == '{' && props[prop][props[prop].length - 1] == '}') {
                var expression = props[prop].slice(1, -1);
                _bindings.push({"expression":expression, "property":prop});
            } else {
                //no binding
                _processedProps[prop] = props[prop];
            }
        }
    }

   
    //construct the component
    if (typeof _literal.constructor == "string") {
        _literal.constructor = eval(_literal.constructor);
    }
    var el = new _literal.constructor(_processedProps);
    el.applyBindings(_bindings, bindingDefaultContext);
    return el;
}
Component.listeners = []
Component.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

Component.ready = function(cmp, fn) 
{
    // Store the selector and callback to be monitored
    if(cmp.$el)
    {
        Component.listeners.push({
            element: cmp,
            fn: fn
        });
    }
    if (!Component.observer) 
    {
        Component.observer = new MutationObserver(Component.check);
        // Watch for changes in the document window.document.documentElement
        Component.observer.observe(document, {
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
            for(var h=0;h<mutations[g].addedNodes.length;h++)
            {
                var DOMNode = mutations[g].addedNodes[h];
                if(DOMNode.querySelectorAll)
                {
                    // Check the DOM for elements matching a stored selector
                    for (var i = 0, len = Component.listeners.length, listener, elements; i < len; i++) 
                    {
                        listener = Component.listeners[i];
                        var $el = listener.element.$el;
                        var id = $el.attr('id');
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
Component.defaultContext = window;