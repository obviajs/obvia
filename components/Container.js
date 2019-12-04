/**
 * This is a Container Element
 * 
 * Kreatx 2018
 */

//component definition
var Container = function(_props, overrided=false)
{
    let _textAlign;

    if(!this.hasOwnProperty("label")){
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
                    {
                        var last = this.$el.children().last();
                        if(last && last.length>0)
                            if(last[0].nextSibling)
                                last[0].nextSibling.textContent = v;
                            else
                                if(_textAlign == "left")
                                    this.$el.prependText(v);
                                else
                                    this.$el.appendText(v);
                        else
                            //this.$el.appendText(v);
                            this.$el.text(v);
                    }
                }
            },
            configurable: true
        });
    }
    if(!this.hasOwnProperty("width"))
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
                        if(v==null){
                            this.$el.css('width', '');
                        }else{
                            let s = (
                                isString(_width) && 
                                (
                                    _width.indexOf("vh")>-1 ||
                                    _width.indexOf("em")>-1 ||
                                    _width.indexOf("%")>-1
                                )
                            );
                            this.$el.css('width', v+ (s?"":"px"));
                        }
                    }
                }
            },
            enumerable:true
        });
    }
    if(!this.hasOwnProperty("height"))
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
                        if(v==null){
                            this.$el.css('height', '');
                        }else{
                            let s = (
                                isString(_height) && 
                                (
                                    _height.indexOf("vh")>-1 ||
                                    _height.indexOf("em")>-1 ||
                                    _height.indexOf("%")>-1
                                )
                            );
                            this.$el.css('height', v+(s?"":"px"));
                        } 
                    }
                }
            },
            configurable:true,
            enumerable:true
        });
    }
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
        },
        enumerable:true
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
        },
        enumerable:true
    });
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<div id="' + this.domID + '"></div>'; 
    };
    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if(!e.isDefaultPrevented()){
                this.$container = this.$el;
                this.addComponents();
            }
        }
    };
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) 
    {
        //if (e.target.id == this.domID) 
       // {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            var e = arguments[0];
            if (!e.isDefaultPrevented()) {
                if(_props.label)
                    this.label = _props.label;
                if(_props.textAlign)
                    _textAlign = _props.textAlign;
            }
            //e.preventDefault();
        //}
    };

    var _defaultParams = {
        type: ContainerType.CONTAINER,
        components:[],
        spacing:{},
        width: undefined,
        height: undefined,
        role: undefined,
        textAlign: "left"
    };
    //_props = extend(false, false, _defaultParams, _props);
    
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    var _width;
    var _height;
    var _type, _role;
    //var _afterAttach = _props.afterAttach;
    //_props.afterAttach = this.afterAttach;
    let _label;
    let r = Parent.call(this, _props, overrided);
    var base = this.base;
    if(overrided)
    {
        this.keepBase();
    }

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
    return r;
};
Container.prototype.ctor = 'Container';