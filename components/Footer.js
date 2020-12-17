/**
 * This is a Footer Element
 * 
 * Kreatx 2019
 */

//component definition
var Footer = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<footer id="' + this.domID + '"></footer>'; 
    };
    _props.type = ContainerType.NONE;
    Container.call(this, _props);
};
Footer.prototype.ctor = 'Footer';