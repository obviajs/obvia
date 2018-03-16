/**
 * This is a CheckboxGroup component
 * 
 * Kreatx 2018
 */

//component definition
var CheckBoxGroup = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    beforeAttach: function () {
        this.checkedField = "checked_"+this.id;
        this.states = [
            {dataProviderField:this.classField, states:{on:this.selectedClass, off:this.defaultClass}},
            {dataProviderField:this.checkedField, states:{on:true, off:false}}
        ];
        this.direction = this.direction==undefined||this.direction==null?'vertical':this.direction;
        this.$container = this.$el.find('#' + this.domID + '-container');
        this.multiselect = (this.multiselect!=undefined && this.multiselect!=null?this.multiselect:true);
        this.list = new List({
            id: 'list',
            colspan: '6',
            label: 'Ministrite',
            fieldName: 'list',
            states: this.states,
            blockProcessAttr: this.blockProcessAttr,
            required: this.required,
            direction: this.direction,
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
                    constructor: CheckBox,
                    props: {
                        id: 'checkBox',
                        label: "{" + this.labelField + "}",
                        value: "{" + this.valueField + "}",
                        checked: "{" + this.checkedField + "}",
                        class: "{" + this.classField + "}",
                        onclick: this.clickHandler.bind(this),
                        enabled: "{" + this.enabledField + "}",
                        embedded: true
                    }
                }
            ],
            onclick : this.onclick,
            onchange : this.onchange
        }).on('creationComplete', function (e) {
            e.stopPropagation();
            this.trigger('creationComplete');   
        }.bind(this)).on('change', function(){
            this.value = this.list.value;
        }.bind(this));
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
        return "<div id='" + this.domID + "-wrapper' class='col-lg-" + this.colspan + " resizable' style='padding-top: 10px; padding-bottom: 10px; overflow:hidden'>" +
            (!this.embedded ? ("<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                    "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                    "<br>") : "") + 
                    "<div id='" + this.domID + "-container' class='card' role='group' style='padding:10px'>" +
                        
                    "</div>"+
                "</div>";
    },

    render: function () {
        this.$container.append(this.list.render());
        return this.$el;
    }
});

//component prototype
CheckBoxGroup.type = 'checkboxgroup';

//register dom element for this component
KxGenerator.registerDOMElement(CheckBoxGroup, 'kx-checkboxgroup');

