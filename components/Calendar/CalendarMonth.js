/**
 * This is a Calendar Component
 * 
 * Kreatx 2019
 */
import { CalendarBase } from "/obvia/components/Calendar/CalendarBase.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { Container } from "/obvia/components/Container.js";
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { dayjs } from "/obvia/lib/dependencies/dayjs/dayjs.min.js";

var CalendarMonth = function (_props)
{
    let _self = this;

    Object.defineProperty(this, "nowMonth", {
        get: function nowMonth()
        {
            return _nowMonth;
        }
    });

    this.afterAttach = function (e)
    {
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
    };

    let _defaultParams = {
        dataProvider: [],
        labelField: 'label',
        labelField1: 'label',
        classField1: " ",
        guidField: "guid",
        classField: " ",
        startField: " ",
        descriptionField: "description",
        nowMonth: new Date().getMonth(),
        eventsField: "cellEvents",
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm',
        internalFormat: "YYYY-MM-DD"
    };

    let _intervalToIndex = {};
    let _intervalFromDate = function (currentValue)
    {
        return dayjs(currentValue[_self.startDateTimeField], _self.inputFormat).format(_self.internalFormat);
    };

    this.fillEvents = function ()
    {
        let groupedEvents = _self.calendarEvents.groupReduce(_intervalFromDate);
        let today = _self.nowDate.getDate();
        let currentMonth = _self.nowDate.getMonth();
        let currentYear = _self.nowDate.getFullYear();
        let dp = [];
        let selected = false;
        let days_in_month = [31, (DateUtils.isLeapYear(currentYear) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // leap year?
        let _getLastMonth = function (d)
        {
            if (d.getMonth() == 0)
            {
                return 11
            } else
            {
                return d.getMonth() - 1;
            }
        };
        let _daysInMonth = function (iMonth, iYear)
        {
            return 32 - new Date(iYear, iMonth, 32).getDate();
        };

        let previousDaysofMonth = new Date((currentMonth + 1) + "/1/" + currentYear);
        let previousDay = previousDaysofMonth.getDay();
        let lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDay();
        if (previousDay == 0)
        {
            previousDay = 7;
        }
        let prevMonth = _getLastMonth(_self.nowDate);
        for (let i = 1; i < previousDay; i++)
        {
            let j = days_in_month[prevMonth] - ((previousDay - 1) - i);
            _self.calendarStartDate = new Date(currentMonth + "/" + (days_in_month[prevMonth] - ((previousDay - 2))) + "/" + currentYear);
            let m = prevMonth + 1;
            let m_content = m;
            if (m <= 9)
            {
                m_content = '0' + m;
            }

            let dp1 = {
                "value": j,
                "selected": selected,
                "classField": ["fc-past-days"],
                "dateContent": currentYear + "-" + m_content + "-" + j
            };
            dp1[_eventsField] = new ArrayEx([]);
            dp1[_guidField] = StringUtils.guid();
            let data_controll_past = currentYear + "-" + m_content + "-" + j;
            if (data_controll_past in groupedEvents)
            {
                dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_past]);
            }
            _intervalToIndex[data_controll_past] = dp.push(dp1) - 1;
        }
        let daysInMonth = _daysInMonth(currentMonth, currentYear);
        for (let i = 1; i <= daysInMonth; i++)
        {
            let iterationday = new Date(currentYear, currentMonth, i).getDay();
            let mm = currentMonth + 1;
            let mm_content = mm;
            if (mm <= 9)
            {
                mm_content = '0' + mm;
            }
            let i_content = i;
            if (i <= 9)
            {
                i_content = '0' + i;
            }
            if (today == i && _nowMonth == currentMonth)
            {
                let dp1 = {
                    "value": i,
                    "selected": true,
                    "classField": ["fc-state-highlight"],
                    "dateContent": currentYear + '-' + mm_content + '-' + i_content
                };

                dp1[_eventsField] = new ArrayEx([]);
                dp1[_guidField] = StringUtils.guid();
                let data_controll_actual = currentYear + '-' + mm_content + '-' + i_content;
                if (data_controll_actual in groupedEvents)
                {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_actual]);
                }
                _intervalToIndex[data_controll_actual] = dp.push(dp1) - 1;
            }
            else if (iterationday == 0 || iterationday == 6)
            {
                let dp1 = {
                    "value": i,
                    "selected": false,
                    "classField": ["fc-past-days"],
                    "dateContent": currentYear + "-" + mm_content + "-" + i_content
                };

                dp1[_eventsField] = new ArrayEx([]);
                dp1[_guidField] = StringUtils.guid();
                let data_controll_past = currentYear + "-" + mm_content + "-" + i_content;
                if (data_controll_past in groupedEvents)
                {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_past]);
                }
                _intervalToIndex[data_controll_past] = dp.push(dp1) - 1;
            }
            else
            {
                let dp1 = {
                    "value": i,
                    "selected": false,
                    "dateContent": currentYear + "-" + mm_content + "-" + i_content,
                    "classField": ["fc-border-weekdays"]
                };

                dp1[_eventsField] = new ArrayEx([]);
                dp1[_guidField] = StringUtils.guid();
                let data_controll_past = currentYear + "-" + mm_content + "-" + i_content;
                if (data_controll_past in groupedEvents)
                {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_past]);
                }
                _intervalToIndex[data_controll_past] = dp.push(dp1) - 1;
            }
        }

        if (lastDayOfCurrentMonth != 0)
        {
            let nextMonthfirstDay = 1;
            for (let i = lastDayOfCurrentMonth; i < 7; i++)
            {
                let month_next = currentMonth + 2;
                let month_next_content = month_next;
                if (month_next <= 9)
                {
                    month_next_content = '0' + month_next;
                }
                let nextMonthfirstDay_content = nextMonthfirstDay;
                if (nextMonthfirstDay <= 9)
                {
                    nextMonthfirstDay_content = '0' + nextMonthfirstDay;
                }
                let dp1 = {
                    "value": nextMonthfirstDay,
                    "selected": selected,
                    "classField": ['fc-past-days'],
                    "dateContent": currentYear + "-" + month_next_content + "-" + nextMonthfirstDay_content
                };

                dp1[_eventsField] = new ArrayEx([]);
                dp1[_guidField] = StringUtils.guid();
                let data_controll_next = currentYear + "-" + month_next_content + "-" + nextMonthfirstDay_content;
                if (data_controll_next in groupedEvents)
                {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_next]);
                }
                _intervalToIndex[data_controll_next] = dp.pushUnique(dp1) - 1;
                nextMonthfirstDay++;
            }
        }
        _dataProvider.splicea(0, _dataProvider.length, dp);
        _self.dataProvider = dp;
        return dp;
    };

    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let eve = [];
    let _labelField = _props.labelField;
    let _lb = _props.lb;
    let _guidField = _props.guidField;
    let _dayClasses = _props._dayClasses;
    let _eventsField = _props.eventsField;
    let _labelField1 = _props.labelField1;
    let _classField1 = _props.classField1;
    let _classField = _props.classField;
    let _startField = _props.startField;
    let _descriptionField = _props.descriptionField;
    let _nowMonth = _props.nowMonth;
    let _click = _props.click;
    let _dataProvider = new ArrayEx();
    let _btnPrev;
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;

    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            _repeater_day = this.daysRepeater;
            e.preventDefault();
        }
    };

    this.addEvent = function (event)
    {
        let gi = _intervalFromDate(event);
        let ind = ArrayUtils.indexOfObject(_dataProvider, "dateContent", gi);
        if (ind > -1)
        {
            _dataProvider[ind][_eventsField].splice(_dataProvider[ind][_eventsField].length, 0, event);
        }
        _self.calendarEvents.push(event);
    };

    let _repeater_day;
    this.previous = function (eve)
    {
        if (_self.nowDate.getMonth() == 0)
        {
            _self.nowDate.setMonth(11);
            _self.nowDate.setFullYear(_self.nowDate.getFullYear() - 1);
        } else
        {
            _self.nowDate.setMonth(_self.nowDate.getMonth() - 1);
        }
        _self.fillEvents();
    };

    this.next = function (eve)
    {
        if (_self.nowDate.getMonth() == 11)
        {
            _self.nowDate.setMonth(0);
            _self.nowDate.setFullYear(_self.nowDate.getFullYear() + 1);
        } else
        {
            _self.nowDate.setMonth(_self.nowDate.getMonth() + 1);
        }
        _self.fillEvents();
    };

    let _calendarEventClick = function (e, ra)
    {
        let event = jQuery.Event("calendarEventClick");
        event.cell = this.parent;
        event.eventCell = this;
        event.originalEvent = e;
        _self.trigger(event, [ra]);
    };

    let _cellClick = function (e, ra)
    {
        let event = jQuery.Event("cellClick");
        event[_self.startDateTimeField] = new Date(ra.currentItem.dateContent + "T00:00:00Z");
        event.cell = this;
        event.originalEvent = e;
        _self.trigger(event, [ra]);
    };

    let _cmps;
    let fnContainerDelayInit = function ()
    {
        _cmps = [
            {
                ctor: Repeater,
                props: {
                    id: 'weekDaysRepeater',
                    ownerDocument: _self.ownerDocument,
                    rendering: {
                        direction: "horizontal",
                        separator: false,
                        wrap: false
                    },
                    classes: ["form-row"],
                    css: { display: "flex", width: "1115px" },
                    dataProvider: new ArrayEx([
                        { value: 'Monday', classes: ['col', 'fc-border'] },
                        { value: 'Tuesday', classes: ['col', 'fc-border'] },
                        { value: 'Wednesday', classes: ['col', 'fc-border'] },
                        { value: 'Thursday', classes: ['col', 'fc-border'] },
                        { value: 'Friday', classes: ['col', 'fc-border'] },
                        { value: 'Saturday', classes: ['col', 'fc-border-Saturday-Sunday'] },
                        { value: 'Sunday', classes: ['col', 'fc-border-Saturday-Sunday'] },
                    ]),
                    components: [{
                        ctor: Container,
                        props: {
                            type: "",
                            id: "IncontainerForWeekDays",
                            label: '{' + _labelField1 + '}',
                            classes: "{classes}",
                            height: 40,
                            width: 140
                        }
                    }]
                }
            },
            {
                ctor: Repeater,
                props: {
                    id: "daysRepeater",
                    ownerDocument: _self.ownerDocument,
                    rendering: {
                        direction: "horizontal",
                        separator: false,
                        wrap: false
                    },
                    css: { width: "980px" },
                    classes: ["form-row"],
                    dataProvider: _dataProvider,
                    components: [{
                        ctor: Container,
                        props: {
                            type: "",
                            id: "dayContainer",
                            classes: ["border-c", "pr-0", "pl-0"],
                            css: { "min-height": "150px" },
                            width: 140,
                            components: [{
                                ctor: Container,
                                props: {
                                    type: "",
                                    id: "dateContainer",
                                    classes: "{classField}",
                                    label: '{' + _labelField + '}'
                                }
                            },
                            {
                                ctor: Repeater,
                                props: {
                                    id: "eventsRepeater",
                                    dataProvider: "{" + _eventsField + "}",
                                    rendering: {
                                        direction: "horizontal",
                                        separator: false,
                                        wrap: false
                                    },
                                    components: [{
                                        ctor: Container,
                                        props: {
                                            type: "",
                                            id: "eventContainer",
                                            label: "{" + _descriptionField + "}",
                                            classes: ["fc-event-inner"],
                                            css: { "width": "100%" },
                                            "click": _calendarEventClick
                                        }
                                    }]
                                }
                            }],
                            "click": _cellClick,
                        }
                    }]
                }
            }
        ];
    };

    let r = CalendarBase.call(this, _props);
    let _rPromise;
    this.render = function () 
    {
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) =>
        {
            _self.on("endDraw", function (e)
            {
                if (e.target.id == _self.domID) 
                {
                    resolve(r);
                }
            });
        });
        _dataProvider.splicea(0, 0, _self.fillEvents());
        fnContainerDelayInit();
        this.addComponents(_cmps);
        return _rPromise;
    };

    return r;
};

DependencyContainer.getInstance().register("CalendarMonth", CalendarMonth, DependencyContainer.simpleResolve);
export
{
    CalendarMonth
};