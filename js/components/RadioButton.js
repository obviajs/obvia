/**
 * This is a Radio Button Element
 * 
 * Kreatx 2018
 */

//component definition
var RadioButton = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            enabled: true,
            checked: false,
        }
    },
    
    beforeAttach: function () {
        this.$input = this.$el.find("input");
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$input, events: { 
                    'click': this.clickHandler.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    enable: function () {
        var model = this.getModel();
        model.enabled = true;

        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;

        return this;
    },

    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },

    template: function () {         
        return "<div id='" + this.domID + "-wrapper'>" +
                    "<label>" +    
                        "<input type='radio' rv-value='value' rv-enabled='model.enabled' rv-checked='model.checked'> {label}" +
                    "</label>"+
                "</div>";    
    },
    
    render: function () {
        return this.$el;
    }
    
});

//component prototype
RadioButton.type = 'radio';

//register dom element for this component
KxGenerator.registerDOMElement(RadioButton, 'kx-radio');