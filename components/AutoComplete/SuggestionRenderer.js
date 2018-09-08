/**
 * This is a SuggestionRenderer Element, the default item renderer for an Autocomplete Suggestion List
 * 
 * Kreatx 2018
 */

//component definition
var SuggestionRenderer = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            class: this.class,
            style: this.style
        }
    },
    _value:null,
    _label:null,
    closeIconSide:"left",
    beforeAttach: function () {
        this.$label = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
        
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'mousedown' : this.mouseDownHandler.bind(this),
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
        ]
    },
    mouseDownHandler: function () {
        if (typeof this.onmousedown == 'function')
            this.onmousedown.apply(this, arguments);
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

    set value(v){
        if(this._value!=v)
        {
            this._value = v;
            if(this.$label!=undefined)
			    this.$label.data('value', v);
        }
    },
    get value(){
        return this._value;
    },
    set label(v){
        if(this._label!=v)
        {
            this._label = v;
            if(this.$label!=undefined)
			    this.$label.text(v);
        }
    },
    get label(){
        return this._label;
    },

    template: function () {         
        var html =  
            '<a href="#" class="dropdown-item" id="'+ this.domID + '" data-value="'+(this._value!=null && this._value!=undefined ? this._value:'')+'">'+
            (this._label!=null && this._label!=undefined ? this._label:'')+
            '</a>';
        return html;
                            
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
SuggestionRenderer.type = 'suggestionrenderer';