/**
 * This is a Form component
 * 
 * Kreatx 2018
 */

//component definition
var Form = function(_props)
{
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
                if (typeof this[component.props.id].cmp.value == "string")
                    this[component.props.id].cmp.value = "";
                else this[component.props.id].cmp.value = [];
            } catch (error) {
                
            }   
        }.bind(this));
    };

    this.serialize = function (encode = false) 
    {
        var value = {};
        this.components.forEach(function (component) {
            value[component.props.id] = this[component.props.id].cmp.value;
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

    this.post = function(dataType)
    {
        var type = dataType? dataType:"json";
        var _self = this;
        $.ajax({
            url: _self.action,
            data: this.getFormData(),
            type: "POST",
            contentType: false,
            processData: false,
            cache: false,
            "dataType": type, 
            xhr: function(){
                var cXhr = $.ajaxSettings.xhr();
                if(cXhr.upload){
                    cXhr.upload.addEventListener('progress', 
                    function(e){
                        if(e.lengthComputable){
                            var max = e.total;
                            var current = e.loaded;
                    
                            var Percentage = (current * 100)/max;
                            console.log(Percentage);
                    
                            if(Percentage >= 100)
                            {
                               // process completed  
                            }
                        }
                        _self.trigger(FormEventType.POST_PROGRESS, [e]);        
                    }
                    ,false);
                }
                return cXhr;
            },
            error: function(err){
                console.error(err);
                _self.trigger(FormEventType.POST_ERROR, [err]);
            },
            success: function(data){
                _self.trigger(FormEventType.POST_SUCCESS, [data]);
            },
            complete: function(jqXHR, textStatus){
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
    
    this.beforeAttach = function() 
    {
        this.$container = this.$form = this.$el;
        if(this.components && Array.isArray(this.components))
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
                if(!component.props['spacing'] || !component.props['spacing']['colSpan'] || component.props['spacing']['colSpan']==0)
                {
                    cmpInst.$el.addClass("form-group")
                }
            }
        }
    };

    Parent.call(this, _props, true);

    var base = this.base;
};
Form.type = 'form';