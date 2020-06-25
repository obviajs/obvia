/**
 * This is a Section Element
 * 
 * Kreatx 2019
 */

//component definition
var Section = function(_props, overrided=false)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<section id="' + this.domID + '"></section>'; 
    };
    _props.type = ContainerType.NONE;
    Container.call(this, _props, overrided);
};
Section.prototype.ctor = 'Section';