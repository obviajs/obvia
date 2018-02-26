/**
 * This is a CheckboxGroup component
 * 
 * Kreatx 2018
 */

//component definition
var CheckboxGroup = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    beforeAttach: function () {
        this.$container = this.$el.find('#' + this.domID + '-container');

        this.repeater = new Repeater({
            id: 'multiswitchRepeater',
            rendering: {
                direction: 'vertical',
                seperator: false,
                actions: false
            },
            dataProvider: this.dataProvider,
            components: [
                {
                    constructor: CheckBox,
                    props: {
                        id: 'checkBox',
                        label: "{" + this.labelField + "}",
                        value: "{" + this.valueField + "}",
                        checked: "{" + this.checkedField + "}",
                        class: "{" + this.classField + "}",
                        onclick: this.clickHandler.bind(this),
                        enabled: "{" + this.enabledField + "}",
                    }
                }
            ]
        });

        this.setValue(this.value, false);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            }
        ];
    },

    afterAttach: function (e) {
        this.repeater.on('creationComplete', function () {
            this.trigger('creationComplete');   
        }.bind(this));
    },

    setValue: function (value, manualRender = true) {
        this.value = value;

        //add correct rendering classes
        this.dataProvider.forEach(function (item, index) {
            item["buttonClass"] = this.defaultClass;

            if (manualRender)
                for (var cmp in this.repeater.rowItems[index]) {
                    this.repeater.rowItems[index][cmp]["class"] = this.defaultClass;
                }
            
            this.value.forEach(function (valueItem) {
                if (valueItem[this.valueField] == item[this.valueField]) {
                    item["buttonClass"] = this.selectedClass;

                    var dpIndex;
                    this.dataProvider.forEach(function (itemDp, indexDp) {
                        if (itemDp[this.valueField] == valueItem[this.valueField]) {
                            dpIndex = indexDp;
                            return false;
                        }
                    }.bind(this));

                    if (manualRender)
                        for (var cmp in this.repeater.rowItems[dpIndex]) {
                            this.repeater.rowItems[dpIndex][cmp]["class"] = this.selectedClass;
                        }

                    return false;
                }
            }.bind(this));

        }.bind(this));

        this.$el.trigger('change');

        return this;
    },

    clickHandler: function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
        
        if(!e.isDefaultPrevented()){
            this.handleButtonClick.apply(this, arguments);
        }
    },

    handleButtonClick: function (e, repeaterEventArgs) {
        var button = repeaterEventArgs.currentRow["button"];
        var index = repeaterEventArgs.currentIndex;
        
        //toggle class
        button.class == this.defaultClass ? button.class = this.selectedClass : button.class = this.defaultClass;
        
        var arrValueIndex = indexOfObject(this.value, this.valueField,  repeaterEventArgs.currentItem[this.valueField]);         
        if (this.multiselect) {
            //allow multiple selects
            //toggle class
            if (arrValueIndex==-1) {
                 //get + push dp row
                this.value.push(this.dataProvider[index]);
            } else {
                this.value.splice(arrValueIndex, 1);
            }
                  
        } else {
            this.dataProvider.forEach(function (item, i) {
                if((index == i && arrValueIndex!=-1) || index != i){
                    for(var cmp in this.repeater.rowItems[i]) {
                        this.repeater.rowItems[i][cmp].$btn.removeClass(this.selectedClass);
                        this.repeater.rowItems[i][cmp].$btn.addClass(this.defaultClass);
                    }
                }
            }.bind(this));

            if (arrValueIndex==-1) {
                this.value = [this.dataProvider[index]]
            }else{
                this.value = [];
            }
        }

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
        this.repeater.$el.children()[0].classList = '';
        this.$container.append(this.repeater.render());

        return this.$el;
    }
});

//component prototype
CheckboxGroup.type = 'checkboxgroup';

//register dom element for this component
KxGenerator.registerDOMElement(CheckboxGroup, 'kx-checkboxgroup');

