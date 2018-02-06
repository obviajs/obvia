/**
 * This is a Horizontal Seperator component
 * 
 * Kreatx 2018
 */

//component definition
var HorizontalSeperator = KxGenerator.createComponent({
    template: function () {
        return  "<div>" +
                    "<hr>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
HorizontalSeperator.type = 'horizontal_seperator';

//register dom element for this component
KxGenerator.registerDOMElement(HorizontalSeperator, 'kx-hseperator');