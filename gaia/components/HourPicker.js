/**
 * This is a Hour Picker Components
 *
 * Kreatx 2021
 */
import { Select } from "/obvia/components/Select/Select.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var HourPicker = function (_props) {
    let _self = this;

    let _defaultParams = {
        dataProvider: new ArrayEx(),
        labelField: "label",
        valueField: "value",
        value: "00:00",
        rendering: {
            wrap: false
        }
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //ObjectUtils.shallowCopy(ObjectUtils.extend(false, false, _defaultParams, _props), _props);
    let r = Select.call(this, _props);
    
    Object.defineProperty(this, "selectedIndex", {
        get: function selectedIndex() {           
            return _self.$el[0].selectedIndex;
        }
    });
    
    return r;
};
HourPicker.prototype.ctor = 'HourPicker';
DependencyContainer.getInstance().register("HourPicker", HourPicker, DependencyContainer.simpleResolve);
export {
    HourPicker
};