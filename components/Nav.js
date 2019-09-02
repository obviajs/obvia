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
    Container.call(this, _props, overrided);
};
Nav.prototype.ctor = 'Nav';