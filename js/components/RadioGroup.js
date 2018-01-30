/**
 * This is a ComboBox/Dropdown Element
 * 
 * Kreatx 2018
 */

//component definition
var RadioGroup = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,
            checked: this.value,
            optionsData: this.dataProvider
            
        }
    },

   

    beforeAttach: function () {

    },

    registerEvents: function () {
          var _self = this;
        var model = this.getModel();

        this.$el.on('change', function (e) {
            _self.value = model.checked;
        });
    },

    afterAttach: function () {
        var _self = this;
        var element = "#" + _self.fieldName;
      
    },

    setValue: function (value) {
        // var model = this.getModel();
        // model.checked = value;
        // this.$el.trigger('change');
        // this.$el.find('#' + this.fieldName).bootstrapToggle('destroy');
        // this.$el.find('#' + this.fieldName).bootstrapToggle();
        // return this;
    },

    getValue: function () {
        return this.value;
    },

    destruct: function () {
        this.$el.remove();
    },

    template: function () {
        // if(isNullOrEmpty("+ this.colspan +") || ("+ this.colspan +" == 0))
        // "+ this.colspan +" = 2;
        		
        return 
			"<div class='form-group col-lg-"+ this.colspan +" rowspan"+ this.rowspan +" resizable' id='" + this.fieldName + "_container'>"+
            "<div id=id='" + this.fieldName + "-block'>"+
            "<label rv-style='versionStyle' rv-for='fieldName'>{label}<span rv-if='required'>*</span></label>" +
			this.dataProvider.forEach(function(item){
                "<div class='radiogroup'>"+
                "<label><input type='radiogroup'  name='" + this.fieldName + "' id='"+this.id+"' value='"+item.id+"'>"+item.value+"</label>"+
            "</div>";
              });
			html+="</div>"+
            "</div>";

   
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
RadioGroup.type = 'radiogroup';
//register dom element for this component
KxGenerator.registerDOMElement(RadioGroup, 'kx-radiogroup');

