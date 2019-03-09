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
                    v = v || 0;
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
                    v = v || 0;
                    this.$el.css('height', v+"px");
                }
            }
        }
    });
    
    Object.defineProperty(this, "spacing", 
    {
        get: function spacing() 
        {
            return _spacing;
        }
    });

    this.template = function ()
    { 
        return  '<div id="' + this.domID + '"></div>'; 
    };
    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        this.addComponents(this.components);
    };

    var _defaultParams = {
        type: ContainerType.CONTAINER
    };
    _props = extend(false, false, _defaultParams, _props);
    var _width;
    var _height;
    var _type = _props.type;
    
    Parent.call(this, _props);
    var _spacing = new Spacing(_props.spacing, this.$el);

    this.width = _props.width;
    this.height = _props.height;

    if(_type)
        this.$el.addClass(_type); 
    
};
Container.type = 'container';