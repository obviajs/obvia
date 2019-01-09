var NavParentInit = {
    render: function () {
        var _self = this;
        if(this.components && Array.isArray(this.components))
        {
            this.components.forEach(function (component, cIndex) {
                var cmpInstance = this.addComponent(component, this.$container, cIndex);
                if(cmpInstance.$header){
                    _self.$navigation.append(cmpInstance.$header);        
                }
            }.bind(this));
        }
        return this.$el;
    }
}
NavParent = extend(true, true, [],[],["render"], Parent, NavParentInit);