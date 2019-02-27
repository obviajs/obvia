/**
 * This is a FormField Element
 * 
 * Kreatx 2018
 */

//component definition
var FormField = function(_props)
{   
    var _defaultParams = {
        id: "Component_"+Component.instanceCnt,
        enabled: true,
        required: false 
    };
   
   
    _props = extend(false, false, _defaultParams, _props);
    var _placeholder;
    var _name;
    var _required;
    var _label = _props.label;
    

    var _cmp = Component.fromLiteral(_props.component);
    _cmp.$el.addClass("form-control");  
    var _self = this;
    _cmp.on('creationComplete', function(e){
        e.stopPropagation();
        _self.placeholder = _props.placeholder;
        _self.name = _props.name;
        _self.required = _props.required;
    });
    
    Component.call(this, _props);

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
                    if(_cmp.$el)
                        _cmp.$el.attr("placeholder", _placeholder);
                }else
                {
                    if(_cmp.$el)
                        _cmp.$el.removeAttr('placeholder');
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
                if(this.$label)
                    this.$label.html(v);
            }
        }
    });

    this.template = function () 
    { 
        '<div class="form-group '+(this.colspan?"col-sm-" + this.colspan:"")+'">'+
            "<label id='" + this.domID + "_label'  for='"+_cmp.domID+"'>"+_label+"</label>"+
            _cmp.template()+
        '</div>';
    }

    this.validate = function()
    {

    }
    this.beforeAttach = function () 
    {
        this.$label = this.$el.find("#" + this.domID + "_label");
    };
}
//component prototype
FormField.type = 'formfield';