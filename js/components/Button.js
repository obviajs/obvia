/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var Button = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            type:this.type,
            value: this.value,
            class:this.class,
            style:this.style,
            onclick:this.onclick.bind(this)
        }
    },

    registerEvents: function () {

    },

    beforeAttach: function () { //function that is executed before you render the  component in the DOM
        //life0-cycle method //futet ne DOM qe te besh inicimet e plugineve
        
    },
    onclick: function(){
        // action goes here
    },
    afterAttach: function () {

    },

    getValue: function () {
    },

    setValue: function (value) {
    },

    template: function () {         
        return  "<div id='" + this.id + "' rv-style='style'>" +
                "<button rv-type='type' rv-class='class' rv-on-click='onclick' >{value}</button>"
                "</div>";    
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Button.type = 'button';

//register dom element for this component
KxGenerator.registerDOMElement(Button, 'kx-button');