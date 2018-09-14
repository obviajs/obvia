/**
 * This is a Text Field Input Element
 * 
 * Kreatx 2018
 */

//component definition
var TextField = KxGenerator.createComponent({

    value:"",
    //inner component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr
        }
    },

    beforeAttach: function () {
        this.$input = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                }
            },
            {
                registerTo: this.$input, events: {
                    'change': this.changeHandler.bind(this),
                }
            }
        ]
    },

    enable: function () {
        this.enabled = true;
        return this;
    },

    disable: function () {
        this.enabled = false;
        return this;
    },

    attached: false,

    afterAttach: function (e) {
        if (e.target.id == this.$el.attr('id') && !this.attached) {
            //init input mask
            if (this.hasOwnProperty('mask')) {
                var mask;
                try {
                    mask = JSON.parse(this.mask);
                } catch (error) {
                    mask = this.mask;
                }
                console.log("===================================");
                console.log(mask);
                console.log("===================================");
                this.$input.inputmask(mask);
            }

            if (typeof this.onafterAttach == 'function')
                this.onafterAttach.apply(this, arguments);;

            this.attached = true;
            this.trigger('creationComplete');
        }
    },

    changeHandler: function () {
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
        this.validate();
    },

    validate: function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];

                this.$input.addClass('invalid');

                return false;
            } else {
                this.errorList = [];
                this.$input.removeClass('invalid');
                return true;
            }     
        } else
            return true;
    },
    
    setValue: function (value) {
        if (this.value != value) {
            if (typeof value == "object") {
                value = JSON.stringify(value);
            }
            this.value = value;
        }

        this.trigger('change');

        return this;
    },

    set mask(v){
        if(this._src != v){
            if(this.$el){
                this.$el.attr('mask', v);
            }
            this._mask= v;
        }
    },
    get mask(){
        return this._mask;
    },

    focus:function(){
        if(this.$input != null)
        {
            this.$input.focus();
        }
    },
    template: function () {
        var html = 
            "<input rv-type='type' " +
            "id='" + this.domID + "' name='" + this.domID + "' rv-value='value' " +
            "class='form-control rowspan" + this.rowspan + "' " +
            "rv-placeholder='label' rv-enabled='enabled' autofocus/>";
        return html;
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
TextField.type = 'textfield';

//register dom element for this component
KxGenerator.registerDOMElement(TextField, 'kx-text-field');




