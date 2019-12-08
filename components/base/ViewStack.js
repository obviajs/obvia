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
    
    var _mutationHandler = function(e, ci)
    {
        var c = _self.children[(_components[ci]).props.id];
        if(c)
        {
            var parent = c.children[c.components[0].props.id];
            var c = parent.children[e.oldValue.props.id];
            delete parent.children[e.oldValue.props.id];
            //
            if(c.$el.parent().length > 0){
                c.$el.detach();
            }
            var cmp = Component.fromLiteral(e.newValue);
            e.newValue.props.id = cmp.id;
            parent.$container.insertAt(cmp.$el, 0);

            //parent.$container.append(cmp.$el);
            parent.children[cmp.id] = cmp;
//pergjithesoje, komponenti i ri te shtohet te indexi ku ishte i vjetri
            cmp.parent = _self;
            cmp.parentType = _self.type;
            cmp.parentForm = _self;
        }       
        console.log(arguments);
    }

    this.beforeAttach = function() 
    {
        this.$container = this.$el;
        if(_components && Array.isArray(_components))
        {
            for(var i=0;i<_components.length;i++)
            {
                var cmp, cmpLiteral, w;
                cmp = cmpLiteral = _components[i];
                if(cmpLiteral.type == "JTemplate")
                {
                    cmp = _components[i] = cmpLiteral.parse();   
                }
                var cmp = Component.fromLiteral(cmp);
                _components[i].props.id = cmp.id;
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
                    if(cmpLiteral.type == "JTemplate")
                    {
                        for(var j=0;j<cmpLiteral.mutations.length;j++)
                        {
                            w = ChangeWatcher.getInstance(cmpLiteral.mutations[j]["host"]);
                            w.watch(cmpLiteral.mutations[j]["host"], cmpLiteral.mutations[j]["chain"], function(e) {_mutationHandler(e, i);});
                        }
                    }
                })(i);
                var maxIndex = this.$container.children().length;
                if(_selectedIndex==i)
                    if(cmp.renderPromise){
                        cmp.renderPromise().then(function($el){
                            _self.$container.append($el);                                
                        });
                    }else
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

    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props)
            {
                if(typeof _props[prop] != 'function')
                {
                    switch(prop)
                    {
                        case "components":
                            var components = [];
                            for(var cid in _children)
                            {
                                var component = _children[cid].literal;
                                components.push(component);
                            }
                            obj[prop] = components;
                            break;
                        case "ownerDocument":
                            break;
                        default:
                            if(this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop))
                                if(!isObject(this[prop]) || !Object.isEmpty(this[prop]))
                                    obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });  
};
ViewStack.prototype.ctor = 'ViewStack';