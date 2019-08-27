/**
 * This is a FormField Element
 * 
 * Kreatx 2018
 */

//component definition
var FormField = function(_props)
{   
    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        this.addComponents(this.components);
        e.preventDefault();
    };

    Object.defineProperty(this, "component", 
    {
        get: function component() 
        {
            return _component;
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
                    if(_cmp.$el)
                        _cmp.$el.attr("name", _name);
                }else
                {
                    if(_cmp.$el)
                        _cmp.$el.removeAttr('name');
                }
            }
        }
    });

    Object.defineProperty(this, "required",
    {
        get: function required()
        {
            return _required;
        },
        set: function required(v)
        {
            if(_required != v)
            {
                _required = v;
                if(_required)
                {
                    if(_cmp.$el)
                        _cmp.$el.attr('required', _required);
                }else
                {
                    if(_cmp.$el)
                        _cmp.$el.removeAttr('required');
                }
            }
        }
    });

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
                if(_lbl)
                    _lbl.label = v;
            }
        }
    });

    Object.defineProperty(this, "cmp", 
    {
        get: function cmp() 
        {
            return _cmp;
        }
    });
    /**
         this.validate = function () {
        if (_props.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                this.$el.addClass('invalid');
                return false;
            } else {
                this.errorList = [];
                this.$el.removeClass('invalid');
            }
        }
        return true;
    };
     *  */
    

    this.validate = function()
    {

    }
    let _lblBeforeAttach = function(e){
        _lbl = this;
        if(_cmp)
            _lbl.$el.prop("for", _cmp.domID);
    }

    var _defaultParams = {
        enabled: true,
        required: false,
        size: FormFieldSize.SMALL,
        type:ContainerType.NONE                     
    };
    
    _props = extend(false, false, _defaultParams, _props);
    var _placeholder;
    var _name;
    var _required;
    var _label;
    var _component = _props.component;
    var _lblCmp = {
        "constructor": Label,
        "props":{
            id: 'label',
            beforeAttach: _lblBeforeAttach
        }
    };    
    var _size = _props.size;
    _props.components = [_lblCmp];
    if(_component && !Object.isEmpty(_component)){
        _props.components.push(_component);
    }


    var _self = this;
    Container.call(this, _props);

    var _cmp, _lbl;
    
    this.on('childCreated childAdded', function(e){
        if(e.child.ctor != 'Label'){
            _cmp = e.child;
            if(_component ==null || Object.isEmpty(_component)){
                _component = _cmp.literal;
            }
            if(_lbl)
                _lbl.$el.prop("for", _cmp.domID);
            if(_props.required)
                _self.required = _props.required;
            if(_props.placeholder)
                _self.placeholder = _props.placeholder;
            e.stopPropagation();
            var _cmpObj;
            if(["input", "select", "textarea"].indexOf(_cmp.$el[0].tagName.toLowerCase())>-1){
                _cmpObj = _cmp.$el;
            }else{
                _cmpObj = _cmp.$el.find("input, select, textarea").filter(function(){ 
                    return ($(this).closest(".no-form-control").length == 0);
                });
            }
            _cmpObj.addClass("form-control");
            if(_size)
                _cmpObj.addClass(_size); 

            _self.placeholder = _props.placeholder;
            _self.name = _props.name;
            _self.required = _props.required;
            _self.label = _props.label;
            _self.trigger('creationComplete');
        }else{
            if(_cmp)
                _lbl.$el.prop("for", _cmp.domID);
        }
    });

    var _enabled = _props.enabled;
    Object.defineProperty(this, "enabled",
    {
        get: function enabled()
        {
            return _enabled;
        },
        set: function enabled(v)
        {
            if(_enabled != v)
            {
                _enabled = v;
                if(_cmp)
                    _cmp.enabled = !!v;
            }
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
                        case "component":
                            var component = {};
                            component.constructor = _cmp.ctor; //_component.constructor;
                            component.props = _cmp.props;
                            obj[prop] = component;
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

    Object.defineProperty(this, "placeholder", 
    {
        get: function placeholder() 
        {
            return _placeholder;
        },
        set: function placeholder(v) 
        {
            if(_placeholder != v)
            {  
                _placeholder = v;
                if(_placeholder)
                {
                    if(_cmp && _cmp.$el)
                        _cmp.$el.attr("placeholder", _placeholder);
                }else
                {
                    if(_cmp && _cmp.$el)
                        _cmp.$el.removeAttr('placeholder');
                }
            }
        }
    });
}
//component prototype
FormField.prototype.ctor = 'FormField';