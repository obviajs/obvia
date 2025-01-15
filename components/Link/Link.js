/**
 * This is a Link Element
 * 
 * 
 */

import { Parent } from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { extractText } from "/obvia/lib/my.js";

var Link = function (_props)
{

    Object.defineProperty(this, "href", {
        get: function href()
        {
            return _href;
        },
        set: function href(v)
        {
            if (href != v)
            {
                _href = v;
                if (this.$el)
                {
                    if (_href)
                    {
                        this.$el[0].href = href;
                    } else
                    {
                        this.$el[0].removeAttribute('href');                    
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "target", {
        get: function target()
        {
            return _target;
        },
        set: function target(v)
        {
            if (_target != v)
            {
                _target = v;
                if (this.$el)
                {
                    if (_target)
                    {
                        this.$el[0].target = _target;
                    } else
                    {
                        this.$el[0].removeAttribute('target');                    
                    }
                }
            }
        },
        enumerable: true
    });

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

    this.beforeAttach = function ()
    {
        if (_props.label && !this.getBindingExpression("label"))
        {
            this.label = _props.label;
        }
        if (_props.href)
        {
            this.href = _props.href;
        }
        if (_props.target)
        {
            this.target = _props.target;
        }
    };

    this.template = function ()
    {
        return "<a id='" + this.domID + "'></a>";
    };

    let _defaultParams = {
        label: "",
        href: "javascript:void(0)",
        target: LinkTarget.self
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let _label, _href, _target;

    let r = Parent.call(this, _props);
    return r;
};
Link.prototype.ctor = 'Link';
var LinkTarget =
{
    "blank": "_blank",
    "self": "_self",
    "parent": "_parent",
    "top": "_top",
    "framename": "_framename"
};
DependencyContainer.getInstance().register("Link", Link, DependencyContainer.simpleResolve);
export
{
    Link, LinkTarget
};