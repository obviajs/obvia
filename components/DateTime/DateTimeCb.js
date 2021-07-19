/**
 * This is a Day Month Year Element
 *
 * Kreatx 2019
 */
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { CalendarConstants } from "/obvia/components/Calendar/CalendarConstants.js";
import { DateTimeMode } from "./DateTimeMode.js";
import { Select } from "../Select/Select.js";
import { EventDispatcher } from "../../lib/EventDispatcher.js";


var DateTimeCb = function (_props) {
    let _self = this;
    let _dpDate = DateTimeCb.dpDate, _dpMonth = DateTimeCb.dpMonth, _dpYear = DateTimeCb.dpYear, _dpHour = DateTimeCb.dpHour, _dpMinute = DateTimeCb.dpMinute, _dpSecond = DateTimeCb.dpSecond;
    let _dateSelect, _monthSelect, _yearSelect, _hourSelect, _minuteSelect, _secondSelect;
    let _cmps, _tpl;
    let _initDP = function () {
        if (!DateTimeCb.init) {
            for (let i = 1; i < 32; i++) {
                _dpDate[i - 1] = { "value": i, "label": i };
            }
            for (let i = 0; i < 13; i++) {
                _dpMonth[i] = { "value": i, "label": CalendarConstants.Months[i] };
            }

            for (let i = _startYear; i < _endYear; i++) {
                _dpYear.push({ "value": i, "label": i });
            }

            for (let i = 0; i < 24; i++) {
                _dpHour[i] = { "value": i, "label": i };
            }

            for (let i = 0; i < 60; i++) {
                _dpMinute[i] = _dpSecond[i] = { "value": i, "label": i };
            }
            DateTimeCb.init = true;
        } else {
            if (_dpYear[0] != _startYear || _dpYear[_dpYear.length - 1] != _endYear) {
                _dpYear = [];
                for (let i = _startYear; i < _endYear; i++) {
                    _dpYear.push({ "value": i, "label": i });
                }
            }
        }
    };

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function (v) {
            let date = dayjs(v).format(_inputFormat);
            let m = dayjs(date);
            _value = m.format(_outputFormat);

            _dateSelect.value = m.date();
            _monthSelect.value = m.month();
            _yearSelect.value = m.year();
            if (_hourSelect)
                _hourSelect.value = m.hour();
            if (_minuteSelect)
                _minuteSelect.value = m.minute();
            if (_secondSelect)
                _secondSelect.value = m.second();
        }
    });

    Object.defineProperty(this, "inputFormat", {
        get: function inputFormat() {
            return _inputFormat;
        },
        set: function inputFormat(v) {
            if (_inputFormat !== v) {
                _inputFormat = v;
                this.value = _value.format(_inputFormat);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "outputFormat", {
        get: function outputFormat() {
            return _outputFormat;
        },
        set: function outputFormat(v) {
            if (_outputFormat !== v) {
                _outputFormat = v;
                //this.value = _value;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "mode", {
        get: function mode() {
            return _mode;
        },
        set: function mode(v) {
            if (_mode != v) {
                _mode = v;
                if (_mode & 1 > 0) {
                    _hourSelect.visible = true;
                } else
                    _hourSelect.visible = false;
                if (_mode & 2 > 0) {
                    _minuteSelect.visible = true;
                } else
                    _minuteSelect.visible = false;
                if (_mode & 3 > 0) {
                    _secondSelect.visible = true;
                } else
                    _secondSelect.visible = false;
            }
        },
        enumerable: true
    });


    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {

            //e.preventDefault();
        }
    };
    //TODO: ti kapim me dot notation, gjithashtu edhe te 
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _dateSelect = this.cntDs.dateSelect;
            _monthSelect = this.cntMs.monthSelect;
            _yearSelect = this.cntYs.yearSelect;
            _hourSelect = this.cntHs.hourSelect;
            _minuteSelect = this.cntIs.minuteSelect;
            _secondSelect = this.cntSs.secondSelect;
            EventDispatcher.listen([_dateSelect, _monthSelect, _yearSelect, _hourSelect, _minuteSelect, _secondSelect], "change", _change);
        }
        console.log("endDraw");
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.value) {
                this.value = _props.value;
            }
        }
    };

    let _change = function (e) {
        let date = dayjs();
        date.date(_dateSelect.value);
        date.month(_monthSelect.value);
        date.year(_yearSelect.value);
        if (_hourSelect)
            date.hour(_hourSelect.value);
        if (_minuteSelect)
            date.minute(_minuteSelect.value);
        if (_secondSelect)
            date.second(_secondSelect.value);
        _value = date.format(_outputFormat);
    };

    let fnContainerDelayInit = function () {
        _cmps =
            [
                {
                    "ctor": Container,
                    "props": {
                        type: "",
                        "id": "cntDs",
                        "components": [
                            {
                                "ctor": Select,
                                "props": {
                                    "id": "dateSelect",
                                    "dataProvider": _dpDate,
                                    labelField: "label",
                                    valueField: "value"
                                }
                            }
                        ]
                    }
                },
                {
                    "ctor": Container,
                    "props": {
                        type: "",
                        "id": "cntMs",
                        "components": [
                            {
                                "ctor": Select,
                                "props": {
                                    "id": "monthSelect",
                                    "dataProvider": _dpMonth,
                                    labelField: "label",
                                    valueField: "value"
                                }
                            }
                        ]
                    }
                },
                {
                    "ctor": Container,
                    "props": {
                        type: "",
                        "id": "cntYs",
                        "components": [
                            {
                                "ctor": Select,
                                "props": {
                                    "id": "yearSelect",
                                    "dataProvider": _dpYear,
                                    labelField: "label",
                                    valueField: "value"
                                }
                            }
                        ]
                    }
                },
                {
                    "ctor": Container,
                    "props": {
                        type: "",
                        "id": "cntHs",
                        classes: ["pl-1"],
                        "components": [
                            {
                                "ctor": Select,
                                "props": {
                                    "id": "hourSelect",
                                    "dataProvider": _dpHour,
                                    labelField: "label",
                                    valueField: "value"
                                }
                            }
                        ]
                    }
                },
                {
                    "ctor": Container,
                    "props": {
                        type: "",
                        "id": "cntIs",
                        "components": [
                            {
                                "ctor": Select,
                                "props": {
                                    "id": "minuteSelect",
                                    "dataProvider": _dpMinute,
                                    labelField: "label",
                                    valueField: "value"
                                }
                            }
                        ]
                    }
                },
                {
                    "ctor": Container,
                    "props": {
                        type: "",
                        "id": "cntSs",
                        "components": [
                            {
                                "ctor": Select,
                                "props": {
                                    "id": "secondSelect",
                                    "dataProvider": _dpSecond,
                                    labelField: "label",
                                    valueField: "value"
                                }
                            }
                        ]
                    }
                }
            ];

        let parts = {};
        if (_mode & 1 > 0) {
            _cmps[3].props.visible = true;
        }
        if (_mode & 2 > 0) {
            _cmps[4].props.visible = true;
        }
        if (_mode & 3 > 0) {
            _cmps[5].props.visible = true;
        }
    };

    let _defaultParams = {
        id: 'dayMonthYear',
        mode: DateTimeMode.DATE,
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD-MM-YYYY',
        value: '06/06/2006',
        startYear: 1900,
        endYear: 2100,
        type: "",
        classes: ["d-flex"]
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _mode = _props.mode;
    let _value = _props.value;
    let _startYear = _props.startYear;
    let _endYear = _props.endYear;

    _initDP();
    fnContainerDelayInit();
    _props.components = _cmps;

    let r = Container.call(this, _props, true);
    return r;
};
DateTimeCb.prototype.ctor = "DateTimeCb";
DateTimeCb.init = false;
DateTimeCb.dpDate = new Array(31);
DateTimeCb.dpMonth = new Array(12);
DateTimeCb.dpYear = new Array();
DateTimeCb.dpHour = new Array(24);
DateTimeCb.dpMinute = DateTimeCb.dpSecond = new Array(60);
export {
    DateTimeCb
};