/**
 * This is a CheckBox Element
 * 
 * Kreatx 2018
 */

//component definition
var CheckBox = KxGenerator.createComponent({
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
		//this.$input.prop('checked', this.checked);
		//this.$input.val(this.value);
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
		if(this.$input!=undefined)
			this.$input.val(v);
    },
    get value(){
        return this._value;
    },
    set checked(v){
        if(v)
        {
            this._checked = true;
        }else
			this._checked = false;
		if(this.$input!=undefined)
			this.$input.prop('checked', v)
    },
	get checked(){
        return this._checked;
    },
   
    template: function () {      
        return  "<div id='" + this.domID + "-wrapper' class='checkbox'>" +
        (!this.embedded?("<span rv-if='blockProcessAttr' class='block-process'> * </span>") : "") + 
                    "<label><input id='" + this.domID + "' name='" + this.domID + "' rv-value='value' " +                    
                    "rv-enabled='enabled' rv-checked='checked' type='checkbox' rv-value='value'>{label}</label>" +
                "</div>"; 
    },
    template: function () {      
        return  "<div id='" + this.domID + "-wrapper' class='checkbox'>" +
        (!this.embedded?("<span rv-if='blockProcessAttr' class='block-process'> * </span>") : "") + 
                    "<label><input id='" + this.domID + "' name='" + this.domID + "'  value='"+this.value+"'" +                    
                    "rv-enabled='enabled' "+(this.checked?"checked='checked'":'')+" type='checkbox'>{label}</label>" +
                "</div>"; 
    },
    render: function () {
        return this.$el;
    }
    
});

//component prototype
CheckBox.type = 'checkbox';

//register dom element for this component
KxGenerator.registerDOMElement(CheckBox, 'kx-checkbox');