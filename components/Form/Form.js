/**
 * This is a Form component
 * 
 * Kreatx 2018
 */

//component definition
var Form = function(_props)
{
    /*
    initModel: function () {
        return {
            formAction: (this.viewMode == "steps") ? "?forms/modify_form_submit" : "#"
        }
    },

    renderFormHeader: function (viewMode) {
        return (
            viewMode == 'steps' ? 
                "<div class='row'>" +
                "</div>" :
                
                "<div class='row'>" +
                    "<div class='col-sm-12'>" +
                        "<center>" +
                            "<h4>" +
                                "{formName}" +
                            "</h4>" +
                        "</center>" +
                    "</div>" +
                "</div><hr>"
        )    
    },*/

    this.beforeAttach = function () 
    {
        this.$container = this.$el.find('#' + model.componentContainerID);
        this.$form = this.$el.find('#'+ this.domID + "-form");
    }

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
                if (typeof this[component.props.id].getValue() == "string")
                    this[component.props.id].setValue("");
                else this[component.props.id].setValue([]);
            } catch (error) {
                
            }   
        }.bind(this));
    };

  

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
                this.components.forEach(function (component) {
                    this[component.props.id].enabled = v;
                }.bind(this));
            }
        }
    });

    this.serialize = function (encode = false) 
    {
        var value = {};
        this.components.forEach(function (component) {
            value[component.props.id] = this[component.props.id].getValue();
        }.bind(this));

        var serialized = JSON.stringify(value);
        if (encode) {
            serialized = btoa(serialized);   
        }
        return serialized;
    };



    this.template = function () 
    {
        return "<div id='" + this.domID + "-wrapper' class='col-sm-12'>" +
                    "<form name='view_form' id='" + this.domID + "-form' method='POST' action='"+this.action+"' class='view_form'>" +
                        "<div class='col-sm-12' style='padding: 10px'>" +
                            this.renderFormHeader(this.viewMode) + 
                            "<div>" +
                                "<div class='row' id='"+this.domID + "_component_container'>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</form>" +
                "</div>";
            
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
    };
    _props = extend(false, false, _defaultParams, _props);
    var _width = _props.width;
    var _height = _props.height;
    var _formData = null;

    Parent.call(this, _props, true);

    var base = this.base;
    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        base.beforeAttach();
    };
};
Form.type = 'form';