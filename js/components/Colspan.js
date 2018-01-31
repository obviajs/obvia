/**
 * This is a Template for a default component
 * 
 * Kreatx 2018
 */

//component definition
var Colspan = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle
      
            
        }
    },

    registerEvents: function () {
        
    },

    beforeAttach: function () {

    },

    afterAttach: function () {
        
    },

    getValue: function () {
       
    },

    setValue: function (value) {
        
    },

    template: function () {
        return
         
        "<div class='col-lg-"+ this.colspan +" rowspan"+ this.rowspan +" resizable' style='background-color: #ccc; margin-bottom: 5px;'><label></label></div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Colspan.type = 'colspan';

//register dom element for this component
KxGenerator.registerDOMElement(Colspan, 'kx-colspan');