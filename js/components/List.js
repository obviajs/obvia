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
        this.direction = this.direction==undefined||this.direction==null?'horizontal':this.direction;
       
        this.states = this.states==undefined || this.states==null?
        [
            {dataProviderField:this.classField, states:{on:this.selectedClass, off:this.defaultClass}}
        ]:this.states;
        
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
            //trick to pass property value updated check on the first setValue call below (initial value)
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

    setValue: function (value, manualRender=true) {
        if(!this.value.equals(value))
        {
            var arrDpFieldsChanged = [];
            if(value==undefined || value==null){
                value = [];
            }
            this.value = intersectOnKeyMatch(this.dataProvider, value, this.valueField) //value;
            var unselect = this.dataProvider.difference(this.value);
            
            unselect.forEach(function (v) {
                var arrDpIndex = (v==undefined||v==null||v[this.valueField]==undefined)?-1:indexOfObject(this.dataProvider, this.valueField,  v[this.valueField]);
                if(arrDpIndex!=-1){
                    this.states.forEach(function (state) { 
                        this.dataProvider[arrDpIndex][state.dataProviderField] = state.states.off;
                        arrDpFieldsChanged.pushUnique(state.dataProviderField);
                    }.bind(this));
                }
            }.bind(this));

            this.value.forEach(function (v, i) {
                var arrDpIndex = (v==undefined||v==null||v[this.valueField]==undefined)?-1:indexOfObject(this.dataProvider, this.valueField,  v[this.valueField]);
                if(arrDpIndex!=-1){
                    this.states.forEach(function (state) { 
                        this.dataProvider[arrDpIndex][state.dataProviderField] = state.states.on;
                        arrDpFieldsChanged.pushUnique(state.dataProviderField);
                    }.bind(this));
                }else{
                    this.value.splice(i, 1);
                }
            }.bind(this));

            this.trigger('change');
            this.repeater.dataProviderChanged(arrDpFieldsChanged);
        }
        return this;
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
        
        var v = repeaterEventArgs.currentItem;
        var arrDpIndex = -1; 
        var arrValueIndex = indexOfObject(this.value, this.valueField,  v[this.valueField]);  
        var _value = this.value.slice();       
        if (arrValueIndex==-1){
            if (this.multiselect){   
                _value.push(v);
            }else
                _value = [v];     
        }else{
            if (this.multiselect){   
                _value.splice(arrValueIndex, 1);
            }else
                _value = []; 
        }    
        this.setValue(_value);
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
        (!this.embedded?("<div class='col-lg-" + this.colspan + "' id='" + this.domID + "-block' resizable' style='padding-top: 10px; padding-bottom: 10px; overflow:hidden'>" +
                        "<label rv-style='versionStyle' rv-for='domID'>{label} <span rv-if='required'>*</span></label>" +
                        "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                        "<br>") : "") +
                        "<div id='" + this.domID + "-container' role='group' style='padding:0'>" +
                            
                        "</div>" +
        (!this.embedded?"</div>":"") +
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