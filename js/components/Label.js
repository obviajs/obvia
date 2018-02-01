/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var Label = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            label: this.label,
            class:this.class,
            style:this.style
        }
    },

    beforeAttach: function () { //function that is executed before you render the  component in the DOM
        //life0-cycle method //futet ne DOM qe te besh inicimet e plugineve
        
    },

    afterAttach: function () {

    },

    getValue: function () {

    },

    setValue: function (value) {

    },

    template: function () {         
        return  "<div id="+this.id+" rv-class='class' rv-style='style'>"+
                    "<label>{label} </label>"+
                "</div>";    
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Label.type = 'label';

//register dom element for this component
KxGenerator.registerDOMElement(Label, 'kx-label');