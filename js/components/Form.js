/**
 * This is a Form component
 * 
 * Kreatx 2018
 */

//component definition
var Form = KxGenerator.createComponent({

    formDOMId: 'view_form_26',

    formAction: (this.viewMode == "steps") ? "?forms/modify_form_submit" : "#",

    componentContainerID: 'view_form_26_component_container',

    validate: function () {
        var _self = this;
        var valid = true;
        this.errorList = [];

        this.components.forEach(function (component) {
            if (!component.validate()) {
                _self.errorList = _self.errorList.concat(component.errorList)
                valid = false;
            }
        });

        return valid;
    },

    addComponent: function (component, container, cIndex) {
        container.append(component.render());
        
        //expose component model
        this[component.id] = component;

        component.parent = this;
        component.parentType = 'form';
        component.parentForm = this;
    },

    enable: function () {
        this.components.forEach(function (component) {
            component.enable();
        });

        return this;
    },

    disable: function () {
        this.components.forEach(function (component) {
            component.disable();
        });

        return this;
    },

    renderFormHeader: function (viewMode) {
        return (
            viewMode == 'steps' ? 
                "<div class='row'>" +
                    "<div class='col-lg-12'>" +
                        "<div class='col-lg-10'>" +
                            "<center>" +
                                "<h4 style='color: #7f0000'>" +
                                    "{formName}" +                                        
                                "</h4>" +
                            "</center>" +
                        "</div>" +
                        "<div class='col-lg-2 btn-group' style='margin-bottom: -15px;'>" +
                        "</div>" +
                    "</div>" +          
                "</div><hr>" :
                
                "<div class='row'>" +
                    "<div class='col-lg-12' style='background-color: #ccc; font-size: 16px; text-align:center;'>" +
                        "<div class='col-lg-10'>" +
                            "<center>" +
                                "<label style='margin-top:5px;'>" +
                                    "{formName}" +
                                "</label>" +
                            "</center>" +
                        "</div>" +
                        "<div class='col-lg-2 btn-group' style='margin-bottom: -15px;'>" +
                        "</div>" +
                    "</div>" +
                "</div>"
        )    
    },

    template: function () {
        return "<div id='" + this.id + "-wrapper'>" +
                    "<form name='view_form' rv-id='formDOMId' method='POST' rv-action='formAction' class='view_form'>" +
                        "<div class='col-lg-12' style='padding: 10px'>" +
                            this.renderFormHeader(this.viewMode) + 
                            "<div class='row'>" +
                                "<div class='col-lg-12' rv-id='componentContainerID'>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</form>" +
                "</div>";
            
    },

    render: function () {
        var _self = this;
        var container = this.$el.find('#' + this.componentContainerID);
        var ccComponents = [];
        this.components.forEach(function (component, cIndex) {
            ccComponents.push(component.id);
            component.on('creationComplete', function(e){
                var ax = -1;
                while ((ax = ccComponents.indexOf(_self.id)) !== -1) 
                {
                    ccComponents.splice(ax, 1);
                }
                console.log("creationComplete ne FORM per "+ component.id);
                e.stopImmediatePropagation();
                e.stopPropagation();
                if(ccComponents.length==0 && cIndex == _self.components.length-1)
                {
                    console.log("creationComplete per FORM");
                    _self.trigger('creationComplete');
                }
            });
            _self.addComponent(component, container, cIndex)
        })
        
        return this.$el;
    }
});

//component prototype
Form.type = 'form';

//register dom element for this component
KxGenerator.registerDOMElement(Form, 'kx-form');