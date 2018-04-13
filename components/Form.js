/**
 * This is a Form component
 * 
 * Kreatx 2018
 */

//component definition
var Form = KxGenerator.createComponent({
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
    },

    addComponent: function (component, container, cIndex) {
        if (typeof component.constructor == "string") {
            component.constructor = eval(component.constructor);
        }
        var cmp = new component.constructor(component.props);
     
        cmp.on('creationComplete', function (e) {
            e.stopImmediatePropagation();
            e.stopPropagation();

            this.ccComponents.push(component.props.id);
          
            if (this.ccComponents.length == this.components.length) {
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
                    "<form name='view_form' method='POST' rv-action='model.formAction' class='view_form'>" +
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