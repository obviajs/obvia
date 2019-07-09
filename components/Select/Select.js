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
        }
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

    
    this.changeHandler = function (e) {
        _value = this.$el.val();
    };

    this.template = function () {
        return "<select data-triggers='change' id='" + this.domID + "'></select>";
    };

    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        this.addComponents(this.components);
    };

    

    var _defaultParams = {
        dataProvider: null,
        optionLabel: "",
        optionValue: "",
        value: null
    };
    shallowCopy(extend(false, false, _defaultParams, _props), _props);
    _props.applyBindings = false;
    var _dataProvider = _props.dataProvider;
    var _optionLabel = _props.optionLabel;
    var _optionValue = _props.optionValue;

    var _component = {
        constructor: Option,
        props:{
            id:"opt",
            value: '{'+_optionValue+'}',
            label: '{'+_optionLabel+'}'
        }
    };
    _props.components = [].pad(_component, _dataProvider.length);
    for(var i=0;i<_dataProvider.length;i++){
        _props.components[i].props.bindingDefaultContext = _dataProvider[i];
    }

    var _value = _props.value;
    var _change = _props.change;
    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler.apply(this, arguments);
        }
    };

    Parent.call(this, _props);
   
    
    this.addRow = function (data, index, isPreventable = false, focusOnRowAdd = true) 
    {
        var cmp = extend(true, _component);
        cmp.props.bindingDefaultContext = data;
        var el = Component.fromLiteral(cmp, data);
        var cmpId = cmp.props.id;

        el.on('creationComplete', (function (ci) { 
                return (function(e) { // a closure is created
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    ccComponents.push(el.id);
                });
        })());
    }
    this.render = function () 
    {
        if(_dataProvider && _dataProvider.forEach)
        {
            this.dataProvider.forEach(function (data, index) {  
                _self.addRow(data, index + 1);
            });
        }
        return this.$el;
    }
    if (overrided) {
        this.keepBase();
    }
};

//component prototype
Select.prototype.ctor = 'Select';