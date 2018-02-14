/**
 * This is a Template for a default component
 * 
 * Kreatx 2018
 */

//component definition
var Template = KxGenerator.createComponent({
    //model variables are private and they bind to the template
    initModel: function () {
        return {
            
        }
    },

    beforeAttach: function () {

    },

    afterAttach: function () {
        
    },

    getValue: function () {
       
    },

    setValue: function (value) {
        
    },

    template: function () {
        return  "<div>" +
            
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Template.type = 'template';

//register dom element for this component
KxGenerator.registerDOMElement(Template, 'kx-template');