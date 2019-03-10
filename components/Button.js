/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var Button = function(_props, overrided=false)
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
                _type = v;
                if(_type)
                {
                    if(this.$el)
                    {
                        this.$el.attr('type', _type);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('_type');
                    }
                }                    
            }
        }
    });

    Object.defineProperty(this, "value", 
    {
        get: function value() 
        {
            return _value;
        },
        set: function value(v) 
        {
            if(_value != v)
            {
                _value = v;
                if(_value)
                {
                    if(this.$el)
                    {
                        this.$el.attr('value', _value);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('value');
                    }
                }                    
            }
        }
    });

    this.template = function () 
    {
        return  "<button data-triggers='click' id='" + this.domID + "' type='"+_type+"'  "+(_value?"value='"+_value+"'":"")+">"+_label+"</button>";
    };
   
    var _defaultParams = {
        label:"",
        type:"button",
    };
    _props = extend(false, false, _defaultParams, _props);
    
    var _label = _props.label;
    var _type = _props.type;
    var _value = _props.value;

    Component.call(this, _props);
    if(overrided)
    {
        this.keepBase();
    }
};
Button.type = 'button';