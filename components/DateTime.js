/**
 * This is a DateTime Input Element
 * 
 * Kreatx 2018
 */

//component definition
var DateTime = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            enabled: true,
            blockProcessAttr: this.required ? false : this.blockProcessAttr
        }
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                }
            },
            {
                registerTo: this.$input, events: {
                    'change': this.changeHandler.bind(this),
                },
            }
        ]
    },

    changeHandler: function (e) {
        this.validate();
    },

    enable: function () {
        var model = this.getModel();
        model.enabled = true;

        return this;
    },

    disable: function () {
        var model = this.getModel();
        model.enabled = false;

        return this;
    },

    beforeAttach: function () {
        this.$input = this.$el.find("#" + this.domID);
    },

    afterAttach: function (e) {
        //init datepicker
        var _self = this;
        if (this.value != "" && this.value != null && this.value != "0000-00-00 00:00:00")
            this.value = moment(this.$input.val()).format(this.inputFormat)
        else
            this.value = ""
        
        this.$input.datepicker({
            format: {
                toDisplay: function (date, format, language) {
                    return moment(date).format(_self.displayFormat);
                },
                toValue: function (date, format, language) {
                    return moment(date).format(_self.displayFormat);
                }
            },
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            forceParse: true
        });

        this.trigger('creationComplete');
    },

    getValue: function () {
        var date = moment(this.$input.val(), this.inputFormat).format(this.outputFormat);
        return  (date == "Invalid date" || date == "") ? "" : date
    },

    setValue: function (value) {
        this.value = moment(value).format(this.inputFormat);

        this.trigger('change');
        return this;
    },

    validate: function () {
        if (this.required) {
            if (this.getValue() == "" || this.getValue() == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];

                this.$input.addClass('invalid');
                return false;
            } else {
                this.errorList = [];
                this.$input.removeClass('invalid');
                return true;  
            }
        } else
            return true;    
    },

    template: function () {         
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " resizable'>" +
                    "<div id='" + this.domID + "-block'>" + 
                        "<label rv-style='versionStyle' rv-for='id'><b>{label}</b> <span rv-if='required'>*</span></label>" + 
                        "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" + 
                            "<input type='text'" + 
                                "id='" + this.domID + "' name='" + this.domID + "' rv-value='value'" +
                                "class='form-control rowspan"+ this.rowspan +"'" +
                                "rv-placeholder='label' rv-enabled='model.enabled' autofocus/>" +
                    "</div>" +
                "</div>";    
    },
 
    render: function () {
        return this.$el;
    }
});

//component prototype
DateTime.type = 'datetime';

//register dom element for this component
KxGenerator.registerDOMElement(DateTime, 'kx-datetime');