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
            optionsData: this.dataProvider,
            labelField: this.labelField,
            valueField: this.valueField,
            checked: this.value,
            changeHandler: this.changeHandler.bind(this)
        };
    },

    beforeAttach: function () {

    },

    changeHandler: function(){
        this.value = this.getModelValue('checked');
        this.$el.trigger('change');
    },

    afterAttach: function () {
        var _self = this;
        var element = "#" + _self.fieldName;
    },

    setValue: function (value) {
        var model = this.getModel();
        
        model.checked = value;
        this.value = value;
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
       var html=
        
			"<div class='form-group col-lg-"+ this.colspan +" rowspan"+ this.rowspan +" resizable' id='" + this.fieldName + "_container'>"+
            "<div id=id='" + this.fieldName + "-block'>"+
            "<label rv-style='versionStyle' rv-for='fieldName'>{label}<span rv-if='required'>*</span></label>";
            for(var i= 0;i<this.dataProvider.length;i++)
            {
                var cid = this.fieldName+"_"+i;
                html+="<div class='radiogroup'>"+
                "<label><input type='radio' rv-on-change='changeHandler' rv-checked='checked' name='" + this.fieldName +"' id='"+cid+"' value='"+this.dataProvider[i][this.valueField]+"'>"+this.dataProvider[i][this.labelField]+"</label>"+
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
RadioGroup.type = 'radiogroup';
//register dom element for this component
KxGenerator.registerDOMElement(RadioGroup, 'kx-radiogroup');

