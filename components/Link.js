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

    template: function () {         
        return "<a id='" + this.domID + "-wrapper' href='" + this.hyperlink + "' "+(this.target?"target='" +this.target+"'":"")+ ">" + this.label + "</a>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Link.type = 'link';