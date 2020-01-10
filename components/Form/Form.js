/**
 * This is a Form component
 * 
 * Kreatx 2018
 */

//component definition
var Form = function(_props)
{

    Object.defineProperty(this, "method", 
    {
        get: function method() 
        {
            return _method;
        },
        set: function method(v) 
        {
            if(_method != v)
            {
                if(_method){
                    if(this.$el){
                        this.$el.attr('method', v);
                        _method = v;
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('method');
                    }                
                }
            }
        },
        enumerable:true
    });

    Object.defineProperty(this, "action", 
    {
        get: function action() 
        {
            return _action;
        },
        set: function _action(v) 
        {
            if(_action != v)
            {
                if(_action){
                    if(this.$el){
                        this.$el.attr('action', v);
                        _action = v;
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('action');
                    }                
                }
            }
        },
        enumerable:true
    });


    this.validate = function () 
    {
        var valid = true;
        this.errorList = [];

        this.components.forEach(function (component) {
            if (!this[component.props.id].validate()) {
                this.errorList = this.errorList.concat(this[component.props.id].errorList)
                valid = false;
            }
        }.bind(this));

        return valid;
    };

    this.clear = function () 
    {
        this.components.forEach(function (component) {
            try {
                if (typeof this[component.props.id].child.value == "string")
                    this[component.props.id].child.value = "";
                else this[component.props.id].child.value = [];
            } catch (error) {
                
            }   
        }.bind(this));
    };

    this.serialize = function (encode = false) 
    {
        var value = {};
        this.components.forEach(function (component) {
            value[component.props.id] = this[component.props.id].child.value;
        }.bind(this));

        var serialized = JSON.stringify(value);
        if (encode) {
            serialized = btoa(serialized);   
        }
        return serialized;
    };

    this.template = function () 
    {
        return  "<form id='" + this.domID + "' method='"+_method+"' action='"+_action+"'></form>";
    };
    
    this.addFormData = function(name, value)
    {
        if(!_formData){
            _formData = new FormData(this.$form[0]);
        }
        _formData.append(name, value);
    };

    this.removeFormData = function(name)
    {
        if(_formData)
        {
            if(typeof _formData["delete"] == 'function')
            {
                _formData.delete(name);
            }else
            {
                var _formData2 = new FormData();
                for (var pair of _formData.entries())
                {
                    if(pair[0]!=name){
                        _formData2.append(pair[0], pair[1]);
                    }
                }
                _formData = _formData2;
            }
        }
    };
    
    this.getFormData = function()
    {
        if(!_formData){
            _formData = new FormData(this.$form[0]);
        }
        return _formData;
    };
    this.resetFormData = function()
    {
        _formData = undefined;
    };
    this.reset = function(){
        this.$el.get(0).reset();
    };
    this.post = function(dataType)
    {
        var type = dataType? dataType:"json";
        var _self = this;
        $.ajax({
            url: _action,
            data: this.getFormData(),
            type: _method,
            contentType: false,
            processData: false,
            cache: false,
            "dataType": type, 
            xhr: function(){
                _self.trigger(FormEventType.POST_STARTED);     
                var cXhr = $.ajaxSettings.xhr();
                if(cXhr.upload){
                    cXhr.upload.addEventListener('progress', 
                    function(e){
                        if(e.lengthComputable){
                            var max = e.total;
                            var current = e.loaded;
                    
                            var percentage = (current * 100)/max;
                            console.log(percentage);
                    
                            if(percentage >= 100)
                            {
                               // process completed  
                            }
                            e.percentage = percentage;
                        }
                        _self.trigger(FormEventType.POST_PROGRESS, [e]);        
                    }
                    ,false);
                }
                return cXhr;
            },
            error: function(jqXHR,  textStatus, errorThrown){
                console.error(errorThrown);
                _self.trigger(FormEventType.POST_ERROR, [jqXHR,  textStatus, errorThrown]);
            },
            success: function(data, textStatus, jqXHR){
                _self.trigger(FormEventType.POST_SUCCESS, [data, textStatus, jqXHR]);
            },
            always: function(jqXHR, textStatus){
                _self.trigger(FormEventType.POST_COMPLETE, [jqXHR, textStatus]);
            }
        });
    }

    var _defaultParams = {
        method: "POST"
    };
    _props = extend(false, false, _defaultParams, _props);
    var _width = _props.width;
    var _height = _props.height;
    var _formData = null;
    var _action = _props.action;
    var _method = _props.method;
    
    this.beforeAttach = function(e) 
    {
        
        this.$container = this.$form = this.$el;
        if(this.sortChildren){
            acSort(this.components, "props.index");
        }
        if(this.components && Array.isArray(this.components) && this.components.length>0)
        {
            var $form_group;
            var rowColSpan = 0;
            for(var i=0;i<this.components.length;i++)
            {
                var component = Object.assign({}, this.components[i]);
                var container = this.$container;
                if(component.props['spacing'] && component.props['spacing']['colSpan'] && component.props['spacing']['colSpan']>0)
                {
                    if(rowColSpan + component.props.spacing.colSpan > 12 || !$form_group)
                    {
                        $form_group = $('<div class="form-group row"></div>');
                        this.$container.append($form_group);
                    }
                    container = $form_group;
                    rowColSpan += component.props.spacing.colSpan;
                }
                var cmpInst = this.addComponentInContainer(container, component);
                if(cmpInst.ctor == "FormField" && (!component.props['spacing'] || !component.props['spacing']['colSpan'] || component.props['spacing']['colSpan']==0))
                {
                    cmpInst.$el.addClass("form-group")
                }
            }
        }
    };

    Parent.call(this, _props, true);

    var base = this.base;
};
Form.prototype.ctor = 'Form';