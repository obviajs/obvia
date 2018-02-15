/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var TextInput = KxGenerator.createComponent({

    initModel: function () {
        return {
            enabled: true,
            blockProcessAttr: this.required ? false : this.blockProcessAttr
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
                        this.trigger('creationComplete');
                        if (typeof this.onafterAttach == 'function')
                        this.onafterAttach(e, this.repeaterIndex, this, this.parent);
                        //this.onafterAttach.apply(this, arguments);
                    }  
                }
            },
            {
                registerTo: this.$input,
                events:
                { 
                    'click': function (e) {
                        console.log("click per input e brendshem $input");
                    } 
                }
            },
            {
                registerTo: this.$input,
                events:
                { 
                    'change': function (e) {
                        console.log("change per input e brendshem $input");
                        if (typeof this.onchange == 'function')
                        this.onchange(e, this.repeaterIndex, this, this.parent);
                        //this.onchange.apply(this, arguments);
                    } 
                }
            }
        ]
    },

    afterAttach: function () {
        if(this.hasOwnProperty('mask'))
            $('#' + this.fieldName).inputmask(this.mask); 
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

    template: function () {         
        return  "<div id='" + this.id + "-wrapper'>" +
                    "<div class='form-group col-lg-" + this.colspan + "' rowspan" + this.rowspan + " resizable '>" +
                        "<div id='" + this.id + "-block'>" + 
                            "<label rv-style='versionStyle' rv-for='id'>{label} <span rv-if='required'>*</span></label>" + 
                            "<span rv-if='blockProcessAttr' class='block-process'> * </span>" + 
                                "<input rv-type='type'" + 
                                    "id='" + this.id + "' name='" + this.id + "' rv-value='value'" +
                                    "class='form-control rowspan"+ this.rowspan +"'" +
                                    "rv-placeholder='label' rv-enabled='model.enabled' autofocus/>" +
                        "</div>" +
                    "</div>" + 
                "</div>";    
    },
    afterAttach: function(){
        this.$input = this.$el.find("#"+this.id);
    },
    render: function () {
        return this.$el;
    }
});

//component prototype
TextInput.type = 'text';

//register dom element for this component
KxGenerator.registerDOMElement(TextInput, 'kx-text');