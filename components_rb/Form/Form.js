/**
 * This is a Form component
 * 
 * Kreatx 2018
 */

//component definition
var Form = function(_props)
{
    let _formData, _action, _method;

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
        set: function action(v) 
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
        let valid = true;
        this.errorList = [];

        this.components.forEach(function (component) {
            if (!this[component.props.id].validate()) {
                this.errorList = this.errorList.concat(this[component.props.id].errorList);
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
        let value = {};
        this.components.forEach(function (component) {
            value[component.props.id] = this[component.props.id].child.value;
        }.bind(this));

        let serialized = JSON.stringify(value);
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
                let _formData2 = new FormData();
                for (let pair of _formData.entries())
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
    this.post = function (dataType) {
        let type = dataType ? dataType : "json";
        let _self = this;
        $.ajax({
            url: _action,
            data: this.getFormData(),
            type: _method,
            contentType: false,
            processData: false,
            cache: false,
            "dataType": type,
            xhr: function () {
                _self.trigger(FormEventType.POST_STARTED);
                let cXhr = $.ajaxSettings.xhr();
                if (cXhr.upload) {
                    cXhr.upload.addEventListener('progress',
                        function (e) {
                            if (e.lengthComputable) {
                                let max = e.total;
                                let current = e.loaded;
                    
                                let percentage = (current * 100) / max;
                                console.log(percentage);
                    
                                if (percentage >= 100) {
                                    // process completed  
                                }
                                e.percentage = percentage;
                            }
                            _self.trigger(FormEventType.POST_PROGRESS, [e]);
                        }, false);
                }
                return cXhr;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
                _self.trigger(FormEventType.POST_ERROR, [jqXHR, textStatus, errorThrown]);
            },
            success: function (data, textStatus, jqXHR) {
                _self.trigger(FormEventType.POST_SUCCESS, [data, textStatus, jqXHR]);
            },
            always: function (jqXHR, textStatus) {
                _self.trigger(FormEventType.POST_COMPLETE, [jqXHR, textStatus]);
            }
        });
    };

    let _defaultParams = {
        method: "POST"
    };
    _props = extend(false, false, _defaultParams, _props);
    _formData = null;
    _action = _props.action;
    _method = _props.method;
    
    Container.call(this, _props, true);

    let base = this.base;
};
Form.prototype.ctor = 'Form';