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

    this.addComponent = function (component, cIndex)
    {
        _components.push(component);
        return this.addComponentInContainer(this.$container, component, cIndex);
    }

    this.addComponentInContainer = function (container, component, cIndex) 
    {
        if(container)
        {
            var cmp = Component.fromLiteral(component);
            cmp.on('creationComplete', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                _ccComponents.push(component.props.id);
            
                if (_ccComponents.length == _self.components.length && !_creationFinished) {
                    _creationFinished = true;
                    _self.trigger('creationComplete');
                }

            }.bind(_self));
            var maxIndex = container.children().length;
            // _self.$container.children().eq(cIndex).after((cmp.render()));
            container.append(cmp.render());
            //expose component model
            component.props.id = cmp.id;
            _children[cmp.id] = cmp;

            cmp.parent = _self;
            cmp.parentType = _self.type;
            cmp.parentForm = _self;
            return cmp;
        }
    };

    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            e.preventDefault();
        }
    };

    var _defaultParams = {
        components:[]
    };
    _props = extend(false, false, _defaultParams, _props);
    var _components = _props.components;
    var _ccComponents = [];
    this.$container = null;

    var _self = this;
    var _creationFinished = false;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
    var _children = {};
   
    
    //override because creationComplete will be thrown when all children components are created
    // this.afterAttach = undefined;

    this.addComponents = function(components)
    {
        if(components && Array.isArray(components))
        {
            for(var i=0;i<components.length;i++)
            {
                this.addComponentInContainer(this.$container, components[i], i);
            }
        }
    }
    Component.call(this, _props);
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
                for(var childId in this.children)
                {
                    this.children[childId].enabled = v;
                }
            }
        },
        configurable: true
    });
}
Parent.prototype.type = 'Parent';