/**
 * This is a Label Element
 * 
 * Kreatx 2018
 */

//component definition
var Label = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            class: this.class || "mb-1 form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable",
            style: this.style
        }
    },

    beforeAttach: function () {
        this.$label = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
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
            
            this.$label.html("<a href='" + this.hyperlink + "' target='" + target + "'>" + this.label + "</a>");
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
        return  
        (!this.embedded?("<div id='" + this.domID + "-wrapper' rv-class='model.class' rv-style='model.style'>"):"")+
                    "<label id='" + this.domID + "'><b>{label}</b></label>"+
        (!this.embedded?("</div>"):"");    
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Label.type = 'label';

//register dom element for this component
KxGenerator.registerDOMElement(Label, 'kx-label');