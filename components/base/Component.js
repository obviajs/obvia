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

    var _mousedown = _props.mousedown;
    var _click = _props.click;
    var _dblclick = _props.dblclick;

    //var _propUpdateMap = {"label":{"o":$el, "fn":"html", "p":[] }, "hyperlink":{}};
    //generate GUID for this component
    Object.defineProperty(this, "guid", 
    {
        get: function enabled() 
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
                this.$el.prop('disabled', !v);
            }
        }
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

    this.registerEvents = function () 
    {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach && typeof this.afterAttach == 'function' ? this.afterAttach.bind(this) : undefined,
                    'mousedown' : _mousedown && typeof _mousedown == 'function' ? _mousedown.bind(this) : undefined,
                    'click': _click && typeof _click == 'function' ? _click.bind(this) : undefined,
                    'dblclick': _dblclick && typeof _dblclick == 'function' ? _dblclick.bind(this) : undefined
                }
            }
        ]
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

    this.setColspan = function (colspan) 
    {
        if(this.$el && !isNaN(colspan))
        {
            this.$el.removeClass([
                'col-sm-0', 'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5',
                'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12'
            ]);
            this.$el.addClass('col-sm-' + colspan);
        }
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
    
    
    ready("#" + this.domID, function (element) {
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