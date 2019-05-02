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
            for(var i=0;i<this.components.length;i++)
            {
                var cmpInstance = this.addComponent(this.components[i], i);
                if(_self.$navigation && cmpInstance.$header){
                    _self.$navigation.append(cmpInstance.$header);        
                }
            }
        }
    };

    if(overrided)
    {
        this.keepBase();
    }
}
NavParent.prototype.ctor = 'NavParent';
