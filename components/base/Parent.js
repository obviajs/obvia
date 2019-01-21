var Parent = function(_props, overrided=false)
{
    var _ccComponents = [];
    this.components = [];
    this.$container = null;
    this.addComponent = function (component, cIndex) 
    {
        if(this.$container)
        {
            if (typeof component.constructor == "string") {
                component.constructor = eval(component.constructor);
            }
            var cmp = new component.constructor(component.props);
        
            cmp.on('creationComplete', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                _ccComponents.push(component.props.id);
            
                if (_ccComponents.length == this.components.length) {
                    this.trigger('creationComplete');
                }

            }.bind(this));
            
            this.$container.append(cmp.render());
            
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
    Component.call(this, _props);
    //override because creationComplete will be thrown when all children components are created
    this.afterAttach = undefined;

    this.beforeAttach = function()
    {
        if(this.components && Array.isArray(this.components))
        {
            this.components.forEach(function (component, cIndex) {
                this.addComponent(component, cIndex);
            }.bind(this));
        }
    }
    if(overrided)
    {
        this.keepBase();
    }
}