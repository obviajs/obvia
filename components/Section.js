/**
 * This is a Section Element
 * 
 * Kreatx 2019
 */

//component definition
var Section = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<section id="' + this.domID + '"></section>'; 
    };
    _props.type = ContainerType.NONE;
    Container.call(this, _props);
};
Section.prototype.ctor = 'Section';