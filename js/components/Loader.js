/**
 * This is a Loader Element
 * 
 * Kreatx 2018
 */

//component definition
var Loader = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
          
        }
    },

    beforeAttach: function () {
        
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
        this.trigger('creationComplete');
    },

    template: function () {
        return  "<div id='" + this.domID + "-wrapper' style='display: none;'>" +
                    "<style>" +
                        ".se-pre-con {" +
                            "position: fixed;" +
                            "left: 0px;" +
                            "top: 0px;" +
                            "width: 100%;" +
                            "height: 100%;" +
                            "z-index: 999999;" +
                            "opacity: 0.9;" +
                            "background: url('lib/flower_dependencies/images/loader.gif')center no-repeat #fff;" +
                        "}" +
                    "</style>"+
                    "<div class='se-pre-con'></div>" +                    
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Loader.type = 'loader';

//register dom element for this component
KxGenerator.registerDOMElement(Loader, 'kx-loader');