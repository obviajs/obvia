var Component = function (_props) {
    let _self = this;
    if (!Component[this.ctor]) {
        Component[this.ctor] = {};
        Component[this.ctor].instanceInc = 0;
    }
    ++Component[this.ctor].instanceInc;

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
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    let ppb = Component.processPropertyBindings(_props);
    for (let prop in _props) {
        if (!ppb.processedProps.hasOwnProperty(prop))
            delete _props[prop];
    }
    if (_props.bindingDefaultContext == null) {
        _props.bindingDefaultContext = this;
    }
    let _parentRepeater = _props.parentRepeater;
    let _repeaterIndex = _props.repeaterIndex;
    let _bindingDefaultContext = _props.bindingDefaultContext;
    let _guid = _props.guid;
    let _attr, _css;
    let _id = _props.id = ((!_props.id) || (_props.id == "")) ? _defaultParams.id : _props.id;
    let _enabled, _draggable, _visible = true;
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
    let _creationComplete = _props.creationComplete;
    let _change = _props.change;
    let _drop = _props.drop;
    let _dragover = _props.dragover;
    let _dragstart = _props.dragstart;
    let _dragenter = _props.dragenter;
    let _dragleave = _props.dragleave;
    let _dragend = _props.dragend;
    let _idChanged = _props.idChanged;
    let _ownerDocument = _props.ownerDocument;
    let _watchers = [];
    let _bindings = ppb.bindings;
    let _attached = false;
    let _attach = _props.attach;
    let _index = _props.index;
    let _appendTo = _props.appendTo;

    let _domID = _id + '_' + _guid;

    Component.instances[_domID] = this;
    let _bindingsManager = BindingsManager.getInstance(this);
    //let _propUpdateMap = {"label":{"o":$el, "fn":"html", "p":[] }, "hyperlink":{}};
    //generate GUID for this component
    Object.defineProperty(this, "guid", {
        get: function guid() {
            return _guid;
        },
        enumerable: true
    });

    Object.defineProperty(this, "attach", {
        get: function attach() {
            return _attach;
        }
    });
    Object.defineProperty(this, "attached", {
        get: function attached() {
            return _attached;
        },
        set: function (v) {
            if (_attached != v) {
                _attached = v;
            }
        }
    });
    Object.defineProperty(this, "bindingDefaultContext", {
        get: function bindingDefaultContext() {
            return _bindingDefaultContext;
        },
        set: function bindingDefaultContext(v) {
            if (_bindingDefaultContext != v) {
                _bindingDefaultContext = v;
                this.refreshBindings(_bindingDefaultContext);
            }
        },
        enumerable: false
    });

    Object.defineProperty(this, "proxyMaybe", {
        get: function proxyMaybe() {
            let inst = this;
            if (this.hasOwnProperty("proxy")) {
                inst = this.proxy;
            }
            return inst;
        }
    });

    //domID property
    Object.defineProperty(this, 'id', {
        get: function () {
            return _id;
        },
        set: function (v) {
            if (v && v.trim() && (_id != v)) {
                if (!this.parent || !this.parent[v]) {
                    let oldId = _id;
                    let oldomId = _domID;

                    delete Component.instances[this.domID];
                    _id = v;
                    _domID = _id + '_' + _guid;
                    Component.instances[_domID] = this;

                    if (this.parent) {
                        if (this.parent.ctor == "Repeater") {
                            this.parent[_id] = this.parent[oldId];
                            delete this.parent[oldId];
                        } else {
                            this.parent.children[_id] = this.parent.children[oldId];
                            delete this.parent.children[oldId];

                            this.parent.ccRelation[_id] = this.parent.ccRelation[oldId];
                            delete this.parent.ccRelation[oldId];

                            let ind = this.parent.csorted.indexOf(oldId);
                            if (ind > -1) {
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
        get: function index() {
            return _index;
        },
        enumerable: true
    });

    Object.defineProperty(this, 'ownerDocument', {
        get: function ownerDocument() {
            return _ownerDocument;
        },
        set: function ownerDocument(v) {
            if (!_ownerDocument || _ownerDocument != v) {
                _ownerDocument = v;
                Component.ready(this, function (element) {
                    _self.proxyMaybe.trigger('afterAttach');
                }, function (element) {
                    _self.proxyMaybe.trigger('detached');
                }, _ownerDocument);
            }
        }
    });

    Object.defineProperty(this, "appendTo", {
        get: function appendTo() {
            return _appendTo;
        },
        set: function appendTo(v) {
            if (_appendTo != v) {
                _appendTo = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, 'domID', {
        get: function domID() {
            return _domID;
        }
    });

    Object.defineProperty(this, "spacing", {
        get: function spacing() {
            return _spacing;
        },
        enumerable: true
    });
    Object.defineProperty(this, "attr", {
        get: function attr() {
            return _attr;
        },
        enumerable: true
    });
    Object.defineProperty(this, "css", {
        get: function css() {
            return _css;
        },
        enumerable: true
    });

    Object.defineProperty(this, "props", {
        get: function props() {
            return new Props(_self, _props);
        },
        configurable: true
    });

    Object.defineProperty(this, "literal", {
        get: function literal() {
            return {
                ctor: this.ctor,
                props: this.props
            };
        },
        configurable: true
    });

    Object.defineProperty(this, "parent", {
        get: function parent() {
            return _parent;
        },
        set: function parent(v) {
            if (_parent != v) {
                if (_parent) {
                    if (_self.$el) {
                        if (_parent)
                            _parent.$el.detach(_self.$el);
                        if (v)
                            v.$el.append(_self.$el);
                    }
                }
                _parent = v;
            }
        },
        enumerable: false
    });

    Object.defineProperty(this, "parentForm", {
        get: function parentForm() {
            return _parentForm;
        },
        set: function parentForm(v) {
            if (_parentForm != v) {
                _parentForm = v;
                if (this.children) {
                    for (let cid in this.children) {
                        this.children[cid].parentForm = _parentForm;
                    }
                }
            }
        },
        enumerable: false
    });

    Object.defineProperty(this, "bindings", {
        get: function bindings() {
            return _bindings;
        }
    });

    Object.defineProperty(this, "visible", {
        get: function visible() {
            return _visible;
        },
        set: function visible(v) {
            if (_visible != v) {
                _visible = v;
                if (this.$el) {
                    if (_visible)
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
        get: function enabled() {
            return _enabled;
        },
        set: function enabled(v) {
            if (_enabled != v) {
                _enabled = v;
                if (this.$el)
                    this.$el.find("input, select, textarea, button").addBack("input, select, textarea, button").each(function () {
                        if (!v)
                            $(this).prop('disabled', 'disabled');
                        else
                            $(this).removeAttr('disabled');
                    });
            }
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this, "readonly", {
        get: function readonly() {
            return _readonly;
        },
        set: function readonly(v) {
            if (_readonly != v) {
                _readonly = v;
                if (this.$el)
                    this.$el.find("input, select, textarea, button").addBack("input, select, textarea, button").each(function () {
                        if (!v)
                            $(this).prop('readonly', 'readonly');
                        else
                            $(this).removeAttr('readonly');
                    });
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "draggable", {
        get: function draggable() {
            return _draggable;
        },
        set: function draggable(v) {
            if (_draggable != v) {
                _draggable = v;
                if (!v)
                    this.$el.prop('draggable', 'false');
                else
                    this.$el.prop('draggable', 'true');
            }
        },
        enumerable: true
    });
    Object.defineProperty(this, "classes", {
        get: function classes() {
            let r = _classes;
            if (1 != 1 && this.children) {
                let p;
                for (let _cid in this.children) {
                    if (this[this.childrenRID[_cid]] && this[this.childrenRID[_cid]]["ctor"]) {
                        if (!p)
                            r = {};
                        r[this.childrenRID[_cid]] = this[this.childrenRID[_cid]].classes;
                        p = true;
                    }
                }
                if (p) {
                    r["self"] = _classes;
                }
            }
            return r;
        },
        set: function classes(v) {
            if ((!_classes && v) || (_classes && (!_classes.equals(v)))) {
                if (this.$el) {
                    if (Array.isArray(v)) {
                        _classes = v.difference(_classes, true);
                        for (let i = 0; i < _classes.length; i++) {
                            let _class = _classes[i];
                            if (this.$el.hasClass(_class))
                                this.$el.removeClass(_class);
                        }
                        _classes = v;
                        for (let i = 0; i < _classes.length; i++) {
                            this.$el.addClass(_classes[i]);
                        }
                    } else {
                        for (let _cid in v) {
                            if (_cid == "self")
                                this.classes = v[_cid];
                            else if (this.proxyMaybe[_cid] && this.proxyMaybe[_cid]["ctor"]) {
                                this.proxyMaybe[_cid].classes = v[_cid];
                            }
                        }
                    }
                }

            }
        },
        enumerable: true
    });

    this.my = function (id) {
        return id + "_" + this.guid;
    };

    this.$el = null;

    let tpl = this.template();
    if ('jquery' in Object(tpl))
        this.$el = tpl;
    else if (tpl && tpl != "")
        this.$el = $(tpl);

    _attr = new Attr(_props.attr, this.$el);
    _css = new Css(_props.css, this.$el);

    let _DOMMutation = this.DOMMutation;
    this.DOMMutation = function (e) {
        if (typeof _props.DOMMutation == 'function')
            _props.DOMMutation.apply(this.proxyMaybe, arguments);
        if (!e.isDefaultPrevented()) {
            if (typeof _DOMMutation == 'function')
                _DOMMutation.apply(this.proxyMaybe, arguments);
        }
    };

    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _props.init == 'function')
                _props.init.apply(this.proxyMaybe, arguments);
            //TODO: not neccessary ? 
            if (!e.isDefaultPrevented()) {
                if (typeof _init == 'function')
                    _init.apply(this.proxyMaybe, arguments);
            }
            if (_props.classes) {
                this.classes = _props.classes;
            }
        }
    };

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _props.beforeAttach == 'function')
                _props.beforeAttach.apply(this.proxyMaybe, arguments);
            //TODO: not neccessary ? 
            if (!e.isDefaultPrevented()) {
                if (typeof _beforeAttach == 'function')
                    _beforeAttach.apply(this.proxyMaybe, arguments);
            }
        }
    };
    let _beginDraw = this.beginDraw;
    this.beginDraw = function (e) {
        if (e.target.id == this.domID) {
            //console.log("beginDraw : Type:", this.ctor + " id:" + this.$el.attr("id"));
            if (typeof _props.beginDraw == 'function')
                _props.beginDraw.apply(this.proxyMaybe, arguments);
            if (!e.isDefaultPrevented()) {
                if (typeof _beginDraw == 'function')
                    _beginDraw.apply(this.proxyMaybe, arguments);
            }
        }
    };

    let _endDraw = this.endDraw;
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            //console.log("endDraw : Type:", this.ctor + " id:" + this.$el.attr("id"));
            if (typeof _props.endDraw == 'function')
                _props.endDraw.apply(this.proxyMaybe, arguments);
            //TODO: not neccessary ? 
            if (!e.isDefaultPrevented()) {
                if (typeof _endDraw == 'function')
                    _endDraw.apply(this.proxyMaybe, arguments);
            }
            if ((_props.applyBindings == null || _props.applyBindings == true) && _bindingsManager.watchers.length == 0)
                this.applyBindings(_bindingDefaultContext);
            _self.trigger('beforeAttach');
        }
    };

    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            _attached = true;
            if (typeof _props.afterAttach == 'function')
                _props.afterAttach.apply(this.proxyMaybe, arguments);
            if (!e.isDefaultPrevented()) {
                if (typeof _afterAttach == 'function')
                    _afterAttach.apply(this.proxyMaybe, arguments);
                if (!e.isDefaultPrevented()) {
                    this.trigger('creationComplete');
                    //console.log("CreationComplete : Type:",this.ctor+" id:"+ this.$el.attr("id"));
                }
            }
            //console.log("AfterAttach : Type:",this.ctor+" id:"+ this.$el.attr("id"));
        }
    };

    let _detached = this.detached;
    this.detached = function (e) {
        if (e.target.id == this.domID) {
            _self.attached = false;
            if (typeof _props.detached == 'function')
                _props.detached.apply(this.proxyMaybe, arguments);
            if (!e.isDefaultPrevented()) {
                if (typeof _detached == 'function')
                    _detached.apply(this.proxyMaybe, arguments);
            }
        }
    };

    let _defaultHandlers = [{
        registerTo: this.$el,
        events: {
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
            'dragend': _dragend && typeof _dragend == 'function' ? _dragend.bind(_self) : undefined,
            'dragenter': _dragenter && typeof _dragenter == 'function' ? _dragenter.bind(_self) : undefined,
            'dragleave': _dragleave && typeof _dragleave == 'function' ? _dragleave.bind(_self) : undefined,
            'idChanged': _idChanged && typeof _idChanged == 'function' ? _idChanged.bind(_self) : undefined,
            'DOMMutation': this.DOMMutation && typeof this.DOMMutation == 'function' ? this.DOMMutation.bind(_self) : undefined,
            'afterAttach': this.afterAttach && typeof this.afterAttach == 'function' ? this.afterAttach.bind(_self) : undefined,
            'detached': this.detached && typeof this.detached == 'function' ? this.detached.bind(_self) : undefined,
            'beforeAttach': this.beforeAttach && typeof this.beforeAttach == 'function' ? this.beforeAttach.bind(_self) : undefined,
            'init': this.init && typeof this.init == 'function' ? this.init.bind(_self) : undefined,
            'beginDraw': this.beginDraw && typeof this.beginDraw == 'function' ? this.beginDraw.bind(_self) : undefined,
            'endDraw': this.endDraw && typeof this.endDraw == 'function' ? this.endDraw.bind(_self) : undefined
        }
    }];

    this.dataTriggerEvents = function () {
        let customEvents = _defaultHandlers;

        this.$el.find('[data-triggers]').addBack('[data-triggers]').each(function () {
            let eventsObj = {};
            let events = $(this).data('triggers');
            let eventsArr = events.split(" ");

            for (let i = 0; i < eventsArr.length; i++) {
                let eventType = eventsArr[i];
                if (customEvents[0].events[eventType]) {
                    //overrided listener, so remove default listener on $el
                    delete customEvents[0].events[eventType];
                }
                let privateEvent = _props[eventType];
                eventsObj[eventsArr[i]] = privateEvent && typeof privateEvent == 'function' ? privateEvent.bind(_self) : undefined;
            }
            let found = false;
            for (let i = 0; i < customEvents.length; i++) {
                if (customEvents[i].registerTo.attr('id') == $(this).attr('id')) {
                    customEvents[i].events = extend(false, false, eventsObj, customEvents[i].events);
                    found = true;
                    break;
                }
            }
            if (!found) {
                customEvents = customEvents.concat([{
                    registerTo: $(this),
                    events: eventsObj
                }]);
            }

        });

        return customEvents;
    };

    let _dataTriggerEventList = this.dataTriggerEvents();
    this.registerEvents = function () {
        return _dataTriggerEventList;
    }; //
    Object.defineProperty(this, "events", {
        get: function events() {
            return _dataTriggerEventList;
        }
    });

    if (!this.hasOwnProperty("render")) {
        this.render = function () {
            _self.trigger('beginDraw');
            _self.trigger('endDraw');
            return Promise.resolve(this);
        };
    }
    //action methods on component
    this.show = function () {
        if (this.$el) {
            this.$el.show();
            _visible = true;
        }
        return this;
    };

    this.hide = function () {
        if (this.$el) {
            this.$el.hide();
            _visible = false;
        }
        return this;
    };
    this.blur = function () {
        if (this.$el)
            this.$el.blur();
        return this;
    };
    this.scrollTo = function () {
        if (this.$el) {
            this.$el[0].scrollTop = this.$el.offset().top - 100;
        }
        return this;
    };
    this.focus = function (preventScroll = true) {
        if (this.$el) {
            this.$el[0].focus({
                "preventScroll": preventScroll
            });
        }
    };
    this.destruct = function (mode = 1) {
        if (this.$el)
            mode == 1 ? this.$el.remove() : this.$el.detach();
        //_self.attached = false;
    };

    //register outside handlers
    //event handling

    Object.defineProperty(this, "repeaterIndex", {
        get: function repeaterIndex() {
            return _repeaterIndex;
        },
        set: function repeaterIndex(v) {
            if (_repeaterIndex != v) {
                _repeaterIndex = v;
                if (this.children) {
                    for (let cid in this.children) {
                        this.children[cid].repeaterIndex = _repeaterIndex;
                    }
                }
            }
        }
    });

    Object.defineProperty(this, "parentRepeater", {
        get: function parentRepeater() {
            return _parentRepeater;
        },
        set: function parentRepeater(v) {
            if (_parentRepeater != v) {
                _parentRepeater = v;
                if (this.children) {
                    for (let cid in this.children) {
                        this.children[cid].parentRepeater = _parentRepeater;
                    }
                }
            }
        }
    });

    let _generateProxyHandler = function (originalHandler) {
        let f = function () {
            let args = [],
                e = arguments[0];
            for (let i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            if (_self.parentRepeater) {
                args = args.concat([
                    new RepeaterEventArgs(
                        _self.parentRepeater.rowItems[_self.repeaterIndex],
                        _self.parentRepeater.dataProvider[_self.repeaterIndex],
                        _self.repeaterIndex
                    )
                ]);
            } else if (e.target != e.currentTarget && Component.instances[e.target.id] && Component.instances[e.target.id].parentRepeater) {
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

    this.on = function (eventType, fnc) {
        eventType = eventType.trim();
        if (typeof fnc !== 'function') {
            throw Error("The specified parameter is not a callback");
        } else {
            if (typeof fnc == 'function') {
                if (this.$el) {
                    let eventTypeArr = eventType.split(" ");
                    for (let t = 0; t < eventTypeArr.length; t++) {
                        eventType = eventTypeArr[t];
                        if (eventType.trim() != "") {
                            if (_handlers[eventType] == null)
                                _handlers[eventType] = [];
                            if (!this.hasListener(eventType, fnc)) {
                                let proxyHandler = _generateProxyHandler(fnc);
                                _handlers[eventType].push({
                                    "proxyHandler": proxyHandler,
                                    "originalHandler": fnc
                                });
                                this.$el.on(eventType, proxyHandler);
                            } else {
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

    this.trigger = function () {
        if (this.$el)
            this.$el.trigger.apply(this.$el, arguments);
    };

    this.off = function () {
        if (this.$el) {
            this.$el.off.apply(this.$el, arguments);
            let evt = arguments[0],
                handler, ind;
            if (!Array.isArray(evt))
                evt = [evt];
            if (typeof arguments[1] == 'function') {
                handler = arguments[1];
                ind = 1;
            } else if (typeof arguments[2] == 'function') {
                handler = arguments[2];
                ind = 2;
            }
            let found;
            for (let i = 0; i < evt.length; i++) {
                found = getMatching(_handlers[evt[i]], "originalHandler", handler, true);
                if (found.objects.length > 0) {
                    arguments[ind] = found.objects[0].proxyHandler;
                    this.$el.off.apply(this.$el, arguments);
                    _handlers[evt[i]].splice(found.indices[0], 1);
                }
            }
        }
    };

    this.hasListener = function (eventType, fnc) {
        let found = getMatching(_handlers[eventType], "originalHandler", fnc, true);
        return found.objects.length > 0;
    };

    this.getBindingExpression = function (property) {
        let match = getMatching(_bindings, "property", property, true);
        let expression = null;
        if (match.objects.length > 0) {
            expression = match.objects[0]["expression"];
        }
        return expression;
    };

    this.resetBindings = function () {
        _bindingsManager.resetBindings();
    };

    this.setBindingExpression = function (property, expression) {
        let match = getMatching(_bindings, "property", property, true);
        if (match.indices.length > 0) {
            let b = getBindingExp(expression);
            if (b) {
                let newBinding = {
                    "expression": b.expression,
                    "property": property,
                    "nullable": false
                };
                _bindings.splice(match.indices[0], 1, newBinding);

                let currentItem = _bindingDefaultContext;
                let bindingExp = expression;
                let site = this;
                let site_chain = [property];
                let nullable = false;

                //this here refers to window context
                let defaultBindTo = "currentItem_" + _self.guid;
                window[defaultBindTo] = (currentItem || this);
                if (!("currentItem" in window[defaultBindTo])) {
                    // window[defaultBindTo]["currentItem"] = window[defaultBindTo];
                    Object.defineProperty(window[defaultBindTo], "currentItem", {
                        value: window[defaultBindTo],
                        enumerable: false,
                        configurable: true
                    });
                }
                // let context = extend(false, true, this, obj);
                let fn = function () {
                    _bindingsManager.getValue(window, bindingExp, site_chain, defaultBindTo);
                };
                if (nullable) {
                    let fnDelayed = whenDefined(window[defaultBindTo], bindingExp, fn);
                    fnDelayed();
                } else {
                    fn();
                }
            }
        }
    };

    let _bindedTo;
    this.refreshBindings = function (data) {
        if (_bindedTo != data) {
            this.resetBindings();
            this.applyBindings(data);
            if (this.children) {
                for (let cid in this.children) {
                    if (this.children[cid].bindingDefaultContext == _bindingDefaultContext)
                        this.children[cid].refreshBindings(data);
                }
            }
        }
        _bindingDefaultContext = data;
    };

    this.applyBindings = function (data) {
        _bindedTo = data;
        for (let bi = 0; bi < _bindings.length; bi++) {
            let currentItem = data;
            let bindingExp = _bindings[bi].expression;

            let site_chain = [_bindings[bi].property];
            let nullable = _bindings[bi].nullable;

            //this here refers to window context
            let defaultBindTo = "currentItem_" + _self.guid;
            window[defaultBindTo] = (currentItem || this);
            if (!("currentItem" in window[defaultBindTo])) {
                Object.defineProperty(window[defaultBindTo], "currentItem", {
                    value: window[defaultBindTo],
                    enumerable: false,
                    configurable: true
                });
            }
            // let context = extend(false, true, this, obj);
            let fn = function () {
                _bindingsManager.getValue(window, bindingExp, site_chain, defaultBindTo);
            };
            if (nullable) {
                let identifierTokens = BindingsManager.getIdentifiers(bindingExp);
                if (identifierTokens) {
                    let len = identifierTokens.length;
                    let cc = window[defaultBindTo];
                    coroutine(function* () {
                        for (let i = 0; i < len; i++) {
                            yield whenDefinedPromise(cc, identifierTokens[i].value);
                            cc = cc[identifierTokens[i].value];
                        }
                        fn();
                    });
                }
            } else {
                fn();
            }
        }
    };

    this.keepBase = function () {
        this.base = {};
        for (let prop in this) {
            if (isGetter(this, prop))
                copyAccessor(prop, this, this.base);
            else
                this.base[prop] = this[prop];
        }
    };

    this.implement = function (inst) {
        for (let prop in inst) {
            if (isGetter(inst, prop))
                copyAccessor(prop, inst, this);
            else
                this[prop] = inst[prop];
        }
    };
    //"#" + this.$el.attr('id'), 
    this.initEvents = function (element) {
        //execute inner handlers if theres any registered
        let handlers = [];

        if (_self['registerEvents'] && (typeof _self.registerEvents == 'function')) {
            handlers = _self.registerEvents();
            //call inner event
            let len = handlers.length;
            for (let h = 0; h < len; h++) {
                let handler = handlers[h];
                for (let innerEventIn in handler.events) {
                    if (typeof handler.events[innerEventIn] == 'function') {
                        if (handler.registerTo != null) {
                            if (_handlers[innerEventIn] == null)
                                _handlers[innerEventIn] = [];

                            let proxyHandler = _generateProxyHandler(handler.events[innerEventIn]);
                            _handlers[innerEventIn].push({
                                "proxyHandler": proxyHandler,
                                "originalHandler": handler.events[innerEventIn]
                            });
                            handler.registerTo.on(innerEventIn, proxyHandler);

                        } else {
                            console.log("Event handler registration on '" + _self.id + "' failed because the target is undefined");
                        }
                    }
                }
            }
        }
    };

    if (_props.enabled != null)
        this.enabled = _props.enabled;
    if (_props.visible != null)
        this.visible = _props.visible;
    if (_props.draggable != null)
        this.draggable = _props.draggable;
    let _spacing = new Spacing(_props.spacing, this.$el);

    _self.initEvents(this.$el);

    //execute functions before component attached on dom
    if (_ownerDocument) {
        Component.ready(this, function (element) {
            _self.proxyMaybe.trigger('afterAttach');
        }, function (element) {
            _self.proxyMaybe.trigger('detached');
        }, _ownerDocument);
    }

    this.find = function (childId) {
        let r = objectHierarchyGetMatchingMember(this, "id", childId, "children", false),
            m = null;
        if (r && r.match)
            m = r.match;
        return m;
    };

    this.trigger('init');
};

Component.processPropertyBindings = function (props) {
    let _bindings = [];
    //build components properties, check bindings
    let _processedProps = {};

    for (let prop in props) {
        if (typeof prop == 'string') {
            //check for binding
            let b = getBindingExp(props[prop]);
            if (b) {
                if (prop != "bindingDefaultContext") {
                    _bindings.push({
                        "expression": b.expression,
                        "property": prop,
                        "nullable": b.nullable
                    });
                } else
                    _bindings.unshift({
                        "expression": b.expression,
                        "property": prop,
                        "nullable": b.nullable
                    });
            } else {
                //no binding
                _processedProps[prop] = props[prop];
            }
        }
    }
    return {
        "bindings": _bindings,
        "processedProps": _processedProps
    };
};

Component.instanceInc = 0;
Component.fromLiteral = function (_literal) {
    //let _literal = Object.assign({}, _literal);
    //let props = Object.assign({}, _literal.props);
    let props = _literal.props;

    if (_literal.ctor) {
        if (typeof _literal.ctor == "string") {
            _literal.ctor = window[_literal.ctor];
        }
        let el = new _literal.ctor(props);
        return el;
    }
};
Component.listeners = {};
Component.objListeners = {};
Component.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

Component.ready = function (cmp, fn, fnDetached, ownerDocument = document) {
    // Store the selector and callback to be monitored
    if (!ownerDocument["id"]) {
        ownerDocument["id"] = StringUtils.guid();
    }
    if (cmp.$el) {
        if (Component.listeners[ownerDocument["id"]] == null) {
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
    if (!Component.observer[ownerDocument["id"]]) {
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

Component.check = function (mutations) {
    if (mutations && mutations.length > 0) {
        for (let g = 0; g < mutations.length; g++) {
            if (Component.instances[mutations[g].target.id]) {
                let evt = new jQuery.Event("DOMMutation");
                evt.mutation = mutations[g];
                Component.instances[mutations[g].target.id].trigger(evt);
            }
            if (mutations[g].type == "childList") {
                let len = mutations[g].removedNodes.length;
                for (let h = 0; h < len; h++) {
                    let DOMNode = mutations[g].removedNodes[h];
                    if (DOMNode.querySelectorAll) {
                        if (Component.listeners[DOMNode.ownerDocument.id]) {
                            Component.ch(DOMNode, "fnDetached");
                        }
                    }
                }

                len = mutations[g].addedNodes.length;
                for (let h = 0; h < len; h++) {
                    let DOMNode = mutations[g].addedNodes[h];
                    if (DOMNode.querySelectorAll) {
                        // Check the DOM for elements matching a stored selector
                        if (Component.listeners[DOMNode.ownerDocument.id]) {
                            Component.ch(DOMNode);
                        }
                    }
                }
            }
        }
    }
};
Component.ch = function (domNode, operation = "fn") {

    let listener = Component.objListeners[domNode.id];
    let len = domNode.children.length;
    for (let i = 0; i < len; i++) {
        Component.ch(domNode.children[i], operation);
    }
    if (listener) {
        if ((!listener.element.attached && operation == "fn") || (listener.element.attached && operation == "fnDetached")) {
            listener[operation].call(listener.element, listener.element.$el);
        }
    } else
        console.log("DOMNode not registered as a component", domNode);
};

Component.defaultContext = window;
Component.registered = {};
Component.instances = {};
Component.observer = {};