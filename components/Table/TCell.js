/**
 * This is a TCell Element
 * 
 * Kreatx 2020
 */

import {Parent} from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var TCell = function (_props) {
    
    let _colspan, _rowspan, _label;

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
            if(_colspan != v)
            {
                _colspan = v;
                if(_colspan)
                {
                    if(this.$el)
                    {
                        this.$el.attr('colspan', _colspan);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('colspan');
                    }
                }                    
            }
        },
        enumerable:true
    });

    Object.defineProperty(this, "rowspan", 
    {
        get: function rowspan() 
        {
            return _rowspan;
        },
        set: function rowspan(v) 
        {
            if(_rowspan != v)
            {
                _rowspan = v;
                if(_rowspan)
                {
                    if(this.$el)
                    {
                        this.$el.attr('rowspan', _rowspan);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('rowspan');
                    }
                }                    
            }
        },
        enumerable:true
    });
    
    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if(_props.colspan)
                this.colspan = _props.colspan;
            if(_props.rowspan)
                this.rowspan = _props.rowspan;
            if (_props.label)
                this.label = _props.label;
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
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
export {
    TCell
};