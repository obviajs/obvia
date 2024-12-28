/**
 * This is a NumberFormatter Element, the default item renderer for a DataGrid
 * 
 * 
 */

// import { isNumber } from "../../gaia/Code/require/addon/hint/jshint";
import { Label } from "/obvia/components/Label.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { NumberUtils } from "/obvia/lib/NumberUtils.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { extractText } from "/obvia/lib/my.js";
var NumberFormatter = function (_props)
{
    //component data
    let _label, _precision;
    let _defaultParams = {
        precision: 2
    };

    ObjectUtils.fromDefault(_defaultParams, _props);
    _precision = _props.precision;

    let r = Label.call(this, _props);
    Object.defineProperty(this, "label", {
        get: function label()
        {
            return _label;
        },
        set: function label(v)
        {
            if (_label != v)
            {
                _props.label = _label = v;
                if (this.$el)
                {
                    //convert html entities
                    v = extractText(v);
                    let last = this.$el.children().last();
                    if(NumberUtils.isNumber(v))
                        v = NumberUtils.addCommas(NumberUtils.toFixed(v, _precision));
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
NumberFormatter.prototype.ctor = 'NumberFormatter';
DependencyContainer.getInstance().register("NumberFormatter", NumberFormatter, DependencyContainer.simpleResolve);
export
{
    NumberFormatter
};
