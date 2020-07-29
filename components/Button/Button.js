/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var Button = function(_props)
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
                if (this.$el) {
                    //convert html entities
                    v = $(`<div>${v}</div>`).get(0).innerText;
                    let last = this.$el.children().last();
                    if(last && last.length>0)
                        if(last[0].nextSibling)
                            last[0].nextSibling.textContent = v;
                        else
                            this.$el.appendText(v);
                    else
                        //this.$el.appendText(v);
                        this.$el.text(v);
                }
            }
        },
        enumerable:true
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
        },
        enumerable:true
    });
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {  
            if(_props.label)
                this.label = _props.label;
            if(_props.value)
                this.value = _props.value;
        }
    }
    this.template = function () 
    {
        return  "<button data-triggers='click' id='" + this.domID + "' type='"+_type+"'></button>";
    };


    let _defaultParams = {
        label:"",
        type:"button",
        components:[]
    };
    //_props = extend(false, false, _defaultParams, _props);
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    let _label;
    let _type = _props.type;
    let _value; 
    
   // Component.call(this, _props);
    let r = Container.call(this, _props);

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
        },
        enumerable:true
    });
    return r;
};
Button.prototype.ctor = 'Button';