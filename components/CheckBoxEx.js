/**
 * This is a CheckBox Element
 *
 * Kreatx 2019
 */

var CheckBoxEx = function (_props) {
    let _self = this, _label, _value, _checked, _name;

    Object.defineProperty(this, "label",
    {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (this.$el)
                {
                    v = $(`<div>${v}</div>`).get(0).innerText;
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
        }
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
            if (this.$input)
                this.$input.val(v);
        }
    });

    Object.defineProperty(this, "checked",
    {
        get: function checked() {
            return _checked;
        },
        set: function checked(v) {
            if (_checked != v) {
                _checked = !!v;
                if (this.$input)
                    this.$input.prop('checked', v);
            }
        }
    });
    
    Object.defineProperty(this, "name", {
        set: function name(v) {
            if(_name!=v){
                _name = v;
                this.$input.attr("name", v);
            }
        },
        get: function name() {
            return _name;
        }
    });

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            this.$input = this.$el.find("#" + this.domID + "-checkbox");
        }
    };
            
    this.beforeAttach = function (e) 
    {
        if (e.target.id == this.domID)
        {
            if (_props.label && !this.getBindingExpression("label")){
                this.label = _props.label;
            }
            if (_props.value && !this.getBindingExpression("value")){
                this.value = _props.value;
            }
            if (_props.checked && !this.getBindingExpression("checked")){
                this.checked = _props.checked;
            }
            if (_props.enabled && !this.getBindingExpression("enabled")){
                this.enabled = _props.enabled;
            }
        }
    };

    let _clickHandler = function () {
        _checked = !_checked;
    };

    this.template = function () {
        return "<label  id='" + this.domID + "'>" +
            "<input data-triggers='click change' id='" + this.domID + "-checkbox' type='checkbox' class='no-form-control'/></label>";
    };

    let _defaultParams = {
        label: 'CheckBox Label',
        value: null,
        enabled: true,
        checked: false
    };

    _props = extend(false, false, _defaultParams, _props);

    let _click = _props.click;

    _props.click = function () {
        if (typeof _click == 'function')
            _click.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _clickHandler.apply(this, arguments);
        }
    };

    Component.call(this, _props);
};

CheckBoxEx.prototype.ctor = "CheckBoxEx";