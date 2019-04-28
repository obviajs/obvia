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
    
    this.template = function ()
    { 
        return  '<div id="' + this.domID + '"></div>'; 
    };
    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        this.addComponents(this.components);
    };

    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            e.preventDefault();
        }
    };

    var _defaultParams = {
        type: ContainerType.CONTAINER,
        components:[]
    };
    _props = extend(false, false, _defaultParams, _props);
    var _width;
    var _height;
    var _type = _props.type;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
   

    Parent.call(this, _props);
    
    this.width = _props.width;
    this.height = _props.height;

    if(_type && _type !="")
        this.$el.addClass(_type); 
    
    
    /*
    this.registerEvents = function () 
    {
        return [];
    }*/
};
Container.prototype.type = 'Container';