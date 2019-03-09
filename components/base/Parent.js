var Parent = function(_props, overrided=false)
{
    var _ccComponents = [];
    this.components = [];
    this.$container = null;

    this.addComponent = function (component, cIndex)
    {
        this.components.push(component);
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
            _self[cmp.id] = cmp;

            cmp.parent = _self;
            cmp.parentType = _self.type;
            cmp.parentForm = _self;
            return cmp;
        }
    };

    var _defaultParams = {
        components:[]
    };
    _props = extend(false, false, _defaultParams, _props);
    this.components = _props.components;
    var _self = this;
    var _creationFinished = false;
    
    //override because creationComplete will be thrown when all children components are created
    // this.afterAttach = undefined;

    this.addComponents = function(components)
    {
        if(components && Array.isArray(components))
        {
            components.forEach(function (component, cIndex) {
                this.addComponentInContainer(this.$container, component, cIndex);
            }.bind(this));
        }
    }
    Component.call(this, _props);
    if(overrided)
    {
        this.keepBase();
    }
}