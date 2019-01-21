/**
 * This is a TabNavigator Element
 * 
 * Kreatx 2018
 */

//component definition
var TabNavigator = function(_props) 
{
   

    type:"tabNavigator",
    
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
                _selectedIndex = v;
                for(var i=0;i<this.components.length;i++)
                {
                    var cTab = this[(this.components[i]).props.id];
                    if(cTab)
                    {
                        if(i==v){
                            cTab.$el.addClass("active");
                            cTab.$anchor.addClass("active");
                            cTab.$el.removeClass("fade");
                        }else{
                            cTab.$el.addClass("fade");
                            cTab.$el.removeClass("active");
                            cTab.$anchor.removeClass("active");
                        }
                    }
                } 
            }
        }
    });

    this.template = function () 
    { 
        return (!_embedded?("<div id='" + this.domID + "-wrapper' class='container "+(this.colspan?"col-sm-" + this.colspan:"")+"'>"):"") +
        '<ul class="nav nav-tabs" id="' + this.domID + '_navigation"></ul>'+ 
        '<div class="tab-content" id="' + this.domID + '_container"></div>'+
        (!_embedded?("</div>"):"");
    }

    var _defaultParams = {
        selectedIndex:0
    };
    _props = extend(false, false, _defaultParams, _props);
    var _embedded = _props.embedded;
    var _selectedIndex = _props.selectedIndex;
    NavParent.call(this, _props, true);
    var base = this.base;
    this.beforeAttach = function () 
    {
        this.$navigation = this.$el.find('#' + this.domID + "_navigation");
        this.$container = this.$el.find('#' + this.domID + "_container");  
        base.beforeAttach();      
    };
};
//component prototype
TabNavigator.type = 'tabNavigator';