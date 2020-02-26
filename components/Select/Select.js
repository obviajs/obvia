/**
 * This is a Select Html Element
 *
 * Kreatx 2019
 */

//component definition
var Select = function (_props, overrided = false) {
    let _self = this, _value, _dataProvider;
    Object.defineProperty(this, "valueField", 
    {
        get: function valueField() 
        {
            return _valueField;
        },
        set: function valueField(v) 
        {
            _valueField = v;
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                if (this.$el) {
                    this.$el.val(v);
                    this.trigger('change');
                }
            }
        }
    });
    
    Object.defineProperty(this, "labelField", 
    {
        get: function labelField() 
        {
            return _labelField;
        },
        set: function labelField(v) 
        {
            _labelField = v;
        },
        enumerable:true
    });
    
    let _changeHandler = function (e) {
        _value = this.$el.val();
    };

    this.template = function () {
        return "<select data-triggers='change' id='" + this.domID + "'></select>";
    };

    this.afterAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            if(_props.value && !this.getBindingExpression("value")){
                _value = _props.value;
            }
        }
    };

    var _defaultParams = {
        dataProvider: new ArrayEx([]),
        labelField: "",
        valueField: "",
        value: null,
        rendering: {
            wrap: false
        }
    };
    
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    _props.applyBindings = false;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;

    _props.components = [{
        ctor: Option,
        props:{
            id:"opt",
            value: '{'+_valueField+'}',
            label: '{'+_labelField+'}'
        }
    }];
   
    var _change = _props.change;
    _props.change = function () {
        var e = arguments[0];
        if(!e.isDefaultPrevented()) {
            _changeHandler.apply(_self, arguments);
        }
        if(typeof _change == 'function')
            _change.apply(_self, arguments);
    };

    Repeater.call(this, _props);
    
    if (overrided) {
        this.keepBase();
    }
    Object.defineProperty(this, "propsLite", {
        get: function props() {
            var obj = {};
            for(var prop in _props)
            {
                if(typeof _props[prop] != 'function' && (this[prop]==null || !this[prop].$el))
                {
                    switch(prop)
                    {
                        case "components":
                            break;
                        case "rendering":
                            break;
                        case "ownerDocument":
                            break;
                        default:
                            if(this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if(!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });  
    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props)
            {
                if(typeof _props[prop] != 'function')
                {
                    switch(prop)
                    {
                        case "components":
                            break;
                        case "rendering":
                            break;
                        case "ownerDocument":
                            break;
                        default:
                            if(this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if(!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });  
};

//component prototype
Select.prototype.ctor = 'Select';