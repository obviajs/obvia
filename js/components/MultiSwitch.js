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
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    beforeAttach: function () {
        this.$container = this.$el.find('#' + this.domID + '-container');

        this.list = new List({
            id: 'list',
            colspan: '6',
            label: 'Ministrite',
            fieldName: 'list',
            blockProcessAttr: this.blockProcessAttr,
            required: true,
            direction: 'horizontal',
            multiselect: this.multiselect,
            dataProvider: this.dataProvider,
            valueField: this.valueField,
            labelField: this.labelField,
            classField: this.classField,
            defaultClass: this.defaultClass,
            selectedClass: this.selectedClass,  
            value: this.value,
            embedded: true,        
            components: [
                {
                    constructor: Button,
                    props: {
                        id: 'button',
                        type: "button",
                        value: "{" + this.labelField + "}",
                        class: "{" + this.classField + "}",
                        style: "float: left; border-radius: 0px",
                        onclick: this.clickHandler.bind(this),
                        embedded: true  
                    }
                }
            ],
            onclick : this.onclick,
            onchange : this.onchange
        }).on('creationComplete', function () {
            this.trigger('creationComplete');   
        }.bind(this));
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            }
            // ,
            // {
            //     registerTo: this.list, events: {
            //         'change': this.changeHandler.bind(this)
            //     }
            // }
        ];
    },

    afterAttach: function (e) {
    
    },

    setValue: function (value) {
        this.value = value;
        this.list.setValue(value);        
        this.trigger('change');
        return this;
    },
    changeHandler : function(e){
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
    },
    clickHandler: function (e) {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },

    enable: function () {         
        this.list.enable();
        return this; 
    },

    disable: function () {
        this.list.disable();
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
        this.$container.append(this.list.render());
        return this.$el;
    }
});

//component prototype
MultiSwitch.type = 'multiswitch';

//register dom element for this component
KxGenerator.registerDOMElement(MultiSwitch, 'kx-multiswitch');