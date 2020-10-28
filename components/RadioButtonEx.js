/**
 * This is a Radio Button Element
 *
 * Kreatx 2019
 */

//component definition
var RadioButton = function (_props) {

    let  _self = this, _label, _value, _checked, _name;

    Object.defineProperty(this, "label",
    {
        get: function label() {
            return _label;
        },
        set: function label(v) {
            if (_label != v) {
                _label = v;
                if (this.$input)
                    this.$input[0].nextSibling.textContent = v;
            }
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

    Object.defineProperty(this, "value",
    {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v)
                _value = v;
            else
                _self.checked = true;
            if (this.$input)
                this.$input.val(v);
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
    
    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            this.$input = this.$el.find("#" + this.domID + "-radio");
        }
    }
    
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {       
            if (_props.name && !this.getBindingExpression("name"))
            {
                this.name = _props.name;
            }
            if (_props.label && !this.getBindingExpression("label"))
            {
                this.label = _props.label;
            }
            if (_props.value && !this.getBindingExpression("value"))
            {
                this.value = _props.value;
            }
            if (_props.checked && !this.getBindingExpression("checked"))
            {
                this.checked = _props.checked;
            }
            if (_props.enabled && !this.getBindingExpression("enabled"))
            {
                this.enabled = _props.enabled;
            }
        }
    };
    
    this.template = function () {
        return "<input data-triggers='click' id='" + this.domID + "-radio' type='radio' class='no-form-control' >";
    };

    let _defaultParams = {
        label: "",
        value: "",
        checked: false,
        enabled: true,
    };
    _props = extend(false, false, _defaultParams, _props);
  
    Component.call(this, _props);
};
RadioButton.prototype.ctor = 'RadioButton';