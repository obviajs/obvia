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
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required,

            repeater: new Repeater({
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
                dataProvider: {
                    items: this.dataProvider
                },
                components: [
                    {
                        constructor: Button,
                        props: {
                            id: 'buttonR',
                            type: "button",
                            value: "{text}",
                            class: "{buttonClass}",
                            style: "float: left; border-radius: 0px",
                            onclick: this.handleButtonClick.bind(this)
                        }
                    }
                ]
            })
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
            item["buttonClass"] = _self.defaultClassField;
            
            if(manualRender)
                for(var cmp in model.repeater.rowItems[index]) {
                    model.repeater.rowItems[index][cmp].setModelValue("class", _self.defaultClassField);
                }
            
            _self.value.forEach(function (valueItem) {
                if (valueItem[_self.valueField] == item[_self.valueField]) {
                    item["buttonClass"] = _self.selectedClassField;
                    
                    var dpIndex;
                    _self.dataProvider.forEach(function (itemDp, indexDp) {
                        if (itemDp[_self.valueField] == valueItem[_self.valueField]) {
                            dpIndex = indexDp;
                            return false;
                        }
                    });

                    if (manualRender)
                        for(var cmp in model.repeater.rowItems[dpIndex]) {
                            model.repeater.rowItems[dpIndex][cmp].setModelValue("class", _self.selectedClassField);
                        }

                    return false;
                }
            });

        });

        return this;
        
    },

    beforeAttach: function () {
        this.setValue(this.value, false);
    },

    handleButtonClick: function (e, index, button, repeater) {
        var _self = this;
        
        if (this.multiselect) {
            //allow multiple selects
            //toggle class
            if (button.getModelValue("class") == this.defaultClassField) {
                button.setModelValue("class", this.selectedClassField);
                //get + push dp row
                this.value.push(this.dataProvider[index]);
            } else {
                button.setModelValue("class", this.defaultClassField);  
                //delete value
                var dpVal = this.dataProvider[index][this.valueField];

                this.value.forEach(function (item, valueIndex) {
                    if (item[_self.valueField] == dpVal) {
                        _self.value.splice(valueIndex, 1);
                        return false;
                    }
                });
            }
                  
        } else {
            //disallow multiple selects
            if (button.getModelValue("class") == this.defaultClassField) {
                for(var row in repeater.rowItems) {
                    for(var cmp in repeater.rowItems[row]) {
                        repeater.rowItems[row][cmp].setModelValue("class", this.defaultClassField);
                    }
                }

                button.setModelValue("class", this.selectedClassField);
            } 

            this.value = [this.dataProvider[index]]
        }
    },

    template: function () {
        return "<div id='" + this.id + "'>" +
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
        var repeater = model.repeater;

        repeater.$el.children()[0].classList = '';
        this.$el.find('#' + this.id + '-container').append(repeater.render());

        return this.$el;
    }
});

//component prototype
MultiSwitch.type = 'multiswitch';

//register dom element for this component
KxGenerator.registerDOMElement(MultiSwitch, 'kx-multiswitch');