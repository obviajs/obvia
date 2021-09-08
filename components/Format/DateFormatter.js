/**
 * This is a DateFormatter Element, the default item renderer for a DataGrid
 * 
 * Kreatx 2021
 */

import { Label } from "/obvia/components/Label.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { DateUtils } from "/obvia/lib/DateUtils.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var DateFormatter = function (_props) {
    //component data
    let _label, _inputFormat, _outputFormat;
    let _defaultParams = {
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'DD/MM/YYYY HH:mm',
    };
    _inputFormat = _props.inputFormat;
    _outputFormat = _props.outputFormat;
    
    ObjectUtils.fromDefault(_defaultParams, _props);

    let r = Label.call(this, _props);
    Object.defineProperty(this, "label", {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _props.label = _label = v;
                if (this.$el) {
                    //convert html entities
                    v = $(`<div>${v}</div>`).get(0).innerText;
                    let last = this.$el.children().last();
                    v = DateUtils.format(v, _inputFormat, _outputFormat);
                    if (last && last.length > 0)
                        if (last[0].nextSibling)
                            last[0].nextSibling.textContent = v;
                        else
                            this.$el.appendText(v);
                    else
                        //this.$el.appendText(v);
                        this.$el.text(v);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return r;
};
 
//component prototype
DateFormatter.prototype.ctor = 'DateFormatter';
DependencyContainer.getInstance().register("DateFormatter", DateFormatter, DependencyContainer.simpleResolve);
export {
    DateFormatter
};