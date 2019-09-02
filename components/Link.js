/**
 * This is a Link Element
 * 
 * Kreatx 2018
 */

//component definition
var Link = function(_props)
{
    Object.defineProperty(this, "href", 
    {
        get: function href() 
        {
            return _href;
        },
        set: function href(v) 
        {
            if(href != v)
            {
                _href = v;
                if(_href)
                {
                    if(this.$el)
                    {
                        this.$el.attr('href', _href);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('href');
                    }
                }                    
            }
        }
    });

    Object.defineProperty(this, "target", 
    {
        get: function target() 
        {
            return _target;
        },
        set: function target(v) 
        {
            if(_target != v)
            {
                _target = v;
                if(_target)
                {
                    if(this.$el)
                    {
                        this.$el.attr('target', _target);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('target');
                    }
                }  
            }
        }
    });

    Object.defineProperty(this, "label", 
    {
        get: function label() 
        {
            return _label;
        },
        set: function label(v) 
        {
            if(_label != v)
            {
                _label = v;
                if(this.$el)
                    this.$el.html(v);
            }
        }
    });
    
    this.beforeAttach = function () 
    {
        this.$container = this.$el;
        this.addComponents();
    };

    this.template = function () 
    {         
        return "<a id='" + this.domID + "' href='" + _href + "' "+(_target?"target='" +_target+"'":"")+ ">" + _label + "</a>";
    };

    var _defaultParams = {
    };
    
    _props = extend(false, false, _defaultParams, _props);
    
    var _label = _props.label;
    var _href = _props.href;
    var _target = _props.target;

    Parent.call(this, _props);
};
Link.prototype.ctor = 'Link';