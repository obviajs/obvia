/**
 * This is a Day Month Year Element
 * 
 * Kreatx 2018
 */

//component definition
var DateTimeCb = KxGenerator.createComponent({
    startYear: 1900,

    endYear: 2100,

    //inner component data
    initModel: function () {
        return {
            label: this.label + ((this.mode == "date") ? " (Dite/Muaj/Vit)" :
                (this.mode == "time") ? " (Ore/min/sek)" : " (Dite/Muaj/Vit Ore/min/sek)"),
            blockProcessAttr: this.required ? false : this.blockProcessAttr
        }
    },

    beforeAttach: function () {
        this.$dateContainer = this.$el.find("#dateContainer-" + this.domID);
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                }
            },
            {
                registerTo: this.$dateContainer, events: {
                    'change': this.changeHandler.bind(this),
                }
            }
        ]
    },

    enable: function () {
        if (this.mode == "date") {
            this.daySelect.enable();
            this.monthSelect.enable();
            this.yearSelect.enable();
        } else if (this.mode == "time") {
            this.hourSelect.enable();
            this.minSelect.enable();
            this.secSelect.enable();
        } else {
            this.daySelect.enable();
            this.monthSelect.enable();
            this.yearSelect.enable();

            this.hourSelect.enable();
            this.minSelect.enable();
            this.secSelect.enable();
        }

        return this;
    },

    disable: function () {
        if (this.mode == "date") {
            this.daySelect.disable();
            this.monthSelect.disable();
            this.yearSelect.disable();
        } else if (this.mode == "time") {
            this.hourSelect.disable();
            this.minSelect.disable();
            this.secSelect.disable();
        } else {
            this.daySelect.disable();
            this.monthSelect.disable();
            this.yearSelect.disable();

            this.hourSelect.disable();
            this.minSelect.disable();
            this.secSelect.disable();
        }

        return this;
    },

    renderDaySelect: function (value = 1) {
        var dp = [];
        for (var i = 1; i < 32; i++){
            dp.push({ "value": i, "text": i })
        }

        this.daySelect = new Select({
            id: 'daySelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        });

        this.daySelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });


        return this.daySelect.render();
    },

    renderMonthSelect: function (value = 1) {
        var dp = [];
        var monthMapper = {"1": "Janar", "2": "Shkurt", "3": "Mars", "4": "Prill", "5": "Maj", "6": "Qershor", "7": "Korrik", "8": "Gusht", "9": "Shtator", "10": "Tetor", "11": "Nentor", "12": "Dhjetor"}
        for (var i = 1; i < 13; i++) {
            dp.push({ "value": i, "text": monthMapper[i] })
        }

        this.monthSelect = new Select({
            id: 'monthSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        });

        this.monthSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });


        return this.monthSelect.render();
    },

    renderYearSelect: function (value = 1) {
        var dp = [];
        for (var i = this.startYear; i < this.endYear; i++) {
            dp.push({ "value": i, "text": i })
        }

        this.yearSelect = new Select({
            id: 'yearSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        });

        this.yearSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });


        return this.yearSelect.render();
    },

    renderHourSelect: function (value = 0) {
        var dp = [];
        for (var i = 0; i < 24; i++) {
            dp.push({ "value": i, "text": i })
        }

        this.hourSelect = new Select({
            id: 'hourSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        });

        this.hourSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });


        return this.hourSelect.render();
    },

    renderMinSelect: function (value = 0) {
        var dp = [];
        for (var i = 0; i < 60; i++) {
            dp.push({ "value": i, "text": i })
        }

        this.minSelect = new Select({
            id: 'minSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        });

        this.minSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });


        return this.minSelect.render();
    },

    renderSecSelect: function (value = 0) {
        var dp = [];
        for (var i = 0; i < 60; i++) {
            dp.push({ "value": i, "text": i })
        }

        this.secSelect = new Select({
            id: 'secSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
        });

        this.secSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });

        return this.secSelect.render();
    },

    renderDate: function (day, month, year) {
        var width = "15%";
        if (this.mode == "date" || this.mode == "time")
            width = "32%";    

        this.$dateContainer.append("<div id='dayContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='monthContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='yearContainer-" + this.domID + "' style='width: " + width + " !important; float: left; " + (this.mode == 'datetime' ? 'margin-right: 2%;' : '') + "'></div>");
    
        this.$dateContainer.find('#dayContainer-' + this.domID).append(this.renderDaySelect(day));
        this.$dateContainer.find('#monthContainer-' + this.domID).append(this.renderMonthSelect(month));
        this.$dateContainer.find('#yearContainer-' + this.domID).append(this.renderYearSelect());
        this.yearSelect.on('creationComplete', function () {
            this.yearSelect.selectByText(year);
        }.bind(this))
    },

    renderTime: function (hour, min, sec) {
        var width = "15%";
        if (this.mode == "time")
            width = "32%";  
        
        this.$dateContainer.append("<div id='hourContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='minContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='secContainer-" + this.domID + "' style='width: " + width + " !important; float: left;'></div>");

        this.$dateContainer.find('#hourContainer-' + this.domID).append(this.renderHourSelect(hour));
        this.$dateContainer.find('#minContainer-' + this.domID).append(this.renderMinSelect(min));
        this.$dateContainer.find('#secContainer-' + this.domID).append(this.renderSecSelect(sec));

    },

    attached: false,

    afterAttach: function (e) {
        // console.log(e);
        if (e.target.id == this.domID + '-wrapper' && !this.attached) {
            this.attached = true;

            var day, month, year, hour, min;
            if (this.value != "" && this.value != undefined) {
                var date = moment(this.value).format(this.inputFormat);
                day = moment(date).date();
                month = moment(date).month() + 1;
                year = moment(date).year();
                hour = moment(date).hour();
                min = moment(date).minute();
                sec = moment(date).second();
            } else {
                day = 1;
                month = 1;
                year = moment().year();
                hour = 0;
                min = 0;
                sec = 0;
            }
            // console.log("Date (", this.inputFormat , ") ", date, "-> ", "day:", day, " month:", month, " year:", year, " hour:", hour, " min:", min)  

            if (this.mode == "date")
                this.renderDate(day, month, year);
            else if (this.mode == "time")
                this.renderTime(hour, min, sec);
            else {
                this.renderDate(day, month, year);
                this.renderTime(hour, min, sec);
            }

            // console.log('here');
            this.trigger('creationComplete');
        }
    },

    changeHandler: function (e) {
        var date = moment();
        if (this.mode == "date" && this.daySelect && this.monthSelect && this.yearSelect) {
            date.date(this.daySelect.getValue());
            date.month(this.monthSelect.getValue() - 1);
            date.year(this.yearSelect.getValue());
        } else if (this.mode == "time" && this.hourSelect && this.minSelect && this.secSelect) {
            date.hour(this.hourSelect.getValue());
            date.minute(this.minSelect.getValue());
            date.second(this.secSelect.getValue());
        } else if (this.mode == "datetime" && this.daySelect && this.monthSelect && this.yearSelect && this.hourSelect && this.minSelect && this.secSelect) {
            date.date(this.daySelect.getValue());
            date.month(this.monthSelect.getValue() - 1);
            date.year(this.yearSelect.getValue());
            date.hour(this.hourSelect.getValue());
            date.minute(this.minSelect.getValue());
            date.second(this.secSelect.getValue());
        }
    
        this.value = date.format(this.outputFormat);  
    },

    setValue: function (value) {
        var date = moment(value).format(this.inputFormat);
        this.value = moment(date).format(this.outputFormat); 

        if (this.mode == "date") {
            this.daySelect.setValue(moment(date).date());
            this.monthSelect.setValue(moment(date).month() + 1);
            this.yearSelect.selectByText(moment(date).year());
        } else if (this.mode == "time") {
            this.hourSelect.setValue(moment(date).hour());
            this.minSelect.setValue(moment(date).minute());
            this.secSelect.setValue(moment(date).second());
        } else {
            this.daySelect.setValue(moment(date).date());
            this.monthSelect.setValue(moment(date).month() + 1);
            this.yearSelect.selectByText(moment(date).year());
            this.hourSelect.setValue(moment(date).hour());
            this.minSelect.setValue(moment(date).minute());
            this.secSelect.setValue(moment(date).second());
        }

        return this;
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
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable'>" +
                    "<div id='" + this.domID + "-block'>" + 
                        "<label rv-style='versionStyle' rv-for='domID'><b>{model.label}</b> <span rv-if='required'>*</span></label>" + 
                        "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" + 
                            "<div id='dateContainer-" + this.domID + "' style='width: 100% !important; float: left;'>" + 
                            
                            "</div>" +
                    "</div>" +
                "</div>";    
    },
 
    render: function () {
        return this.$el;
    }
});

//component prototype
DateTimeCb.type = 'datetime_cb';

//register dom element for this component
KxGenerator.registerDOMElement(DateTimeCb, 'kx-datetimecb');