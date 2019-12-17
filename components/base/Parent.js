var Parent = function(_props, overrided=false, _isSurrogate=false)
{
    let _$hadow = $("<div/>");
    let _proxy = new Proxy(this, {
        get: function(target, property, receiver) {
            if(!target.hasOwnProperty(property)){
                if(target.children && _self.childrenIDR[property] && target.children[_self.childrenIDR[property]])
                    return target.children[_self.childrenIDR[property]];
            }
            return Reflect.get(...arguments);
        }
    });
    
    Object.defineProperty(this, "proxy", 
    {
        get: function proxy() 
        {
            return _proxy;
        }
    });
    
    Object.defineProperty(this, "children", 
    {
        get: function children() 
        {
            return _children;
        }
    });
    
    Object.defineProperty(this, "components", 
    {
        get: function components() 
        {
            return _components;
        },
        set: function components(v) 
        {
            this.removeAllChildren();
            _components = v;
            this.addComponents();
        },
        configurable:true
    });

    Object.defineProperty(this, "magnets", 
    {
        get: function magnets() 
        {
            return _magnets;
        }
    });

    this.add = function(childOrLiteral, index){
        if(childOrLiteral){
            if(childOrLiteral.$el)
                this.addChild(childOrLiteral, index);
            else
                this.addComponent(childOrLiteral, index);
        }
    }

    this.addChild = function(child, index)
    {
        if(child)
        {
            index = index > -1? index : _components.length;
            if(index>=0 && index <= _components.length)
            {
                index = index > -1? index : _components.length;
                this.$el.insertAt(child.$el, index);
                _components.splice(index, 0, {ctor:child.ctor, props:child.props});
                _children[child.id] = child; 
                child.parent = _proxy;
                child.parentType = this.type;
                child.parentForm = _proxy;
                var event = jQuery.Event("childAdded");
                event.child = child;
                this.trigger(event);
            }
        }
    }
    this.indexOfChild = function(child)
    {
        var ind = -1;
        if(child){
            ind = indexOfObject(_components, "props.id",  child.id);
        }
        return ind;
    }
    this.removeAllChildren = function(mode=1)
    {
        for(var cid in this.children)
        {
            this.removeChild(this.children[cid], mode);
        }
    }
    this.removeChild = function(child, mode=1)
    {
        if(child)
        {
            //TODO: kur fshijme child, beji resize siblings; kur fshijme row/col dhe jane 2 gjithsej hiq container prind 
            var ind = indexOfObject(_components, "props.id",  child.id);
            if(ind >-1){
                _components.splice(ind, 1);
                delete _children[child.id];
                child.destruct(mode);
                child.parent = null;
            }else{
                console.log("Failed to remove Component: "+child.id+". It was not found in child list.");
            }
        }
    }

    this.removeChildAtIndex = function(index, mode=1)
    {
        if(index>=0 && index < _components.length)
        {
            this.removeChild(_children[_components[index].props.id], mode);
        }
    }

    this.addComponent = function (component, index)
    {
        index = index > -1? index : _components.length;
        _components.splice(index, 0, component);
        return this.addComponentInContainer(this.$container, component, index);
    }

    Object.defineProperty(this, "sortChildren",
    {
        get: function sortChildren()
        {
            return _sortChildren;
        },
        enumerable:true
    });

    Object.defineProperty(this, "childrenIDR",
    {
        get:function childrenIDR(){
            return _childrenIDR;
        },
        enumerable:false
    });

    Object.defineProperty(this, "childrenRID",
    {
        get:function childrenRID(){
            return _childrenRID;
        },
        enumerable:false
    });
    Object.defineProperty(this, "renderPromises",
    {
        get:function renderPromises(){
            return _compRenderPromises;
        },
        enumerable: false,
        configurable: true
    });
    let _childrenIDR = {};
    let _childrenRID = {};
    let _compRenderPromises = [];
    this.addComponentInContainer = function (container, component, index) 
    {
        if(container)
        {
            let resetBindingContext = false;
            component.props.ownerDocument = this.ownerDocument;
            if(component.props.bindingDefaultContext==null){
                component.props.bindingDefaultContext = this.bindingDefaultContext;
                resetBindingContext = true;
            }
            var cmp = Component.fromLiteral(component);
            if(!_childrenIDR[component.props.id]){
                _childrenIDR[component.props.id] = [];
            }
            _childrenRID[cmp.id] = component.props.id;
            _childrenIDR[component.props.id].push(cmp.id);
            component.props.id = cmp.id;
            _children[cmp.id] = cmp;
            cmp.parent = _proxy;
            cmp.parentType = _self.type;
            cmp.parentForm = _proxy;
            if(resetBindingContext){
                component.props.bindingDefaultContext = null;
            }
            cmp.on('creationComplete', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                _ccComponents.push(component.props.id);
                var event = jQuery.Event("childCreated");
                event.child = this;
                _self.trigger(event);
                if ((_ccComponents.length == _self.components.length - Object.keys(_magnetizedIndexes).length) && !_creationFinished) {
                    
                     //TODO:solve magnet dependencies, i.e: component is magnetized to a component that is magnetized to another component  
                    for(var i in _magnetizedIndexes)
                    {
                        var magnetCmp = Component.instances[_magnetizedIndexes[i]];

                        var magnetizedCmp = _self.addComponentInContainer(magnetCmp.$container, _components[i], i);
                        delete _magnetizedIndexes[i];
                    }
                    if (_ccComponents.length == _self.components.length && !_creationFinished) {
                        _creationFinished = true;
                        //02.05
                        //_self.trigger('creationComplete');
                    }
                }else{
                    
                }

            });
            index = index > -1? index : _components.length;
            if(cmp.renderPromise){
                _compRenderPromises.push({
                    "cmp": cmp, "promise": cmp.renderPromise().then(function (cmpInstance)
                    {
                        if (cmpInstance.appendTo)
                        {
                            cmpInstance.appendTo.insertAt(cmpInstance.$el, index);
                        } else
                            container.insertAt(cmpInstance.$el, index);
                        --_countChildren;
                        if (_countChildren == 0)
                        {
                            _$hadow.contents().appendTo(_self.$container);
                            _self.trigger('endDraw');
                        }
                    })
                });
            }else{
                container.insertAt(cmp.render(), index);
                --_countChildren;
                if(_countChildren==0){
                    _$hadow.contents().appendTo(_self.$container);
                    _self.trigger('endDraw');
                }
            }
                
            //container.append(cmp.render());
            //expose component model
            
            return cmp;
        }
    };

    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            /*if((!_creationFinished && (this.components && Array.isArray(this.components) && this.components.length>0)) || e.isDefaultPrevented())    
                e.preventDefault();*/
            
        }
    };

    var _defaultParams = {
        components:[],
        magnets:{},
        enabled:true,
        sortChildren: false
    };
    //_props = extend(false, false, _defaultParams, _props);
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    var _components = _props.components;
    var _magnets = _props.magnets;
    
    var _magnetized = {};

    var _ccComponents = [];
    this.$container = null;

    var _self = this;
    var _creationFinished = false;
    //var _afterAttach = _props.afterAttach;
    //_props.afterAttach = this.afterAttach;
    var _children = {};
    let _sortChildren = _props.sortChildren;
   
    
    //override because creationComplete will be thrown when all children components are created
    // this.afterAttach = undefined;
    var _magnetizedIndexes = {}; 
    let _countChildren;
    this.addComponents = function(cmps)
    {
        _self.trigger('beginDraw');
        let arrInst = [];
        let components;
        if(cmps){
            components = cmps;
        }else{
            components = this.components;
        }
        if(components && Array.isArray(components) && components.length>0)
        {
            if(_sortChildren){
                acSort(components, "props.index");
            }
            _countChildren = components.length;
            for(var i=0;i<components.length;i++)
            {
                if(isObject(components[i]))
                {
                    var magnet, isMagnetized = false;
                    if(_magnets && !Object.isEmpty(_magnets))
                    {
                        for(var magnet in _magnets)
                        {
                            if(_magnets[magnet] && _magnets[magnet].length>0)
                            {
                                if(_magnets[magnet].indexOf(components[i].props.id)>-1)
                                {
                                    isMagnetized = true;
                                    _magnetizedIndexes[i] = magnet;
                                }
                            }                    
                        }   
                    }
                    if(!isMagnetized)
                        arrInst.push(this.addComponentInContainer(_$hadow, components[i], i));
                    if(cmps){
                        _components.splice(i, 0, components[i]);
                    }
                }
            }
        }else{
            _creationFinished = true;
            _self.trigger('endDraw');
        }   
        return arrInst;
    }
    
    let _rPromise;
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
        this.addComponents();
        return _rPromise;
    }; 
    
    Component.call(this, _props, true, _isSurrogate);
    var base = this.base;
    if(overrided)
    {
        this.keepBase();
    }  
/*
    this.destruct = function (mode=1)
    {
        for(var id in _children){
            _children[id].destruct(mode);
        }
        base.destruct(mode);
    }
*/
    var _enabled = _props.enabled;
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
                base.enabled = v;
                for(var childId in this.children)
                {
                    this.children[childId].enabled = v;
                }
            }
        },
        enumerable:true,
        configurable: true
    });

    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props)
            {
                if(typeof _props[prop] != 'function')
                {
                    switch(prop)
                    {
                        case "components":
                            var components = [];
                            for(var cid in _children)
                            {
                                var component = _children[cid].literal;
                                components.push(component);
                            }
                            obj[prop] = components;
                            break;
                        case "ownerDocument":
                            break;
                        default:
                            if(this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if(!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });  
    return _proxy;
}
Parent.prototype.ctor = 'Parent';