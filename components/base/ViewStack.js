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
    Object.defineProperty(this, "children", 
    {
        get: function children() 
        {
            return _children;
        }
    });

    Object.defineProperty(this, "components", 
    {
        get: function components() 
        {
            return _components;
        }
    });
    
    Object.defineProperty(this, "width", 
    {
        get: function width() 
        {
            return _width;
        },
        set: function width(v) 
        {
            if(_width != v)
            {
                _width = v;
                if(this.$el)
                {
                    v = v || 0;
                    this.$el.css('width', v+"px");
                }
            }
        }
    });

    Object.defineProperty(this, "height", 
    {
        get: function height() 
        {
            return _height;
        },
        set: function height(v) 
        {
            if(_height != v)
            {
                _height = v;
                if(this.$el)
                {
                    v = v || 0;
                    this.$el.css('height', v+"px");
                }
            }
        }
    });

    Object.defineProperty(this, "spacing", 
    {
        get: function spacing() 
        {
            return _spacing;
        }
    });

    this.template = function ()
    { 
        return  '<div id="' + this.domID + '"></div>'; 
    };

    Object.defineProperty(this, "selectedIndex", 
    {
        get: function selectedIndex() 
        {
            return _selectedIndex;
        },
        set: function selectedIndex(v) 
        {
            if(_selectedIndex != v)
            {
                var event = jQuery.Event("change");
                this.$el.trigger(event, [_selectedIndex, v]);
                if (!event.isDefaultPrevented()) 
                {
                    _selectedIndex = v;
                    for(var i=0;i<_components.length;i++)
                    {
                        var c = this.children[(_components[i]).props.id];
                        if(c)
                        {
                            if(i==v){
                                this.$container.append(c.$el);
                            }else if(c.$el.parent().length > 0){
                                c.$el.detach();
                            }
                        }
                    } 
                }
            }
        }
    });
    
    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        if(_components && Array.isArray(_components))
        {
            for(var i=0;i<_components.length;i++)
            {
                var cmp = Component.fromLiteral(_components[i]);
                (function(i){
                    cmp.on('creationComplete', function (e) {
                            e.stopImmediatePropagation();
                            e.stopPropagation();
            
                            _ccComponents.push(_components[i].props.id);
                        
                            if (_ccComponents.length == _self.components.length && !_creationFinished) {
                                _creationFinished = true;
                                _self.trigger('creationComplete');
                            }
        
                    });
                })(i);
                var maxIndex = this.$container.children().length;
                if(_selectedIndex==i)
                    this.$container.append(cmp.render());
                //expose component model
                _components[i].props.id = cmp.id;
                _children[cmp.id] = cmp;
    
                cmp.parent = _self;
                cmp.parentType = _self.type;
                cmp.parentForm = _self;
            }
        }
    }
    var _defaultParams = {
        selectedIndex: 0,
        components: []
    };
   
    var _width;
    var _height;
    _props = extend(false, false, _defaultParams, _props);
    var _selectedIndex = _props.selectedIndex;
    var _ccComponents = [];
    var _components = _props.components;
    var _children = {};
    var _self = this;
    var _creationFinished = false;

    Component.call(this, _props, true);

    var _spacing = new Spacing(_props.spacing, this.$el);

    this.width = _props.width;
    this.height = _props.height;

    var _enabled = _props.enabled;
    Object.defineProperty(this, "enabled", 
    {
        get: function enabled() 
        {
            return _enabled;
        },
        set: function enabled(v) 
        {
            if(_enabled != v)
            {
                _enabled = v;
                for(var childId in this.children)
                {
                    this.children[childId].enabled = v;
                }
            }
        },
        configurable: true
    });
};
ViewStack.prototype.type = 'ViewStack';