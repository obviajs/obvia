/**
 * This is a Nav Element
 * 
 * Kreatx 2019
 */

//component definition
var Nav = function(_props, overrided=false)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<nav id="' + this.domID + '"></nav>'; 
    };
    _props.type = ContainerType.NONE;
    let r = Container.call(this, _props, overrided);
    return r;
};
Nav.prototype.ctor = 'Nav';