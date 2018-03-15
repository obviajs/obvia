/**
 * This is a Radio Button Element
 * 
 * Kreatx 2018
 */

//component definition
var RadioButton = KxGenerator.createComponent({
    enabled: true,
    blockProcessAttr: this.required ? false : this.blockProcessAttr,
    _checked: false,
    _value: null,
    //inner component data
    initModel: function () {
        return {
        }
    },
    
    beforeAttach: function () {
        this.$input = this.$el.find("input");
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
                registerTo: this.$input, events: { 
                    'change': this.changeHandler.bind(this),
                    'click': this.clickHandler.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    enable: function () {
        this.enabled = true;
        return this;
    },

    disable: function () {
        this.enabled = false;
        return this;
    },
    set value(v){
        if(this._value!=v)
        {
            this._value = v;
        }else{
            this.checked = true;
        }

    },
    get value(){
        return this._value;
    },
    set checked(v){
        if(v)
        {
            this._checked = this.value;
        }else
        this._checked = false;
    },
    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },
    changeHandler: function () {
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    },
    template: function () {         
        return "<div id='" + this.domID + "-wrapper'>" +
                    "<label>" +    
                        "<input id='" + this.domID + "' name='" + this.domID + "' type='radio' rv-value='_value' rv-enabled='enabled' rv-checked='_checked'> {label}" +
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