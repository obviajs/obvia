var NavParent = function(_props, overrided=false)
{
    this.$navigation = null;
    var _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);
    Parent.call(this, _props);
    
    this.beforeAttach = function() 
    {
        var _self = this;
        if(this.components && Array.isArray(this.components))
        {
            this.components.forEach(function (component, cIndex) {
                var cmpInstance = this.addComponent(component, cIndex);
                if(_self.$navigation && cmpInstance.$header){
                    _self.$navigation.append(cmpInstance.$header);        
                }
            }.bind(this));
        }
    };

    if(overrided)
    {
        this.keepBase();
    }
}
