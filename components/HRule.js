/**
 * This is a HRule Element Component
 * 
 * Kreatx 2018
 */

//component definition
var HRule = function(_props)
{
    
    Object.defineProperty(this, "height", 
    {
        get: function height() 
        {
            return _height;
        },
        set: function height(v) 
        {
            if(_height != v)
            {
                _height = v;
                if(this.$el)
                {
                    this.$el.css('height', v+"px");
                }
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
                    this.$el.attr('align', v);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "width", 
    {
        get: function width() 
        {
            return _width;
        },
        set: function width(v) 
        {
            if(_width != v)
            {
                _width = v;
                if(this.$el)
                {
                    this.$el.css('width', v+"px");
                }
            }
        },
        enumerable: true
    });


    this.template = function () 
    {        
        return  '<hr id="' + this.domID + '" align="'+_align +'" style="height:'+_height +'px width="'+_width +'px"" >';    
    };

    var _defaultParams = {
        width:0,
        height:0,
        align:"center" //="left|center|right"
    };

    _props = extend(false, false, _defaultParams, _props);
    var _width = _props.width;
    var _height = _props.height;
    var _align = _props.align;
   
    Component.call(this, _props);
};
HRule.prototype.ctor = 'HRule';