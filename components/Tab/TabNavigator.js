/**
 * This is a TabNavigator Element
 * 
 * Kreatx 2018
 */

//component definition
var TabNavigatorInit = {

    beforeAttach: function () {
        this.ccComponents = [];
        this.$navigation = this.$el.find('#' + this.domID + "_navigation");
        this.$container = this.$el.find('#' + this.domID + "_container");        
    },

    type:"tabNavigator",
    _selectedIndex:null,
    set selectedIndex(v){
        if(this._selectedIndex != v){
            this._selectedIndex = v;
            for(var i=0;i<this.components.length;i++){
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
    },
    get selectedIndex(){
        return this._selectedIndex;
    },
    template: function () { 
        return (!this.embedded?("<div id='" + this.domID + "-wrapper' class='"+(this.colspan?"col-sm-" + this.colspan:"")+" class='container' rowspan" + this.rowspan + "'>"):"") +
        '<ul class="nav nav-tabs" id="' + this.domID + '_navigation"></ul>'+ 
        '<div class="tab-content" id="' + this.domID + '_container"></div>'+
        (!this.embedded?("</div>"):"");
    }
};
TabNavigatorInit = extend(true, true, NavParent, TabNavigatorInit);
var TabNavigator = KxGenerator.createComponent(TabNavigatorInit);
//component prototype
TabNavigator.type = 'tabNavigator';

//register dom element for this component
KxGenerator.registerDOMElement(TabNavigator, 'kx-tabNavigator');