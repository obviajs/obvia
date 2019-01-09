/**
 * This is a Container Element
 * 
 * Kreatx 2018
 */

//component definition
var ContainerInit = {
    //component data
    initModel: function () {
        return {
            style: this.style
        }
    },

    beforeAttach: function () {
        this.ccComponents = [];
        this.$container = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
    },
    type:"container",
    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        if (this.hyperlink) {
            var target = '';
            if (this.hasOwnProperty('target'))
                target = this.target;
            
            this.$container.html("<a href='" + this.hyperlink + "' target='" + target + "'>" + this.container + "</a>");
        }
        
        this.trigger('creationComplete');
    },

    template: function () { 
        return  '<div id="' + this.domID + '" class="container" style="'+(this.width?'width:'+this.width+'px;':'')+(this.height?'width:'+this.height+'px;':'')+'" ></div>'; 
    },
  
};
ContainerInit = extend(true, true, Parent, ContainerInit);
var Container = KxGenerator.createComponent(ContainerInit);
//component prototype
Container.type = 'container';
//register dom element for this component
KxGenerator.registerDOMElement(Container, 'kx-container');