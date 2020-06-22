/**
 * This is a Header Element
 * 
 * Kreatx 2019
 */

//component definition
var Header = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<header id="' + this.domID + '"></header>'; 
    };
    _props.type = ContainerType.NONE;
    Container.call(this, _props);
};
Header.prototype.ctor = 'Header';