/**
 * This is a TCell Element
 * 
 * Kreatx 2020
 */

//component definition
var TCell = function (_props, _hideComponents=false) {
    
    let _colspan, _rowspan;

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
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
        }
    };

    let _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);

    let r = Parent.call(this, _props, _hideComponents);
    return r;
};
TCell.prototype.ctor = 'TCell';