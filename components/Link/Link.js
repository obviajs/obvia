/**
 * This is a Link Element
 * 
 * Kreatx 2018
 */

//component definition
var Link = function(_props)
{
    Object.defineProperty(this, "title", 
    {
        get: function title() 
        {
            return _title;
        },
        set: function title(v) 
        {
            if(_title != v)
            {
                _title = v;
                if(this.$el)
                    this.$el.attr('title', v);
            }
        },
        enumerable:true
    });
    
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
        },
        enumerable:true
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
        },
        enumerable:true
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
        },
        enumerable:true
    });
    
    this.beforeAttach = function () 
    {
        this.$container = this.$el;
        this.addComponents();
        if(_props.title){
            this.title = _props.title;
        }
        if(_props.label){
            this.label = _props.label;
        }
        if(_props.href){
            this.href = _props.href;
        }
        if(_props.target){
            this.target = _props.target;
        }
    };

    this.template = function () 
    {         
        return "<a id='" + this.domID + "' href='" + _href + "' "+(_target?"target='" +_target+"'":"")+ ">" + _label + "</a>";
    };

    var _defaultParams = {
        label: "Click Me",
        href: "javascript:void()",
        target: "_blank",
        title: undefined
    };
    
    _props = extend(false, false, _defaultParams, _props);
    
    let _label, _href, _target, _title;

    Parent.call(this, _props);
};
Link.prototype.ctor = 'Link';