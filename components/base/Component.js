var Component = function(_props, overrided=false)
{
    var _defaultParams = {
        id: "Component_"+Component.instanceCnt,
        enabled: true
    };

    _props = extend(false, false, _defaultParams, _props);
    var _guid = guid();
    var _id = _props.id;
    var _enabled = _props.enabled;
    var _class = _props.class;
    var _colSpan = _props.colSpan;

    var _mousedown = _props.mousedown;
    var _click = _props.click;
    var _dblclick = _props.dblclick;

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

    Object.defineProperty(this, "cssClass",
    {
        get: function cssClass()
        {
            return _class;
        }
    });

    var _self = this;

    this.$el = null;
    this.embedded = false;
    this.$el = $(this.template());

    //spacing of element
    if (_props['spacing'])
    {
        if (_props.spacing['offset'])
            this.$el.addClass('offset-sm-' + _props.spacing.offset);
        if (_props.spacing['mb'])
            this.$el.addClass('mb-' + _props.spacing.mb);
        if (this.spacing['mt'])
            this.$el.addClass('mt-' + _props.spacing.mt);
    }

    var _defaultHandlers =
    [
        {
            registerTo: this.$el, events: {
                'mousedown' : _mousedown && typeof _mousedown == 'function' ? _mousedown.bind(this) : undefined,
                'click': _click && typeof _click == 'function' ? _click.bind(this) : undefined,
                'dblclick': _dblclick && typeof _dblclick == 'function' ? _dblclick.bind(this) : undefined
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
                if(customEvents[0][eventType])
                {
                    //overrided listener, so remove default listener on $el
                    delete customEvents[0][eventType];
                }
                var privateEvent = _props[eventType];
                eventsObj[eventsArr[i]] = privateEvent && typeof privateEvent == 'function' ? privateEvent.bind(this) : undefined;
            }
            var found = false;
            for(var i=0;i<customEvents.length;i++)
            {
                if(customEvents[i].registerTo.attr('id') == $(this).attr('id'))
                {
                    extend(false, false, eventsObj, customEvents[i].events);
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

    this.registerEvents = function ()
    {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach && typeof this.afterAttach == 'function' ? this.afterAttach.bind(this) : undefined,
                }
            }
        ].concat(this.dataTriggerEvents());
    };

    this.render = function ()
    {
        return this.$el;
    };

    this.afterAttach = function (e)
    {
        if (typeof _props.afterAttach == 'function')
            _props.afterAttach.apply(this, arguments);
        this.trigger('creationComplete');
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
    Object.defineProperty(this, "colSpan", 
    {
        get: function colSpan() 
        {
            return _colSpan;
        },
        set: function colSpan(v) 
        {
            if(_colSpan != v)
            {
                _colSpan = v;
                if(this.$el && v && !isNaN(v))
                {
                    this.$el.removeClass([
                        'col-sm-0', 'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5',
                        'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12'
                    ]);
                    this.$el.addClass('col-sm-' + v);
                }
            }
        },
        configurable: true
    });
   
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
                        fnc.apply(_self, args);
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

    //execute functions before component attached on dom
    if (this['beforeAttach'] && (typeof this.beforeAttach == 'function'))
        this.beforeAttach();


    ready("#" + this.$el.attr('id'), function (element) {
        //execute inner handlers if theres any registered
        var handlers = [];
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

    this.applyBindings = function(bindings, data)
    {
        var watchers = [];
        var _self = this;
        for(var bi=0;bi<bindings.length;bi++){
            (function(currentItem, bindingExp, site, site_chain){
                return (function(e) { // a closure is created
                    //this here refers to window context
                    var defaultBindTo = "currentItem_"+_self.guid;
                    this[defaultBindTo] = currentItem;
                   // var context = extend(false, true, this, obj);
                    watchers.splicea(watchers.length, 0, BindingUtils.getValue(this, bindingExp, site, site_chain, defaultBindTo));
                })();	
            })(data, bindings[bi].expression, this, [bindings[bi].property]);
        }
        return watchers;
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
}
Component.instanceCnt = 0;
Component.fromLiteral = function(_literal, bindingDefaultContext=null)
{
    var _literal = Object.assign({}, _literal);
    var props = Object.assign({}, _literal.props);

    //build components properties, check bindings
    var _processedProps = {};
    
    var bindings = [];
    for (var prop in props) {
        if (typeof prop == 'string') {
            //check for binding
            if (props[prop] && props[prop][0] == '{' && props[prop][props[prop].length - 1] == '}') {
                var expression = props[prop].slice(1, -1);
                bindings.push({"expression":expression, "property":prop});
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
    el.applyBindings(bindings, bindingDefaultContext);
    return el;
}