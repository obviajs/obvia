/**
 * This is a Color Element
 * 
 * Kreatx 2018
 */

//component definition
var Color = KxGenerator.createComponent({

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

    // valueSetter:function(r,a){
    //     for(var i=0;i<formProps.provider.mask.length;i++)
    //     if(formProps.provider.mask[i].input_mask_name==r)
    //     return this.maskId=formProps.provider.mask[i].input_mask_id,void this.$input.inputmask(JSON.parse(formProps.provider.mask[i].dataField));
    //     this.maskId=0,this.$input.inputmask({alias:"",prefix:""})
    // },
    valueSetter: function (mask,value) {
        if (this.value != value) {
            if (typeof value == "object") {
                value = JSON.stringify(value);
            }
            this.value = value;
        }

        this.trigger('change');

        return this;
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
    focus:function(){
        if(this.$input != null)
        {
            this.$input.focus();
        }
    },
    template: function () {
    var html = '<input type="color" id="' + this.domID + '" style = "width:20px;height:20px">'; 
        return html;
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Color.type = 'color';

//register dom element for this component
KxGenerator.registerDOMElement(Color, 'kx-color');




