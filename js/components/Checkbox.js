/**
 * This is a ComboBox/Dropdown Element
 * 
 * Kreatx 2018
 */

//component definition
var Checkbox = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,
            checked: this.value
            
        }
    },

    getData: function (provider) {
       
    },

    setData: function (data, element) {
      
    },

    beforeAttach: function () {

    },

    registerEvents: function () {
        var _self = this;

        this.$el.on('change', function (e) {
           
            var thisVal = $('#' + _self.fieldName).val();
            console.log(_self.value);
            _self.value = thisVal;
            //console.log(thisVal);

            // if(thisVal.checked == true){
            //     console.log("Hello");
            // }
            // _self.value = thisVal;

            // if (thisVal[0] == '#' + this.fieldName + '_new') {
            //     $('#' + _self.fieldName + ' _popup').fadeIn();
            //     $('#' + _self.fieldName).multiselect('deselect', '#' + _self.fieldName + ' _new');
            // }
        });
    },

    afterAttach: function () {
        var _self = this;
        
        var element = "#" + _self.fieldName;
      
    },

    setValue: function (value) {
        
        $('#' + this.fieldName).val();
        this.$el.trigger('checked');
        //console.log(this.$el.trigger('checked'));
    },

    getValue: function () {
        return this.value;
    },

    destruct: function () {
        this.$el.remove();
    },

    template: function () {

            return "<div id='" + this.id + "'>" +
            "<div id='checkbox_" + this.fieldName + "' class='form-group col-lg-"+ this.colspan +" rowspan"+ this.rowspan +" resizable'>" +
            "<div  id='" + this.fieldName + "-block'>" +
            "<label rv-style='versionStyle' rv-for='fieldName'>{label}<span rv-if='required'>*</span></label>" +
            "<div class='row'>" +
            "<div class='col-xs-12'>" +
            " <div class='col-xs-2'>" +
            "<input  type='checkbox' rv-checked='checked' switch-toggle='toggle' data-on='"+this.checkedLabel+"' data-off='"+this.unCheckedLabel+"'+ data-style='slow'  id='" +this.fieldName+" class='checkbox'  name='" + this.fieldName + "'/>"+
            "</div>" +
            "<div class='col-xs-10' style='padding-left:20px;'>" +
            "<div style='padding-top: 5px;'>" +
            "<div>"+
    		"<span rv-if='blockProcessAttr' class='block-process'> * </span>" +
    		"</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
   
      
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Checkbox.type = 'checkbox';
