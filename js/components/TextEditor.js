/**
 * This is a Text Editor element
 * 
 * Kreatx 2018
 */

//component definition
var Template = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            
        }
    },

    registerEvents: function () {
        var _self = this;

        this.$el.on('change', function (e) {
        
        });
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
        return  "<div id='" + this.id + "'>" +
            
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