var Parent = function (_props, _hideComponents = false) {
    let _$hadow = $("<div/>");
    let _comprenders = [];
    let _self = this;
    let _children = {};
    let _enabled;

    let _proxy = new Proxy(this, {
        get: function (target, property, receiver) {
            if (!target.hasOwnProperty(property)) {
                if (target.children && target.children[property])
                    return target.children[property];
            }
            return Reflect.get(...arguments);
        }
    });

    Object.defineProperty(this, "hasInternalComponents", {
        get: function hasInternalComponents() {
            return _hideComponents;
        }
    });

    Object.defineProperty(this, "proxy", {
        get: function proxy() {
            return _proxy;
        }
    });

    Object.defineProperty(this, "children", {
        get: function children() {
            return _children;
        },
        enumerable: true
    });

    Object.defineProperty(this, "components", {
        get: function components() {
            return _components;
        },
        set: function components(v) {
            this.removeAllChildren();
            _components = v;
            this.addComponents();
        },
        enumerable: true && !_hideComponents,
        configurable: true
    });

    this.add = function (childOrLiteral, index) {
        if (childOrLiteral) {
            if (childOrLiteral.$el)
                this.addChild(childOrLiteral, index);
            else
                this.addComponent(childOrLiteral, index);
        }
    };

    this.addChild = function (child, index) {
        if (child && !_children[child.id]) {
            index = index > -1 ? index : _components.length;
            if (index >= 0 && index <= _components.length) {
                index = index > -1 ? index : _components.length;
                let component = {
                    ctor: child.ctor,
                    props: child.props
                };
                _components.splice(index, 0, component);
                _children[child.id] = child;
                _csorted.splice(index, 0, child.id);
                _ccRelation[child.id] = component;
                child.parent = _proxy;
                child.parentType = this.type;
                child.parentForm = _proxy.ctor == 'Form' ? _proxy : _proxy.parentForm;
                child.repeaterIndex = this.repeaterIndex;
                child.parentRepeater = this.parentRepeater;

                return child.render().then(function (cmpInstance) {
                    _self.$el.insertAt(cmpInstance.$el, index);
                    let event = jQuery.Event("childAdded");
                    event.child = child;
                    _self.trigger(event);
                });
            }
        }
    };
    this.indexOfChild = function (child) {
        let ind = -1;
        if (child) {
            ind = _components.indexOf(_ccRelation[child.id]);
        }
        return ind;
    };
    this.removeAllChildren = function (mode = 1) {
        for (let cid in this.children) {
            this.removeChild(this.children[cid], mode);
        }
    };
    this.removeChild = function (child, mode = 1) {
        if (child) {
            //TODO: kur fshijme child, beji resize siblings; kur fshijme row/col dhe jane 2 gjithsej hiq container prind 
            let ind = _components.indexOf(_ccRelation[child.id]);
            if (ind > -1) {
                _components.splice(ind, 1);
                ind = _csorted.indexOf(child.id);
                if (ind > -1) {
                    _csorted.splice(ind, 1);
                }
                delete _children[child.id];
                delete _ccRelation[child.id];
                child.destruct(mode);
                child.parent = null;
            } else {
                console.log("Failed to remove Component: " + child.id + ". It was not found in child list.");
            }
        }
    };

    this.removeChildAtIndex = function (index, mode = 1) {
        if (index >= 0 && index < _components.length) {
            this.removeChild(_children[_components[index].props.id], mode);
        }
    };

    this.addComponent = function (component, index) {
        index = index > -1 ? index : _components.length;
        _components.splice(index, 0, component);
        let cr = this.addComponentInContainer(this.$container, component, index);

        cr.promise.then(function (cmpInstance) {
            if (cmpInstance && cmpInstance.attach && !cmpInstance.attached) {
                if (cmpInstance.appendTo) {
                    cmpInstance.appendTo.append(cmpInstance.$el);
                } else
                    _self.$container.insertAt(cmpInstance.$el, index);
            } else {
                console.log("Component not found " + _csorted[i]);
            }
            _self.trigger('endDraw');
        });
        return cr.cmp;
    };

    Object.defineProperty(this, "sortChildren", {
        get: function sortChildren() {
            return _sortChildren;
        },
        enumerable: true
    });

    Object.defineProperty(this, "renders", {
        get: function renders() {
            return _comprenders;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "csorted", {
        get: function csorted() {
            return _csorted;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "ccRelation", {
        get: function ccRelation() {
            return _ccRelation;
        },
        enumerable: false,
        configurable: true
    });

    let _ccRelation = {},
        _csorted = [];
    this.getChildDefinedProperties = function (c) {
        return _ccRelation[c.id];
    };

    this.addComponentInContainer = function (container, component, index) {
        if (container) {
            component.props.ownerDocument = this.ownerDocument;
            let cmpLit = {};
            shallowCopy(component, cmpLit, ["props"]);
            cmpLit.props = {};
            shallowCopy(component.props, cmpLit.props, ["id", "bindingDefaultContext"]);
            if (component.props.id && _children[component.props.id]) {
                cmpLit.props.id = component.props.id + '_' + Object.keys(_children).length;
            } else
                cmpLit.props.id = component.props.id;
            if (component.props.bindingDefaultContext == null) {
                cmpLit.props.bindingDefaultContext = this.bindingDefaultContext;
            } else {
                cmpLit.props.bindingDefaultContext = component.props.bindingDefaultContext;
            }
            cmpLit.props.repeaterIndex = _self.repeaterIndex;
            cmpLit.props.parentRepeater = _self.parentRepeater;
            let cmp = Component.fromLiteral(cmpLit);
            //component.props.id = cmp.id;
            if (_children[cmp.id])
                throw new Error("Child id: " + cmp.id + " is already used in Parent with id: " + _self.id + ". Components ids should be unique within their parent.");
            else
                _children[cmp.id] = cmp;
            _ccRelation[cmp.id] = component;
            _csorted.splice(index, 0, cmp.id);
            cmp.parent = _proxy;
            cmp.parentType = _self.type;
            cmp.parentForm = _proxy.ctor == 'Form' ? _proxy : _proxy.parentForm;

            index = index > -1 ? index : _components.length;
            let cr = {
                "cmp": cmp,
                "promise": cmp.render()
            };
            _comprenders.push(cr);
            return cr;
        }
    };
    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            this.$container = this.$el;
            if (typeof _init == 'function')
                _init.apply(this, arguments);
        }
    };

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if (_props.enabled != null && !this.getBindingExpression("enabled"))
                this.enabled = _props.enabled;
        }
    };
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);

        }
    };

    let _defaultParams = {
        components: [],
        enabled: true,
        sortChildren: false
    };
    //_props = extend(false, false, _defaultParams, _props);
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    let _components = _props.components;

    this.$container = null;

    let _creationFinished = false;
    //let _afterAttach = _props.afterAttach;
    //_props.afterAttach = this.afterAttach;
    let _sortChildren = _props.sortChildren;
    //override because creationComplete will be thrown when all children components are created
    // this.afterAttach = undefined;
    this.addComponents = function (cmps) {
        _self.trigger('beginDraw');
        let arrInst = [];
        let components;
        if (cmps) {
            components = cmps;
            //_self.$container.contents().appendTo(_$hadow);
        } else {
            components = this.components;
        }
        _comprenders = [];
        if (components && Array.isArray(components) && components.length > 0) {
            if (_sortChildren) {
                acSort(components, "props.index");
            }
            for (let i = 0; i < components.length; i++) {
                if (isObject(components[i])) {
                    if (cmps) {
                        _components.splice(i, 0, components[i]);
                    }
                    let cr = this.addComponentInContainer(_$hadow, components[i], i);
                    arrInst.push(cr.cmp);
                }
            }
            let cr = arrayFromKey(_comprenders, "promise");
            Promise.all(cr).then(function () {
                _comprenders = [];
                for (let i = 0; i < _csorted.length; i++) {
                    let cmpInstance = _children[_csorted[i]];
                    if (cmpInstance && cmpInstance.attach && !cmpInstance.attached) {
                        if (cmpInstance.appendTo) {
                            cmpInstance.appendTo.insertAt(cmpInstance.$el, i);
                        } else
                            _$hadow.insertAt(cmpInstance.$el, i);
                    } else {
                        console.log("Component not found " + _csorted[i]);
                    }
                }

                _$hadow.contents().appendTo(_self.$container);
                _self.trigger('endDraw');
            });
        } else {
            _creationFinished = true;
            _self.trigger('endDraw');
        }
        return arrInst;
    };

    if (!this.hasOwnProperty("render")) {
        let _rPromise;
        this.render = function () {
            if (_rPromise == null) {
                _rPromise = new Promise((resolve, reject) => {
                    _self.on("endDraw", function (e) {
                        if (e.target.id == _self.domID) {
                            resolve(_proxy);
                        }
                    });
                    this.addComponents();
                });
            }
            return _rPromise;
        };
    }

    Component.call(this, _props);
    /*
        this.destruct = function (mode=1)
        {
            for(let id in _children){
                _children[id].destruct(mode);
            }
            base.destruct(mode);
        }
    */
    let objFromDesc = Object.getOwnPropertyDescriptor(this, "enabled");
    let _oenabled = objFromDesc['set'];
    Object.defineProperty(this, "enabled", {
        get: function enabled() {
            return _enabled;
        },
        set: function enabled(v) {
            if (_enabled != v) {
                _enabled = v;
                _oenabled.call(this, v);
                for (let childId in this.children) {
                    this.children[childId].enabled = v;
                }
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(this, "props", {
        get: function props() {
            return new Props(_self, _props);
        },
        configurable: true
    });
    return _proxy;
};
Parent.prototype.ctor = 'Parent';