/**
 * This is a Day Month Year Element
 * 
 * Kreatx 2018
 */

//component definition
var DayMonthYear = KxGenerator.createComponent({
    startYear: 1900,

    endYear: 2100,

    //inner component data
    initModel: function () {
        return {
            enabled: true,
            blockProcessAttr: this.required ? false : this.blockProcessAttr
        }
    },

    registerEvents: function () {
        this.$dateContainer = this.$el.find("#dateContainer-" + this.domID);

        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
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

    renderDaySelect: function (value = 1) {
        var dp = [];
        for (var i = 1; i < 32; i++){
            dp.push({ "value": i, "text": i })
        }

        return (new Select({
            id: 'daySelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        })).render()
    },

    renderMonthSelect: function (value = 1) {
        var dp = [];
        var monthMapper = {"1": "Janar", "2": "Shkurt", "3": "Mars", "4": "Prill", "5": "Maj", "6": "Qershor", "7": "Korrik", "8": "Gusht", "9": "Shtator", "10": "Tetor", "11": "Nentor", "12": "Dhejtor"}
        for (var i = 1; i < 13; i++) {
            dp.push({ "value": (i < 10) ? ("0" + i) : i, "text": monthMapper[i] })
        }

        return (new Select({
            id: 'monthSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        })).render()
    },

    renderYearSelect: function (value = 1) {
        var dp = [];
        for (var i = this.startYear; i < this.endYear; i++) {
            dp.push({ "value": i, "text": i })
        }

        return (new Select({
            id: 'yearSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        })).render()
    },

    afterAttach: function (e) {
        if (e.target.id == this.domID + '-wrapper') {
            var day, month, year;
            if (this.value != "") {
                var date = moment(this.value).format(this.inputFormat);
                day = moment(date).date();
                month = moment(date).month()
                year = moment(date).year()
            } else {
                day = 1;
                month = 1;
                year = 1;
            }
                

            this.$day = this.renderDaySelect(day);
            this.$month = this.renderMonthSelect(month);
            this.$year = this.renderYearSelect(year);

            this.$dateContainer.append("<div id='dayContainer-" + this.domID + "' style='width: 30% !important; float: left; padding-right: 5px;'></div>");
            this.$dateContainer.append("<div id='monthContainer-" + this.domID + "' style='width: 30% !important; float: left; padding-right: 5px;'></div>");
            this.$dateContainer.append("<div id='yearContainer-" + this.domID + "' style='width: 30% !important; float: left; padding-right: 5px;'></div>");
            this.$dateContainer.find('#dayContainer-' + this.domID).append(this.$day);
            this.$dateContainer.find('#monthContainer-' + this.domID).append(this.$month);
            this.$dateContainer.find('#yearContainer-' + this.domID).append(this.$year);

            this.trigger('creationComplete');
        }
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
                    "<div class='form-group col-lg-" + this.colspan + "' rowspan" + this.rowspan + " resizable' id='" + this.domID + "-container'>" +
                        "<div id='" + this.domID + "-block'>" + 
                            "<label rv-style='versionStyle' rv-for='domID'>{label} <span rv-if='required'>*</span></label>" + 
                            "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" + 
                                "<div id='dateContainer-" + this.domID + "' style='width: 100% !important; float: left;'>" + 
                                
                                "</div>" +
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