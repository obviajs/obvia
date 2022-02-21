/**
 * This is a Calendar Component
 * 
 * Kreatx 2019
*/
import { Container } from "/obvia/components/Container.js";
import { CalendarDay } from "/obvia/components/Calendar/CalendarDay.js";
import { CalendarWeek } from "/obvia/components/Calendar/CalendarWeek.js";
import { CalendarMonth } from "/obvia/components/Calendar/CalendarMonth.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { CalendarConstants } from "/obvia/components/Calendar/CalendarConstants.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { Label } from "/obvia/components/Label.js";
import { LabelType } from "/obvia/components/Label.js";
import { Button, ButtonSize } from "/obvia/components/Button/Button.js";
import { ViewStack } from "/obvia/components/base/ViewStack.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";

var Calendar = function (_props)
{
    let _self = this;
    let _calendarEvents;

    Object.defineProperty(this, "calendarEvents", {
        get: function calendarEvents()
        {
            return _calendarEvents;
        },
        set: function calendarEvents(v)
        {
            if (_calendarEvents != v)
            {
                if (_calendarDay)
                    _calendarDay.calendarEvents = v;
                if (_calendarWeek)
                    _calendarWeek.calendarEvents = v;
                if (_calendarMonth)
                    _calendarMonth.calendarEvents = v;
            }
        }
    });

    Object.defineProperty(this, "descriptionField", {
        get: function descriptionField()
        {
            return _descriptionField;
        }
    });

    Object.defineProperty(this, "startDateTimeField", {
        get: function startDateTimeField()
        {
            return _startDateTimeField;
        },
        set: function startDateTimeField(v)
        {
            if (_startDateTimeField != v)
            {
                _startDateTimeField = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "endDateTimeField", {
        get: function endDateTimeField()
        {
            return _endDateTimeField;
        },
        set: function endDateTimeField(v)
        {
            if (_endDateTimeField != v)
            {
                _endDateTimeField = v;
            }
        },
        enumerable: true
    });
    Object.defineProperty(this, "calendarWeek", {
        get: function calendarWeek()
        {
            return _calendarWeek;
        }
    });
    Object.defineProperty(this, "calendarMonth", {
        get: function calendarMonth()
        {
            return _calendarMonth;
        }
    });

    Object.defineProperty(this, "calendarDay", {
        get: function calendarDay()
        {
            return _calendarDay;
        }
    });

    Object.defineProperty(this, "labelMonth", {
        get: function labelMonth()
        {
            return _labelMonth;
        }
    });

    Object.defineProperty(this, "labelYear", {
        get: function labelYear()
        {
            return _labelYear;
        }
    });

    let _defaultParams = {
        nowDate: new Date(),
        guidField: "guid",
        selectedIndex: 0,
        calendarDay: "",
        calendarWeek: "",
        calendarMonth: "",
        calendarEvents: new ArrayEx(),
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm',
        eventsField: "cellEvents",
        descriptionField: "description",
        startDateTimeField: "startDateTime",
        endDateTimeField: "endDateTime",
    };

    let _calendarDay;
    let _calendarWeek;
    let _calendarMonth;
    let _viewStack;
    let _labelMonth;
    let _labelYear;
    let _startDateTimeField, _endDateTimeField;

    this.beforeAttach = async function (e)
    {
        if (e.target.id == this.domID)
        {
            _viewStack = this.viewStack;
            _calendarDay = _viewStack.calendarDay;
            _calendarWeek = (await _viewStack.calendarWeek)[0];
            _calendarMonth = (await _viewStack.calendarMonth)[0];
            _labelMonth = this.month_year.label_for_month;
            _labelYear = this.month_year.label_for_year;
            if (_props.calendarEvents && !this.getBindingExpression("calendarEvents"))
            {
                this.calendarEvents = _props.calendarEvents;
            }
            e.preventDefault();
        }
    };

    let _cmps;
    let fnViewStackDelayInit = function ()
    {
        _cmps = [
            {
                ctor: Label,
                props: {
                    id: "month_year",
                    components: [
                        {
                            ctor: Label,
                            props: {
                                id: "label_for_month",
                                label: CalendarConstants.Months[_nowDate.getMonth()],
                                labelType: LabelType.label,
                                classes: ["fc-label-month-w"],
                            },
                        },
                        {
                            ctor: Label,
                            props: {
                                id: "label_for_year",
                                label: _nowDate.getFullYear(),
                                labelType: LabelType.label,
                                classes: ["fc-label-year-w"]
                            }
                        }
                    ],
                    classes: ["col-4"]
                }
            },
            {
                ctor: Button,
                props: {
                    id: "button_for_day",
                    label: "day",
                    type: 'button',
                    classes: [ButtonSize.SMALL, "fc-button-left-w"],
                    "click": _clickDay,
                }
            },
            {
                ctor: Button,
                props: {
                    id: "button_for_week",
                    label: "week",
                    type: "button",
                    classes: [ButtonSize.SMALL, "fc-button-center-w"],
                    "click": _clickWeek,
                }
            },
            {
                ctor: Button,
                props: {
                    id: "button_for_month",
                    label: "month",
                    type: "button",
                    classes: [ButtonSize.SMALL, "fc-button-right-w"],
                    "click": _clickMonth,
                }
            },
            {
                ctor: Button,
                props: {
                    id: "button_previous_week",
                    type: "button",
                    classes: ["fc-button-prev-w", ButtonSize.LARGE],
                    components: [{
                        ctor: Label,
                        props: {
                            id: 'fa',
                            labelType: LabelType.i,
                            classes: ["fas", "fa-arrow-left"],
                        }
                    }],
                    "click": _prevHandler,
                }
            },
            {
                ctor: Button,
                props: {
                    id: "button_next_week",
                    type: "button",
                    classes: ["fc-button-next-w", ButtonSize.LARGE],
                    components: [{
                        ctor: Label,
                        props: {
                            id: 'fad',
                            labelType: LabelType.i,
                            classes: ["fas", "fa-arrow-right"],
                        }
                    }],
                    "click": _nextHandler,
                }
            },
            {
                ctor: ViewStack,
                props: {
                    id: 'viewStack',
                    selectedIndex: 0,
                    enabled: true,
                    components: [
                        {
                            ctor: CalendarDay,
                            props: {
                                id: 'calendarDay',
                                labelField: "value",
                                labelField1: "value",
                                descriptionField: _descriptionField,
                                startDateTimeField: _startDateTimeField,
                                endDateTimeField: _endDateTimeField,
                                interval: 30,
                                eventsField: _eventsField,
                                timing: "timing",
                                nowDate: new Date(),
                                //calendarEvents: _calendarEvents,
                                inputFormat: _inputFormat,
                                outputFormat: _outputFormat
                            }
                        },
                        {
                            ctor: CalendarWeek,
                            props: {
                                id: 'calendarWeek',
                                nowDate: new Date(),
                                startHourCalendar: 0,
                                endHourCalendar: 24,
                                labelField: "value",
                                descriptionField: _descriptionField,
                                startDateTimeField: _startDateTimeField,
                                endDateTimeField: _endDateTimeField,
                                duration: "duration",
                                valueHour: "valueHour",
                                interval: 30,
                                startRow: "startRow",
                                eventsField: _eventsField,
                                timing: "timing",
                                classField1: "classField1",
                                time: "time",
                                top: "top",
                                height: "height",
                                marginTop: "marginTop",
                                marginLeft: "marginLeft",
                                //calendarEvents: _calendarEvents,
                                inputFormat: _inputFormat,
                                outputFormat: _outputFormat
                            }
                        },
                        {
                            ctor: CalendarMonth,
                            props: {
                                id: 'calendarMonth',
                                labelField: "value",
                                labelField1: "value",
                                eventsField: _eventsField,
                                nowDate: new Date(),
                                selectedClasses: "selectedClasses",
                                classField: "classField",
                                classField1: "classField1",
                                startField: "startField",
                                descriptionField: _descriptionField,
                                startDateTimeField: _startDateTimeField,
                                endDateTimeField: _endDateTimeField,
                                nowMonth: new Date().getMonth(),
                                //calendarEvents: _calendarEvents,
                                inputFormat: _inputFormat,
                                outputFormat: _outputFormat
                            }
                        }
                    ]
                }
            }
        ];
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let _nowDate = _props.nowDate;
    let _guidField = _props.guidField;
    let _selectedIndex = _props.selectedIndex;
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _eventsField = _props.eventsField;
    let _descriptionField = _props.descriptionField;
    if (_props.startDateTimeField)
        _self.startDateTimeField = _props.startDateTimeField;
    if (_props.endDateTimeField)
        _self.endDateTimeField = _props.endDateTimeField;

    let _clickDay = function ()
    {
        if (_viewStack.selectedIndex < _viewStack.components.length)
        {
            _viewStack.selectedIndex = 0;
            let actualDateforDay = _calendarDay.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforDay.getMonth()];
            _labelYear.label = actualDateforDay.getFullYear();
        }
    };

    let _clickWeek = function ()
    {
        if (_viewStack.selectedIndex < _viewStack.components.length)
        {
            _viewStack.selectedIndex = 1;
            let actualDateforWeek = _calendarWeek.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforWeek.getMonth()];
            _labelYear.label = actualDateforWeek.getFullYear();
        }
        else
        {
            _viewStack.selectedIndex = 0;
        }
    };

    let _clickMonth = function ()
    {

        if (_viewStack.selectedIndex < _viewStack.components.length)
        {
            _viewStack.selectedIndex = 2;
            let actualDateforMonth = _calendarMonth.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforMonth.getMonth()];
            _labelYear.label = actualDateforMonth.getFullYear();
        }
        else
        {
            _viewStack.selectedIndex = 0;
        }
    };

    let _prevHandler = function ()
    {
        if (_viewStack.selectedIndex == 0)
        {
            _calendarDay.previous();
            let actualDateforDay = _calendarDay.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforDay.getMonth()];
            _labelYear.label = actualDateforDay.getFullYear();

        } else if (_viewStack.selectedIndex == 1)
        {
            _calendarWeek.previous();
            let actualDateforWeek = _calendarWeek.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforWeek.getMonth()];
            _labelYear.label = actualDateforWeek.getFullYear();
        } else if (_viewStack.selectedIndex == 2)
        {
            _calendarMonth.previous();
            let actualDateforMonth = _calendarMonth.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforMonth.getMonth()];
            _labelYear.label = actualDateforMonth.getFullYear();
        }
    };

    let _nextHandler = function ()
    {
        if (_viewStack.selectedIndex == 0)
        {
            _calendarDay.next();
            let actualDateforDay = _calendarDay.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforDay.getMonth()];
            _labelYear.label = actualDateforDay.getFullYear();
        } else if (_viewStack.selectedIndex == 1)
        {
            _calendarWeek.next();
            let actualDateforWeek = _calendarWeek.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforWeek.getMonth()];
            _labelYear.label = actualDateforWeek.getFullYear();
        } else if (_viewStack.selectedIndex == 2)
        {
            _calendarMonth.next();
            let actualDateforMonth = _calendarMonth.nowDate;
            _labelMonth.label = CalendarConstants.Months[actualDateforMonth.getMonth()];
            _labelYear.label = actualDateforMonth.getFullYear();
        }
    };

    fnViewStackDelayInit();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
}
DependencyContainer.getInstance().register("Calendar", Calendar, DependencyContainer.simpleResolve);
export
{
    Calendar
};