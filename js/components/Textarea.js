/**
 * This is a Textarea element
 * 
 * Kreatx 2018
 */

//component definition
var Textarea = KxGenerator.createComponent({
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

        this.$el.find('#' + this.fieldName).on('change', function (e) {
            _self.value = model.value;
        });
    },

    beforeAttach: function () {

    },

    afterAttach: function () {
        if(this.hasOwnProperty('defaultDictionary')){
            _self = this;
            $('#' + this.fieldName + '-spellCHeck').remove();
            $('#' + this.fieldName).after(
                $('<button>')
                    .text('Spell Check')
                    .attr('id', '' + this.fieldName + '-spellCHeck')
                    .addClass('btn btn-xs btn-default pull-right')
                    .on('click', function(e){
                        $('#' + _self.fieldName).spellCheckInDialog({defaultDictionary: '' + _self.defaultDictionary});
                        e.preventDefault();
                    })
            ); 
        }
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

        return "<div id='" + this.id + "'>" +
                "<div class='form-group col-lg-" + this.colspan + "' rowspan" + this.rowspan + " resizable '>" +
                    "<div id='" + this.fieldName + "-block'> " +
                        "<label rv-style='versionStyle' rv-for='fieldName'>{label}<span rv-if='required'>*</span></label>" +
                            "<span rv-if='blockProcessAttr' class='block-process'> * </span>" +
                                "<textarea rv-type='type' rv-value='value' " +
                                "name='" + this.fieldName + "' id='" + this.fieldName + "' class='form-control rowspan"+ this.rowspan +
                                "' rv-placeholder='label' rv-enabled='enabled' autofocus></textarea>" +
                    "</div>" +
                "</div>"+
            "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Textarea.type = 'textarea';

//register dom element for this component
KxGenerator.registerDOMElement(Textarea, 'kx-textarea');