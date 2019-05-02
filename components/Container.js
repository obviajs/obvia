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

    Object.defineProperty(this, "type", 
    {
        get: function type() 
        {
            return _type;
        },
        set: function type(v) 
        {
            if(_type != v)
            {
                if(this.$el)
                {
                    this.$el.removeClass(_type); 
                    this.$el.addClass(v); 
                    _type = v;
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
    //_props = extend(false, false, _defaultParams, _props);
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    var _width;
    var _height;
    var _type;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
   
    Parent.call(this, _props);
    
    this.width = _props.width;
    this.height = _props.height;

    if(_props.type && _props.type !="")
        this.type = _props.type; 
    /*
    this.registerEvents = function () 
    {
        return [];
    }*/
};
Container.prototype.ctor = 'Container';