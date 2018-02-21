/**
 * This is a Template for a default component
 * 
 * Kreatx 2018
 */

//component definition
var Template = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            
        }
    },

    beforeAttach: function () {

    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el,
                events:{
                    'afterAttach': function (e) {
                        this.trigger('creationComplete');
                    }
                }
            }
        ]
    },

    template: function () {
        return  "<div id='" + this.domID + "-wrapper'>" +
            
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