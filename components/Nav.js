/**
 * This is a Nav Element
 * 
 * Kreatx 2019
 */

import { Container } from "/obvia/components/Container.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var Nav = function (_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<nav id="' + this.domID + '"></nav>'; 
    };
    _props.type = "";
    let r = Container.call(this, _props);
    return r;
};
DependencyContainer.getInstance().register("Nav", Nav, DependencyContainer.simpleResolve);
Nav.prototype.ctor = 'Nav';
export {
    Nav
};