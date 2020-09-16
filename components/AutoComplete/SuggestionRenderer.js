/**
 * This is a SuggestionRenderer Element, the default item renderer for an Autocomplete Suggestion List
 * 
 * Kreatx 2018
 */

//component definition
var SuggestionRenderer = function(_props)
{

    this.beforeAttach = function () 
    {
        this.$el.addClass('dropdown-item');
        if(_value)
            this.$el.data('value', _value);
    };
    
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
                    if(v || v===false)
                        this.$el.data('value', v);
                    else if(v==null)
                        this.$el.removeData('value');
            }
        }
    });

    let _defaultParams = {
        closeIconSide:"left",
    };
    _props = extend(false, false, _defaultParams, _props);
    let _value = _props.value;
    let _closeIconSide = _props.closeIconSide;
    
    Link.call(this, _props, true);
};
SuggestionRenderer.prototype.ctor = 'SuggestionRenderer';