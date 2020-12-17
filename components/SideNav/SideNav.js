/**
 * This is a SideNav Element
 * 
 * Kreatx 2019
 */

//component definition
var SideNav = function(_props)
{
    let _self = this, _open, _width, _side;

    Object.defineProperty(this, "side", {
        get: function side()
        {
            return _side;
        },
        set: function side(v)
        {
            if(_side!=v)
            {
                let classes = (this.classes["self"] || this.classes).slice(0);
                let ind, newCls;
                if(v==1){
                    ind = classes.indexOf("sidenav_right");
                    newCls = "sidenav_left";   
                }else{
                    ind = classes.indexOf("sidenav_left");
                    newCls = "sidenav_right";   
                }
                if(ind>-1)
                    classes.splice(ind, 1);
                classes.pushUnique(newCls);
                this.classes = classes;
            }
        },
        enumerable: true
    });
    
    this.toggleVisibility = function()
    {
        if(!_open){
            _self.width = _width;
            _self.minWidth = _width;
            _open = true;
        } 
        else{
            _self.width = 0;
            _self.minWidth = 0;
            _open = false;
        }
    }
    
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            this.$container = this.$el;
            _width = _props.width;
            _minWidth =  _props.width;
            _open != _props.open;
            _self.side = _props.side;
            this.toggleVisibility();
        }
    }
    
    var _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        open: true,
        classes: ["sidenav"],
        side : SideNavSide.left,
        width: 250
    };
    
    _props = extend(false, false, _defaultParams, _props);
    let r = Container.call(this, _props);
    return r;
};
SideNav.prototype.ctor = 'SideNav';