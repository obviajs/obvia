/**
 * This is a Td Element
 * 
 * Kreatx 2020
 */

//component definition
import { TCell } from "/obvia/components/Table/TCell.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var Td = function (_props) {
   
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
        return "<td id='" + this.domID + "'></td>";
    };

    let _defaultParams = {
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = TCell.call(this, _props);
    return r;
};
Td.prototype.ctor = 'Td';
export {
    Td
};