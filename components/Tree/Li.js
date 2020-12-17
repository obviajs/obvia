var Li = function (_props) {
    var _self = this;
    
    Object.defineProperty(this, "label", {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (this.$el) {
                    v = $(`<div>${v}</div>`).get(0).innerText;
                    let last = this.$el.children().last();
                    if (last && last.length > 0)
                        if (last[0].nextSibling)
                            last[0].nextSibling.textContent = v;
                        else
                            this.$el.appendText(v);
                    else
                        //this.$el.appendText(v);
                        this.$el.text(v);
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this, "value", 
    {
        get: function value() 
        {
            return _value;
        },
        set: function value(v) 
        {
            if(_value != v)
            {
                _value = v;
                if(this.$el)
                    this.$el.attr('value', v);
            }
        },
        enumerable: true
    });

    this.template = function () {
        return "<li id='" + this.domID + "' value='"+_value+"'></li>";
    };

    let _defaultParams = {
        label: "",
        value: "",
        type: ContainerType.NONE
    };

    _props = extend(false, false, _defaultParams, _props);
    //_props.applyBindings = false;
   
    let r = Container.call(this, _props); 
   
    var _label = _props.label;
    var _value = _props.value;
    return r;
};
//component prototype
Li.prototype.ctor = 'Li';