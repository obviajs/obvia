/**
 * This is a Select Html Element
 *
 * Kreatx 2019
 */

//component definition
var Select = function (_props) {
    let _self = this, _value, _dataProvider;
    Object.defineProperty(this, "valueField", 
    {
        get: function valueField() 
        {
            return _valueField;
        },
        set: function valueField(v) 
        {
            if (_valueField != v) { 
                _valueField = v;
                this.components = fnContainerDelayInit();
                this.removeAllRows(false);
                if (_dataProvider && _dataProvider.length > 0) { 
                    let dpFields = Object.keys(_dataProvider[0]);
                    if (propDataProvider && dpFields.includes(_labelField) && dpFields.includes(_valueField)) { 
                        propDataProvider['set'].call(_self, _dataProvider);
                    }
                }
            }
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "labelField", 
    {
        get: function labelField() 
        {
            return _labelField;
        },
        set: function labelField(v) 
        {
            if (_labelField != v) { 
                _labelField = v;
                this.components  = fnContainerDelayInit();
                this.removeAllRows(false);
                if (_dataProvider && _dataProvider.length > 0) { 
                    let dpFields = Object.keys(_dataProvider[0]);
                    if (propDataProvider && dpFields.includes(_labelField) && dpFields.includes(_valueField)) { 
                        propDataProvider['set'].call(_self, _dataProvider);
                    }
                } 
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
    let fnContainerDelayInit = function () {
        return [{
            ctor: Option,
            props:{
                id:"opt",
                value: '{'+_valueField+'}',
                label: '{'+_labelField+'}'
            }
        }]; 
    };

    let _defaultParams = {
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
    let _labelField = _props.labelField;
    let _valueField = _props.valueField;

    _props.components = fnContainerDelayInit();
   
    let _change = _props.change;
    _props.change = function () {
        let e = arguments[0];
        if(!e.isDefaultPrevented()) {
            _changeHandler.apply(_self, arguments);
        }
        if(typeof _change == 'function')
            _change.apply(_self, arguments);
    };

    Repeater.call(this, _props);
    
    let propDataProvider = Object.getOwnPropertyDescriptor(this, "dataProvider");   
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return propDataProvider['get'].call(_self);
        },
        set: function dataProvider(v)
        { 
            _dataProvider = v;
            this.removeAllRows(false);
                    
            if (v.length > 0) { 
                let dpFields = Object.keys(v[0]);
                if (dpFields.includes(_labelField) && dpFields.includes(_valueField))
                { 
                    propDataProvider['set'].call(_self, _dataProvider);
                }
            } else {
                propDataProvider['set'].call(_self, _dataProvider);
            }  
        },
        enumerable: true
    });
    
    Object.defineProperty(this, "props", {
        get: function props() {            
            return new Props(_self, _props, ["components", "rendering"]);
        },
        configurable: true
    });
};

//component prototype
Select.prototype.ctor = 'Select';