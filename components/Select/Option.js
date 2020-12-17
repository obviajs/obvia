var Option = function (_props) {
    let _self = this, _label, _value;
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
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            if(_props.label && !this.getBindingExpression("label")){
                this.label = _props.label;
            }
            if(_props.value && !this.getBindingExpression("value")){
                this.value = _props.value;
            }
        
        }
    }
    this.template = function () {
        return "<option id='" + this.domID + "'></option>";
    };

    let _defaultParams = {
        label: "",
        value: ""
    };

    _props = extend(false, false, _defaultParams, _props);
    //_props.applyBindings = false;
    Component.call(this, _props);
};
//component prototype
Option.prototype.ctor = 'Option';