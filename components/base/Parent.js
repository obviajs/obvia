var Parent = function(_props, overrided=false)
{
    var _ccComponents = [];
    this.components = [];
    this.$container = null;
    this.addComponent = function (component, cIndex) 
    {
        alert("add component");
        console.log("inside addComponent",this.$container);
        console.log("component to be added",component);
        if(this.$container)
        {
            var cmp = Component.fromLiteral(component);
            cmp.on('creationComplete', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                _ccComponents.push(component.props.id);
            
                if (_ccComponents.length == this.components.length) {
                    this.trigger('creationComplete');
                }

            }.bind(this));
            var maxIndex = this.$container.children().length;
            console.log("maxIndex",maxIndex);

            // this.$container.children().eq(cIndex).after((cmp.render()));
            console.log("this.$container after shtim",this.$container);
            this.$container.append(cmp.render());
             console.log("component added",this.$container);
            //expose component model
            if (!this.idField)
                this[cmp.id] = cmp;
            else
                this[ cmp[this.idField] ] = cmp;

            cmp.parent = this;
            cmp.parentType = this.type;
            cmp.parentForm = this;
            return cmp;
        }
    };

    var _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);
    this.components = _props.components;
    
    //override because creationComplete will be thrown when all children components are created
    // this.afterAttach = undefined;

    this.addComponents = function(components)
    {
        if(components && Array.isArray(components))
        {
            components.forEach(function (component, cIndex) {
                this.addComponent(component, cIndex);
            }.bind(this));
        }
    }
    Component.call(this, _props);
    if(overrided)
    {
        this.keepBase();
    }
}