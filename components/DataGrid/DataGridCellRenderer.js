/**
 * This is a DataGridCellRenderer Element, the default item renderer for a DataGrid
 * 
 * Kreatx 2018
 */

//component definition
var DataGridCellRenderer = KxGenerator.createComponent({
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
                    'click': this.clickHandler.bind(this)
                }
            }
        ]
    },
     clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },
    afterAttach: function (e) {
        if (this.hyperlink) {
            var target = '';
            if (this.hasOwnProperty('target'))
                target = this.target;
            
            this.$el.html("<a href='" + this.hyperlink + "' target='" + target + "'>" + this.label + "</a>");
        }
        
        this.trigger('creationComplete');
    },

    getValue: function () {
        return this.$el.text();
    },

    setValue: function (value) {
        this.$el.text(value);
    },

    template: function () {         
        return  "<label id='" + this.domID + "-wrapper'>{label}</label>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
DataGridCellRenderer.type = 'datagridcellrenderer';