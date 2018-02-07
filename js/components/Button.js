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
            style: this.style,
            clickHandler: this.clickHandler.bind(this)
        }
    },

    registerEvents: function () {
        // return {
        //     'click': function () {
                
        //     }
        // }
    },

    clickHandler: function (e) {
        //execute custom click
        if (typeof this.onclick == 'function')
            this.onclick(e, this.repeaterIndex, this, this.parent);
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        this.value = value;
        this.$el.trigger('change');
    },

    template: function () {         
        return  "<div id='" + this.id + "'>" +
                    "<button rv-type='type'  rv-style='style' rv-class='class' rv-on-click='clickHandler'>{value}</button>"
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