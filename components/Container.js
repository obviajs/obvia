/**
 * This is a Container Element
 * 
 * Kreatx 2018
 */

//component definition
var Container = function(_props)
{
    if(!this.hasOwnProperty("placeholder")){
        Object.defineProperty(this, "placeholder", 
        {
            get: function placeholder() 
            {
                return _placeholder;
            },
            set: function placeholder(v) 
            {
                if(_placeholder != v)
                {  
                    _placeholder = v;
                    if(_placeholder)
                    {
                        if(this.$el)
                            this.$el.attr("placeholder", _placeholder);
                    }else
                    {
                        if(this.$el)
                            this.$el.removeAttr('placeholder');
                    }
                }
            }
        });
    }
    
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
                    this.$el.css('width', v+ (isString(_width) && _width.indexOf("%")>-1?"":"px"));
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
                    this.$el.css('height', v+(isString(_width) && _width.indexOf("%")>-1?"":"px"));
                }
            }
        }
    });

    Object.defineProperty(this, "role",
    {
        get:function role(){
            return _role;
        },
        set:function role(v){
            if(_role!=v){
                _role=v;
                if(_role){
                    if(this.$el){
                        this.$el.attr('role',_role);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('role');
                    }                
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
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<div id="' + this.domID + '"></div>'; 
    };

    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            if(!e.isDefaultPrevented()){
                this.$container = this.$el;
                this.addComponents(this.components);
            }
        }
    };

    this.afterAttach = function (e) 
    {
        //if (e.target.id == this.domID) 
       // {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            var e = arguments[0];
            if (!e.isDefaultPrevented()) {
                if(_props.placeholder)
                    this.placeholder = _props.placeholder;
            }
            //e.preventDefault();
        //}
    };

    var _defaultParams = {
        type: ContainerType.CONTAINER,
        components:[]
    };
    //_props = extend(false, false, _defaultParams, _props);
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    var _width;
    var _height;
    var _type, _role;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
    var _placeholder;
    Parent.call(this, _props);
    
    if(_props.width)
        this.width = _props.width;
    if(_props.height)
        this.height = _props.height;
    if(_props.role)
        this.role = _props.role;

    if(_props.type && _props.type !="")
        this.type = _props.type; 
    /*
    this.registerEvents = function () 
    {
        return [];
    }*/
};
Container.prototype.ctor = 'Container';