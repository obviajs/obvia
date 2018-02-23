/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var TextInput = KxGenerator.createComponent({

    //inner component data
    initModel: function () {
        return {
            enabled: true,
            blockProcessAttr: this.required ? false : this.blockProcessAttr
        }
    },

    beforeAttach: function () {
        this.$input = this.$el.find("#" + this.domID);
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
        var model = this.getModel();
        model.enabled = true;

        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;

        return this;
    },

    afterAttach: function (e) {
        //init input mask
        if (this.hasOwnProperty('mask')) {
                this.$input.inputmask(this.mask);
        }

        if (typeof this.onafterAttach == 'function')
            this.onafterAttach.apply(this, arguments);;

        this.trigger('creationComplete');
    },

    changeHandler: function () {
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    },

    validate: function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                return false;
            } else
                return true;    
        } else
            return true;    
    },
//The autofocus attribute is a boolean attribute. When present, it specifies that an <input> element should automatically get focus when the page loads.
    template: function () {         
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<div class='form-group col-lg-" + this.colspan + "' rowspan" + this.rowspan + " resizable '>" +
                        "<div id='" + this.domID + "-block'>" + 
                            "<label rv-style='versionStyle' rv-for='domID'>{label} <span rv-if='required'>*</span></label>" + 
                            "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" + 
                                "<input rv-type='type'" + 
                                    "id='" + this.domID + "' name='" + this.domID + "' rv-value='value'" +
                                    "class='form-control rowspan"+ this.rowspan +"'" +
                                    "rv-placeholder='label' rv-enabled='model.enabled' autofocus/>" +
                        "</div>" +
                    "</div>" + 
                "</div>";    
    },
 
    render: function () {
        return this.$el;
    }
});

//component prototype
TextInput.type = 'text';

//register dom element for this component
KxGenerator.registerDOMElement(TextInput, 'kx-text');