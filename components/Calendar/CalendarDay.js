/**
 * This is a CalendarDay Component
 * 
 * Kreatx 2019
*/
var CalendarDay = function(_props)
{
    let _self = this;
    let _calendarEvents;
    let _lbl;
    
    Object.defineProperty(this, "calendarEvents",{
        get: function calendarEvents(){
           return _calendarEvents;
        },
        set: function calendarEvents(v){
            if(_calendarEvents != v){
                if(_dpWatcher && _calendarEvents){
                    _dpWatcher.reset();
                    _calendarEvents.off("propertyChange", _dpMemberChanged);
                }
                _calendarEvents = v;
                if(_calendarEvents){
                    _dpWatcher = ChangeWatcher.getInstance(_calendarEvents);
                    _dpWatcher.watch(_calendarEvents, "length", _dpLengthChanged);
                    _calendarEvents.on("propertyChange", _dpMemberChanged);
                }
            }
          
        }
    }); 

    let _dpWatcher;
    let _dpLengthChanged = function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    let _dpMemberChanged = function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
        _dataProvider[_intervalToIndex[_intervalFromDate(e.newValue)]].children.splice(_dataProvider[_intervalToIndex[_intervalFromDate(e.newValue)]].children.length,0,e.newValue);
    }
    Object.defineProperty(this, "nowDate",{
        get: function nowDate(){
            return  _nowDate;
        }
    });

    Object.defineProperty(this, "calendarStartDate",{
        get: function calendarStartDate() {
            return  _calendarStartDate;
        }
    });
    
    this.afterAttach = function (e){
        if(typeof _afterAttach == 'function')
        _afterAttach.apply(this,arguments);
        _creationFinished = true;
    }

    let _defaultParams = {
        dataProvider: [],
        nowDate : new Date(),
        labelField:'label',
        labelField1:'label',
        startHour:" ",
        endHour:" ",
        descriptionField:" ",
        interval:'',
        childrenField:"children",
        dateContent:" ",
        guidField:"guid",
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm'
    }

    let _intervalToIndex = {};
    let _intervalFromDate = function(currentValue){          
        let date = moment(currentValue.startDateTime).format(_props.inputFormat);
        let m = moment(date);
        let hours = m.hours();
        let minutes = m.minutes();
        let h = hours % 12;
        h = h ? h :12 ; 
        let ampm = hours >=12 ? 'pm':'am';
        if(minutes == 30){
        return (h+":30") + "-" + ((h == 12 ) ? ((hours%12)+1) : (h+1))+':00' + ampm;
        }
        else{
            return (h+":00") + "-" + (h+':30') + ampm ;
        }
    }
    
    let _createHours = function (_calendarStartDate,event){
        let groupedEvents = _calendarEvents.groupReduce(_intervalFromDate);
        let today = _calendarStartDate.getDate();
        let currentMonth = _calendarStartDate.getMonth();
        let currentYear = _calendarStartDate.getFullYear();
        let myActualMonth = CalendarConstants.Months[currentMonth];
        let _dataProvider = [];     
        for (let i = 0; i < 24; i++)
        {
            let hours = i;
            hours = hours % 12;
            hours = hours ? hours :12 ; 
            let ampm = i >=12 ? 'pm':'am';
            let m_content = currentMonth;
            if(currentMonth < 9){
                m_content = '0'+ (currentMonth+1);
            }
            else{
                m_content = currentMonth+1;
            }
            let today_d = today;
            if(today<=9){
                today_d = '0'+ today;
            }else
            { 
                today_d = today;
            }
            let dp1 = {
                "value":hours+":00",
                "startHour":hours+":00",
                "endHour":hours+':30',
                "interval":(hours+":00") + "-" + (hours+':30') + ampm,
                "dateContent":currentYear+'-'+ m_content +'-'+ today_d,
                "children": new ArrayEx([]),
            }
            dp1[_guidField] = StringUtils.guid();
            let hourInterval_2 =  dp1.interval;
            if(hourInterval_2 in  groupedEvents){
                dp1.children = new ArrayEx(groupedEvents[hourInterval_2]);      
            }
            _intervalToIndex[hourInterval_2] = _dataProvider.push(dp1) - 1;

            let dp2 = {
                "value":" ",
                "startHour":hours+":30",
                "endHour":(hours+1)+':00',
                "interval":(hours+":30") + "-" + ((hours == 12 ) ? ((i%12)+1) : (hours+1))+':00' + ampm,
                "timing":ampm,
                "dateContent":currentYear+'-'+ m_content +'-'+ today_d,
                "children":new ArrayEx([])
            }
            dp2[_guidField] = StringUtils.guid();
            let hourInterval_3 = dp2.interval ;
            if(hourInterval_3 in  groupedEvents){
                dp2.children = new ArrayEx(groupedEvents[hourInterval_3]);
            }   

            _intervalToIndex[hourInterval_3] = _dataProvider.push(dp2) - 1;
        }

        return _dataProvider;
    }


    _props = extend(false,false,_defaultParams,_props);
    let _guidField = _props.guidField;
    let _labelField = _props.labelField;
    let _labelField1 = _props.labelField1;
    let _nowDate = _props.nowDate;
    let _startHour = _props.startHour;
    let _endHour = _props.endHour;
    let _interval = _props.interval;
    let _calendarStartDate = _props.calendarStartDate;
    let  _dataProvider; 
    let _component_Cday;
    let _childrenField = _props.childrenField;
    let _descriptionField = _props.descriptionField;
    let _dateContent = _props.dateContent;
    let _component_Mday;
    let eve = [];

    this.addEvent  =  function(event){
        if(event.date.getTime() == _nowDate.getTime()){
            let ind = indexOfObject(_dataProvider,"interval",event.interval);
            if(ind>-1){
                _dataProvider[ind].children.splice(_dataProvider[ind].children.length,0,event);
            }
        }
        let key  =  event.interval + " " + event.dateContent;
        if( _calendarEvents[key] == null){
            _calendarEvents[key] = [];
        }
        _calendarEvents[key].push(event);
    };

        
    
    let _repeater_hour;
    this.beginDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            
        }
    }
    
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            _repeater_hour = this.Container_Repeater.repeaterForHours;
            _lbl = this.Label_Displaying_WeekDay;
            e.preventDefault();
        }
    }

    this.previous = function(eve){
        _nowDate.setDate(_nowDate.getDate()-1);
        let new_prev = CalendarConstants.Days[_nowDate.getDay()];
        let update_prev_date = _nowDate.getDate();
        let new_dp_prev = _createHours(_nowDate,eve);
        let dataProvider = _repeater_hour.dataProvider;
        dataProvider.splicea(0, dataProvider.length, new_dp_prev);
        _lbl.label =  new_prev + " "+ update_prev_date;
        _self.dataProvider = new_dp_prev;
    }


    this.next = function(eve){
        _nowDate.setDate(_nowDate.getDate() + 1);
        let new_day = CalendarConstants.Days[_nowDate.getDay()];
        let update_date = _nowDate.getDate();
        let new_dp_next = _createHours(_nowDate,eve);
        let dp = _repeater_hour.dataProvider;
        dp.splicea(0, dp.length, new_dp_next);
        _lbl.label =  new_day + " "+ update_date;
        _self.dataProvider = new_dp_next;
    }

    let _cellClick = function(e, ra) {   
        let event = jQuery.Event("cellClick");
        event.interval = ra.currentItem.interval;
        let time = ra.currentItem.startHour.split(':');
        let setTime = _self.nowDate.setHours(parseInt(time[0]),parseInt(time[1]),0);
        console.log("eventtime",setTime);
        event.startDateTime = new Date(setTime);
        event.cell = this;
        _self.trigger(event); 
    }

    let  _cmps;
    let fnContainerDelayInit  = function(){
        _cmps = [
            {
                ctor: Label,
                props: {
                    id: 'Label_Displaying_WeekDay',
                    ownerDocument: _self.ownerDocument,
                    label: CalendarConstants.Days[_nowDate.getDay()] + " " + _nowDate.getDate(),
                    classes: ["fc-week-day"],
                }
            },
            {
                ctor: Container,
                props: {
                    type: ContainerType.NONE,
                    id: "Container_Repeater",
                    ownerDocument: _self.ownerDocument,
                    classes: ["fc-float"],
                    components: [
                        {
                            ctor: Repeater,
                            props: {
                                id: 'repeaterForHours',
                                rendering: {
                                    direction: "horizontal",
                                    separator: false
                                },
                                classes: ["fc-float"],
                                dataProvider: _dataProvider,
                                components: [
                                    {
                                        ctor: Container,
                                        props: {
                                            type: ContainerType.NONE,
                                            id: "InContainerForHours",
                                            label: '{' + _labelField + '}',
                                            classes: ["fc-container-hour"],
                                            height: 20,
                                            width: 20,
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            type: ContainerType.NONE,
                                            id: "container_for_both",
                                            components: [{
                                                ctor: Container,
                                                props: {
                                                    type: ContainerType.NONE,
                                                    id: "container_half_1",
                                                    label: '{' + _interval + '}',
                                                    classes: ["fc-hour-day"],
                                                    height: 10,
                                                    width: 1050,
                                                }
                                            },
                                            {
                                                ctor: Container,
                                                props: {
                                                    type: ContainerType.NONE,
                                                    id: "container_Repeater",
                                                    components: [{
                                                        ctor: Repeater,
                                                        props: {
                                                            id: "event_Repeater",
                                                            dataProvider: "{children}",
                                                            rendering: {
                                                                direction: "horizontal",
                                                                separator: false
                                                            },
                                                            components: [{
                                                                ctor: Container,
                                                                props: {
                                                                    type: ContainerType.NONE,
                                                                    id: "event_Container",
                                                                    label: '{descriptionField}',
                                                                    classes: ["fc-event"],
                                                                }
                                                            }]
                                                        }
                                                    }]
                                                }
                                            }],
                                            "click": _cellClick,
                                        }
                                    }
                                ]
                            }
                        },
                    ]
                }
            }
        ];        
    };
    
    if(_props.calendarEvents){
        this.calendarEvents = _props.calendarEvents;
    }
    _dataProvider = _createHours(_nowDate,eve);
    fnContainerDelayInit();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
}
CalendarDay.prototype.ctor = 'CalendarDay';