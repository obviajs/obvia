/**
 * This is a Select Html Element
 *
 * Kreatx 2019
 */

//component definition
var Select = function (_props, overrided = false) {
    var _self = this;
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                _dataProvider = v;
            }
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
    
    _changeHandler = function (e) {
        _value = this.$el.val();
    };

    this.template = function () {
        return "<select data-triggers='change' id='" + this.domID + "'></select>";
    };

    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        this.addComponents();
        if(_props.value){
            _value = _props.value;
        }
    };

    var _defaultParams = {
        dataProvider: null,
        labelField: "",
        valueField: "",
        value: null
    };
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    _props.applyBindings = false;
    var _dataProvider = _props.dataProvider;
    var _labelField = _props.labelField;
    var _valueField = _props.valueField;

    var _component = {
        ctor: Option,
        props:{
            id:"opt",
            value: '{'+_valueField+'}',
            label: '{'+_labelField+'}'
        }
    };
    _props.components = [].pad(_component, _dataProvider.length);
    for(var i=0;i<_dataProvider.length;i++){
        _props.components[i].props.bindingDefaultContext = _dataProvider[i];
    }

    var _change = _props.change;
    _props.change = function () {
        var e = arguments[0];
        if(!e.isDefaultPrevented()) {
            _changeHandler.apply(_self, arguments);
        }
        if(typeof _change == 'function')
            _change.apply(_self, arguments);
    };

    Parent.call(this, _props);
    let _value;
    
    if (overrided) {
        this.keepBase();
    }

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