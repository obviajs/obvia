/**
 * This is a Tab Element
 * 
 * Kreatx 2018
 */

//component definition
var Tab = KxGenerator.createComponent({

    beforeAttach: function () {

        //this.$tabNavigator = this.$el.find('#' + model.componentContainerID);
    },
    template: function () { 
        return  '<div id="' + this.domID + '" class="tab-content"></div>'; 
    },
  
    
    render: function () {
        return this.$el;
    }
});

//component prototype
Tab.type = 'tab';

//register dom element for this component
KxGenerator.registerDOMElement(Tab, 'kx-tab');