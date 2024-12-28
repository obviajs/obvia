import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { extractText } from "/obvia/lib/my.js";

var Li = function (_props)
{
    let _self = this, _label, _value;

    Object.defineProperty(this, "label", {
        get: function label()
        {
            return _label;
        },
        set: function label(v)
        {
            if (_label != v)
            {
                _label = v;
                if (this.$el)
                {
                    v = extractText(v);
                    let last = this.$el.children().last();
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

    Object.defineProperty(this, "value",
        {
            get: function value() 
            {
                return _value;
            },
            set: function value(v) 
            {
                if (_value != v)
                {
                    _value = v;
                    if (this.$el)
                        this.$el[0].value = v;
                }
            },
            enumerable: true
        });

    this.template = function ()
    {
        return "<li id='" + this.domID + "' value='" + _value + "'></li>";
    };

    let _defaultParams = {
        label: "",
        value: "",
        type: ""
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = Container.call(this, _props);

    _label = _props.label;
    _value = _props.value;
    return r;
};
//component prototype
Li.prototype.ctor = 'Li';
DependencyContainer.getInstance().register("Li", Li, DependencyContainer.simpleResolve);
export
{
    Li
};