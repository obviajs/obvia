/**
 * This is a ComboBox/Dropdown Element
 * 
 * Kreatx 2018
 */

//component definition
var CheckboxGroup = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,
            optionsData: this.dataProvider,
            labelField: this.labelField,
            valueField: this.valueField,
            checkedField: this.checkedField       
         };
    },

   

    beforeAttach: function () {

    },

    registerEvents: function () {
        var _self = this;
       
        var model = this.getModel();
        //console.log("fkdk");
        this.$el.on('change', function (e) {
            _self.value = model.checked;
        });
    },

    afterAttach: function () {
      
      
    },

    setValue: function (value) {
        var model = this.getModel();

      for(var i=0;i<model.optionsData.length;i++){
            if(value.contains(model.optionsData[i][this.valueField]))
            {
               model.optionsData[i][this.checkedField]= true;
            }
            else{
                model.optionsData[i][this.checkedField] = false;
            }
        }
       
        this.$el.trigger('change');
        return value;
    },

    getValue: function () {
        var model = this.getModel();
        var results = [];
        for(var i=0;i<model.optionsData.length;i++){
            results.push(model.optionsData[i][this.checkedField]);

    }
     //console.log(results);
     return results;
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
                var cid = this.fieldName+"_"+i;
                html+="<div class='checkbox-group'>"+
                "<label><input type='checkbox' rv-checked='optionsData." + i + "." + this.checkedField + "' name='" + this.fieldName + "[]' id='"+cid+"'>{optionsData." + i + "." + this.labelField + "}</label>"+
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

