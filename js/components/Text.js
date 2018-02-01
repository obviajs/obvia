/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var Text = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName, 
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,
            value: this.value,
            enabled: true
        }
    },

    registerEvents: function () {
        var _self = this;
        var model = this.getModel();

        this.$el.on('change', function () {
            _self.value = model.value;
        });
    },

    //function that is executed before you render the  component in the DOM
    beforeAttach: function () { 
        
    },

    afterAttach: function () {
        if(this.hasOwnProperty('mask'))
            $('#' + this.fieldName).inputmask(this.mask); 
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        this.setModelValue('value', value);
        this.$el.trigger('change');

        return this;
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
        var model = this.getModel();
        if (model.required) {
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
        return  "<div id='" + this.id + "'>" +
                    "<div class='form-group col-lg-" + this.colspan + "' rowspan" + this.rowspan + " resizable '>" +
                        "<div id='" + this.fieldName + "-block'>" + 
                            "<label rv-style='versionStyle' rv-for='fieldName'>{label} <span rv-if='required'>*</span></label>" + 
                            "<span rv-if='blockProcessAttr' class='block-process'> * </span>" + 
                                "<input rv-type='type'" + 
                                    "id='" + this.fieldName + "' name='" + this.fieldName + "' rv-value='value'" +
                                    "class='form-control rowspan"+ this.rowspan +"'" +
                                    "rv-placeholder='label' rv-enabled='enabled' autofocus/>" +
                        "</div>" +
                    "</div>" + 
                "</div>";    
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Text.type = 'text';

//register dom element for this component
KxGenerator.registerDOMElement(Text, 'kx-text');