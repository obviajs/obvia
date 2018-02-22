/**
 * This is a Label Element
 * 
 * Kreatx 2018
 */

//component definition
var Label = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            class: "form-group col-lg-12 resizable",
            style: 'margin-top: 15px; background-color: #CAC8C8; font-size: 16px;'
        }
    },

    beforeAttach: function () {
        this.$label = this.$el.find("label"); 
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    getValue: function () {
        return null;
    },

    setValue: function (value) {
        return null
    },

    template: function () {         
        return  "<div id='" + this.domID + "-wrapper' rv-class='model.class' rv-style='model.style'>"+
                    "<label>{label}</label>"+
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