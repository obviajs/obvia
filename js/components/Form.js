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

    beforeAttach: function () {
        this.ccComponents = [];
        this.$container = this.$el.find('#' + this.componentContainerID);
    },

    addComponent: function (component, container, cIndex) {
        var cmp = new component.constructor(component.props);
     
        cmp.on('creationComplete', function (e) {
            e.stopImmediatePropagation();
            e.stopPropagation();

            this.ccComponents.push(component.props.id);
          
            if (this.ccComponents.length == this.components.length) {
                console.log('creationComplete for ', this.id);
                this.trigger('creationComplete');
            }

        }.bind(this));

        container.append(cmp.render());
        
        //expose component model
        this[cmp.id] = cmp;

        cmp.parent = this;
        cmp.parentType = 'form';
        cmp.parentForm = this;
    },

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

    enable: function () {
        this.components.forEach(function (component) {
            this[component.props.id].enable();
        }.bind(this));

        return this;
    },

    disable: function () {
        this.components.forEach(function (component) {
            this[component.props.id].disable();
        }.bind(this));

        return this;
    },

    renderFormHeader: function (viewMode) {
        return (
            viewMode == 'steps' ? 
                "<div class='row'>" +
                    "<div class='col-lg-12'>" +
                        "<div class='col-lg-10'>" +
                            "<center>" +
                                "<h4>" +
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
        return "<div id='" + this.domID + "-wrapper'>" +
                    "<form name='view_form' rv-id='formDOMId' method='POST' rv-action='formAction' class='view_form'>" +
                        "<div class='col-md-12' style='padding: 10px'>" +
                            this.renderFormHeader(this.viewMode) + 
                            "<div>" +
                                "<div class='row col-md-12' rv-id='componentContainerID'>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</form>" +
                "</div>";
            
    },

    render: function () {
        this.components.forEach(function (component, cIndex) {
            this.addComponent(component, this.$container, cIndex);
        }.bind(this));
        
        return this.$el;
    }
});

//component prototype
Form.type = 'form';

//register dom element for this component
KxGenerator.registerDOMElement(Form, 'kx-form');