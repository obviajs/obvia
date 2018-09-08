/**
 * This is an AutoComplete Element
 * 
 * Kreatx 2018
 */

//component definition
var AutoComplete = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    beforeAttach: function () {
        this.$input = this.$el.attr('id') == this.domID?this.$el:this.$el.find("#" + this.domID);
        this.$select2Instance = null;
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$input, events: {
                    'change': this.handleChange.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        if (e.target.id == this.$el.attr('id')) {
            this.renderSelect2();
        }
    },

    handleChange: function (e) {
        var _self = this;
        this._value = [];
        if (this.$select2Instance.select2('data').length > 0)
            this.$select2Instance.select2('data').forEach(function (item) {
                var option = this.dataProvider.filter(function (option) {
                    return option[_self.valueField] == item[_self.valueField];
                });
                this._value.push(option[0]);
            }.bind(this));

        this.validate();
    },

    renderSelect2: function () {
        var _self = this;

        this.$select2Instance = this.$input.select2({
            multiple: this.multipleSelection,
            placeholder: 'Search',
            allowClear: true,
            data: this.dataProvider.map(function (item) {
                return extend({
                    id: item[_self.valueField],
                    text: item[_self.labelField]
                }, item);
            }),
            separator: ',',
            width: '100%',
        });

        if (this._value == "" || this._value == undefined || typeof this._value === 'string' || this._value instanceof String)
            this._value = [];    
        this.$input.val(this._value.map(function (item) { return item[_self.valueField] })).trigger('change');

        this.trigger('creationComplete');
    },

    validate: function () {
        if (this.required && this._value.length == 0) {
            this.errorList = [
                KxGenerator.getErrorList().call(this)['empty']
            ];

            this.$el.find('.select2-selection__rendered').addClass('invalid');
            return false;
        } else {
            this.errorList = [];
            this.$el.find('.select2-selection__rendered').removeClass('invalid');
            return true;
        }
    },

    get value(){
        return this._value;
    },
    set value(value){
        if(!(differenceOnKeyMatch (value, this._value, this.valueField).length==0)){
            
            if(value==undefined || value==null){
                value = [];
            }else if (typeof value === "string" || value instanceof String){
                v = {};
                v[this.valueField] = value;
                value = [v];
            }else if(typeof(value)==="object" && !(value instanceof Array)){
               value = [value];
            }else if(!(typeof(value)==="object" && (value instanceof Array))){
                v = {};
                v[this.valueField] = value;
                value = [v];
            }
            
            value = intersectOnKeyMatch(this.dataProvider, value, this.valueField) //value;
           //TODO: Add a property allowNew in order to check if above result is null whether to add the new value or not
           // if allowNew wwill be tru, we will also add this value to dataProvider

            if(this.$input!=undefined){
                var _self = this;
                this.$input
                    .val(value.map(function (item) { return item[_self.valueField] }))
                    .trigger('change');
            }
            this._value = value;    
        }    
    },
    focus:function(){
        if(this.$select2Instance != null)
        {
            this.$select2Instance.select2('open').select2('close');
        }
    },
    destruct: function () {
        this.$select2Instance.select2('destroy');
        this.$el.remove();
    },

    enable: function () {
        this.$input.prop("disabled", false);
        this.enabled = true;
        return this;
    },

    disable: function () {
        this.$input.prop("disabled", true);
        this.enabled = false;
        return this;
    },

    template: function () {
        var html = 
        //(!this.embedded?("<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable'>") : "") +
                        "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable'>"+
        (!this.embedded?("<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>") : "") +
        (!this.embedded?("<span rv-if='model.blockProcessAttr' class='block-process'> * </span>") : "") +
                        "<select type='hidden' name='" + this.domID + "[]' id='" + this.domID + "'></select>" +   
                        "</div>"                 
        //(!this.embedded?("</div>") : "");
        return html;        
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
AutoComplete.type = 'autocomplete';

//register dom element for this component
KxGenerator.registerDOMElement(AutoComplete, 'kx-autocomplete');