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
        },
        enumerable:true
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
        },
        enumerable:true
    });

    Object.defineProperty(this, "headingType", 
    {
        get: function headingType() 
        {
            return _headingType;
        },
        set: function headingType(v) 
        {
            if(_headingType != v)
            {
                _headingType = v;
                if(this.$el){
                    let newCls = this.$el[0].className;
                    let drag =  this.$el[0].draggable;
                    let $newEl = $(this.template());
                    $newEl[0].className = newCls;
                    $newEl[0].draggable = drag;
                    this.$el.replaceWith($newEl);
                    this.$el = $newEl;
                }
            }
        },
        enumerable:true
    });

    this.beforeAttach = function () 
    {
        if(_props.align!=null)
            this.align = _props.align;
    };

    this.template = function () 
    {         
        return "<"+_headingType+" id='" + this.domID + "' align="+_props.align+">"+_label+"</"+_headingType+">"; 
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