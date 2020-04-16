var Parent = function (_props, overrided = false, _isSurrogate = false) {
    let _$hadow = $("<div/>");
    let _compRenderPromises = [];
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
    
    Object.defineProperty(this, "proxy",
        {
            get: function proxy() {
                return _proxy;
            }
        });
    
    Object.defineProperty(this, "children",
        {
            get: function children() {
                return _children;
            },
            enumerable: true
        });
    
    Object.defineProperty(this, "components",
    {
        get: function components() {
            return _components;
        },
        set: function components(v) {
            this.removeAllChildren();
            _components = v;
            this.addComponents();
        },
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
                this.$el.insertAt(child.$el, index);
                let component = { ctor: child.ctor, props: child.props };
                _components.splice(index, 0, component);
                _children[child.id] = child;
                _csorted.splice(index, child.id);
                _ccRelation[child.id] = component;
                child.parent = _proxy;
                child.parentType = this.type;
                child.parentForm = _proxy;
                let event = jQuery.Event("childAdded");
                event.child = child;
                this.trigger(event);
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
        let cmp = this.addComponentInContainer(this.$container, component, index);
        let cr = arrayFromKey(_compRenderPromises, "promise");
        Promise.all(cr).then(function () {
            _compRenderPromises = [];
            for (let i = 0; i < _csorted.length; i++) {
                let cmpInstance = _children[_csorted[i]];
                if (cmpInstance && cmpInstance.attach) {
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
        return cmp;
    };

    Object.defineProperty(this, "sortChildren",
        {
            get: function sortChildren() {
                return _sortChildren;
            },
            enumerable: true
        });

    Object.defineProperty(this, "renderPromises",
        {
            get: function renderPromises() {
                return _compRenderPromises;
            },
            enumerable: false,
            configurable: true
        });
    let _ccRelation = {}, _csorted = [];    
    this.getChildDefinedProperties = function (c) {
        return _ccRelation[c.id];
    };

    this.addComponentInContainer = function (container, component, index) {
        if (container) {
            let resetBindingContext = false;
            component.props.ownerDocument = this.ownerDocument;
            if (component.props.bindingDefaultContext == null) {
                component.props.bindingDefaultContext = this.bindingDefaultContext;
                resetBindingContext = true;
            }
            let cmpLit = {};
            if (component.props.id && _children[component.props.id]) {
                shallowCopy(component, cmpLit, ["props"]);
                cmpLit.props = {};
                shallowCopy(component.props, cmpLit.props, ["id"]);
                cmpLit.props.id = component.props.id + '_' + _components.length;
            } else
                cmpLit = component;
            let cmp = Component.fromLiteral(cmpLit);
            //component.props.id = cmp.id;
            _children[cmp.id] = cmp;
            _ccRelation[cmp.id] = component;
            _csorted.splice(index, 0, cmp.id);
            cmp.parent = _proxy;
            cmp.parentType = _self.type;
            cmp.parentForm = _proxy;
            if (resetBindingContext) {
                component.props.bindingDefaultContext = null;
            }
           
            index = index > -1 ? index : _components.length;
            if (cmp.renderPromise) {
                _compRenderPromises.push({
                    "cmp": cmp, "promise": cmp.renderPromise().then(function (cmpInstance) {
                        /*if (cmpInstance.appendTo)
                        {
                            cmpInstance.appendTo.insertAt(cmpInstance.$el, index);
                        } else
                            container.insertAt(cmpInstance.$el, index);
                            */
                        --_countChildren;
                    })
                });
            } else {
                container.insertAt(cmp.render(), index);
                --_countChildren;
                if (_countChildren == 0) {
                    _$hadow.contents().appendTo(_self.$container);
                    _self.trigger('endDraw');
                }
            }
            
            //container.append(cmp.render());
            //expose component model
        
            return cmp;
        }
    };
    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if (_props.enabled === false)
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
    let _countChildren;
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
        _compRenderPromises = [];
        if (components && Array.isArray(components) && components.length > 0) {
            if (_sortChildren) {
                acSort(components, "props.index");
            }
            _countChildren = components.length;
            for (let i = 0; i < components.length; i++) {
                if (isObject(components[i])) {          
                    if (cmps) {
                        _components.splice(i, 0, components[i]);
                    }
                    arrInst.push(this.addComponentInContainer(_$hadow, components[i], i));
                }
            }
            let cr = arrayFromKey(_compRenderPromises, "promise");
            Promise.all(cr).then(function () {
                _compRenderPromises = [];
                for (let i = 0; i < _csorted.length; i++) {
                    let cmpInstance = _children[_csorted[i]];
                    if (cmpInstance && cmpInstance.attach) {
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
    
    let _rPromise;
    this.renderPromise = function () {
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function (e) {
                if (e.target.id == _self.domID) {
                    resolve(_proxy);
                }
            });
        });
        this.addComponents();
        return _rPromise;
    };
    
    Component.call(this, _props, true, _isSurrogate);
    let base = this.base;
    if (overrided) {
        this.keepBase();
    }
    /*
        this.destruct = function (mode=1)
        {
            for(let id in _children){
                _children[id].destruct(mode);
            }
            base.destruct(mode);
        }
    */
    Object.defineProperty(this, "enabled",
        {
            get: function enabled() {
                return _enabled;
            },
            set: function enabled(v) {
                if (_enabled != v) {
                    _enabled = v;
                    base.enabled = v;
                    for (let childId in this.children) {
                        this.children[childId].enabled = v;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
    
    Object.defineProperty(this, "propsLite", {
        get: function propsLite() {
            let obj = {};
            for (let prop in _props) {
                if (typeof _props[prop] != 'function' && (this[prop]==null || !this[prop].$el)) {
                    switch (prop) {
                        case "components":
                            let components = [];
                            if (_components) {
                                 for (let i = 0; i < _components.length;i++) {
                                    let component = _children[_components[i].props.id].literalLite;
                                    components.push(component);
                                }
                            }
                            obj[prop] = components;
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
    Object.defineProperty(this, "props", {
        get: function props() {
            let obj = {};
            for (let prop in _props) {
                if (typeof _props[prop] != 'function') {
                    switch (prop) {
                        case "components":
                            let components = [];
                            if (_components) {
                                 for (let i = 0; i < _components.length;i++) {
                                    let component = _children[_components[i].props.id].literal;
                                    components.push(component);
                                }
                            }
                            obj[prop] = components;
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
    return _proxy;
};
Parent.prototype.ctor = 'Parent';