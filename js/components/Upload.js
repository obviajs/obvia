/**
 * This is an Upload component
 * 
 * Kreatx 2018
 */

//component definition
var Upload = KxGenerator.createComponent({
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
        return "";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Upload.type = 'upload';