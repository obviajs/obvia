/**
 * This is a Heading Element
 * 
 * Kreatx 2018
 */

//component definition
var Heading = function(_props)
{   
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
    
    Object.defineProperty(this, "align", 
    {
        get: function align() 
        {
            return _align;
        },
        set: function align(v) 
        {
            if(_align != v)
            {
                _align = v;
                if(this.$el)
                    this.$el.attr('align', _align);
            }
        }
    });

    this.beforeAttach = function () 
    {
        this.$container = this.$el;
        this.addComponents(this.components);
    };

    this.template = function () 
    {         
        return "<"+_headingType+" id='" + this.domID + "'>"+_label+"</"+_headingType+">"; 
    };

    var _defaultParams = {
        label:"",
        headingType: HeadingType.h1,
        align: Align.left
    };
    _props = extend(false, false, _defaultParams, _props);
    
    var _label = _props.label;
    var _headingType = _props.headingType;
    var _align = _props.align;

    Parent.call(this, _props);
};
Heading.prototype.ctor = 'Heading';