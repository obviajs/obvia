/**
 * This is a Day Month Year Element
 *
 * Kreatx 2019
 */

var DateTimeCb = function (_props, overrided = false) {

    var startYear = 1900;
    var endYear = 2100;


    Object.defineProperty(this, "label",
        {
            get: function label() {
                return _label;
            },
            set: function label(v) {
                if (_label != v) {
                    _label = v;
                    var target = this.$el.find("label");
                    if (target) {
                        target.children(":first-child").html(v);
                    }
                }
            }
        });

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function (v) {
            var date = moment(v).format(this.inputFormat);
            _value = moment(date).format(this.outputFormat);

            if (_mode == "date") {
                this.daySelect.setValue(moment(date).date());
                this.monthSelect.setValue(moment(date).month() + 1);
                this.yearSelect.setValue(moment(date).year());
            } else if (_mode == "time") {
                this.hourSelect.setValue(moment(date).hour());
                this.minSelect.setValue(moment(date).minute());
                this.secSelect.setValue(moment(date).second());
            } else {
                this.daySelect.setValue(moment(date).date());
                this.monthSelect.setValue(moment(date).month() + 1);
                this.yearSelect.setValue(moment(date).year());
                this.hourSelect.setValue(moment(date).hour());
                this.minSelect.setValue(moment(date).minute());
                this.secSelect.setValue(moment(date).second());
            }
        }
    });

    this.beforeAttach = function () {
        this.$dateContainer = this.$el.attr('id') == this.domID ? this.$el : this.$el.find("#" + this.domID);
    };

    this.renderDaySelect = function (value = 1) {
        var dp = [];
        for (var i = 1; i < 32; i++) {
            dp.push({"value": i, "text": i})
        }
        this.daySelect = new Select({
            id: 'daySelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
            embedded: true
        });
        this.daySelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });
        return this.daySelect.render();
    };

    this.renderMonthSelect = function (value = 1) {
        var dp = [];
        
        for (var i = 1; i < 13; i++) {
            dp.push({"value": i, "text": _monthMapper[i]})
        }
        this.monthSelect = new Select({
            id: 'monthSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
            embedded: true
        });
        this.monthSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });
        return this.monthSelect.render();
    };

    this.renderYearSelect = function (value = 1) {
        var dp = [];
        for (var i = startYear; i < endYear; i++) {
            dp.push({"value": i, "text": i})
        }

        this.yearSelect = new Select({
            id: 'yearSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
            embedded: true
        });

        this.yearSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });

        return this.yearSelect.render();
    };

    this.renderHourSelect = function (value = 0) {
        var dp = [];
        for (var i = 0; i < 24; i++) {
            dp.push({"value": i, "text": i})
        }

        this.hourSelect = new Select({
            id: 'hourSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
            embedded: true
        });

        this.hourSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });
        return this.hourSelect.render();
    };

    this.renderMinSelect = function (value = 0) {
        var dp = [];
        for (var i = 0; i < 60; i++) {
            dp.push({"value": i, "text": i})
        }

        this.minSelect = new Select({
            id: 'minSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
            embedded: true
        });

        this.minSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });


        return this.minSelect.render();
    };

    this.renderSecSelect = function (value = 0) {
        var dp = [];
        for (var i = 0; i < 60; i++) {
            dp.push({"value": i, "text": i})
        }

        this.secSelect = new Select({
            id: 'secSelect-' + this.id,
            dataProvider: dp,
            textField: "text",
            valueField: "value",
            value: value,
            embedded: true
        });

        this.secSelect.on('creationComplete', function (e) {
            e.stopPropagation();
        });

        return this.secSelect.render();
    };

    this.renderDate = function (day, month, year) {
        var width = "15%";
        if (_mode == "date" || _mode == "time")
            width = "32%";

        this.$dateContainer.append("<div id='dayContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='monthContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='yearContainer-" + this.domID + "' style='width: " + width + " !important; float: left; " + (_mode == 'datetime' ? 'margin-right: 2%;' : '') + "'></div>");

        this.$dateContainer.find('#dayContainer-' + this.domID).append(this.renderDaySelect(day));
        this.$dateContainer.find('#monthContainer-' + this.domID).append(this.renderMonthSelect(month));
        this.$dateContainer.find('#yearContainer-' + this.domID).append(this.renderYearSelect(year));
        // this.yearSelect.on('creationComplete', function () {
        //     this.yearSelect.selectByText(year);
        // }.bind(this))
    };

    this.renderTime = function (hour, min, sec) {
        var width = "15%";
        if (_mode == "time")
            width = "32%";

        this.$dateContainer.append("<div id='hourContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='minContainer-" + this.domID + "' style='width: " + width + " !important; float: left; margin-right: 2%;'></div>");
        this.$dateContainer.append("<div id='secContainer-" + this.domID + "' style='width: " + width + " !important; float: left;'></div>");

        this.$dateContainer.find('#hourContainer-' + this.domID).append(this.renderHourSelect(hour));
        this.$dateContainer.find('#minContainer-' + this.domID).append(this.renderMinSelect(min));
        this.$dateContainer.find('#secContainer-' + this.domID).append(this.renderSecSelect(sec));

    };

    this.afterAttach = function (e) {
        // console.log(e);
        if (e.target.id == this.$el.attr('id') && !this.attached) {
            this.attached = true;

            var day, month, year, hour, min;
            if (_value != "" && _value != undefined) {
                var date = moment(_value).format(_inputFormat);
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

            if (_mode == "date")
                this.renderDate(day, month, year);
            else if (_mode == "time")
                this.renderTime(hour, min, sec);
            else {
                this.renderDate(day, month, year);
                this.renderTime(hour, min, sec);
            }
        }
    };

    this.validate = function () {
        if (this.required) {
            if (_value == "" || _value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];
            }
        }
    };

    this.changeHandler = function (e) {
        var date = moment();
        if (_mode == "date" && this.daySelect && this.monthSelect && this.yearSelect) {
            date.date(this.daySelect.getValue());
            date.month(this.monthSelect.getValue() - 1);
            date.year(this.yearSelect.getValue());
        } else if (_mode == "time" && this.hourSelect && this.minSelect && this.secSelect) {
            date.hour(this.hourSelect.getValue());
            date.minute(this.minSelect.getValue());
            date.second(this.secSelect.getValue());
        } else if (_mode == "datetime" && this.daySelect && this.monthSelect && this.yearSelect && this.hourSelect && this.minSelect && this.secSelect) {
            date.date(this.daySelect.getValue());
            date.month(this.monthSelect.getValue() - 1);
            date.year(this.yearSelect.getValue());
            date.hour(this.hourSelect.getValue());
            date.minute(this.minSelect.getValue());
            date.second(this.secSelect.getValue());
        }

        _value = date.format(this.outputFormat);
    };


    this.template = function () {
        return "<div data-triggers='change' id='" + this.domID + "' style='width: 100% !important; float: left;'>" +
            "</div>";
    };

    var _defaultParams = {
        id: 'dayMonthYear',
        colspan: '6',
        label: 'Date Mode 2',
        versionStyle: '',
        blockProcessAttr: false,
        required: false,
        mode: "date", //datetime, time
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD-MM-YYYY',
        value: '06/06/2006',
        monthMapper: {
            "1": "January",
            "2": "February",
            "3": "March",
            "4": "April",
            "5": "May",
            "6": "June",
            "7": "July",
            "8": "August",
            "9": "September",
            "10": "October",
            "11": "November",
            "12": "December"
        },
        afterAttach: this.afterAttach,
        change: this.changeHandler.bind(this)
    };

    _props = extend(false, false, _defaultParams, _props);
    var _label = _props.label;
    var _inputFormat = _props.inputFormat;
    var _mode = _props.mode;
    var _value = _props.value;
    var _monthMapper = _props.monthMapper;
    
    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};
DateTimeCb.prototype.ctor = "DateTimeCb";