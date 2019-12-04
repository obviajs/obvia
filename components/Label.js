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
                if(this.$el){
                    var last = this.$el.children().last();
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
        enumerable:true,
        configurable: true
    });
    
    this.beforeAttach = function () 
    {
        this.$container = this.$el;
        this.addComponents();
        if(_props.label){
            this.label = _props.label;
        }
    };

    this.template = function () 
    {         
        return "<"+_labelType+" id='" + this.domID + "'></"+_labelType+">"; 
    };

    var _defaultParams = {
        label:"",
        labelType: LabelType.label
    };
    _props = extend(false, false, _defaultParams, _props);
    
    var _label;
    var _labelType = _props.labelType;

    Parent.call(this, _props);
};
Label.prototype.ctor = 'Label';