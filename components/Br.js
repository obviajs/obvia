/**
 * This is a Br Element Component
 * 
 * Kreatx 2018
 */

import { Component } from "/obvia/components/base/Component.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var Br = function(_props)
{
    this.template = function () 
    {        
        return  '<br/>';    
    };

    var _defaultParams = {
    };

    _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    Component.call(this, _props);
};
Br.prototype.ctor = 'Br';
export {
    Br
};