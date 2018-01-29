/**
 * This is a Trippleswitch component
 * 
 * Kreatx 2018
 */

//component definition
var Trippleswitch = KxGenerator.createComponent({
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
        return
        "<div id='" + this.id + "'>" +

            "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Trippleswitch.type = 'trippleswitch';

//register dom element for this component
KxGenerator.registerDOMElement(Trippleswitch, 'kx-trippleswitch');