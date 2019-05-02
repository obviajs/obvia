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
    
    this.template = function () 
    { 
        return  '<div id="' + this.domID + '" class="tab-pane container fade"></div>'; 
    }
    var _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);
    var _label = _props.label;
    Parent.call(this, _props, true);
    var base = this.base;

    this.beforeAttach = function () 
    {
        this.$container = this.$el;
        this.$anchor = $('<a class="nav-link" data-toggle="tab" href="#' + this.domID + '">'+_label+'</a>');
        this.$header = $('<li class="nav-item"></li>');
        this.$header.append(this.$anchor);
        base.beforeAttach();
    };

};
Tab.prototype.ctor = 'Tab';