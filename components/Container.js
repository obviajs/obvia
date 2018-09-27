/**
 * This is a Container Element
 * 
 * Kreatx 2018
 */

//component definition
var Container = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            class: this.class || "mb-1 form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable",
            style: this.style
        }
    },

    beforeAttach: function () {
        this.$container = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
    },

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

    getValue: function () {
        return null;
    },

    setValue: function (value) {
        return null
    },

    template: function () { 
        return  '<div id="' + this.domID + '" style = "width:200px;height:100px;background-color:lightblue" ><h5>{label}</h5></i></div>'; 
    },
  
    
    render: function () {
        return this.$el;
    }
});

//component prototype
Container.type = 'container';

//register dom element for this component
KxGenerator.registerDOMElement(Container, 'kx-container');