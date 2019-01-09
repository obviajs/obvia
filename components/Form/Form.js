/**
 * This is a Form component
 * 
 * Kreatx 2018
 */

//component definition
var FormInit = {
    initModel: function () {
        return {
            formAction: (this.viewMode == "steps") ? "?forms/modify_form_submit" : "#",
            componentContainerID: this.domID + '_component_container'
        }
    },

    beforeAttach: function () {
        var model = this.getModel();

        this.ccComponents = [];
        this.$container = this.$el.find('#' + model.componentContainerID);
        this.$form = this.$el.find('#'+ this.domID + "-form");
    },
    type:"form",
    validate: function () {
        var valid = true;
        this.errorList = [];

        this.components.forEach(function (component) {
            if (!this[component.props.id].validate()) {
                this.errorList = this.errorList.concat(this[component.props.id].errorList)
                valid = false;
            }
        }.bind(this));

        return valid;
    },

    clear: function () {
        this.components.forEach(function (component) {
            try {
                if (typeof this[component.props.id].getValue() == "string")
                    this[component.props.id].setValue("");
                else this[component.props.id].setValue([]);
            } catch (error) {
                
            }   
        }.bind(this));
    },

    enable: function () {
        this.enabled = true;
        this.components.forEach(function (component) {
            this[component.props.id].enable();
        }.bind(this));

        return this;
    },

    serialize: function (encode = false) {
        var value = {};
        this.components.forEach(function (component) {
            value[component.props.id] = this[component.props.id].getValue();
        }.bind(this));

        if (encode) {
            return btoa(JSON.stringify(value));   
        }

        return JSON.stringify(value);
    },

    disable: function () {
        this.enabled = false;
        this.components.forEach(function (component) {
            this[component.props.id].disable();
        }.bind(this));

        return this;
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
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='col-sm-12'>" +
                    "<form name='view_form' id='" + this.domID + "-form' method='POST' action='"+this.action+"' class='view_form'>" +
                        "<div class='col-sm-12' style='padding: 10px'>" +
                            this.renderFormHeader(this.viewMode) + 
                            "<div>" +
                                "<div class='row' rv-id='model.componentContainerID'>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</form>" +
                "</div>";
            
    },
    formData: null,
    addFileUploadField: function(name, blob){
        if(!this.formData){
            this.formData = new FormData(this.$form[0]);
        }
        this.formData.append(name, blob);
    },
    addHiddenField: function(name, value){
        if(!this.formData){
            this.formData = new FormData(this.$form[0]);
        }
        this.formData.append(name, value);
    },
    getFormData: function(){
        if(!this.formData){
            this.formData = new FormData(this.$form[0]);
        }
        return this.formData;
    },
    resetFormData: function(){
        this.formData = undefined;
    },
    post: function(dataType){
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
};
FormInit = extend(true, true, Parent, FormInit);
var Form = KxGenerator.createComponent(FormInit);
//component prototype
Form.type = 'form';

//register dom element for this component
KxGenerator.registerDOMElement(Form, 'kx-form');