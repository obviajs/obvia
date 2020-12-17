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
    let _self = this;
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
                let event = jQuery.Event("change");
                this.$el.trigger(event, [_selectedIndex, v]);
                if (!event.isDefaultPrevented()) 
                {
                    _selectedIndex = v;
                    for(let i=0;i<_self.components.length;i++)
                    {
                        let c = this.children[(_self.components[i]).props.id];
                        if(c)
                        {
                            if(i==v){
                                this.$container.append(c.$el);
                                event = jQuery.Event("changed");
                                this.trigger(event, [_selectedIndex, v]);
                            }else if(c.$el.parent().length > 0){
                                c.$el.detach();
                            }
                        }
                    } 
                }
            }
        },
        enumerable: true
    });
    
    let _mutationHandler = function (e, ci) {
        let c = _self.children[(_components[ci]).props.id];
        if (c) {
            let parent = c.children[c.components[0].props.id];
            let c = parent.children[e.oldValue.props.id];
            delete parent.children[e.oldValue.props.id];
            //
            if (c.$el.parent().length > 0) {
                c.$el.detach();
            }
            let cmp = Component.fromLiteral(e.newValue);
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
    };

    this.beforeAttach = function() 
    {
       
    }
    let _defaultParams = {
        selectedIndex: 0,
        type: ContainerType.NONE
    };

    _props = extend(false, false, _defaultParams, _props);
    let _selectedIndex = _props.selectedIndex;
    let _components = _props.components;
    
    if(_components && _components.length > 0){
        for (let i = 0; i < _props.components.length; i++)
        { 
            _props.components[i].props.attach = (i == _selectedIndex);
        }
    }
    if (!_props.attr) { 
        _props.attr = {};
    }
    let myDtEvts = ["change", "changed"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {   
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    
    let r = Container.call(this, _props);
    
    // this.addComponents = function (cmps)
    // {
    //     _self.trigger('beginDraw');
    //     let components;
    //     if(cmps){
    //         components = cmps;
    //     }else{
    //         components = this.components;
    //     }
    //     if(components && Array.isArray(components))
    //     {
    //         for(let i=0;i<components.length;i++)
    //         {
    //             let cmp, cmpLiteral, w;
    //             cmp = cmpLiteral = components[i];
    //             if(cmpLiteral.type == "JTemplate")
    //             {
    //                 cmp = components[i] = cmpLiteral.parse();   
    //             }
    //             let cmp = Component.fromLiteral(cmp);
    //             components[i].props.id = cmp.id;
    //             (function(i){
    //                 cmp.on('creationComplete', function (e) {
    //                         e.stopImmediatePropagation();
    //                         e.stopPropagation();
            
    //                         _ccComponents.push(components[i].props.id);
                        
    //                         if (_ccComponents.length == _self.components.length && !_creationFinished) {
    //                             _creationFinished = true;
    //                             _self.trigger('creationComplete');
    //                         }
        
    //                 });
    //                 if(cmpLiteral.type == "JTemplate")
    //                 {
    //                     for(let j=0;j<cmpLiteral.mutations.length;j++)
    //                     {
    //                         w = ChangeWatcher.getInstance(cmpLiteral.mutations[j]["host"]);
    //                         w.watch(cmpLiteral.mutations[j]["host"], cmpLiteral.mutations[j]["chain"], function(e) {_mutationHandler(e, i);});
    //                     }
    //                 }
    //             })(i);
    //             let maxIndex = this.$container.children().length;
    //             if(_selectedIndex==i)
    //                 if (cmp.render)
    //                 {
    //                     _comprenders.push({
    //                         "cmp": cmp, "promise": cmp.render().then(function (cmpInstance)
    //                         {
    //                             if (cmpInstance.appendTo)
    //                             {
    //                                 cmpInstance.appendTo.append(cmpInstance.$el);
    //                             } else
    //                                 _self.$container.append(cmpInstance.$el);
    //                         })
    //                     });
    //                 }else
    //                     this.$container.append(cmp.render());
    //             //expose component model
    //             components[i].props.id = cmp.id;
    //             _children[cmp.id] = cmp;
    
    //             cmp.parent = _self;
    //             cmp.parentType = _self.type;
    //             cmp.parentForm = _self;
    //         }
    //     }
    // }
    return r;
};
ViewStack.prototype.ctor = 'ViewStack';