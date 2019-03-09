/**
 * This is a Hidden Input Element
 *
 * Kreatx 2019
 */
 
//component definition
var Hidden = function (_props, overrided = false) {
    var _self = this;
 
    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                if (_value) {
                    if (this.$el) {
                        this.$el.attr('value', _value);
                        this.trigger('change');
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('value');
                    }
                }
            }
        }
    });
    
    Object.defineProperty(this, "name", 
    {
        get: function name() 
        {
            return _name;
        },
        set: function name(v) 
        {
            if(_name != v)
            {  
                _name = v;
                if(_name)
                {
                    if(this.$el)
                        this.$el.attr("name", _name);
                }else
                {
                    if(this.$el)
                        this.$el.removeAttr('name');
                }
            }
        }
    });
  
    this.changeHandler = function () {
        _value = this.$el.val();
    };
 
 
    this.template = function () {
        return  "<input data-triggers='change' type='hidden' id='" + this.domID + "'>";
    };
 
    var _defaultParams = {
        value: ""
    };
    _props = extend(false, false, _defaultParams, _props);
 
    var _value; 
    var _name; 
    var _change = _props.change;
 
    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);
        _self.changeHandler(e);
    };
 
    Component.call(this, _props);
    
    if(_props.name)
        this.name = _props.name;
    if(_props.value)
        this.value = _props.value;   
};
 
//component prototype
TextInput.type = 'text';