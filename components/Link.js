/**
 * This is a Link Element
 * 
 * Kreatx 2018
 */

//component definition
var Link = function(_props)
{
    this.registerEvents = function () 
    {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
        ]
    };

    this.clickHandler = function () 
    {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    };

    this.doubleClickHandler = function () 
    {
        if (typeof this.ondblclick == 'function')
            this.ondblclick.apply(this, arguments);
    };

    Object.defineProperty(this, "hyperlink", 
    {
        get: function hyperlink() 
        {
            return _hyperlink;
        },
        set: function hyperlink(v) 
        {
            if(hyperlink != v)
            {
                _hyperlink = v;
                if(_hyperlink)
                {
                    if(this.$el)
                    {
                        this.$el.attr('href', _hyperlink);
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

    this.template = function () 
    {         
        return "<a id='" + this.domID + "' href='" + _hyperlink + "' "+(_target?"target='" +_target+"'":"")+ ">" + _label + "</a>";
    };

    _props = extend(false, false, _defaultParams, _props);
    
    var _label = _props.label;
    var _hyperlink = _props.hyperlink;
    var _target = _props.target;

    var base = Component.call(this, _props);
    return this;

};
//component prototype
Link.type = 'link';