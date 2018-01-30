/**
 * This is a ComboBox/Dropdown Element
 * 
 * Kreatx 2018
 */

//component definition
var CheckboxGroup= KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,
            checkedOptions: this.value,
            optionsData: this.dataProvider
            
        }
    },

   

    beforeAttach: function () {

    },

    registerEvents: function () {
        var _self = this;
        var model = this.getModel();
        
    },

    afterAttach: function () {
      
      
    },

    setValue: function (value) {
        var model = this.getModel();
        model.checked = value;
        this.$el.trigger('change');
        this.$el.find('#' + this.fieldName).bootstrapToggle('destroy');
        this.$el.find('#' + this.fieldName).bootstrapToggle();
        return this;
    },

    getValue: function () {
        return this.value;
    },

    destruct: function () {
        this.$el.remove();
    },

    template: function () {
      var html =  
              "<div class='form-group col-lg-"+ this.colspan +" "+ this.rowspan +" resizable' id='"+this.fieldName+"_container'>"+
              "<div id='" + this.fieldName + "-block'>"+
			  "<label rv-for='fieldName'>{label}<span rv-if='required'>*</span></label>"+
              "<span rv-if='blockProcessAttr' class='block-process'> * </span>";
            for(var i= 0;i<this.dataProvider.length;i++)
            {
                html+="<div class='checkbox-group'>"+
                "<label><input type='checkbox'  name='" + this.dataProvider[i][fieldName] + "[]' id='"+this.id+"' value='"+item.id+"'>"+item.checkedOptions+"</label>"+
            "</div>";
            }
			html+="</div>"+
            "</div>";

       return html;      
      
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
CheckboxGroup.type = 'checkboxgroup';
//register dom element for this component
KxGenerator.registerDOMElement(CheckboxGroup, 'kx-checkboxgroup');

