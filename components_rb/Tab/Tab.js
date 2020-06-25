/**
 * This is a Tab Element
 * 
 * Kreatx 2018
 */

//component definition
var Tab = function(_props)
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
                if(this.$anchor)
                    this.$anchor.html(v);
            }
        }
    });
    
    this.beforeAttach = function (e) 
    {
        if (e.target.id == this.domID) {
            this.$container = this.$el;
            this.$anchor = $('<a class="nav-link" data-toggle="tab" href="#' + this.domID + '">' + _label + '</a>');
            this.$header = $('<li class="nav-item"></li>');
            this.$header.append(this.$anchor);
        }
    };
    
    this.template = function ()
    {
        return '<div id="' + this.domID + '" class="tab-pane container fade"></div>';
    };
    
    let _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);
    let _label = _props.label;
    let r = Parent.call(this, _props);
    return r;
};
Tab.prototype.ctor = 'Tab';