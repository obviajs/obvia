/**
 * This is a FormField Element
 * 
 * Kreatx 2018
 */

//component definition
var FormField = function(_props)
{   
    /**
     * 
     * 
            //if component is embedded within another then do not render label and other specific html
            if (!component.hasOwnProperty('embedded')) {
                component.embedded = false;
            }
       
        
           


            //validation
            component.errorList = [];
            if (!component.hasOwnProperty('validate')) {
                component.validate = function () {
                    return true;
                }
            }

            if (!component.hasOwnProperty('setValue')) {
                component.setValue = function (value) {
                    if (component.value != value) {
                        component.value = value;

                        component.trigger('change');
                    }
                    return this;
                }

            }
     *  */
}
//component prototype
FormField.type = 'formfield';