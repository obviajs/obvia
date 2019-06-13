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

    Object.defineProperty(this, "hyperlink", 
    {
        get: function hyperlink() 
        {
            return _hyperlink;
        },
        set: function hyperlink(v) 
        {
            if(_hyperlink != v)
            {
                _hyperlink = v;
                if(_hyperlink)
                {
                    _labelHtml = "<a id='" + this.domID + "_anchor' href='" + _hyperlink + "' target='" + _target + "'>" + _label + "</a>";
                    if(this.$el)
                    {
                        if(this.$anchor && this.$anchor.length>0)
                        {
                            this.$anchor.attr('href', _hyperlink);
                        }else
                            this.$el.html(_labelHtml);
                    }
                }else
                {
                    _labelHtml = _label;
                    if(this.$el)
                    {
                        if(this.$anchor && this.$anchor.length>0)
                        {
                            this.$anchor.removeAttr('href');
                        }else
                            this.$el.html(_labelHtml);
                    }
                }                    
            }
        }
    });
    Object.defineProperty(this, "target", 
    {
        get: function target() 
        {
            return _target;
        },
        set: function target(v) 
        {
            if(_target != v)
            {
                _target = v;
                if(_target)
                {
                    _labelHtml = "<a id='" + this.domID + "_anchor' href='" + _hyperlink + "' target='" + _target + "'>" + _label + "</a>";
                    if(this.$el)
                    {
                        if(this.$anchor && this.$anchor.length>0)
                        {
                            this.$anchor.attr('target', _target);
                        }else
                            this.$el.html(_labelHtml);
                    }
                }else
                {
                    _labelHtml = "<a id='" + this.domID + "_anchor' href='" + _hyperlink + "'>" + _label + "</a>";
                    if(this.$el)
                    {
                        if(this.$anchor && this.$anchor.length>0)
                        {
                            this.$anchor.removeAttr('target');
                        }else
                            this.$el.html(_labelHtml);
                    }
                }
                    
            }
        }
    });
    
    this.beforeAttach = function () 
    {
        this.$anchor = this.$el.find("#" + this.domID + "_anchor");
    };

    this.template = function () 
    {         
        return "<"+_labelType+" id='" + this.domID + "'>"+_labelHtml+"</"+_labelType+">"; 
    };

    var _defaultParams = {
        label:"",
        hyperlink:"",
        target:"",
        labelType: LabelType.label
    };
    _props = extend(false, false, _defaultParams, _props);
    
    var _label = _props.label;
    var _labelHtml = _label;
    var _hyperlink = _props.hyperlink;
    var _target = _props.target;
    var _labelType = _props.labelType;

    Component.call(this, _props);
};
Label.prototype.ctor = 'Label';