/**
 * This is a SideNav Element
 * 
 * Kreatx 2019
 */

//component definition
var NavBar = function(_props, overrided=false)
{

    let _self = this, _height;
    
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            this.$container = this.$el;
            _height = _props.height;
            if(_props.classes)
                this.classes = _props.classes;
        }
    }
    
    var _defaultParams = {
        height: 20,
        components: [],
        classes: ["navbar"]
    };
    
    _props = extend(false, false, _defaultParams, _props);
    let r = Container.call(this, _props, overrided);
    return r;
};
NavBar.prototype.ctor = 'NavBar';