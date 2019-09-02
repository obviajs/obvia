/**
 * This is a Footer Element
 * 
 * Kreatx 2019
 */

//component definition
var Footer = function(_props, overrided=false)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<footer id="' + this.domID + '"></footer>'; 
    };
    Container.call(this, _props, overrided);
};
Footer.prototype.ctor = 'Footer';