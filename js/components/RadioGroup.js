/**
 * This is a ComboBox/Dropdown Element
 * 
 * Kreatx 2018
 */

//component definition
var RadioGroup = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        };
    },

    beforeAttach: function () {
        this.$radioGroup = this.$el.find('.radiogroup');

        this.repeater = new Repeater({
            id: 'radioRepeater',
            defaultItem: {
                text: 'Radio',
            },
            rendering: {
                direction: 'vertical',
                seperator: false,
                actions: false
            },
            dataProvider: this.dataProvider,
            components: [
                {
                    constructor: RadioButton,
                    props: {
                        id: 'radio',
                        value: "{" + this.valueField + "}",
                        label: "{" + this.labelField + "}",
                        onclick: this.clickHandler.bind(this) 
                    }
                }
            ]
        });
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            }
        ]
    }, 

    afterAttach: function (e) {
        this.repeater.on('creationComplete', function () {
            this.trigger('creationComplete');
        }.bind(this));
    },

    setValue: function (value) {
        this.value = value;

        this.dataProvider.forEach(function (item, index) { 
            if (this.value == item[this.valueField]) {
                this.repeater["radio"][index].setModelValue('checked', this.value)
            } else {
                this.repeater["radio"][index].setModelValue('checked', false)
            }
        }.bind(this));

        this.trigger('change');

        return this;
    },

    clickHandler: function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);

        if (!e.isDefaultPrevented()) {
            this.handleComponentClick.apply(this, arguments);
        }
    },

    handleComponentClick: function (e, repeaterEventArgs) {
        var radio = repeaterEventArgs.currentRow["radio"];
        var index = repeaterEventArgs.currentIndex;

        this.setValue(this.dataProvider[index][this.valueField]);
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
                    "<div class='form-group col-lg-" + this.colspan + " rowspan" + this.rowspan + " resizable' id='" + this.domID + "_container'>" +
                        "<div id=id='" + this.domID + "-block'>" +
                            "<label rv-style='versionStyle' rv-for='domID'>{label}<span rv-if='required'>*</span></label>" +
                            "<div class='radiogroup panel panel-default' style='padding:10px;'>" +
                    
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>"; 
    },

    render: function () {
        this.repeater.$el.children()[0].classList = '';
        this.$radioGroup.append(this.repeater.render());

        return this.$el;
    }
});

//component prototype
RadioGroup.type = 'radiogroup';
//register dom element for this component
KxGenerator.registerDOMElement(RadioGroup, 'kx-radiogroup');

