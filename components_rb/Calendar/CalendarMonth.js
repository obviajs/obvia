/**
 * This is a Calendar Component
 * 
 * Kreatx 2019
 */

var CalendarMonth = function(_props)
{
    let _self = this;
    let _calendarEvents;
    
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
        get: function nowDate() {
            return  _nowDate;
        }
    });

    Object.defineProperty(this, "nowMonth",{
        get: function nowMonth(){
            return  _nowMonth;
        }
    });

    Object.defineProperty(this, "calendarStartDate",{
        get: function calendarStartDate(){
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
        labelField:'label',
        labelField1:'label',
        classField1:" ",
        guidField:"guid",
        classField:" ",
        startField:" ",
        descriptionField:" ",
        dateContent:'',
        nowDate : new Date(),
        nowMonth : new Date().getMonth(),
        events:[],
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm'
    };
    
    let _calendarStartDate;
    let _intervalToIndex = {};
    let _intervalFromDate = function(currentValue){
        let date = moment(currentValue.startDateTime).format(_props.inputFormat);
        return date.toString().substring(0,10);
    }
    let _createData = function(_nowDate)
    {
        let groupedEvents = _calendarEvents.groupReduce(_intervalFromDate);
        let today = _nowDate.getDate();
        let currentMonth = _nowDate.getMonth(); 
        let currentYear = _nowDate.getFullYear(); 
        let _dataProvider = [];
        let selected  = false;
        let days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // leap year?
        currentYear % 4 == 0 && currentYear != 1900 ? days_in_month[1] = 29 : days_in_month;
        let _getLastMonth = function (d) {
            if (d.getMonth() == 0) {
                return 11
            } else {
                return d.getMonth() - 1;
            }
        }
        let _daysInMonth = function(iMonth,iYear)
        {
            return 32 - new Date(iYear,iMonth,32).getDate();
        }

        let previousDaysofMonth = new Date ((currentMonth+1) +"/1/"+currentYear);
        let previousDay = previousDaysofMonth.getDay();
        let lastDayOfCurrentMonth = new Date(currentYear, currentMonth +1, 0).getDay();
        if(previousDay == 0){
            previousDay = 7;
        }
    
        for (let i=1;i<previousDay;i++){
            let j = days_in_month[_getLastMonth(_nowDate)]-((previousDay-1)-i);
            _calendarStartDate = new Date( currentMonth +"/" +(days_in_month[_getLastMonth(_nowDate)]-((previousDay-2)))+"/"+ currentYear);
            let m =_getLastMonth(_nowDate)+1;
            let m_content = m;
            if(m <= 9) {
                m_content  = '0'+ m;
            }
            
            let dp1 = {
                "value":j,
                "selected":selected,
                "classField":["fc-past-days"],
                "dateContent":currentYear + "-" + m_content + "-" + j,
                "children" : new ArrayEx([]),
            }
            dp1[_guidField] = StringUtils.guid();
            let data_controll_past =  currentYear + "-" + m_content + "-" +j;
                if(data_controll_past in  groupedEvents){
                    dp1.children = new ArrayEx(groupedEvents[data_controll_past]);
                }
            _intervalToIndex[data_controll_past] = _dataProvider.push(dp1) - 1;
        }

        for(let i=1;i<=_daysInMonth(currentMonth,currentYear);i++){

            let iterationday = new Date(currentYear, currentMonth, i).getDay();
            let mm = currentMonth+1;
            let mm_content = mm ;
            if(mm <= 9) {
                mm_content = '0'+ mm;
            }
            let i_content = i ;
            if(i<=9) {
                i_content = '0'+ i;
            }
            if(today == i  && _nowMonth == currentMonth ){
                let dp1={
                    "value":i,
                    "selected" :true,
                    "classField":["fc-state-highlight"],
                    "dateContent":currentYear +'-'+ mm_content +'-'+ i_content,
                    "children":new ArrayEx([])
                } 
            dp1[_guidField] = StringUtils.guid();
            let data_controll_actual = currentYear +'-'+ mm_content +'-'+ i_content;
                if(data_controll_actual in  groupedEvents){
                    dp1.children = new ArrayEx(groupedEvents[data_controll_actual]); 
                } 
                _intervalToIndex[data_controll_actual] = _dataProvider.push(dp1) - 1;   
            }
            else if(iterationday == 0 || iterationday == 6){
               
                let dp1={
                    "value":i,
                    "selected" :false,
                    "classField":["fc-past-days"],
                    "dateContent":currentYear + "-"+ mm_content + "-"+ i_content,
                    "children":new ArrayEx([])
                }
                dp1[_guidField] = StringUtils.guid();
                let data_controll_past = currentYear + "-" + mm_content + "-" + i_content;
                if(data_controll_past in  groupedEvents){
                    dp1.children = new ArrayEx(groupedEvents[data_controll_past]);
                }
                _intervalToIndex[data_controll_past] = _dataProvider.push(dp1) -1;
            }
            else{
                let dp1={
                    "value":i,
                    "selected":false,
                    "dateContent":currentYear + "-" + mm_content + "-" + i_content,
                    "classField":["fc-border-weekdays"],
                    "children":new ArrayEx([])
                }
                dp1[_guidField] = StringUtils.guid();
                let data_controll_past =  currentYear + "-" + mm_content + "-" + i_content;
                if(data_controll_past in  groupedEvents){
                    dp1.children = new ArrayEx(groupedEvents[data_controll_past]);
                }
                _intervalToIndex[data_controll_past] = _dataProvider.push(dp1) -1;
            }
        }

        if(lastDayOfCurrentMonth !=0){
            let nextMonthfirstDay=1;
            for(let i=lastDayOfCurrentMonth;i<7;i++){
                let month_next = currentMonth + 2;
                let  month_next_content = month_next ;
                if(month_next <= 9){
                    month_next_content = '0'+ month_next;
                }
            let  nextMonthfirstDay_content = nextMonthfirstDay;
            if(nextMonthfirstDay<=9){
                nextMonthfirstDay_content = '0'+ nextMonthfirstDay;
            }
            let dp1={
                "value":nextMonthfirstDay,
                "selected":selected,
                "classField":['fc-past-days'],
                "dateContent":currentYear+"-"+month_next_content+"-"+nextMonthfirstDay_content,
                "children":new ArrayEx([])
            }
            dp1[_guidField] = StringUtils.guid();
            let data_controll_next =currentYear+"-"+month_next_content+"-"+nextMonthfirstDay_content;
            if(data_controll_next in  groupedEvents){
                dp1.children = new ArrayEx(groupedEvents[data_controll_next]);
            }
                _intervalToIndex[data_controll_next] = _dataProvider.pushUnique(dp1) -1;
                nextMonthfirstDay++;
            } 
        }
    return _dataProvider;
}

    _props = extend(false,false,_defaultParams,_props);
    let eve = [];
    let _labelField = _props.labelField;
    let _lb = _props.lb;
    let _guidField = _props.guidField;
    let _dayClasses = _props._dayClasses;
    let _childrenField = _props.childrenField;
    let _labelField1  = _props.labelField1;
    let _classField1 = _props.classField1;
    let _classField = _props.classField;
    let _startField = _props.startField;
    _calendarEvents = _props.calendarEvents;
    let  _descriptionField = _props.descriptionField;
    let  _nowDate = _props.nowDate;
    let  _nowMonth = _props.nowMonth;
    _calendarStartDate = _props.calendarStartDate;
    let _dateContent = _props.dateContent;
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
    
    this.addEvent  =  function(event){
        _dataProvider = _repeater_day.dataProvider;
        let begin_Date  = myModal.children[myModal.components[3].props.id].value.slice(0,10).split('/').join('-');
        if (begin_Date == event.dateContent ){
            let ind = indexOfObject(_dataProvider,"dateContent",event.dateContent);
            if(ind>-1){
                _dataProvider[ind].children.splice(_dataProvider[ind].children.length,0,event);
            }
        }
        let key  = event.dateContent;
        if( _calendarEvents[key] == null){
            _calendarEvents[key] = [];
        }
        _calendarEvents[key].push(event);
    };


    let _repeater_day;
    this.previous = function(eve){
        if(_nowDate.getMonth() == 0){
            _nowDate.setMonth(11);
            _nowDate.setFullYear(_nowDate.getFullYear() - 1);
        }else{
            _nowDate.setMonth(_nowDate.getMonth() - 1);
        }
        let new_dp_prev = _createData(_nowDate,eve); 
        let dp =_repeater_day.dataProvider;
        dp.splicea(0,dp.length,new_dp_prev);
        _self.dataProvider = new_dp_prev;
        
    }
    
    this.next = function (eve){
       
        if (_nowDate.getMonth() == 11){
            _nowDate.setMonth(0);
            _nowDate.setFullYear(_nowDate.getFullYear() + 1);
        }else{
            _nowDate.setMonth(_nowDate.getMonth() + 1);
        }
        let new_dp_next = _createData(_nowDate,eve);
        let dp= _repeater_day.dataProvider ;
        dp.splicea(0,dp.length,new_dp_next);
        _self.dataProvider = new_dp_next;
    };

    let _cellClick = function(e,ra){
        let event =jQuery.Event("cellClick");
        event.dateContent = ra.currentItem.dateContent;
        let startDateTime = new Date(event.dateContent +"T00:00:00Z");
        event.startDateTime = startDateTime;
        event.call = this;
        _self.trigger(event);
    }
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
                                    dataProvider: "{children}",
                                    components: [{
                                        ctor: Container,
                                        props: {
                                            type: ContainerType.NONE,
                                            id: "eventContainer",
                                            label: "{descriptionField}",
                                            classes: ["fc-event-inner"],
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
    if(_props.calendarEvents){
        this.calendarEvents = _props.calendarEvents;
    }
    _dataProvider = _createData(_nowDate, eve);
    fnContainerDelayInit();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
};
CalendarMonth.prototype.ctor = 'CalendarMonth';