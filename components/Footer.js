/**
 * This is a Footer Element
 * 
 * Kreatx 2019
 */

import { Container } from "/obvia/components/Container.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var Footer = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<footer id="' + this.domID + '"></footer>'; 
    };
    _props.type = "";
    Container.call(this, _props);
};
Footer.prototype.ctor = 'Footer';
DependencyContainer.getInstance().register("Footer", Footer, DependencyContainer.simpleResolve);
export {
    Footer
};