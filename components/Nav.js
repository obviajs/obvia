/**
 * This is a Nav Element
 * 
 * Kreatx 2019
 */

//component definition
var Nav = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<nav id="' + this.domID + '"></nav>'; 
    };
    _props.type = ContainerType.NONE;
    let r = Container.call(this, _props);
    return r;
};
Nav.prototype.ctor = 'Nav';