/**
 * This is an Image Element
 * 
 * Kreatx 2018
 */

//component definition
var Image = function(_props)
{
    Object.defineProperty(this, "src", 
    {
        get: function src() 
        {
            return _src;
        },
        set: function src(v) 
        {
            if(_src != v)
            {
                _src = v;
                if(this.$el)
                    this.$el.attr('src', v);
            }
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "alt", 
    {
        get: function alt() 
        {
            return _alt;
        },
        set: function alt(v) 
        {
            if(_alt != v)
            {
                _alt = v;
                if(this.$el)
                    this.$el.attr('alt', v);
            }
        },
        enumerable:true
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
                    this.$el.attr('height', v);
            }
        },
        enumerable:true
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
                    this.$el.attr('width', v);
            }
        },
        enumerable:true
    });

    this.beforeAttach = function() {
        if(_props.width){
            this.width = _props.width;
        }

        if(_props.height){
            this.height = _props.height;
        }
    }

    this.template = function () 
    {         
        return  '<img id="' + this.domID + '" src="'+this.src+'" alt="'+this.alt+'">';    
    };
    var _defaultParams = {
        width: 0,
        height: 0
    };

    _props = extend(false, false, _defaultParams, _props);
    let _width;
    var _height = _props.height;
    var _alt = _props.alt;
    var _src = _props.src;
    var _load = _props.load;

    Component.call(this, _props, true);
    var base = this.base;

    this.registerEvents = function () 
    {
        return base.registerEvents().concat(
        [
            {
                registerTo: this.$el, events: {
                    'load' : _load && typeof _load == 'function'? _load.bind(this) : undefined
                }
            }
        ]);
    };

    this.render = function () 
    {
        if(this.$el.complete)
        {
            this.trigger('load');
        }
        return this.$el;
    }
};
Image.prototype.ctor = 'Image';