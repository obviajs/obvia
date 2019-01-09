/**
 * This is a Tab Element
 * 
 * Kreatx 2018
 */

//component definition
var TabInit = {

    beforeAttach: function () {
        this.ccComponents = [];
        this.$container = this.$el;
        this.$anchor = $('<a class="nav-link" data-toggle="tab" href="#' + this.domID + '">'+this._label+'</a>');
        this.$header = $('<li class="nav-item"></li>');
        this.$header.append(this.$anchor);
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
    type:"tab",
    set label(v){
        if(this._label != v){
            this._label = v;
            if(this.$anchor){
                this.$anchor.html(v);
            }
        }
    },
    get label(){
        return this._label;
    },
    template: function () { 
        return  '<div id="' + this.domID + '" class="tab-pane container fade"></div>'; 
    }
};
TabInit = extend(true, true, Parent, TabInit);
var Tab = KxGenerator.createComponent(TabInit);
//component prototype
Tab.type = 'tab';

//register dom element for this component
KxGenerator.registerDOMElement(Tab, 'kx-tab');