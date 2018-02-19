/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var Button = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            
        }
    },
    
    registerEvents: function () {
        this.$btn = this.$el.find("button");

        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$btn, events: { 
                    'click': this.clickHandler.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },

    template: function () {         
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<button rv-type='type'  rv-style='style' rv-class='class'>{value}</button>"
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