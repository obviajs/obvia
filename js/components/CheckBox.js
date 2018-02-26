/**
 * This is a CheckBox Element
 * 
 * Kreatx 2018
 */

//component definition
var CheckBox = KxGenerator.createComponent({
    enabled: true,
    blockProcessAttr: this.required ? false : this.blockProcessAttr,
   //inner component data
   initModel: function () {
        return {
            
        }
    }, 
    beforeAttach: function () {
        this.enabled = (this.enabled!=undefined && this.enabled!=null?this.enabled:true);
    },
    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$chkb, events: { 
                    'change': this.changeHandler.bind(this),
                    'click': this.clickHandler.bind(this)
                }
            }
        ]
    },
 
    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    changeHandler: function () {
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    },

    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);       
    },
    enable: function () {
        enabled = true;
        return this;
    },

    disable: function () {
        enabled = false;
        return this;
    },
    setValue: function (value) {
        if (this.value != value) {
            this.value = value;
        }
        return this;
    },
    template: function () {      
        return  "<div id='" + this.domID + "-wrapper' class='checkbox'>" +
        (!this.embedded?("<span rv-if='blockProcessAttr' class='block-process'> * </span>") : "") + 
                    "<label><input id='" + this.domID + "' name='" + this.domID + "' rv-value='value' " +                    
                    "rv-enabled='enabled' rv-checked='checked' type='checkbox' rv-value='value'>{label}</label>" +
                "</div>"; 
    },
    
    render: function () {
        this.$chkb = this.$el.find("input");
        return this.$el;
    }
    
});

//component prototype
CheckBox.type = 'checkbox';

//register dom element for this component
KxGenerator.registerDOMElement(Button, 'kx-checkbox');