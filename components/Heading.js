/**
 * This is a Heading Element
 * 
 * 
 */
import { Parent } from "/obvia/components/base/Parent.js";
import { Align } from "/obvia/components/base/Align.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { extractText } from "/obvia/lib/my.js";
var Heading = function (_props)
{
    let _self, _label, _align;

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
        enumerable: true
    });

    Object.defineProperty(this, "align", {
        get: function align()
        {
            return _align;
        },
        set: function align(v)
        {
            if (_align != v)
            {
                _align = v;
                if (this.$el)
                    this.$el[0].align = _align;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "headingType", {
        get: function headingType()
        {
            return _headingType;
        },
        set: function headingType(v)
        {
            if (_headingType != v)
            {
                _headingType = v;
                if (this.$el)
                {
                    let newCls = this.$el[0].className;
                    let drag = this.$el[0].draggable;
                    let $newEl = $(this.template());
                    $newEl[0].className = newCls;
                    $newEl[0].draggable = drag;
                    $newEl[0].innerText = _label;
                    $newEl[0].align = _align;
                    this.$el.replaceWith($newEl);
                    this.$el = $newEl;
                }
            }
        },
        enumerable: true
    });

    this.init = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (_props.align != null)
                this.align = _props.align;
            if (_props.label)
                this.label = _props.label;
        }
    };

    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
        }
    };

    this.template = function ()
    {
        return "<" + _headingType + " id='" + this.domID + "'></" + _headingType + ">";
    };

    let _defaultParams = {
        label: "",
        headingType: HeadingType.h1,
        align: Align.left
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let _headingType = _props.headingType;

    let r = Parent.call(this, _props);
    return r;
};
Heading.prototype.ctor = 'Heading';
var HeadingType =
{
    "h1": "h1",
    "h2": "h2",
    "h3": "h3",
    "h4": "h4",
    "h5": "h5",
    "h6": "h6",
};
DependencyContainer.getInstance().register("Heading", Heading, DependencyContainer.simpleResolve);
export
{
    Heading, HeadingType
};