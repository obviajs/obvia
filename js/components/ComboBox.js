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
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required 
        }
    },

    getData: function (provider) {
        if (typeof url == "string") {
            //ajax call
            return $.get(provider);
        } else {
            //json 
            return provider;
        }  
    },

    setData: function (data, element) {
        $(element).children().remove();
        $(element).closest('.multiselect-container').children().remove();
        $(element).append(
            $("<option></option>")
                .val("0")
                .text("Zgjidh")
        );
        $(element).append(
            $("<option></option>").attr("data-role", "divider")
        );

        for (var i = 0; i < data.length; i++)
            $(element).append(
                $("<option></option>").val(data[i].value).text(data[i].text).attr("title", data[i].text)
            );
    },

    beforeAttach: function () {

    },

    registerEvents: function () {
        var _self = this;

        this.$el.on('change', function (e) {
            var thisVal = $('#' + _self.fieldName).val();
            _self.value = thisVal;

            if (thisVal[0] == '#' + this.fieldName + '_new') {
                $('#' + _self.fieldName + ' _popup').fadeIn();
                $('#' + _self.fieldName).multiselect('deselect', '#' + _self.fieldName + ' _new');
            }
        });
    },

    afterAttach: function () {
        var _self = this;
        
        var element = "#" + _self.fieldName;
        KxRequest.promise(this.getData(this.dataProvider)).done(function (result) {
            if (typeof result == "string")
                result = JSON.parse(result);
            
            _self.setData(result, element);

            $(element).multiselect({
                enableFiltering: true,
                maxHeight: 250,
                minWidth: 350,
                templates: {
                    divider: "<div class=\"divider\" data-role=\"divider\"></div>"
                }
            });
            if (_self.value.length > 0) {
                $(element).multiselect('select', _self.value);
            }
        });
    },

    setValue: function (value) {
        $('#' + this.fieldName).multiselect('select', value);
        this.$el.trigger('change');

        return this;
    },

    getValue: function () {
        return this.value;
    },

    destruct: function () {
        this.$el.remove();
    },

    template: function () {
        return  "<div id='" + this.id + "'>" +
                    "<div class='col-lg-"+ this.colspan +"' form-group rowspan"+ this.rowspan +" resizable' id='"+ this.fieldName +"_container'>" +
                        "<div id='" + this.fieldName + "-block'>" +
                        "<label rv-style='versionStyle' rv-for='fieldName'>{label} <span rv-if='required'>*</span></label>" +
                        "<span rv-if='blockProcessAttr' class='block-process'> * </span>" +
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
