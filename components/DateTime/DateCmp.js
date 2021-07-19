/**
 * This is a DateCmp Input Element
 *
 * Kreatx 2019
 */
import { DateTime } from "/obvia/components/DateTime/DateTime.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
 var DateCmp = function (_props) {
    let _self = this;

    this.template = function () {
        return "<input data-triggers='input' type='date' id='" + this.domID + "'/>";
    };

    let _defaultParams = {
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD/MM/YYYY',
        displayFormat: 'DD/MM/YYYY',
        internalFormat: "YYYY-MM-DD",
        value: null,
        min: null,
        max: null        
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = DateTime.call(this, _props);

    return r;
};
DateCmp.prototype.ctor = "DateCmp";
DependencyContainer.getInstance().register("DateCmp", DateCmp, DependencyContainer.simpleResolve);
export {
    DateCmp
};