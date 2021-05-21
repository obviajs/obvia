/**
 * This is a TBody Element
 * 
 * Kreatx 2020
 */

import { Parent } from "/flowerui/components/base/Parent.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var TBody = function (_props, _hideComponents=false) {
   
    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
        }
    };
    this.template = function () {
        return "<tbody id='" + this.domID + "'></tbody>";
    };

    let _defaultParams = {
    };
    _props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = Parent.call(this, _props, _hideComponents);
    return r;
};
TBody.prototype.ctor = 'TBody';
export {
    TBody
};