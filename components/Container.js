/**
 * This is a Container Element
 * 
 * Kreatx 2018
 */

//component definition
var Container = function(_props)
{

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
        }
    });

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
        }
    });

    this.template = function ()
    { 
        return  '<div id="' + this.domID + '" class="container" style="'+(_width?'width:'+_width+'px;':'')+(_height?'width:'+_height+'px;':'')+'" ></div>'; 
    };
    
    var _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);
    var _width = _props.width;
    var _height = _props.height;
    Parent.call(this, _props, true);

    var base = this.base;
    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        base.beforeAttach();
    };
};
Container.type = 'container';