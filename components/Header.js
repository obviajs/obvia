/**
 * This is a Header Element
 * 
 * Kreatx 2019
 */

import {Container} from "/flowerui/components/Container.js";
var Header = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<header id="' + this.domID + '"></header>'; 
    };
    _props.type = "";
    Container.call(this, _props);
};
Header.prototype.ctor = 'Header';
export {
    Header
};