var Parent = {

    addComponent: function (component, container, cIndex) {
        if (typeof component.constructor == "string") {
            component.constructor = eval(component.constructor);
        }
        var cmp = new component.constructor(component.props);
     
        cmp.on('creationComplete', function (e) {
            e.stopImmediatePropagation();
            e.stopPropagation();

            this.ccComponents.push(component.props.id);
          
            if (this.ccComponents.length == this.components.length) {
                this.trigger('creationComplete');
            }

        }.bind(this));

        container.append(cmp.render());
        
        //expose component model
        if (!this.idField)
            this[cmp.id] = cmp;
        else
            this[ cmp[this.idField] ] = cmp;

        cmp.parent = this;
        cmp.parentType = this.type;
        cmp.parentForm = this;
        return cmp;
    },
    render: function () {
        if(this.components && Array.isArray(this.components))
        {
            this.components.forEach(function (component, cIndex) {
                this.addComponent(component, this.$container, cIndex);
            }.bind(this));
        }
        return this.$el;
    },
    getValue: function () {
        return null;
    },

    setValue: function (value) {
        return null
    }
}