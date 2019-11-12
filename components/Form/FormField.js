/**
 * This is a FormField Element
 * 
 * Kreatx 2018
 */

//component definition
var FormField = function(_props)
{   
    var _self = this;
    var _child, _lbl;

    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            console.log("beforeAttach domID: ", this.domID);
            this.$container = this.$el;
            let inst = this.addComponents();
            _lbl = inst[0];
            if(inst[1])
            {
                _child = inst[1];
                _lbl.$el.prop("for", _child.domID);
                if(_props.required)
                    _self.required = _props.required;
                if(_props.placeholder)
                    _self.placeholder = _props.placeholder;
                if(_props.name)   
                    _self.name = _props.name;
            }
            if(_props.label)       
                _self.label = _props.label;
            e.preventDefault();
        }
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
                    if(_child && _child.$el)
                        _child.$el.attr("name", _name);
                }else
                {
                    if(_child && _child.$el)
                        _child.$el.removeAttr('name');
                }
            }
        },
        enumerable:true
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
                    if(_child && _child.$el)
                        _child.$el.attr('required', _required);
                }else
                {
                    if(_child && _child.$el)
                        _child.$el.removeAttr('required');
                }
            }
        },
        enumerable:true
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
        },
        enumerable:true
    });

    Object.defineProperty(this, "child", 
    {
        get: function child() 
        {
            return _child;
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

    var _defaultParams = {
        enabled: true,
        required: false,
        size: FormFieldSize.SMALL,
        type:ContainerType.NONE,
        name:"",
        label:""                 
    };
    
    _props = extend(false, false, _defaultParams, _props);
    var _placeholder;
    var _name;
    var _required;
    var _label;
    var _component = _props.component;
    var _lblCmp = {
        "ctor": Label,
        "props":{
            id: 'label'
        }
    };    
    var _size = _props.size;
    
    _props.components = [_lblCmp];
    if(_component && !Object.isEmpty(_component)){
        _props.components.push(_component);
    }
    
    Container.call(this, _props); 

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
                if(_child)
                    _child.enabled = !!v;
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
                            component.ctor = _child.ctor; //_component.ctor;
                            component.props = _child.props;
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
                    if(_child && _child.$el)
                        _child.$el.attr("placeholder", _placeholder);
                }else
                {
                    if(_child && _child.$el)
                        _child.$el.removeAttr('placeholder');
                }
            }
        }
    });

    this.on('childCreated childAdded', function(e){
        if(e.child.ctor != 'Label'){
            if(_component == null || Object.isEmpty(_component)){
                _child = e.child;
                _lbl.$el.prop("for", _child.domID);
                if(_props.required)
                    _self.required = _props.required;
                if(_props.placeholder)
                    _self.placeholder = _props.placeholder;
                if(_props.name)   
                    _self.name = _props.name;
                _component = _child.literal;
            }
            
            e.stopPropagation();
            var _cmpObj;
            if(["input", "select", "textarea", "button"].indexOf(_child.$el[0].tagName.toLowerCase())>-1){
                _cmpObj = _child.$el;
            }else{
                _cmpObj = _child.$el.find("input, select, textarea, button").filter(function(){ 
                    return ($(this).closest(".no-form-control").length == 0);
                });
            }
            _cmpObj.addClass("form-control");
            if(_size)
                _cmpObj.addClass(_size); 
            _self.trigger('creationComplete');
        }
    });
}
//component prototype
FormField.prototype.ctor = 'FormField';