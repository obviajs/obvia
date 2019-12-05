/**
 * This is a CheckBox Element
 *
 * Kreatx 2019
 */

let CheckBox = function (_props, overrided = false) {
    let _self = this, _label, _value, _checked;

    Object.defineProperty(this, "label",
    {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (this.$el){
                    let last = this.$el.children().last();
                    if(last && last.length>0)
                        if(last[0].nextSibling)
                            last[0].nextSibling.textContent = v;
                        else
                            this.$el.appendText(v);
                    else
                        //this.$el.appendText(v);
                        this.$el.text(v);
                }
            }
        },
        enumerable:true
    });

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value !== v) {
                _value = v;
            } else {
                _checked = true;
            }
            if (this.$el !== undefined)
                this.$el.val(v);
        },
        enumerable:true
    });

    Object.defineProperty(this, "checked",
    {
        get: function checked() {
            return _checked;
        },
        set: function checked(v) {
            if (_checked != v) {
                _checked = !!v;
                if (this.$el)
                    this.$el.prop('checked', v)
            }
        },
        enumerable:true
    });

    let _changeHandler = function () {
        _checked = !_checked;
    };
    
    this.beforeAttach = function () {
        if(_props.label && !this.getBindingExpression("label")){
            this.label = _props.label;
        }
        if(_props.value && !this.getBindingExpression("value")){
            this.value = _props.value;
        }
        if(_props.checked && !this.getBindingExpression("checked")){
            this.checked = _props.checked;
        }
        if(_props.enabled && !this.getBindingExpression("enabled")){
            this.enabled = _props.enabled;
        }
    };
    
    this.template = function () {
        return "<input id='" + this.domID + "' type='checkbox'/>" + _label;
    };
    
    let _defaultParams = {
        label: '',
        value: null,
        enabled: true,
        checked: false,
        embedded: false
    };

    _props = extend(false, false, _defaultParams, _props);

    let _change = _props.change;

    _props.change = function () {
        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _changeHandler.apply(this, arguments);
        }
        if (typeof _change == 'function')
        _change.apply(this, arguments);
    };

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

CheckBox.prototype.ctor = "CheckBox";