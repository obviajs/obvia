import { Literal } from "/obvia/lib/Literal.js";
import { UseBindings } from "/obvia/lib/UseBindings.js";
import { Attr } from "/obvia/components/base/Attr.js";
import { Css } from "/obvia/components/base/Css.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { RepeaterEventArgs } from "/obvia/components/Repeater/RepeaterEventArgs.js";
import { Props } from "/obvia/components/base/Props.js";

var Component = function (_props)
{
    let _self = this;
    if (!Component[this.ctor])
    {
        Component[this.ctor] = {};
        Component[this.ctor].instanceInc = 0;
    }
    ++Component[this.ctor].instanceInc;
    delete _props["guid"];
    let _defaultParams = {
        id: this.ctor + "_" + Component[this.ctor].instanceInc,
        classes: [],
        guid: StringUtils.guid(),
        bindingDefaultContext: null,
        ownerDocument: document,
        attr: {},
        visible: true,
        enabled: true,
        index: 0,
        appendTo: undefined,
        attach: true
    };

    ObjectUtils.fromDefault(_defaultParams, _props);
    //ObjectUtils.shallowCopy(ObjectUtils.extend(false, false, _defaultParams, _props), _props);
    UseBindings.call(this, _props);
    for (let prop in _props)
    {
        if (this.bindedProps.hasOwnProperty(prop))
            delete _props[prop];
    }

    let _parentRepeater = _props.parentRepeater;
    let _repeaterIndex = _props.repeaterIndex;
    let _guid = _props.guid;
    let _attr, _css;
    let _id = _props.id = ((!_props.id) || (_props.id == "")) ? _defaultParams.id : _props.id;
    let _enabled, _readonly, _draggable, _visible = true, _display = true;
    let _classes = [];
    let _parent = _props.parent;
    let _parentForm = _props.parentForm;
    let _mousedown = _props.mousedown;
    let _mouseover = _props.mouseover;
    let _mouseout = _props.mouseout;
    let _mouseup = _props.mouseout;
    let _click = _props.click;
    let _dblclick = _props.dblclick;
    let _blur = _props.blur;
    let _keydown = _props.keydown;
    let _keyup = _props.keyup;
    let _change = _props.change;
    let _drop = _props.drop;
    let _dragover = _props.dragover;
    let _dragstart = _props.dragstart;
    let _dragenter = _props.dragenter;
    let _dragleave = _props.dragleave;
    let _dragend = _props.dragend;
    let _idChanged = _props.idChanged;
    let _ownerDocument = _props.ownerDocument || _defaultParams.ownerDocument;
    let _attached = false;
    let _attach = _props.attach;
    let _index = _props.index;
    let _appendTo = _props.appendTo;

    let _domID = _id + '_' + _guid;
    //let _propUpdateMap = {"label":{"o":$el, "fn":"html", "p":[] }, "hyperlink":{}};
    //generate GUID for this component
    Object.defineProperty(this, "guid", {
        get: function guid()
        {
            return _guid;
        },
        enumerable: true
    });

    Object.defineProperty(this, "dependencies", {
        get: function dependencies()
        {
            return [{ "attr": this.attr, "css": this.css }, this.children];
        },
        enumerable: false
    });

    Object.defineProperty(this, "attach", {
        get: function attach()
        {
            return _attach;
        }
    });
    Object.defineProperty(this, "attached", {
        get: function attached()
        {
            return _attached;
        },
        set: function attached(v)
        {
            if (_attached != v)
            {
                _attached = v;
            }
        }
    });

    Object.defineProperty(this, "proxyMaybe", {
        get: function proxyMaybe()
        {
            let inst = this;
            if (this.hasOwnProperty("proxy"))
            {
                inst = this.proxy;
            }
            return inst;
        }
    });

    //domID property
    Object.defineProperty(this, 'id', {
        get: function ()
        {
            return _id;
        },
        set: function (v)
        {
            if (v && v.trim() && (_id != v))
            {
                if (!this.parent || !this.parent[v])
                {
                    let oldId = _id;
                    let oldomId = _domID;

                    delete Component.instances[this.domID];
                    _id = v;
                    _domID = _id + '_' + _guid;
                    Component.instances[_domID] = this.proxyMaybe;

                    if (this.parent)
                    {
                        if (this.parent.ctor == "Repeater")
                        {
                            this.parent[_id] = this.parent[oldId];
                            delete this.parent[oldId];
                        } else
                        {
                            this.parent.children[_id] = this.parent.children[oldId];
                            delete this.parent.children[oldId];

                            let ind = this.parent.csorted.indexOf(oldId);
                            if (ind > -1)
                            {
                                this.parent.csorted.splice(ind, 1, _id);
                            }
                        }
                    }
                    this.$el.attr("id", _domID);
                    _props.id = _id;
                    let evt = new jQuery.Event("idChanged");
                    evt.oldValueId = oldId;
                    evt.newValueId = _id;
                    evt.oldValueDomId = oldomId;
                    evt.newValueDomId = _domID;
                    _self.trigger(evt);
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "index", {
        get: function index()
        {
            return _index;
        },
        enumerable: true
    });

    Object.defineProperty(this, 'ownerDocument', {
        get: function ownerDocument()
        {
            return _ownerDocument;
        },
        set: function ownerDocument(v)
        {
            if (!_ownerDocument || _ownerDocument != v)
            {
                _ownerDocument = v;
                Component.ready(this, function (element)
                {
                    _self.proxyMaybe.trigger('afterAttach');
                }, function (element)
                {
                    _self.proxyMaybe.trigger('detached');
                }, _ownerDocument);
            }
        }
    });

    Object.defineProperty(this, "appendTo", {
        get: function appendTo()
        {
            return _appendTo;
        },
        set: function appendTo(v)
        {
            if (_appendTo != v)
            {
                _appendTo = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, 'domID', {
        get: function domID()
        {
            return _domID;
        }
    });

    Object.defineProperty(this, "attr", {
        get: function attr()
        {
            return _attr;
        },
        enumerable: true
    });
    Object.defineProperty(this, "css", {
        get: function css()
        {
            return _css;
        },
        enumerable: true
    });

    Object.defineProperty(this, "props", {
        get: function props()
        {
            return new Props(_self, _props);
        },
        configurable: true
    });

    Object.defineProperty(this, "literal", {
        get: function literal()
        {
            return {
                ctor: this.ctor,
                props: this.props
            };
        },
        configurable: true
    });

    Object.defineProperty(this, "parent", {
        get: function parent()
        {
            return _parent;
        },
        set: function parent(v)
        {
            if (_parent != v)
            {
                if (_parent)
                {
                    _parent.removeChild(_self);
                }
                _parent = v;
                if (this.children)
                {
                    for (let cid in this.children)
                    {
                        this.children[cid].invalidateScopeChain();
                    }
                }
                if (this.invalidateScopeChain && typeof this.invalidateScopeChain == 'function')
                    this.invalidateScopeChain();
            }
        },
        enumerable: false
    });

    Object.defineProperty(this, "parentForm", {
        get: function parentForm()
        {
            return _parentForm;
        },
        set: function parentForm(v)
        {
            if (_parentForm != v)
            {
                _parentForm = v;
                if (this.children)
                {
                    for (let cid in this.children)
                    {
                        this.children[cid].parentForm = _parentForm;
                    }
                }
            }
        },
        enumerable: false
    });

    Object.defineProperty(this, "visible", {
        get: function visible()
        {
            return _visible;
        },
        set: function visible(v)
        {
            if (_visible != v)
            {
                _visible = v;
                if (this.$el)
                {
                    if (_visible)
                        this.$el.css({ "visibility": "visible" });
                    else
                        this.$el.css({ "visibility": "hidden" });
                }
            }
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this, "display", {
        get: function display()
        {
            return _display;
        },
        set: function display(v)
        {
            if (_display != v)
            {
                _display = v;
                if (this.$el)
                {
                    if (_display)
                        this.show();
                    else
                        this.hide();
                }
            }
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this, "enabled", {
        get: function enabled()
        {
            return _enabled;
        },
        set: function enabled(v)
        {
            if (_enabled != v)
            {
                _enabled = v;
                if (this.$el)
                    this.$el.find("input, select, textarea, button").addBack("input, select, textarea, button").each(function ()
                    {
                        if (!v)
                            $(this).attr('disabled', 'disabled');
                        else
                            $(this).removeAttr('disabled');
                    });
            }
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this, "readonly", {
        get: function readonly()
        {
            return _readonly;
        },
        set: function readonly(v)
        {
            if (_readonly != v)
            {
                _readonly = v;
                if (this.$el)
                    this.$el.find("input, select, textarea, button").addBack("input, select, textarea, button").each(function ()
                    {
                        if (v)
                            $(this).prop('readonly', 'readonly');
                        else
                            $(this).removeAttr('readonly');
                    });
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "draggable", {
        get: function draggable()
        {
            return _draggable;
        },
        set: function draggable(v)
        {
            if (_draggable != v)
            {
                _draggable = v;
                if (!v)
                    this.$el.prop('draggable', 'false');
                else
                    this.$el.prop('draggable', 'true');
            }
        },
        enumerable: true
    });

    let _classesClone;

    Object.defineProperty(this, "classes", {
        get: function classes()
        {
            return _classes;
        },
        set: function classes(v)
        {
            if (v && (!_classesClone || !_classesClone.equals(v)))
            {
                if (this.$el)
                {
                    if (Array.isArray(v))
                    {
                        _classes = v.difference(_classesClone, true);
                        let len = _classes.length;
                        for (let i = 0; i < len; i++)
                        {
                            let _class = _classes[i];
                            if (this.$el.hasClass(_class))
                                this.$el.removeClass(_class);
                        }
                        _classes = v;
                        len = _classes.length;
                        for (let i = 0; i < len; i++)
                        {
                            this.$el.addClass(_classes[i]);
                        }
                        _classesClone = _classes.slice(0);
                    }
                }
            }
        },
        enumerable: true
    });

    this.my = function (id)
    {
        return id + "_" + this.guid;
    };

    this.$el = null;

    let tpl = this.template();
    if ('jquery' in Object(tpl))
        this.$el = tpl;
    else if (tpl && tpl != "")
        this.$el = $(tpl);
    this.$el.ownerDocument = _ownerDocument;
    let dt = this.$el.attr("data-triggers");

    if (dt && !ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"]))
    {
        _props.attr["data-triggers"] = _props.attr["data-triggers"] + " " + dt;
    }
    _attr = new Attr(_props.attr, this);
    _css = new Css(_props.css, this);

    let _DOMMutation = this.DOMMutation;
    this.DOMMutation = function (e)
    {
        if (typeof _props.DOMMutation == 'function')
            _props.DOMMutation.apply(this.proxyMaybe, arguments);
        if (!e.isDefaultPrevented())
        {
            if (typeof _DOMMutation == 'function')
                _DOMMutation.apply(this.proxyMaybe, arguments);
        }
    };

    let _init = this.init;
    this.init = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _props.init == 'function')
                _props.init.apply(this.proxyMaybe, arguments);
            //TODO: not neccessary ? 
            if (!e.isDefaultPrevented())
            {
                if (typeof _init == 'function')
                    _init.apply(this.proxyMaybe, arguments);
            }
            if (_props.classes)
            {
                this.classes = _props.classes;
            }
        }
    };

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _props.beforeAttach == 'function')
                _props.beforeAttach.apply(this.proxyMaybe, arguments);
            //TODO: not neccessary ? 
            if (!e.isDefaultPrevented())
            {
                if (typeof _beforeAttach == 'function')
                    _beforeAttach.apply(this.proxyMaybe, arguments);
            }
            if (_props.enabled != null)
                this.enabled = _props.enabled;
            if (_props.readonly != null)
                this.readonly = _props.readonly;
        }
    };
    let _drawEnded;
    let _beginDraw = this.beginDraw;
    this.beginDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            _drawEnded = false;
            //console.log("beginDraw : Type:", this.ctor + " id:" + this.$el.attr("id"));
            if (typeof _props.beginDraw == 'function')
                _props.beginDraw.apply(this.proxyMaybe, arguments);
            if (!e.isDefaultPrevented())
            {
                if (typeof _beginDraw == 'function')
                    _beginDraw.apply(this.proxyMaybe, arguments);
            }
        }
    };

    let _endDraw = this.endDraw;
    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            _drawEnded = true;
            //console.log("endDraw : Type:", this.ctor + " id:" + this.$el.attr("id"));
            if (typeof _props.endDraw == 'function')
                _props.endDraw.apply(this.proxyMaybe, arguments);
            //TODO: not neccessary ? 
            if (!e.isDefaultPrevented())
            {
                if (typeof _endDraw == 'function')
                    _endDraw.apply(this.proxyMaybe, arguments);
            }
            if (!_attached)
            {
                this.applyMyBindings();
                _self.trigger('beforeAttach');
            }
        }
    };

    this.applyMyBindings = function ()
    {
        if (_self.bindingsManager.watchers.length == 0)
        {
            this.applyBindings();
            this.attr.applyBindings();
            this.css.applyBindings();
        }
    };

    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            _attached = true;
            if (typeof _props.afterAttach == 'function')
                _props.afterAttach.apply(this.proxyMaybe, arguments);
            if (!e.isDefaultPrevented())
            {
                if (typeof _afterAttach == 'function')
                    _afterAttach.apply(this.proxyMaybe, arguments);
            }
            //console.log("AfterAttach : Type:",this.ctor+" id:"+ this.$el.attr("id"));
        }
    };

    let _detached = this.detached;
    this.detached = function (e)
    {
        if (e.target.id == this.domID)
        {
            _self.attached = false;
            if (typeof _props.detached == 'function')
                _props.detached.apply(this.proxyMaybe, arguments);
            if (!e.isDefaultPrevented())
            {
                if (typeof _detached == 'function')
                    _detached.apply(this.proxyMaybe, arguments);
            }
        }
    };

    let _defaultHandlers = [{
        registerTo: this.$el,
        events: {
            'mousedown': _mousedown && typeof _mousedown == 'function' ? _mousedown.bind(_self.proxyMaybe) : undefined,
            'mouseover': _mouseover && typeof _mouseover == 'function' ? _mouseover.bind(_self.proxyMaybe) : undefined,
            'mouseout': _mouseout && typeof _mouseout == 'function' ? _mouseout.bind(_self.proxyMaybe) : undefined,
            'mouseup': _mouseup && typeof _mouseup == 'function' ? _mouseup.bind(_self.proxyMaybe) : undefined,
            'click': _click && typeof _click == 'function' ? _click.bind(_self.proxyMaybe) : undefined,
            'dblclick': _dblclick && typeof _dblclick == 'function' ? _dblclick.bind(_self.proxyMaybe) : undefined,
            'blur': _blur && typeof _blur == 'function' ? _blur.bind(_self.proxyMaybe) : undefined,
            'keydown': _keydown && typeof _keydown == 'function' ? _keydown.bind(_self.proxyMaybe) : undefined,
            'keyup': _keyup && typeof _keyup == 'function' ? _keyup.bind(_self.proxyMaybe) : undefined,
            'change': _change && typeof _change == 'function' ? _change.bind(_self.proxyMaybe) : undefined,
            'drop': _drop && typeof _drop == 'function' ? _drop.bind(_self.proxyMaybe) : undefined,
            'dragover': _dragover && typeof _dragover == 'function' ? _dragover.bind(_self.proxyMaybe) : undefined,
            'dragstart': _dragstart && typeof _dragstart == 'function' ? _dragstart.bind(_self.proxyMaybe) : undefined,
            'dragend': _dragend && typeof _dragend == 'function' ? _dragend.bind(_self.proxyMaybe) : undefined,
            'dragenter': _dragenter && typeof _dragenter == 'function' ? _dragenter.bind(_self.proxyMaybe) : undefined,
            'dragleave': _dragleave && typeof _dragleave == 'function' ? _dragleave.bind(_self.proxyMaybe) : undefined,
            'idChanged': _idChanged && typeof _idChanged == 'function' ? _idChanged.bind(_self.proxyMaybe) : undefined,
            'DOMMutation': this.DOMMutation && typeof this.DOMMutation == 'function' ? this.DOMMutation.bind(_self.proxyMaybe) : undefined,
            'afterAttach': this.afterAttach && typeof this.afterAttach == 'function' ? this.afterAttach.bind(_self.proxyMaybe) : undefined,
            'detached': this.detached && typeof this.detached == 'function' ? this.detached.bind(_self.proxyMaybe) : undefined,
            'beforeAttach': this.beforeAttach && typeof this.beforeAttach == 'function' ? this.beforeAttach.bind(_self.proxyMaybe) : undefined,
            'init': this.init && typeof this.init == 'function' ? this.init.bind(_self.proxyMaybe) : undefined,
            'beginDraw': this.beginDraw && typeof this.beginDraw == 'function' ? this.beginDraw.bind(_self.proxyMaybe) : undefined,
            'endDraw': this.endDraw && typeof this.endDraw == 'function' ? this.endDraw.bind(_self.proxyMaybe) : undefined
        }
    }];

    this.dataTriggerEvents = function ()
    {
        let customEvents = _defaultHandlers;

        this.$el.find('[data-triggers]').addBack('[data-triggers]').each(function ()
        {
            let eventsObj = {};
            let events = $(this).data('triggers');
            let eventsArr = events.split(" ");

            for (let i = 0; i < eventsArr.length; i++)
            {
                let eventType = eventsArr[i];
                if (customEvents[0].events[eventType])
                {
                    //overrided listener, so remove default listener on $el
                    delete customEvents[0].events[eventType];
                }
                let privateEvent = _props[eventType];
                eventsObj[eventsArr[i]] = privateEvent && typeof privateEvent == 'function' ? privateEvent.bind(_self.proxyMaybe) : undefined;
            }
            let found = false;
            for (let i = 0; i < customEvents.length; i++)
            {
                if (customEvents[i].registerTo.attr('id') == $(this).attr('id'))
                {
                    customEvents[i].events = ObjectUtils.extend(false, false, eventsObj, customEvents[i].events);
                    found = true;
                    break;
                }
            }
            if (!found)
            {
                customEvents = customEvents.concat([{
                    registerTo: $(this),
                    events: eventsObj
                }]);
            }

        });

        return customEvents;
    };

    let _dataTriggerEventList = this.dataTriggerEvents();
    this.registerEvents = function ()
    {
        return _dataTriggerEventList;
    }; //
    Object.defineProperty(this, "events", {
        get: function events()
        {
            return _dataTriggerEventList;
        }
    });

    Object.defineProperty(this, "drawEnded", {
        get: function drawEnded()
        {
            return _drawEnded;
        }
    });

    if (!this.hasOwnProperty("render"))
    {
        this.render = function ()
        {
            _self.trigger('beginDraw');
            _self.trigger('endDraw');
            return Promise.resolve(this);
        };
    }
    //action methods on component
    this.show = function ()
    {
        if (this.$el)
        {
            this.$el.show();
            _display = true;
        }
        return this;
    };

    this.hide = function ()
    {
        if (this.$el)
        {
            this.$el.hide();
            _display = false;
        }
        return this;
    };
    this.blur = function ()
    {
        if (this.$el)
            this.$el.blur();
        return this;
    };
    this.scrollTo = function ()
    {
        if (this.$el)
        {
            this.$el[0].scrollTop = this.$el.offset().top - 100;
        }
        return this;
    };
    this.focus = function (preventScroll = true)
    {
        if (this.$el)
        {
            this.$el[0].focus({
                "preventScroll": preventScroll
            });
        }
    };
    this.destruct = function (mode = 1)
    {
        return new Promise((resolve, reject) =>
        {
            let arrow = (e) =>
            {
                if (e.target.id == _self.domID)
                {
                    resolve();
                }
                _self.proxyMaybe.off('detached', arrow);
            };
            _self.proxyMaybe.on('detached', arrow);
            if (_self.$el)
                mode == 1 ? _self.$el.remove() : _self.$el.detach();
        });
        //_self.attached = false;
    };

    //register outside handlers
    //event handling

    Object.defineProperty(this, "repeaterIndex", {
        get: function repeaterIndex()
        {
            return _repeaterIndex;
        },
        set: function repeaterIndex(v)
        {
            if (_repeaterIndex != v)
            {
                _repeaterIndex = v;
                if (this.children)
                {
                    for (let cid in this.children)
                    {
                        this.children[cid].repeaterIndex = _repeaterIndex;
                    }
                }
            }
        }
    });

    Object.defineProperty(this, "parentRepeater", {
        get: function parentRepeater()
        {
            return _parentRepeater;
        },
        set: function parentRepeater(v)
        {
            if (_parentRepeater != v)
            {
                _parentRepeater = v;
                if (this.children)
                {
                    for (let cid in this.children)
                    {
                        this.children[cid].parentRepeater = _parentRepeater;
                    }
                }
            }
        }
    });

    let _generateProxyHandler = function (originalHandler)
    {
        let f = function ()
        {
            let args = [],
                e = arguments[0];
            for (let i = 0; i < arguments.length; i++)
            {
                args.push(arguments[i]);
            }

            if (_self.parentRepeater)
            {
                args = args.concat([
                    new RepeaterEventArgs(
                        _self.parentRepeater.rowItems[_self.repeaterIndex],
                        _self.parentRepeater.dataProvider[_self.repeaterIndex],
                        _self.repeaterIndex
                    )
                ]);
            } else if (e.target != e.currentTarget && Component.instances[e.target.id] && Component.instances[e.target.id].parentRepeater)
            {
                args = args.concat([
                    new RepeaterEventArgs(
                        Component.instances[e.target.id].parentRepeater.rowItems[Component.instances[e.target.id].repeaterIndex],
                        Component.instances[e.target.id].parentRepeater.dataProvider[Component.instances[e.target.id].repeaterIndex],
                        Component.instances[e.target.id].repeaterIndex
                    )
                ]);
            }
            args[0].originalContext = this;
            return originalHandler.apply(_self.proxyMaybe, args);
        };
        f.bind(_self.proxyMaybe);
        return f;
    };

    this.on = function (eventType, fnc)
    {
        eventType = eventType.trim();
        if (typeof fnc !== 'function')
        {
            throw Error("The specified parameter is not a callback");
        } else
        {
            if (typeof fnc == 'function')
            {
                if (this.$el)
                {
                    let eventTypeArr = eventType.split(" ");
                    for (let t = 0; t < eventTypeArr.length; t++)
                    {
                        eventType = eventTypeArr[t];
                        if (eventType.trim() != "")
                        {
                            if (_handlers[eventType] == null)
                                _handlers[eventType] = [];
                            if (!this.hasListener(eventType, fnc))
                            {
                                let proxyHandler = _generateProxyHandler(fnc);
                                _handlers[eventType].push({
                                    "proxyHandler": proxyHandler,
                                    "originalHandler": fnc
                                });
                                this.$el.on(eventType, proxyHandler);
                            } else
                            {
                                console.log("Tried to add a listener that was previously added.");
                            }
                        }
                    }
                } else
                    console.log("$el in not defined");
            }
        }
        return this;
    };

    let _handlers = {};

    this.trigger = function ()
    {
        if (this.$el)
            this.$el.trigger.apply(this.$el, arguments);
    };

    this.off = function ()
    {
        if (this.$el)
        {
            this.$el.off.apply(this.$el, arguments);
            let evt = arguments[0],
                handler, ind;
            if (!Array.isArray(evt))
                evt = [evt];
            if (typeof arguments[1] == 'function')
            {
                handler = arguments[1];
                ind = 1;
            } else if (typeof arguments[2] == 'function')
            {
                handler = arguments[2];
                ind = 2;
            }
            let found;
            for (let i = 0; i < evt.length; i++)
            {
                found = ArrayUtils.getMatching(_handlers[evt[i]], "originalHandler", handler, true);
                if (found.objects.length > 0)
                {
                    arguments[ind] = found.objects[0].proxyHandler;
                    this.$el.off.apply(this.$el, arguments);
                    _handlers[evt[i]].splice(found.indices[0], 1);
                }
            }
        }
    };

    this.hasListener = function (eventType, fnc)
    {
        let found = ArrayUtils.getMatching(_handlers[eventType], "originalHandler", fnc, true);
        return found.objects.length > 0;
    };

    this.implement = function (inst)
    {
        for (let prop in inst)
        {
            if (isGetter(inst, prop))
                copyAccessor(prop, inst, this);
            else
                this[prop] = inst[prop];
        }
    };
    //"#" + this.$el.attr('id'), 
    this.initEvents = function (element)
    {
        //execute inner handlers if theres any registered
        let handlers = [];

        if (_self['registerEvents'] && (typeof _self.registerEvents == 'function'))
        {
            handlers = _self.registerEvents();
            //call inner event
            let len = handlers.length;
            for (let h = 0; h < len; h++)
            {
                let handler = handlers[h];
                for (let innerEventIn in handler.events)
                {
                    if (typeof handler.events[innerEventIn] == 'function')
                    {
                        if (handler.registerTo != null)
                        {
                            if (_handlers[innerEventIn] == null)
                                _handlers[innerEventIn] = [];

                            let proxyHandler = _generateProxyHandler(handler.events[innerEventIn]);
                            _handlers[innerEventIn].push({
                                "proxyHandler": proxyHandler,
                                "originalHandler": handler.events[innerEventIn]
                            });
                            handler.registerTo.on(innerEventIn, proxyHandler);

                        } else
                        {
                            console.log("Event handler registration on '" + _self.id + "' failed because the target is undefined");
                        }
                    }
                }
            }
        }
    };

    Component.instances[_domID] = this.proxyMaybe;

    if (_props.visible != null)
        this.visible = _props.visible;
    if (_props.display != null)
        this.display = _props.display;
    if (_props.draggable != null)
        this.draggable = _props.draggable;

    _self.initEvents(this.$el);

    //execute functions before component attached on dom
    if (_ownerDocument)
    {
        Component.ready(this, function (element)
        {
            _self.proxyMaybe.trigger('afterAttach');
        }, function (element)
        {
            _self.proxyMaybe.trigger('detached');
        }, _ownerDocument);
    }

    this.find = function (childId)
    {
        let r = ArrayUtils.objectHierarchyGetMatchingMember(this, "id", childId, "children", false),
            m = null;
        if (r && r.match)
            m = r.match;
        return m;
    };

    this.isInViewport = function ()
    {
        if (this.$el)
        {
            let box = this.$el[0].getBoundingClientRect();
            return (
                box.top >= 0 &&
                box.left >= 0 &&
                box.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                box.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

    this.trigger('init');
};
Component.instanceInc = 0;
Literal.call(Component);
Component.listeners = {};
Component.objListeners = {};
Component.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

Component.ready = function (cmp, fn, fnDetached, ownerDocument = document)
{
    // Store the selector and callback to be monitored
    if (!ownerDocument["id"])
    {
        ownerDocument["id"] = StringUtils.guid();
    }
    if (cmp.$el)
    {
        if (Component.listeners[ownerDocument["id"]] == null)
        {
            Component.listeners[ownerDocument["id"]] = [];
        }
        Component.listeners[ownerDocument["id"]].push({
            element: cmp,
            "fn": fn,
            "fnDetached": fnDetached
        });

        Component.objListeners[cmp.domID] = {
            "element": cmp,
            "fn": fn,
            "fnDetached": fnDetached
        };
    }
    if (!Component.observer[ownerDocument["id"]])
    {
        Component.observer[ownerDocument["id"]] = new MutationObserver(Component.check);
        // Watch for changes in the document window.document.documentElement
        let oo = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        };

        Component.observer[ownerDocument["id"]].observe(ownerDocument, oo);
    }
    // Check if the element is currently in the DOM
    //Component.check();
};

Component.check = function (mutations)
{
    if (mutations && mutations.length > 0)
    {
        for (let g = 0; g < mutations.length; g++)
        {
            if (Component.instances[mutations[g].target.id])
            {
                let evt = new jQuery.Event("DOMMutation");
                evt.mutation = mutations[g];
                Component.instances[mutations[g].target.id].trigger(evt);
            }
            if (mutations[g].type == "childList")
            {
                let len = mutations[g].removedNodes.length;
                for (let h = 0; h < len; h++)
                {
                    let DOMNode = mutations[g].removedNodes[h];
                    if (DOMNode.querySelectorAll)
                    {
                        if (Component.listeners[DOMNode.ownerDocument.id])
                        {
                            Component.ch(DOMNode, "fnDetached");
                        }
                    }
                }

                len = mutations[g].addedNodes.length;
                for (let h = 0; h < len; h++)
                {
                    let DOMNode = mutations[g].addedNodes[h];
                    if (DOMNode.querySelectorAll)
                    {
                        // Check the DOM for elements matching a stored selector
                        if (Component.listeners[DOMNode.ownerDocument.id])
                        {
                            Component.ch(DOMNode);
                        }
                    }
                }
            }
        }
    }
};
Component.ch = function (domNode, operation = "fn")
{

    let listener = Component.objListeners[domNode.id];
    let len = domNode.children.length;
    for (let i = 0; i < len; i++)
    {
        Component.ch(domNode.children[i], operation);
    }
    if (listener)
    {
        if ((!listener.element.attached && operation == "fn") || (listener.element.attached && operation == "fnDetached"))
        {
            listener[operation].call(listener.element, listener.element.$el);
        }
    } //else
    //console.log("DOMNode not registered as a component", domNode);
};

Component.defaultContext = window;
Component.registered = {};
Component.instances = {};
Component.observer = {};
export
{
    Component
};