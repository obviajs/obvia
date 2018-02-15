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
            style: this.style
        }
    },
    
    registerEvents: function () {
         return [
            {
                registerTo: this.$el,
                events:
                { 
                    'click': function (e) {
                        console.log("click per elementin $el");
                    },
                    'afterAttach': function (e) {
                        console.log('afterAttach_BUTTON');
                        this.trigger('creationComplete');
                        if (typeof this.onchange == 'function')
                        this.onafterAttach(e, this.repeaterIndex, this, this.parent);
                        //this.onafterAttach.apply(this, arguments);
                    }  
                }
            },
            {
                registerTo: this.$btn,
                events:
                { 
                    'click': function (e) {
                        console.log("click per butonin e brendshem $btn");
                        //execute custom click
                        if (typeof this.onclick == 'function')
                        this.onclick(e, this.repeaterIndex, this, this.parent);
                    } 
                }
            }
        ]
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        this.value = value;
        this.$el.trigger('change');
    },

    template: function () {         
        return  "<div id='" + this.id + "-wrapper'>" +
                    "<button rv-type='type'  rv-style='style' rv-class='class'>{value}</button>"
                "</div>";    
    },
    afterAttach: function(){
        this.$btn = this.$el.find("button");
    },
    render: function () {
        return this.$el;
    }
    
});

//component prototype
Button.type = 'button';

//register dom element for this component
KxGenerator.registerDOMElement(Button, 'kx-button');