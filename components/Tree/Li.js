var Li = function (_props, overrided = false) {
    var _self = this;

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
                if(this.$el){
                    if(this.$el[0].nextSibling)
                        this.$el[0].nextSibling.textContent = v;
                    else
                        this.$el.prependText(v);
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
                if(this.$el)
                    this.$el.attr('value', v);
            }
        }
    });

    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        this.addComponents(this.components);
    };

    this.template = function () {
        return "<li id='" + this.domID + "' value='"+_value+"'></li>";
    };

    var _defaultParams = {
        label: "",
        value: "",
        classes:["list-group-item"]
    };

    _props = extend(false, false, _defaultParams, _props);
    //_props.applyBindings = false;
   
    Parent.call(this, _props); 
   
    var _label = _props.label;
    var _value = _props.value;
};
//component prototype
Li.prototype.ctor = 'Li';