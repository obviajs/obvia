/**
 * This is a Time Input Element
 *
 * Kreatx 2019
 */
import { DateTime } from "/obvia/components/DateTime/DateTime.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var Time = function (_props) {
    let _self = this;

    this.template = function () {
        return "<input data-triggers='input' type='time' id='" + this.domID + "'/>";
    };

    let _defaultParams = {
        id: 'datetime',
        inputFormat: 'HH:mm',
        outputFormat: 'HH:mm',
        displayFormat: 'hh:mm A',
        internalFormat: "HH:mm",
        value: null,
        min: null,
        max: null        
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    
    let r = DateTime.call(this, _props);
    
    return r;
};
Time.prototype.ctor = "Time";
export {
    Time
};