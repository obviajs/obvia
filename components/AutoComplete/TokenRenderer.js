/**
 * This is a TokenRenderer Element, the default item renderer for an Autocomplete
 * 
 * Kreatx 2018
 */

//component definition
var TokenRenderer = KxGenerator.createComponent({
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

        this.$closeIcon = this.$el.find('#'+ this.domID + '_closeIcon');
        this.$label = this.$el.find('#'+ this.domID + '_label');
        
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$closeIcon, events: {
                    'click': this.closeIconClickHandler.bind(this)
                }
            },
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
    closeIconClickHandler: function(){
        if (typeof this.closeiconclickhandler == 'function')
            this.closeiconclickhandler.apply(this, arguments);
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
            '<div id="'+ this.domID + '-wrapper">'+
                '<span id="'+ this.domID + '_label" data-value="'+(this._value!=null && this._value!=undefined ? this._value:'')+'" class="badge badge-info" style="font-size: 14px; margin:2px">'+
                (this.closeIconSide=="left"?('<a class="badge badge-info" id="'+ this.domID + '_closeIcon"href="#" tabindex="-1">×</a>'):"")+          
                (this._label!=null && this._label!=undefined ? this._label:'')+
                (this.closeIconSide=="right"?('<a class="badge badge-info" id="'+ this.domID + '_closeIcon"href="#" tabindex="-1">×</a>'):"")+            
                '</span>'+
            '</div>';
        return html;
                            
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
TokenRenderer.type = 'tokenrenderer';