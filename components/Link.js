/**
 * This is a Link Element
 * 
 * Kreatx 2018
 */

//component definition
var Link = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            class: this.class,
            style: this.style
        }
    },

    beforeAttach: function () {
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
        ]
    },
    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },
    doubleClickHandler: function () {
        if (typeof this.ondblclick == 'function')
            this.ondblclick.apply(this, arguments);
    },
    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    getValue: function () {
        return this.$el.text();
    },

    setValue: function (value) {
        this.$el.text(value);
    },
    set hyperlink(v){
        if(this._hyperlink != v){
            if(this.$el){
                this.$el.attr('hyperlink', v);
            }
            this._hyperlink = v;
        }
    },
    get hyperlink(){
        return this._hyperlink;
    },
    set target(v){
        if(this._target != v){
            if(this.$el){
                this.$el.attr('target', v);
            }
            this._target = v;
        }
    },
    get target(){
        return this._target;
    },
    set label(v){
        if(this._label != v){
            if(this.$el){
                this.$el.attr('target', v);
            }
            this._label = v;
        }
    },
    get label(){
        return this._label;
    },
    template: function () {         
        return "<a id='" + this.domID + "' href='" + this._hyperlink + "' "+(this._target?"target='" +this._target+"'":"")+ ">" + this._label + "</a>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Link.type = 'link';