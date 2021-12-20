import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";

var CalendarBase = function (_props)
{
    let _self = this, _calendarEvents = new ArrayEx(), _inputFormat, _outputFormat, _internalFormat,
        _childrenField, _guidField, _descriptionField, _startDateTimeField, _endDateTimeField,
        _nowDate, _calendarStartDate;

    let _dpWatcher;
    let _dpLengthChanged = function (e)
    {
        _self.fillEvents();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    let _dpMemberChanged = function (e)
    {
        _self.fillEvents();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    Object.defineProperty(this, "calendarEvents", {
        get: function calendarEvents()
        {
            return _calendarEvents;
        },
        set: function calendarEvents(v)
        {
            if (_calendarEvents != v)
            {
                if (_dpWatcher && _calendarEvents)
                {
                    _dpWatcher.reset();
                    _calendarEvents.off("propertyChange", _dpMemberChanged);
                }
                _calendarEvents = v;
                if (_calendarEvents)
                {
                    _dpWatcher = ChangeWatcher.getInstance(_calendarEvents);
                    _dpWatcher.watch(_calendarEvents, "length", _dpLengthChanged);
                    _calendarEvents.on("propertyChange", _dpMemberChanged);
                }
                _self.fillEvents();
            }
        },
        enumerable: true
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

    Object.defineProperty(this, "internalFormat", {
        get: function internalFormat()
        {
            return _internalFormat;
        },
        set: function internalFormat(v)
        {
            if (_internalFormat != v)
            {
                _internalFormat = v;
            }
        }
    });

    Object.defineProperty(this, "inputFormat", {
        get: function inputFormat()
        {
            return _inputFormat;
        },
        set: function inputFormat(v)
        {
            if (_inputFormat != v)
            {
                _inputFormat = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "outputFormat", {
        get: function outputFormat()
        {
            return _outputFormat;
        },
        set: function outputFormat(v)
        {
            if (_outputFormat != v)
            {
                _outputFormat = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "descriptionField", {
        get: function descriptionField()
        {
            return _descriptionField;
        },
        set: function descriptionField(v)
        {
            if (_descriptionField != v)
            {
                _descriptionField = v;
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "guidField", {
        get: function guidField()
        {
            return _guidField;
        }
    });

    Object.defineProperty(this, "childrenField", {
        get: function childrenField()
        {
            return _childrenField;
        }
    });

    Object.defineProperty(this, "calendarStartDate", {
        get: function calendarStartDate()
        {
            return _calendarStartDate;
        },
        set: function calendarStartDate(v)
        {
            if (_calendarStartDate != v)
            {
                _calendarStartDate = v;
            }
        }
    });

    Object.defineProperty(this, "nowDate", {
        get: function nowDate()
        {
            return _nowDate;
        },
        set: function nowDate(v)
        {
            if (_nowDate != v)
            {
                _nowDate = v;
            }
        }
    });

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) 
    {
        if (e.target.id == this.domID)
        {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if (_props.calendarEvents && !this.getBindingExpression("calendarEvents"))
            {
                this.calendarEvents = _props.calendarEvents;
            }

        }
    };

    let _defaultParams = {
        type: "",
        calendarEvents: new ArrayEx(),
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm',
        internalFormat: "YYYY-MM-DDTHH:mm",
        guidField: "guid",
        childrenField: "children",
        descriptionField: "description",
        startDateTimeField: "startDateTime",
        endDateTimeField: "endDateTime",
        nowDate: new Date(),
        calendarStartDate: null
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (!_props.attr)
    {
        _props.attr = {};
    }
    let myDtEvts = ["cellClick", "calendarEventClick"];
    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    if (_props.inputFormat)
        _self.inputFormat = _props.inputFormat;
    if (_props.outputFormat)
        _self.outputFormat = _props.outputFormat;
    if (_props.internalFormat)
        _self.internalFormat = _props.internalFormat;
    if (_props.childrenField)
        _childrenField = _props.childrenField;
    if (_props.descriptionField)
        _descriptionField = _props.descriptionField;
    if (_props.nowDate)
        _self.nowDate = _props.nowDate;
    if (_props.calendarStartDate)
        _self.calendarStartDate = _props.calendarStartDate;
    else
        _self.calendarStartDate = new Date(_self.nowDate);
    if (_props.nowDate)
        _self.nowDate = _props.nowDate;
    if (_props.startDateTimeField)
        _self.startDateTimeField = _props.startDateTimeField;
    if (_props.endDateTimeField)
        _self.endDateTimeField = _props.endDateTimeField;
    let r = Container.call(this, _props);

    return r;
}
CalendarBase.prototype.ctor = 'CalendarBase';
export
{
    CalendarBase
};