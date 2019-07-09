var Option = function (_props, overrided = false) {
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
                if(this.$el)
                    this.$el.text(v);
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

    this.template = function () {
        return "<option id='" + this.domID + "' value='"+_value+"'>"+_label+"</option>";
    };

    var _defaultParams = {
        label: "",
        value: ""
    };

    _props = extend(false, false, _defaultParams, _props);
    //_props.applyBindings = false;
    var _label = _props.label;
    var _value = _props.value;

    Component.call(this, _props);
};
//component prototype
Option.prototype.ctor = 'Option';