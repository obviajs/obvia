/**
 * This is a Day Month Year Element
 * 
 * Kreatx 2018
 */

//component definition
var DayMonthYear = KxGenerator.createComponent({
    //inner component data
    initModel: function () {
        return {
            enabled: true,
            blockProcessAttr: this.required ? false : this.blockProcessAttr
        }
    },

    registerEvents: function () {
        this.$input = this.$el.find("#" + this.domID);

        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                }
            },
            {
                registerTo: this.$input, events: { 
                    'dp.change': this.changeHandler.bind(this),
                }
            }
        ]
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

    afterAttach: function (e) {
        //init datepicker
        this.$input.datetimepicker({
            format: 'DD/MM/YYYY',
            // minDate: '01/01/1900',
            // maxDate: '01/01/2100',
            showTodayButton: true,
            showClear: true,
            widgetPositioning: {
                horizontal: 'left',
                vertical: 'auto'
            }
        });

        this.trigger('creationComplete');
    },

    changeHandler: function () {
     
    },

    validate: function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
                return false;
            } else
                return true;    
        } else
            return true;    
    },

    template: function () {         
        return  "<div id='" + this.domID + "-wrapper'>" +
                    "<div class='form-group col-lg-" + this.colspan + "' resizable'>" +
                        "<div id='" + this.domID + "-block'>" + 
                            "<label rv-style='versionStyle' rv-for='id'>{label} <span rv-if='required'>*</span></label>" + 
                            "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" + 
                                "<input type='text'" + 
                                    "id='" + this.domID + "' name='" + this.domID + "' rv-value='value'" +
                                    "class='form-control rowspan"+ this.rowspan +"'" +
                                    "rv-placeholder='label' rv-enabled='model.enabled' autofocus/>" +
                        "</div>" +
                    "</div>" + 
                "</div>";    
    },
 
    render: function () {
        return this.$el;
    }
});

//component prototype
DayMonthYear.type = 'day_month_year';

//register dom element for this component
KxGenerator.registerDOMElement(DayMonthYear, 'kx-daymonthyear');