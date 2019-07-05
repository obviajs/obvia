var Parent = function(_props, overrided=false)
{
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
        }
    });

    Object.defineProperty(this, "magnets", 
    {
        get: function magnets() 
        {
            return _magnets;
        }
    });

    this.addChild = function(child, index)
    {
        if(child)
        {
            index = index || _components.length;
            if(index>=0 && index <= _components.length)
            {
                index = index || _components.length;
                this.$el.insertAt(child.$el, index);
                _components.splice(_components.length, 0, {constructor:child.type, props:child.props});
                _children[child.id] = child; 
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
        _components.push(component);
        return this.addComponentInContainer(this.$container, component, index);
    }

    this.addComponentInContainer = function (container, component, index) 
    {
        if(container)
        {
            var cmp = Component.fromLiteral(component);
            component.props.id = cmp.id;
            _children[cmp.id] = cmp;
            cmp.parent = _self;
            cmp.parentType = _self.type;
            cmp.parentForm = _self;

            cmp.on('creationComplete', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                _ccComponents.push(component.props.id);
            
                if ((_ccComponents.length == _self.components.length - Object.keys(_magnetizedIndexes).length) && !_creationFinished) {
                    
                     //TODO:solve magnet dependencies, i.e: component is magnetized to a component that is magnetized to another component  
                    for(var i in _magnetizedIndexes)
                    {
                        var magnetCmp = Component.instances[_magnetizedIndexes[i]];

                        var magnetizedCmp = this.addComponentInContainer(magnetCmp.$container, _components[i], i);
                        delete _magnetizedIndexes[i];
                    }
                    if (_ccComponents.length == _self.components.length && !_creationFinished) {
                        _creationFinished = true;
                        //02.05
                        //_self.trigger('creationComplete');
                    }
                }else{
                    
                }

            }.bind(_self));
            index = index || _components.length;
            container.insertAt(cmp.render(), index);
            //container.append(cmp.render());
            //expose component model
            
            return cmp;
        }
    };

    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            if(!_creationFinished && (this.components && Array.isArray(this.components) && this.components.length>0))    
                e.preventDefault();
        }
    };

    var _defaultParams = {
        components:[],
        magnets:{}
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
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
    var _children = {};
   
    
    //override because creationComplete will be thrown when all children components are created
    // this.afterAttach = undefined;
    var _magnetizedIndexes = {};
    this.addComponents = function(components)
    {
        if(components && Array.isArray(components) && components.length>0)
        {
            for(var i=0;i<components.length;i++)
            {
                var magnet, isMagnetized = false;
                if(_magnets && !Object.isEmpty(_magnets))
                {
                    for(var magnet in _magnets)
                    {
                        if(_magnets[magnet] && _magnets[magnet].length>0)
                        {
                            if(_magnets[magnet].indexOf(_components[i].props.id)>-1)
                            {
                                isMagnetized = true;
                                _magnetizedIndexes[i] = magnet;
                            }
                        }                    
                    }   
                }
                if(!isMagnetized)
                    this.addComponentInContainer(this.$container, components[i], i);
            }
        }else   
            _creationFinished = true;
    }

    Component.call(this, _props, true);
    var base = this.base;
    if(overrided)
    {
        this.keepBase();
    }
    
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
                            for(var i=0;i<_components.length;i++)
                            {
                                var component = {};
                                component.constructor = _children[_components[i].props.id].ctor;//_components[i].constructor;
                                component.props = _children[_components[i].props.id].props;
                                components.push(component);
                            }
                            obj[prop] = components;
                            break;
                        default:
                            if(this.hasOwnProperty(prop))
                                obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });  
}
Parent.prototype.ctor = 'Parent';