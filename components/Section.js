/**
 * This is a Section Element
 * 
 * Kreatx 2019
 */

import {Container} from "/obvia/components/Container.js";
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
export {
    Section
};