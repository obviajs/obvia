/**
 * This is an Image Element
 * 
 * Kreatx 2018
 */

//component definition
var Image = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            class: this.class || "mb-1 form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable",
            style: this.style
        }
    },

    beforeAttach: function () {
        this.$image = this.$el;
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'load': this.handleimageonload.bind(this)
                }
            }
        ]
    },
    handleimageonload: function(e){
        if (typeof this.onload == 'function')
            this.onload.apply(this, arguments);

        if(!e.isDefaultPrevented()){
            //
        }
    },
    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    getValue: function () {
        return null;
    },

    setValue: function (value) {
        return null
    },
    set src(v){
        if(this._src != v){
            if(this.$el){
                this.$el.attr('src', v);
            }
            this._src = v;
        }
    },
    get src(){
        return this._src;
    },
    set alt(v){
        if(this._alt != v){
            if(this.$el){
                this.$el.attr('alt', v);
            }
            this._alt = v;
        }
    },
    get alt(){
        return this._alt;
    },
    set height(v){
        if(this._height != v){
            if(this.$el){
                this.$el.attr('height', v);
            }
            this._height = v;
        }
    },
    get height(){
        return this._height;
    },
    set width(v){
        if(this._alt != v){
            if(this.$el){
                this.$el.attr('width', v);
            }
            this._width = v;
        }
    },
    get width(){
        return this._width;
    },

    template: function () {         
        return  '<img id="' + this.domID + '" src="'+this.src+'" alt="'+this.alt+'" height="'+this.height+'" width="'+this.width+'">';    
    },

    render: function () {
        if(this.$el.complete){
            this.trigger('load');
        }
        return this.$el;
    }
});

//component prototype
Image.type = 'image';

//register dom element for this component
KxGenerator.registerDOMElement(Image, 'kx-image');