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
                if (_value) {
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
                this.trigger('change');
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
                if(_placeholder){
                    if(this.$el){
                        this.$el.attr = ('placeholder', _placeholder)
                    }
                }else {
                    if(this.$el){
                        this.$el.removeAttr("placeholder")
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
                if(_type){
                    if(this.$el){
                        this.$el.attr('type', _type)
                    }
                }else {
                    if(this.$el){
                        this.$el.removeAttr('type')
                    }
                }
            }
        },
        enumerable:true
    });
 
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
        afterAttach: this.afterAttach
    };
    _props = extend(false, false, _defaultParams, _props);
 
    var _value = _props.value;
    var _mask = _props.mask;
    var _placeholder = _props.placeholder;
    var _type = _props.type;
    var _change = _props.change;
 
    _props.change = function () {
        if (typeof _change == 'function')
            _change.apply(this, arguments);
 
        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _self.changeHandler(e);
        }
    };
 
    Component.call(this, _props);
 
    if (overrided) {
        this.keepBase();
    }
};
 
//component prototype
TextInput.prototype.ctor = 'TextInput';