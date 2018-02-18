/**
 * This is a MultiSwitch component
 * 
 * Kreatx 2018
 */

//component definition
var MultiSwitch = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        this.repeater = new Repeater({
            id: 'multiswitchRepeater',
            defaultItem: {
                text: 'Button',
                buttonClass: 'btn btn-xs btn-default'
            },
            rendering: {
                direction: 'horizontal',
                seperator: false,
                actions: false
            },
            dataProvider: this.dataProvider,
            components: [
                {
                    constructor: Button,
                    props: {
                        id: 'buttonR',
                        type: "button",
                        value: "{text}",
                        class: "{buttonClass}",
                        style: "float: left; border-radius: 0px",
                        onclick: this.clickHandler.bind(this)
                    }
                }
            ]
        })//.on('creationComplete', function(){alert('creation Complete per Repeater ne Multiswitch')})

        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,
        }
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value, manualRender = true) {
        var model = this.getModel();
        var _self = this;
        this.value = value;

        //add correct rendering classes
        this.dataProvider.forEach(function (item, index) {
            item["buttonClass"] = _self.defaultClass;
            
            if(manualRender)
                for(var cmp in _self.repeater.rowItems[index]) {
                    _self.repeater.rowItems[index][cmp].setModelValue("class", _self.defaultClass);
                }
            
            _self.value.forEach(function (valueItem) {
                if (valueItem[_self.valueField] == item[_self.valueField]) {
                    item["buttonClass"] = _self.selectedClass;
                    
                    var dpIndex;
                    _self.dataProvider.forEach(function (itemDp, indexDp) {
                        if (itemDp[_self.valueField] == valueItem[_self.valueField]) {
                            dpIndex = indexDp;
                            return false;
                        }
                    });

                    if (manualRender)
                        for(var cmp in _self.repeater.rowItems[dpIndex]) {
                            _self.repeater.rowItems[dpIndex][cmp].setModelValue("class", _self.selectedClass);
                        }

                    return false;
                }
            });

        });

        return this;
        
    },

    registerEvents: function () {
        return [];
    },

    afterAttach: function (e) {
        this.trigger('creationComplete');
    },

    clickHandler: function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
        
        if(!e.isDefaultPrevented())
        {
            this.handleButtonClick.apply(this, arguments);
        }
    },


    beforeAttach: function () {
        this.setValue(this.value, false);
    },
/*
new RepeaterEventArgs(
                                        component.parent.rowItems[component.repeaterIndex],
                                        component.parent.dataProvider[component.repeaterIndex],
                                        component.repeaterIndex

                                        indexOfObject(ac, key,  matchingValue)
                                        getMatching(ac, key,  matchingValue, stopAtFirstOcurrence)	

*/
    handleButtonClick: function (e, repeaterEventArgs) {
        var _self = this;
        var model = this.getModel();
        var button = repeaterEventArgs.currentRow["buttonR"];
        var index = repeaterEventArgs.currentIndex;
        
        button.$btn.toggleClass(this.defaultClass);
        button.$btn.toggleClass(this.selectedClass);
        

        var arrValueIndex = indexOfObject(_self.value, _self.valueField,  repeaterEventArgs.currentItem[_self.valueField]);         
        if (this.multiselect) {
            //allow multiple selects
            //toggle class
            if (arrValueIndex==-1) {
                 //get + push dp row
                this.value.push(this.dataProvider[index]);
            } else {
                _self.value.splice(arrValueIndex, 1);
            }
                  
        } else {
            this.dataProvider.forEach(function (item, i) {
                if((index == i && arrValueIndex!=-1) || index != i){
                    for(var cmp in _self.repeater.rowItems[i]) {
                        _self.repeater.rowItems[i][cmp].$btn.removeClass(_self.selectedClass);
                        _self.repeater.rowItems[i][cmp].$btn.addClass(_self.defaultClass);
                    }
                }
            });

            if (arrValueIndex==-1) {
                this.value = [this.dataProvider[index]]
            }else{
                this.value = [];
            }
        }
    },

    template: function () {
        return "<div id='" + this.id + "-wrapper'>" +
                    "<div class='col-lg-" + this.colspan + "' id='" + this.fieldName + "-block' resizable' style='padding-top: 10px; padding-bottom: 10px; overflow:hidden'>" +
                        "<label rv-style='versionStyle' rv-for='fieldName'>{label} <span rv-if='required'>*</span></label>" +
                        "<span rv-if='blockProcessAttr' class='block-process'> * </span>" +
                        "<br>" +
                        "<div id='" + this.id + "-container' role='group' style='padding:0'>" +
                            
                        "</div>" +
                    "</div>" +
                "</div>";
    },

    render: function () {
        var model = this.getModel();
        var repeater = this.repeater;

        repeater.$el.children()[0].classList = '';
        this.$container = this.$el.find('#' + this.id + '-container');
        this.$container.append(repeater.render());

        return this.$el;
    }
});

//component prototype
MultiSwitch.type = 'multiswitch';

//register dom element for this component
KxGenerator.registerDOMElement(MultiSwitch, 'kx-multiswitch');