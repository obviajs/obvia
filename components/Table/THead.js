/**
 * This is a THead Element
 * 
 * Kreatx 2020
 */
import { Parent } from "/flowerui/components/base/Parent.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var THead = function (_props, _hideComponents=false) {
   
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
        return "<thead id='" + this.domID + "'></thead>";
    };

    let _defaultParams = {
    };
    _props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = Parent.call(this, _props, _hideComponents);
    return r;
};
THead.prototype.ctor = 'THead';
export {
    THead
};