/**
 * This is a Text Input Element
 * 
 * Kreatx 2018
 */

//component definition
var PopOver = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            enabled: true
        }
    },
    
    beforeAttach: function () {
        this.$container = this.$el.find('#' + this.domID + '-container');
        this.$header = this.$el.find('#' + this.domID + '-header');
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$btn, events: { 
                    'click': this.clickHandler.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        $(function(){
            // Enables popover
            $("#example-popover").popover({
                html : true, 
                content: function() {
                  return this.$container.html();
                },
                title: function() {
                  return this.$header.html();
                }
            });
        });
        this.trigger('creationComplete');
    },

    enable: function () {
        var model = this.getModel();
        model.enabled = true;

        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;

        return this;
    },

    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },

    template: function () {         
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<div id='" + this.domID +"-container' class='invisible'>"+
                    "</div>"+
                    "<div id='" + this.domID +"-header' class='invisible'>"+
                    "</div>"
                    "<button rv-type='type' rv-enabled='model.enabled' rv-style='style' rv-class='class'>{value}</button>" +
                "</div>";      
    },
    
    render: function () {
        return this.$el;
    }
    
});

//component prototype
PopOver.type = 'popover';

//register dom element for this component
KxGenerator.registerDOMElement(PopOver, 'kx-popover');