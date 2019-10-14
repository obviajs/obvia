/**
 * This is a Day Month Year Element
 *
 * Kreatx 2019
 */

var DateTimeCb = function (_props, overrided = false) {
    var _self = this;
    let _dpDate = DateTimeCb.dpDate, _dpMonth = DateTimeCb.dpMonth, _dpYear = DateTimeCb.dpYear, _dpHour = DateTimeCb.dpHour, _dpMinute = DateTimeCb.dpMinute, _dpSecond = DateTimeCb.dpSecond;
    let _dateSelect, _monthSelect, _yearSelect, _hourSelect, _minuteSelect, _secondSelect;
    let _cmps, _tpl;
    var _initDP = function()
    {
        if(!DateTimeCb.init){
            for (var i = 1; i < 32; i++) {
                _dpDate[i-1] = {"value": i, "label": i};
            }
            for (var i = 0; i < 13; i++) {
                _dpMonth[i] = {"value": i, "label": CalendarConstants.Months[i]};
            }
        
            for (var i = _startYear; i < _endYear; i++) {
                _dpYear.push({"value": i, "label": i});
            }
            
            for (var i = 0; i < 24; i++) {
                _dpHour[i] = {"value": i, "label": i};
            }
            
            for (var i = 0; i < 60; i++) {
                _dpMinute[i] = _dpSecond[i] = {"value": i, "label": i};
            }
            DateTimeCb.init = true;
        }else{
            if(_dpYear[0] != _startYear || _dpYear[_dpYear.length-1]!=_endYear){
                _dpYear = [];
                for (var i = _startYear; i < _endYear; i++) {
                    _dpYear.push({"value": i, "label": i});
                }
            }
        }
    }

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function (v) {
            var date = moment(v).format(_inputFormat);
            let m = moment(date);
            _value = m.format(_outputFormat);

            _dateSelect.value = m.date();
            _monthSelect.value = m.month();
            _yearSelect.value = m.year();
            if(_hourSelect)
                _hourSelect.value = m.hour();
            if(_minuteSelect)
                _minuteSelect.value = m.minute();
            if(_secondSelect)
                _secondSelect.value = m.second();
        }
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) 
        {
            _initDP();
            this.$container = this.$el;
            fnContainerDelayInit();
            this.components = _cmps;
            this.addComponents();
            _dateSelect = this.children[this.components[0].props.id].children[this.components[0].props.components[0].props.id];
            _monthSelect = this.children[this.components[1].props.id].children[this.components[1].props.components[0].props.id];
            _yearSelect = this.children[this.components[2].props.id].children[this.components[2].props.components[0].props.id];
            if(this.components[3])
                _hourSelect = this.children[this.components[3].props.id].children[this.components[3].props.components[0].props.id];
            if(this.components[4])
                _minuteSelect = this.children[this.components[4].props.id].children[this.components[4].props.components[0].props.id];
            if(this.components[5])
                _secondSelect = this.children[this.components[5].props.id].children[this.components[5].props.components[0].props.id];

            if(_props.value){
                this.value = _props.value;
            }
            EventDispatcher.listen([_dateSelect, _monthSelect, _yearSelect, _hourSelect, _minuteSelect, _secondSelect], "change", _change);
            e.preventDefault();
        }
    };

    var _change = function (e) {
        var date = moment();
        date.date(_dateSelect.value);
        date.month(_monthSelect.value);
        date.year(_yearSelect.value);
        if(_hourSelect)
            date.hour(_hourSelect.value);
        if(_minuteSelect)
            date.minute(_minuteSelect.value);
        if(_secondSelect)
            date.second(_secondSelect.value);
        _value = date.format(_outputFormat);
    };
    
    var fnContainerDelayInit = function(){
        _cmps = 
            [
                {
                    "ctor": "Container",
                    "props": {
                        type: ContainerType.NONE,
                        "id": "workArea",
                        "components": [
                            {
                                "ctor": "Select",
                                "props": {
                                    "id": "dateSelect",
                                    "dataProvider": _dpDate,
                                    labelField:"label",
                                    valueField:"value"
                                }
                            }
                        ]
                    }
                },
                {
                    "ctor": "Container",
                    "props": {
                        type: ContainerType.NONE,
                        "id": "workArea_53",
                        "components": [
                            {
                                "ctor": "Select",
                                "props": {
                                    "id": "monthSelect",
                                    "dataProvider": _dpMonth,
                                    labelField:"label",
                                    valueField:"value"
                                }
                            }
                        ]
                    }
                },
                {
                    "ctor": "Container",
                    "props": {
                        type: ContainerType.NONE,
                        "id": "workArea_54",
                        "components": [
                            {
                                "ctor": "Select",
                                "props": {
                                    "id": "yearSelect",
                                    "dataProvider": _dpYear,
                                    labelField:"label",
                                    valueField:"value"
                                }
                            }
                        ]
                    }
                },
                "{{?hour}}",
                "{{?minute}}",
                "{{?second}}"
            ];

            let hour = {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea_55",
                    classes:["pl-1"],
                    "components": [
                        {
                            "ctor": "Select",
                            "props": {
                                "id": "hourSelect",
                                "dataProvider": _dpHour,
                                labelField:"label",
                                valueField:"value"
                            }
                        }
                    ]
                }
            };
            let minute = {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea_56",
                    "components": [
                        {
                            "ctor": "Select",
                            "props": {
                                "id": "minuteSelect",
                                "dataProvider": _dpMinute,
                                labelField:"label",
                                valueField:"value"
                            }
                        }
                    ]
                }
            };
            let second = {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea_57",
                    "components": [
                        {
                            "ctor": "Select",
                            "props": {
                                "id": "secondSelect",
                                "dataProvider": _dpSecond,
                                labelField:"label",
                                valueField:"value" 
                            }
                        }
                    ]
                }
            };
        let parts = {};
        if(_mode & 1 > 0){
            parts.hour = hour;
        }
        if(_mode & 2 > 0){
            parts.minute = minute;
        }
        if(_mode & 3 > 0){
            parts.second = second;
        }
        _tpl = new JTemplate({template:_cmps}, parts);
        _tpl.parse();
        _cmps = (_tpl.now()).template;
    }

    var _defaultParams = {
        id: 'dayMonthYear',
        mode: DateTimeMode.DATE,
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD-MM-YYYY',
        value: '06/06/2006',
        startYear: 1900,
        endYear: 2100,
        type:ContainerType.ROW
    };

    _props = extend(false, false, _defaultParams, _props);
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;
    let _mode = _props.mode;
    let _value = _props.value;
    let _startYear = _props.startYear
    let _endYear = _props.endYear;

    Container.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};
DateTimeCb.prototype.ctor = "DateTimeCb";
DateTimeCb.init = false;
DateTimeCb.dpDate = new Array(31);
DateTimeCb.dpMonth = new Array(12);
DateTimeCb.dpYear = new Array(); 
DateTimeCb.dpHour = new Array(24);
DateTimeCb.dpMinute = DateTimeCb.dpSecond = new Array(60);
