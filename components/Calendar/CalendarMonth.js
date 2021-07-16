/**
 * This is a Calendar Component
 * 
 * Kreatx 2019
 */
import { CalendarBase } from "/flowerui/components/Calendar/CalendarBase.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";
import { ArrayUtils } from "/flowerui/lib/ArrayUtils.js";
var CalendarMonth = function(_props)
{
    let _self = this;
    
    let _dpWatcher;
    let _dpLengthChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
    };
    
    let _dpMemberChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        _dataProvider[_intervalToIndex[_intervalFromDate(e.newValue)]][_eventsField].splice(_dataProvider[_intervalToIndex[_intervalFromDate(e.newValue)]][_eventsField].length, 0, e.newValue);
    };

    Object.defineProperty(this, "nowMonth",{
        get: function nowMonth(){
            return  _nowMonth;
        }
    });
    
    this.afterAttach = function (e) {

        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
        _creationFinished = true;
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
        calendarEvents: [],
        eventsField: "cellEvents",
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm',
        internalFormat: "YYYY-MM-DD"
    };
    
    let _intervalToIndex = {};
    let _intervalFromDate = function (currentValue) {
        return dayjs(currentValue[_self.startDateTimeField], _self.inputFormat).format(_self.internalFormat);
    };

    let _createData = function () {
        let groupedEvents = _self.calendarEvents.groupReduce(_intervalFromDate);
        let today = _self.nowDate.getDate();
        let currentMonth = _self.nowDate.getMonth();
        let currentYear = _self.nowDate.getFullYear();
        let _dataProvider = [];
        let selected = false;
        let days_in_month = [31, (DateUtils.isLeapYear(currentYear) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // leap year?
        let _getLastMonth = function (d) {
            if (d.getMonth() == 0) {
                return 11
            } else {
                return d.getMonth() - 1;
            }
        }
        let _daysInMonth = function (iMonth, iYear) {
            return 32 - new Date(iYear, iMonth, 32).getDate();
        }

        let previousDaysofMonth = new Date((currentMonth + 1) + "/1/" + currentYear);
        let previousDay = previousDaysofMonth.getDay();
        let lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDay();
        if (previousDay == 0) {
            previousDay = 7;
        }
    
        for (let i = 1; i < previousDay; i++) {
            let j = days_in_month[_getLastMonth(_self.nowDate)] - ((previousDay - 1) - i);
            _self.calendarStartDate = new Date(currentMonth + "/" + (days_in_month[_getLastMonth(_self.nowDate)] - ((previousDay - 2))) + "/" + currentYear);
            let m = _getLastMonth(_self.nowDate) + 1;
            let m_content = m;
            if (m <= 9) {
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
            if (data_controll_past in groupedEvents) {
                dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_past]);
            }
            _intervalToIndex[data_controll_past] = _dataProvider.push(dp1) - 1;
        }

        for (let i = 1; i <= _daysInMonth(currentMonth, currentYear); i++) {

            let iterationday = new Date(currentYear, currentMonth, i).getDay();
            let mm = currentMonth + 1;
            let mm_content = mm;
            if (mm <= 9) {
                mm_content = '0' + mm;
            }
            let i_content = i;
            if (i <= 9) {
                i_content = '0' + i;
            }
            if (today == i && _nowMonth == currentMonth) {
                let dp1 = {
                    "value": i,
                    "selected": true,
                    "classField": ["fc-state-highlight"],
                    "dateContent": currentYear + '-' + mm_content + '-' + i_content
                };

                dp1[_eventsField] = new ArrayEx([]);
                dp1[_guidField] = StringUtils.guid();
                let data_controll_actual = currentYear + '-' + mm_content + '-' + i_content;
                if (data_controll_actual in groupedEvents) {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_actual]);
                }
                _intervalToIndex[data_controll_actual] = _dataProvider.push(dp1) - 1;
            }
            else if (iterationday == 0 || iterationday == 6) {               
                let dp1 = {
                    "value": i,
                    "selected": false,
                    "classField": ["fc-past-days"],
                    "dateContent": currentYear + "-" + mm_content + "-" + i_content
                };

                dp1[_eventsField] = new ArrayEx([]);
                dp1[_guidField] = StringUtils.guid();
                let data_controll_past = currentYear + "-" + mm_content + "-" + i_content;
                if (data_controll_past in groupedEvents) {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_past]);
                }
                _intervalToIndex[data_controll_past] = _dataProvider.push(dp1) - 1;
            }
            else {
                let dp1 = {
                    "value": i,
                    "selected": false,
                    "dateContent": currentYear + "-" + mm_content + "-" + i_content,
                    "classField": ["fc-border-weekdays"]
                };

                dp1[_eventsField] = new ArrayEx([]);
                dp1[_guidField] = StringUtils.guid();
                let data_controll_past = currentYear + "-" + mm_content + "-" + i_content;
                if (data_controll_past in groupedEvents) {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_past]);
                }
                _intervalToIndex[data_controll_past] = _dataProvider.push(dp1) - 1;
            }
        }

        if (lastDayOfCurrentMonth != 0) {
            let nextMonthfirstDay = 1;
            for (let i = lastDayOfCurrentMonth; i < 7; i++) {
                let month_next = currentMonth + 2;
                let month_next_content = month_next;
                if (month_next <= 9) {
                    month_next_content = '0' + month_next;
                }
                let nextMonthfirstDay_content = nextMonthfirstDay;
                if (nextMonthfirstDay <= 9) {
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
                if (data_controll_next in groupedEvents) {
                    dp1[_eventsField] = new ArrayEx(groupedEvents[data_controll_next]);
                }
                _intervalToIndex[data_controll_next] = _dataProvider.pushUnique(dp1) - 1;
                nextMonthfirstDay++;
            }
        }
        return _dataProvider;
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let eve = [];
    let _labelField = _props.labelField;
    let _lb = _props.lb;
    let _guidField = _props.guidField;
    let _dayClasses = _props._dayClasses;
    let _eventsField = _props.eventsField;
    let _labelField1  = _props.labelField1;
    let _classField1 = _props.classField1;
    let _classField = _props.classField;
    let _startField = _props.startField;
    let  _descriptionField = _props.descriptionField;
    let  _nowMonth = _props.nowMonth;
    let _click = _props.click;
    let _dataProvider;
    let _btnPrev;
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;

    this.beforeAttach = function(e){
        if(e.target.id == this.domID){
            _repeater_day = this.listRepeater;
            e.preventDefault();
        }
    };
    
    this.addEvent = function (event) {
        let gi = _intervalFromDate(event);
        let ind = ArrayUtils.indexOfObject(_dataProvider, "dateContent", gi);
        if(ind > -1) {
            _dataProvider[ind][_eventsField].splice(_dataProvider[ind][_eventsField].length, 0, event);
        }
        _self.calendarEvents.push(event);
    };

    let _repeater_day;
    this.previous = function (eve) {
        if (_self.nowDate.getMonth() == 0) {
            _self.nowDate.setMonth(11);
            _self.nowDate.setFullYear(_self.nowDate.getFullYear() - 1);
        } else {
            _self.nowDate.setMonth(_self.nowDate.getMonth() - 1);
        }
        let new_dp_prev = _createData();
        let dp = _repeater_day.dataProvider;
        dp.splicea(0, dp.length, new_dp_prev);
        _self.dataProvider = new_dp_prev;
        
    };
    
    this.next = function (eve){
        if (_self.nowDate.getMonth() == 11){
            _self.nowDate.setMonth(0);
            _self.nowDate.setFullYear(_self.nowDate.getFullYear() + 1);
        }else{
            _self.nowDate.setMonth(_self.nowDate.getMonth() + 1);
        }
        let new_dp_next = _createData();
        let dp= _repeater_day.dataProvider ;
        dp.splicea(0,dp.length,new_dp_next);
        _self.dataProvider = new_dp_next;
    };

    let _calendarEventClick = function (e, ra) {
        let event = jQuery.Event("calendarEventClick");
        event.cell = this.parent;
        event.eventCell = this;
        event.originalEvent = e;
        _self.trigger(event, [ra]);
    };

    let _cellClick = function (e, ra) {
        let event = jQuery.Event("cellClick");
        event[_self.startDateTimeField] = new Date(ra.currentItem.dateContent + "T00:00:00Z");
        event.cell = this;
        event.originalEvent = e;
        _self.trigger(event, [ra]);
    };

    let  _cmps;
    let fnContainerDelayInit  = function(){
        _cmps = [
            {
                ctor: Repeater,
                props: {
                    id: 'repeaterForWeekDays',
                    ownerDocument: _self.ownerDocument,
                    rendering: {
                        direction: "horizontal",
                        separator: false,
                        wrap:false
                    },
                    css: {display: "flex"},
                    dataProvider: new ArrayEx([
                        { value: 'Monday', classes: ['fc-border'] },
                        { value: 'Tuesday', classes: ['fc-border'] },
                        { value: 'Wednesday', classes: ['fc-border'] },
                        { value: 'Thursday', classes: ['fc-border'] },
                        { value: 'Friday', classes: ['fc-border'] },
                        { value: 'Saturday', classes: ['fc-border-Saturday-Sunday'] },
                        { value: 'Sunday', classes: ['fc-border-Saturday-Sunday'] },
                    ]),
                    components: [{
                        ctor: Container,
                        props: {
                            type: ContainerType.NONE,
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
                    id: "listRepeater",
                    ownerDocument: _self.ownerDocument,
                    rendering: {
                        direction: "horizontal",
                        separator: false
                    },
                    dataProvider: _dataProvider,
                    components: [{
                        ctor: Container,
                        props: {
                            type: ContainerType.NONE,
                            id: "containerOneDay",
                            classes: ["border-c"],
                            height: 140,
                            width: 140,
                            components: [{
                                ctor: Container,
                                props: {
                                    type: ContainerType.NONE,
                                    id: "containerforDays",
                                    classes: "{classField}",
                                    label: '{' + _labelField + '}'
                                }
                            },
                            {
                                ctor: Repeater,
                                props: {
                                    id: "eventRepeater",
                                    dataProvider: "{" + _eventsField + "}",
                                    rendering: {
                                        direction: "horizontal",
                                        separator: false,
                                        wrap:false
                                    },
                                    components: [{
                                        ctor: Container,
                                        props: {
                                            type: ContainerType.NONE,
                                            id: "eventContainer",
                                            label: "{" + _descriptionField + "}",
                                            classes: ["fc-event-inner"],
                                            "click": _calendarEventClick
                                        }
                                    }]
                                }
                            }],
                            "click": _cellClick,
                        }
                    }],
                }
            }
        ];
    };

    let r = CalendarBase.call(this, _props);
    let _rPromise;
    this.render = function () 
    {  
        this.$container = this.$el;
        _rPromise = new Promise((resolve, reject) => {
            _self.on("endDraw", function(e){
                if (e.target.id == _self.domID) 
                {
                    resolve(r); 
                }
            });                   
        });
        _dataProvider = _createData();
        fnContainerDelayInit();
        this.addComponents(_cmps);
        return _rPromise;
    };
    
    return r;
};
CalendarMonth.prototype.ctor = 'CalendarMonth';
export {
    CalendarMonth
};