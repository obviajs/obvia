/**
 * This is a ComboBox/Dropdown Element
 * 
 * Kreatx 2018
 */

//component definition
var ComboBox = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.blockProcessAttr,
            versionStyle: ''
        }
    },

    beforeAttach: function () {
        
    },

    afterAttach: function () {
        var _self = this;
        $('#' + this.fieldName).change(function (e) {
            var thisVal = $('#' + _self.fieldName).val();
            _self.value = thisVal;

            if (thisVal[0] == '#' + this.fieldName + '_new') {
                $('#' + _self.fieldName + ' _popup').fadeIn();
                $('#' + _self.fieldName).multiselect('deselect', '#' + _self.fieldName + ' _new');
            }
        });
        
        getData(this.retrieveAction, '#' + this.fieldName, this.value);
    },

    setValue: function (value) {
        $('#' + this.fieldName).multiselect('select', value);

        return this;
    },

    getValue: function () {
        return $('#' + this.fieldName).val();
    },

    template: function () {
        return  "<div id='" + this.id + "'>" +
                    "<div class='col-lg-"+ this.colspan +"' form-group rowspan"+ this.rowspan +" resizable' id='"+ this.fieldName +"_container'>" +
                        "<div id='" + this.fieldName + "-block'>" +
                        "<label rv-style='versionStyle' rv-for='fieldName'>{label} {required}</label>" +
                        "<span class='block-process'> {blockProcessAttr} </span>" +
                        "<select class='form-control' name='" + this.fieldName + "[]' control-blocked='controlBlocked' style='min-width: 250px;' id='" + this.fieldName + "'></select>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
ComboBox.type = 'combobox';
