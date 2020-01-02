/**
 * This is a CalendarWeek Component
 * 
 * Kreatx 2019
*/
var CalendarWeek = function(_props)
{
    let _self = this;
    let _calendarEvents;
    let day;
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
      
    }
    Object.defineProperty(this,"dataProvider",{
        get: function dataProvider(){ 
            return _dataProvider;
        },
        set: function dataProvider(v){
            if(_dataProvider !=v){
                _dataProvider = !ArrayEx.isArrayEx(v)? new ArrayEx(v):v;
            }
        }
    });

    Object.defineProperty(this, "nowDate",{
        get: function nowDate(){
            return  _nowDate;
        }
    });

    Object.defineProperty(this, "calendarStartDate",{
        get: function calendarStartDate(){
            return  _calendarStartDate;
        }
    });
    
    this.afterAttach = function(e){
        if(typeof _afterAttach == 'function')
        _afterAttach.apply(this,arguments);
        _creationFinished = true;
    }

       
    let _defaultParams = {
        dataProvider: [],
        nowDate: new Date(),
        labelField:'label',
        labelFieldHour:'label',
        interval:'',
        childrenField:"children",
        dateContent:"",
        duration:"",
        time :" ",
        startHour:" ",
        startHourCalendar:0,
        endHourCalendar:24,
        endHour:" ",
        guidField:"guid",
        classField1:" ",
        descriptionField:" ",
        heightField:"",
        calendarEvents:[],
        calendarStartDate:" ",
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm'
    }

    let _calendarStartDate ;
    this.dates = function(today){
        let week= []; 
        today.setDate(today.getDate() - today.getDay() +1);
        _calendarStartDate = new Date(today.getTime());
        for (let i = 0; i < 7; i++){
            week.push(new Date(today)); 
            today.setDate(today.getDate() +1);
        }
        return week; 
    };

    let _intervalToIndex = {};
    let _intervalFromDate = function(currentValue){    
        let date = moment(currentValue.startDateTime,_props.inputFormat);
        let  weekDayNumber = date.weekday();
        return  weekDayNumber-1;
    }
   
    let _createDataProvider = function(_nowDate){
        let groupedEvents = _calendarEvents.groupReduce(_intervalFromDate);
        let _dataProvider = [];
        let input = new Date(_nowDate.getTime());
        let result = _self.dates(input);
        let result_final=result.map(d=> d.toString());
        
        for (let i=0;i<result_final.length;i++){ 
            let day_dp = result_final[i].split(" ").slice(0,1);
            let date_dp = result_final[i].split(" ").slice(2,3);
            let day_string = day_dp[0];
            let date_string = date_dp[0];
            let result_complete = day_string + " " + date_string;
            let result_second = new Date (result_final[i]);
            let eventCount = {};
            let dp1 = {
                "value":result_complete,
                "dateContent":result_final,    
                "startHour":" ",
                "endHour":" ",
                "duration":"",
                "valueHour":" ",
                "top":" ",
                "height":" ",
                "marginTop":0,
                "marginLeft":0,
                "children":new ArrayEx([]),
            };
            dp1[_guidField] = StringUtils.guid();
        
                for(let j=0;groupedEvents[i] && j<groupedEvents[i].length;j++){
                    eventCount[_self.convertHour(groupedEvents[i][j].startDateTime.split(' ')[1])] = eventCount[_self.convertHour(groupedEvents[i][j].startDateTime.split(' ')[1])]!= null ? ++eventCount[ _self.convertHour(groupedEvents[i][j].startDateTime.split(' ')[1])]: 0;
                    groupedEvents[i][j].value =  result_complete;
                    groupedEvents[i][j].valueHour = " ";
                    let ds = moment(groupedEvents[i][j].startDateTime,_props.inputFormat);
                    let de = moment(groupedEvents[i][j].endDateTime,_props.inputFormat);
                    groupedEvents[i][j].duration = de.diff(ds,"minutes");
                    groupedEvents[i][j].dateContent = result_second.toJSON().slice(0,10);
                    groupedEvents[i][j].top = _self.getTop(_self.convertHour(groupedEvents[i][j].startDateTime).split(' ')[1]);
                    groupedEvents[i][j].height = _self.getHeight(groupedEvents[i][j].duration);
                    groupedEvents[i][j].marginTop = (eventCount[_self.convertHour(groupedEvents[i][j].startDateTime).split(' ')[1]])*10;
                    groupedEvents[i][j].marginLeft =(eventCount[_self.convertHour(groupedEvents[i][j].startDateTime).split(' ')[1]])*10;                                       
                }
                if(groupedEvents[i]){
                    dp1.children = new ArrayEx(groupedEvents[i]);
                }
            _dataProvider.push(dp1); 
        } 
        return _dataProvider;
    }
    

    _props = extend(false,false,_defaultParams,_props);
    let _nowDate = _props.nowDate;
    _calendarStartDate = _props.calendarStartDate;
    let _labelField = _props.labelField;
    let _guidField = _props.guidField;
    let _labelFieldHour = _props._labelFieldHour;
    let _startHour = _props.startHour;
    let _duration = _props.duration;
    let _endHour = _props.endHour;
    let _interval = _props.interval;
    let _children = _props.children;
    let _descriptionField = _props.descriptionField;
    let _time = _props.time;
    let _dateContent = _props.dateContent;
    let  _timing = _props.timing;
    let  _valueHour = _props.valueHour;
    let _classFieldWeek = _props.classFieldWeek;
    let _height = _props.height;
    let _top = _props.top;
    let _marginTop = _props.marginTop;
    let _marginLeft = _props.marginLeft;
    let _startHourCalendar = _props.startHourCalendar;
    let _endHourCalendar = _props.endHourCalendar;
    let eve = [];
    let _dataProvider ;
    let _dataProvider_Hour;
    let _cmpCalendar_Week ;
    let _component_Mday;
    _calendarEvents = _props.calendarEvents;
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;

    
    this.getTop = function(startHour){
        let differenceStart = _self.substract(startHour,_startHourCalendar);
        //Kthe ore ne minuta.
        let a = differenceStart.split(':'); 
        let minutes = (+a[0]) * 60  + (+a[1]) ;
        return (minutes*31.76)/30;
    };

    this.addEvent = function(event){
        let result = _self.dataProvider;
        result.reduce(function (r, a) { return r.concat(a); }, [])
        event.value =  day;
        console.log("event.value",event.value);
        let ind = indexOfObject(result, "value", event.value);
        event.height = _self.getHeight(event.duration);
        event.top = _self.getTop(event.startHour);

        if(ind>-1){
            event.marginLeft =  (result[ind].children.length)*10;
            event.marginTop =  (result[ind].children.length)*10;
            event.height = _self.getHeight(event.duration);
            event.top = _self.getTop(event.startHour);
            result[ind].children.splice(result[ind].children.length,0,event);
        }
        let key  =  event.value ; 
        if(_calendarEvents[key] == null){
            _calendarEvents[key] = [];
        }       
        _calendarEvents[key].push(event);
        
    };

    
    this.getHeight = function(duration){
        let totalHeight =  31.76 * duration/30;
        return totalHeight;   
    };

    this.substract = function (time, minsToAdd) {
        let _displayHour = function (h){ return (h < 10? '0':'') + h;};
        let split = time.split(':');
        let mins = split[0]*60 + +split[1] + +minsToAdd;
        return _displayHour(mins%(24*60)/60 | 0) + ':' + _displayHour(mins%60);  
    }  

    let _repeater_for_week;
    let _repeater_for_hour;
    
    this.beforeAttach = function(e){
        
        if (e.target.id == this.domID){
            _repeater_for_week = this.Out_Week_Container.Container_Month_Year_Prev_Next_Button.repeater_For_WeekDays_AND_Dates;
            _repeater_for_hour = this.Out_Week_Container.Container_Month_Year_Prev_Next_Button.Container_Repeater.repeater_for_weekDays_and_dates;
            e.preventDefault();
        }
    };

    let initHourGrid = function(){
        let dataProvider_second = new ArrayEx();
        for(let j=_startHourCalendar;j<_endHourCalendar;j++){
            let hours = j;
                hours = hours % 12;
                hours = hours ? hours :12 ; // Hour: '0' -> '12'
                let ampm = j >=12 ? 'pm':'am';
         
            let arrayHours = new ArrayEx(_self.dataProvider.length*2);
            for(let k=0;k<_self.dataProvider.length;k++){
                
                let dp1 = {
                    "value":" ",
                    "valueHour": k==0 ? hours+":00" :" ",
                    "startHour":hours+":00"+ " "+ ampm,
                    "startHourC":hours+":00",
                    "duration":"",
                    "endHour":hours+':30',
                    "interval":(hours+":00") + "-" + (hours+':30') + ampm,
                    "timing": ampm,
                    "classes":["placeholder-top-left"],
                    "descriptionField":" ",
                    "children": new ArrayEx([]),
                }
                
                dp1[_guidField] = StringUtils.guid();
                arrayHours[k] = dp1;

                let dp2 = {
                    "value":" ",
                    "valueHour":" ",
                    "startHour":hours+":30" + "" +ampm ,
                    "startHourC":hours+":30",
                    "duration":" ",
                    "classes":[],
                    "endHour":(hours+1)+':00',
                    "interval":(hours+":30") + "-" + ((hours == 12 ) ? ((j%12)+1) : (hours+1))+':00' + ampm,
                    "descriptionField":" ",
                    "children":new ArrayEx([]),
                }
                
                dp2[_guidField] = StringUtils.guid();
                arrayHours[k + _self.dataProvider.length] = dp2;

            }
            dataProvider_second.splicea(dataProvider_second.length,0,arrayHours);                                                           
        }
     
        return dataProvider_second; 
    };

    this.previous = function(){
        let two_weeks_a = new Date(_dataProvider[0].dateContent[0]);
        let two_weeks_ago = new Date(two_weeks_a.getTime() - 7 * 24 * 60 * 60 * 1000) ;
        let new_dp_prev = _createDataProvider(two_weeks_ago);
        _nowDate = two_weeks_ago;
        let new_dp_prev_1 = new_dp_prev;
        let dp_first = _repeater_for_week.dataProvider;
        dp_first.splicea(0,dp_first.length,new_dp_prev_1);
        _self.dataProvider = new_dp_prev;
    }


    this.next = function() {
        
        let one_week_n = new Date(_dataProvider[0].dateContent[0]);
        let one_week_next = new Date(one_week_n.getTime() + 7 * 24 * 60 * 60 * 1000);
        let new_dp_next = _createDataProvider(one_week_next);
        _nowDate = one_week_next;
        let new_dp_next_1 = new_dp_next;
        let dp_first = _repeater_for_week.dataProvider;
        dp_first.splicea(0,dp_first.length,new_dp_next_1);
        _self.dataProvider = new_dp_next;
    }

    let previous_click = function(){
        _self.previous();
    }

    let next_click = function(){
        _self.next();
    }

    this.generateDay = function(ra){
     
        let d  = ra.currentIndex % 7;
        day =_self.dataProvider[d].value;
        console.log("day",day);
        return day;
    }

    this.convertHour = function (time){
        let hours = parseInt(time.substr(0, 2));
        if(time.indexOf('am') != -1 && hours == 12) {
            time = time.replace('12', '00');
        }
        if(time.indexOf('pm')  != -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return time.replace(/(am|pm)/, '');


            // let ts = time;
            // let te = ts.split(' ')[1];
            // let H = +te.substr(0, 2);
            // let h = (H % 12) || 12;
            // h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
            // let ampm = H < 12 ? " AM" : " PM";
            // te = h + te.substr(2, 3) + ampm;
            // return te;
        
    }
    let _cellClick = function(e,ra) {
       
        let event = jQuery.Event("cellClick");
        //Konvertimi i ores 12 ne 24 
        event.startHour = _self.convertHour(ra.currentItem.startHour);
        event.dateContent = _self.generateDay(ra);
        let addDays = function (date, days) {
            let result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        
        let time =  addDays(_self.calendarStartDate,ra.currentIndex%7);
        let  timeToDate = new Date(time);
        let hourS = event.startHour.split(':');
        let timeToDateHour = timeToDate.setHours(parseInt(hourS[0],10),parseInt(hourS[1],10),0);
        event.startDateTime = new Date(timeToDateHour);
        event.cell = this;
        _self.trigger(event);
    };

    let _componentCalendarWeek;
    let fnContainerDelayInit = function(){
        _componentCalendarWeek = {
            ctor: Container,
            props: {
                type: ContainerType.NONE,
                id:"Out_Week_Container",
                components:[
                    {
                        ctor: Container,
                        props:{
                            type:ContainerType.NONE,
                            id:"Container_Month_Year_Prev_Next_Button",
                            components:[
                                {
                                    ctor: Repeater,
                                    props:{
                                        id:"repeater_For_WeekDays_AND_Dates",
                                        rendering:{
                                            direction:"horizontal",
                                            separator:false
                                        },
                                        dataProvider:_dataProvider,
                                        components:[
                                            {
                                                ctor: Container,
                                                props:{
                                                    type:Container.NONE,
                                                    id:"Container_Week_Days",
                                                    height:40,
                                                    width:150,
                                                    label:'{'+_labelField+'}',
                                                    classes:'{'+_classFieldWeek+'}',
                                                    classes:['fc-week-display']
                                                }
                                            },
                                            {
                                                ctor:Container,
                                                props:{
                                                    type:ContainerType.NONE,
                                                    id:"container_top",
                                                    height:40,
                                                    width:150,
                                                    classes:["fc-repeater-top"],
                                                    components:[
                                                        {
                                                            ctor: Repeater,
                                                            props:{
                                                                id:"repeater_top",
                                                                dataProvider: "{children}",
                                                                rendering:{
                                                                    direction:"vertical",
                                                                    separator:false,
                                                                },
                                                                components:[
                                                                    {
                                                                        ctor:Container,
                                                                        props:{
                                                                            type:ContainerType.NONE,
                                                                            top:"{top}",
                                                                            height:"{height}",
                                                                            marginTop:"{marginTop}",
                                                                            marginLeft:"{marginLeft}",
                                                                            id:"Container_top",
                                                                            label:"{descriptionField}",
                                                                            classes:["placeholder-top-left","fc-event-first"],
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    ctor:Container,
                                    props:{
                                        type:ContainerType.NONE,
                                        id:"Container_Repeater",
                                        classes:["fc-float"],
                                        components:[
                                            {
                                                ctor: Repeater,
                                                props:{
                                                    id:'repeater_for_weekDays_and_dates_'+_self.guid,
                                                    rendering:{
                                                        direction:"horizontal",
                                                        separator:false
                                                    },
                                                    classes:["fc-float"],
                                                    dataProvider: _dataProvider_Hour,
                                                    components:[
                                                        {
                                                            ctor:Container,
                                                            props:{
                                                                type:ContainerType.NONE,
                                                                id:"pass_value_hour",
                                                                label:'{'+_valueHour+'}',
                                                                classes:["fc-container-label-hour"],
                                                                height:20,
                                                                width:20,
                                                            }
                                                        },
                                                        {
                                                            ctor:Container,
                                                            props:{
                                                                type:ContainerType.NONE,
                                                                id:"container_hour_display",
                                                                components:[
                                                                    {
                                                                        ctor:Container,
                                                                        props:{
                                                                            type:ContainerType.NONE,
                                                                            id:"container_half",
                                                                            label:'{'+_interval+'}',
                                                                            classes:["fc-hour","placeholder-top-left"],
                                                                            height:10,
                                                                            width:150,
                                                                        }
                                                                    },
                                                                ],
                                                                "click":_cellClick,
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
        _componentCalendarWeek.props.ownerDocument = _self.ownerDocument;
    };
    if(_props.calendarEvents){
        this.calendarEvents = _props.calendarEvents;
    }
    _dataProvider = _createDataProvider( new Date(_nowDate.getTime() ));
    _dataProvider_Hour = initHourGrid();
    fnContainerDelayInit(); 
    _props.components = [_componentCalendarWeek];
    let r = Container.call(this, _props);
    return r;
}
CalendarWeek.prototype.ctor = 'CalendarWeek';