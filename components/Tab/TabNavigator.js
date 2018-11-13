/**
 * This is a TabNavigator Element
 * 
 * Kreatx 2018
 */

//component definition
var TabNavigator = KxGenerator.createComponent({

    beforeAttach: function () {

        this.$tabContainer = this.$el.find('#' + this.domID+"_tabContainer");
    },
    template: function () { 
        return  
        '<div id="' + this.domID + '">' +
            '<ul class="nav nav-tabs justify-content-center" id="' + this.domID + '_tabContainer" role="tablist">' +
            '</ul>' +
        '</div>'; 
    },
  
    
    render: function () {
        return this.$el;
    }
});

//component prototype
TabNavigator.type = 'tabNavigator';

//register dom element for this component
KxGenerator.registerDOMElement(TabNavigator, 'kx-tabNavigator');