/**
 * This is a TCell Element
 * 
 * 
 */

import { Parent } from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { extractText } from "/obvia/lib/my.js";
var TCell = function (_props)
{

    let _colspan, _rowspan, _label;

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

    Object.defineProperty(this, "colspan",
        {
            get: function colspan() 
            {
                return _colspan;
            },
            set: function colspan(v) 
            {
                if (_colspan != v)
                {
                    _colspan = v;
                    if (this.$el)
                    {
                        if (_colspan)
                        {
                            this.$el.attr('colspan', _colspan);
                        } else
                        {
                            this.$el.removeAttribute('colspan');
                        }
                    }
                }
            },
            enumerable: true
        });

    Object.defineProperty(this, "rowspan",
        {
            get: function rowspan() 
            {
                return _rowspan;
            },
            set: function rowspan(v) 
            {
                if (_rowspan != v)
                {
                    _rowspan = v;  
                    if (this.$el)
                    {
                        if (_rowspan)
                        {
                            this.$el[0].rowspan = _rowspan;
                        } else
                        {                           
                            this.$el[0].removeAttribute('rowspan');
                        }
                    }
                }
            },
            enumerable: true
        });

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if (_props.colspan)
                this.colspan = _props.colspan;
            if (_props.rowspan)
                this.rowspan = _props.rowspan;
            if (_props.label)
                this.label = _props.label;
        }
    };

    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
        }
    };

    let _defaultParams = {
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    let r = Parent.call(this, _props);
    return r;
};
TCell.prototype.ctor = 'TCell';
export
{
    TCell
};