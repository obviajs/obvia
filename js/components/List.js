/**
 * This is a List component
 * 
 * Kreatx 2018
 */

//component definition
var List = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    beforeAttach: function () {
        this.$container = this.$el.find('#' + this.domID + '-container');
        
        this.components[0].props.onclick = this.clickHandler.bind(this);
        
        this.repeater = new Repeater({
            id: 'listRepeater',
            defaultItem: {
                text: 'Button',
                buttonClass: 'btn btn-xs btn-default'
            },
            rendering: {
                direction: this.direction,
                seperator: false,
                actions: false
            },
            dataProvider: this.dataProvider,
            components: this.components
        }).on('creationComplete', function () {
            var v = this.value.slice();
            this.value = [];
            this.setValue(v, false);
            this.trigger('creationComplete');
        }.bind(this));
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this, events: {
                    'change': this.changeHandler.bind(this)
                }
            }
        ];
    },

    afterAttach: function (e) {
       
    },

    setValue: function (value, manualRender = true) {
        //if(value==undefined || value==null);
        
        value.forEach(function (valueItem) {
            this.setSingleleValue(valueItem)
        }.bind(this));
        this.trigger('change');
        return this;
    },

    setSingleleValue: function(v){
        var arrDpIndex = indexOfObject(this.dataProvider, this.valueField,  v[this.valueField]); 
        if(arrDpIndex!=-1)
        {
            var arrValueIndex = indexOfObject(this.value, this.valueField,  v[this.valueField]);         
            if (this.multiselect) {
                //allow multiple selects
                //toggle class
                if (arrValueIndex==-1) {
                    //get + push dp row
                    this.dataProvider[arrDpIndex][this.classField] = this.selectedClass;
                    this.value.push(this.dataProvider[arrDpIndex]);
                } else {
                    this.value.splice(arrValueIndex, 1);
                    this.dataProvider[arrDpIndex][this.classField] = this.defaultClass;
                }
                    
            } else {
                this.dataProvider.forEach(function (item, i) {
                    if((arrDpIndex == i && arrValueIndex!=-1) || arrDpIndex != i){
                        for(var cmp in this.repeater.rowItems[i]) {
                            this.dataProvider[i][this.classField] = this.defaultClass;
                        }
                    }
                }.bind(this));

                if (arrValueIndex==-1) {
                    this.dataProvider[arrDpIndex][this.classField] = this.selectedClass;
                    this.value = [this.dataProvider[arrDpIndex]]
                }else{
                    this.value = [];
                }
            }
            this.repeater.dataProviderChanged();
        }
    },

    changeHandler : function(e){
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    },
        
    clickHandler: function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
        
        if(!e.isDefaultPrevented()){
            this.handleComponentClick.apply(this, arguments);
        }
    },

    handleComponentClick: function (e, repeaterEventArgs) {
        var componentID = this.repeater.components[0].props.id;
        var clickedComponent = repeaterEventArgs.currentRow[componentID];
        var index = repeaterEventArgs.currentIndex;
        
        this.setSingleleValue(repeaterEventArgs.currentItem);
        
        this.trigger('change');
    },

    enable: function () {         
        this.repeater.enable();
        return this; 
    },

    disable: function () {
        this.repeater.disable();
        return this;  
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper'>" +
                    "<div class='col-lg-" + this.colspan + "' id='" + this.domID + "-block' resizable' style='padding-top: 10px; padding-bottom: 10px; overflow:hidden'>" +
                        "<label rv-style='versionStyle' rv-for='domID'>{label} <span rv-if='required'>*</span></label>" +
                        "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                        "<br>" +
                        "<div id='" + this.domID + "-container' role='group' style='padding:0'>" +
                            
                        "</div>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        //this.repeater.$el.children()[0].classList = '';
        this.$container.append(this.repeater.render());
        return this.$el;
    }
});

//component prototype
List.type = 'list';

//register dom element for this component
KxGenerator.registerDOMElement(List, 'kx-list');