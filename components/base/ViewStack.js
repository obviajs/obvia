/**
 * This is a ViewStack component
 * A ViewStack navigator container consists of a collection of child containers stacked on top of each other, 
 * where only one child at a time is visible. When a different child container is selected, 
 * it seems to replace the old one because it appears in the same location. 
 * However, the old child container still exists; it is just invisible.
 * Kreatx 2019
 */

//component definition
var ViewStack = function(_props)
{
    Object.defineProperty(this, "selectedIndex", 
    {
        get: function selectedIndex() 
        {
            return _selectedIndex;
        },
        set: function selectedIndex(v) 
        {
            if(_selectedIndex != v)
            {}
        }
    });
    
    var _defaultParams = {
        selectedIndex: 0
    };
    _props = extend(false, false, _defaultParams, _props);
    var _selectedIndex = _props.selectedIndex;

    Parent.call(this, _props, true);
};
ViewStack.type = 'viewstack';