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
/*
    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'mousedown' : this.mouseDownHandler.bind(this),
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
        ]
    }
*/
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
                    this.$el.data('value', v);
            }
        }
    });

    var _defaultParams = {
        closeIconSide:"left",
    };
    _props = extend(false, false, _defaultParams, _props);
    var _value = _props.value;
    _props.hyperlink = "#";
    var _closeIconSide = _props.closeIconSide;
    

    Link.call(this, _props, true);
};
SuggestionRenderer.type = 'suggestionrenderer';