/**
 * This is a Label Element
 * 
 * Kreatx 2018
 */

//component definition
var Label = function(_props)
{   
    Object.defineProperty(this, "label", 
    {
        get: function label() 
        {
            return _label;
        },
        set: function label(v) 
        {
            if(_label != v)
            {
                _label = v;
                if(this.$el)
                    this.$el.html(v);
            }
        }
    });

    Object.defineProperty(this, "labelHtml", 
    {
        get: function labelHtml() 
        {
            return _labelHtml;
        },
        set: function labelHtml(v) 
        {
            if(_labelHtml != v)
            {
                _labelHtml = v;
                if(this.$el)
                    this.$el.html(v);
            }
        }
    });
 
    this.beforeAttach = function () 
    {
        this.$container = this.$el;
        this.addComponents(this.components);
    };

    this.template = function () 
    {         
        return "<"+_labelType+" id='" + this.domID + "'>"+_labelHtml+"</"+_labelType+">"; 
    };

    var _defaultParams = {
        label:"",
        target:"",
        labelType: LabelType.label
    };
    _props = extend(false, false, _defaultParams, _props);
    
    var _label = _props.label;
    var _labelHtml = _label;
    var _labelType = _props.labelType;

    Parent.call(this, _props);
};
Label.prototype.ctor = 'Label';