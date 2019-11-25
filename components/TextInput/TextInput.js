/**
 * This is a Text Input Element
 *
 * Kreatx 2019
 */
 
//component definition
var TextInput = function (_props, overrided = false) {
    var _self = this;
 
    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                _value = v;
                if (_value!=null) {
                    if (this.$el) {
                        this.$el.attr('value', _value);
                        this.$el.val(_value);
                    }
                } else {
                    if (this.$el) {
                        this.$el.removeAttr('value');
                        this.$el.val("");
                    }
                }
                //this.trigger('change');
            }
        },
        enumerable:true
    });

    Object.defineProperty(this, "placeholder",
    {
        get: function placeholder(){
            return _placeholder;
        },
        set: function placeholder(v){
            if(_placeholder != v){
                _placeholder = v;
                if(_placeholder!=null){
                    if(this.$el){
                        this.$el.attr = ('placeholder', _placeholder);
                    }
                }else {
                    if(this.$el){
                        this.$el.removeAttr("placeholder");
                    }
                }
            }
        },
        enumerable:true
    })

    Object.defineProperty(this, "type", 
    {
        get: function type(){
            return _type
        },
        set: function type(v){
            if(_type != v ){
                _type = v;
                if(_type!=null){
                    if(this.$el){
                        this.$el.attr('type', _type);
                    }
                }else {
                    if(this.$el){
                        this.$el.removeAttr('type');
                    }
                }
            }
        },
        enumerable:true
    });
    
    Object.defineProperty(this, "autocomplete", 
    {
        get: function autocomplete(){
            return _autocomplete
        },
        set: function autocomplete(v){
            if(_autocomplete != v ){
                _autocomplete = v;
                if(_autocomplete!=null){
                    if(this.$el){
                        this.$el.attr('autocomplete', _autocomplete);
                    }
                }else {
                    if(this.$el){
                        this.$el.removeAttr('autocomplete');
                    }
                }
            }
        },
        enumerable:true
    });
   
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            if(_props.value)
                this.value = _props.value;
            if(_props.autocomplete)
                this.autocomplete = _props.autocomplete;
        }
    }
    this.afterAttach = function (e) {
        if (e.target.id == this.$el.attr('id') && !this.attached) {
            //init input mask
            if (_mask) {
                this.$el.inputmask(_mask);
            }
        }
    };
 
    this.changeHandler = function () {
        _value = this.$el.val();
    };
 
    this.focus = function () {
        if (this.$el != null) {
            this.$el.focus();
        }
    };
 
    this.template = function () {
        return  "<input data-triggers='change' type='"+ this.type +"' id='" + this.domID + "' value='"+ this.value+ "' placeholder='"+this.placeholder+"'>";
    };
 
    var _defaultParams = {
        value: "",
        type: "text",
        placeholder: "",
        afterAttach: this.afterAttach,
        autocomplete: "off"
    };
    
    _props = extend(false, false, _defaultParams, _props);
    let _autocomplete;
    let _value;
    var _mask = _props.mask;
    var _placeholder = _props.placeholder;
    var _type = _props.type;
    var _change = _props.change;
 
    _props.change = function () {
        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler(e);
        }
        if (typeof _change == 'function')
            _change.apply(this, arguments);
    };
 
    Component.call(this, _props);
    
    if (overrided) {
        this.keepBase();
    }
};
 
//component prototype
TextInput.prototype.ctor = 'TextInput';