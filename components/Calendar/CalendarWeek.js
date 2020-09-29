/**
 * This is a CalendarWeek Component
 * 
 * Kreatx 2019
*/
var CalendarWeek = function(_props)
{
    let _self = this;
    let day;
    
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

    this.afterAttach = function(e){
        if(typeof _afterAttach == 'function')
        _afterAttach.apply(this,arguments);
        _creationFinished = true;
    }

       
    let _defaultParams = {
        dataProvider: [],
        type: ContainerType.NONE,
        labelField:'label',
        labelFieldHour:'label',
        interval:'',
        dateContent:"",
        duration:"",
        time :" ",
        startHour:" ",
        startHourCalendar:0,
        endHourCalendar:24,
        endHour:" ",
        classField1:" ",
        descriptionField:" ",
        heightField:"",       
        css: { display: "flex" },
        cellHeight:20
    }
    
    this.dates = function(today){
        var week= []; 
        today.setDate(today.getDate() - today.getDay() +1);
        _self.calendarStartDate = new Date(today.getTime());
        for (var i = 0; i < 7; i++){
            week.push(new Date(today)); 
            today.setDate(today.getDate() +1);
        }
        return week; 
    };
    
    let _intervalToIndex = {};
    let _intervalFromDate = function(currentValue){    
        let date = moment(currentValue.startDateTime, _self.inputFormat);
        let  weekDayNumber = date.weekday();
        return  weekDayNumber-1;
    }
   
    let _createDataProvider = function(){
        let groupedEvents = _self.calendarEvents.groupReduce(_intervalFromDate);
        let _dataProvider = [];
        let input = new Date(_self.nowDate.getTime());
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
            dp1[_self.guidField] = StringUtils.guid();
        
            for (let j = 0; groupedEvents[i] && j < groupedEvents[i].length; j++)
            {
                
                let ds = moment(groupedEvents[i][j].startDateTime, _self.inputFormat);
                let de = moment(groupedEvents[i][j].endDateTime, _self.inputFormat);
                let d_ds = ds.toDate();
                let h = d_ds.getHours();
                let m = d_ds.getMinutes();
                let hm = (h + 1) * 60 + m + 1;
                eventCount[hm] = eventCount[hm]!= null ? ++eventCount[hm]: 0;
                groupedEvents[i][j].value =  result_complete;
                groupedEvents[i][j].valueHour = " ";
                groupedEvents[i][j].duration = de.diff(ds, "minutes");
                groupedEvents[i][j].dateContent = result_second.toJSON().slice(0, 10);
                groupedEvents[i][j].top = _getTop(hm);
                groupedEvents[i][j].height = _getHeight(groupedEvents[i][j].duration);
                groupedEvents[i][j].marginTop = eventCount[hm]*10;
                groupedEvents[i][j].marginLeft = eventCount[hm]*10;                                       
            }
            if(groupedEvents[i]){
                dp1.children = new ArrayEx(groupedEvents[i]);
            }
            _dataProvider.push(dp1); 
        } 
        return _dataProvider;
    }
    

    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) { 
        _props.attr = {};
    }
    let myDtEvts = ["cellClick"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {   
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    let _cellHeight = _props.cellHeight;
    let _labelField = _props.labelField;
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
    let _startHourCalendar = _props.startHourCalendar;
    let _endHourCalendar = _props.endHourCalendar;
    let eve = [];
    let _dataProvider ;
    let _dataProvider_Hour;
    let _cmpCalendar_Week ;
    let _component_Mday;

    
    let _getTop = function(minutes){
        return (minutes*_cellHeight)/30;
    };

    this.addEvent = function(event){
        let result = _self.dataProvider;
        result.reduce(function (r, a) { return r.concat(a); }, [])
        event.value = day;
        console.log("event.value",event.value);
        let ind = indexOfObject(result, "value", event.value);
        event.height = _getHeight(event.duration);
        
        if(ind>-1){
            event.marginLeft =  (result[ind].children.length)*10;
            event.marginTop =  (result[ind].children.length)*10;
            event.height = _getHeight(event.duration);
            
            let ds = moment(event.startDateTime, _self.inputFormat);
            let d_ds = ds.toDate();
            let h = d_ds.getHours();
            let m = d_ds.getMinutes();
            let hm = (h + 1) * 60 + m + 1;
            event.top = _getTop(hm);
            
            result[ind].children.splice(result[ind].children.length,0,event);
        }
        let key = event.value; 
        if(_self.calendarEvents[key] == null){
            _self.calendarEvents[key] = [];
        }       
        _self.calendarEvents[key].push(event);
    };
    
    let _getHeight = function(duration){
        let totalHeight =  Math.max(_cellHeight * duration/30, _cellHeight);
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
            _repeater_for_week = this.cntRow.repeater_For_WeekDays_AND_Dates;
            _repeater_for_hour = this.cntRow.repeater_for_weekDays_and_dates;
            e.preventDefault();
        }
    };

    let initHourGrid = function(){
        let dataProvider_second = new ArrayEx();
        for(let j=_startHourCalendar;j<_endHourCalendar;j++){
            let hours = j;
                hours = hours % 12;
                hours = hours ? hours : 12; // Hour: '0' -> '12'
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
                    "descriptionField":" ",
                    "children": new ArrayEx([]),
                }
                
                dp1[_self.guidField] = StringUtils.guid();
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
                
                dp2[_self.guidField] = StringUtils.guid();
                arrayHours[k + _self.dataProvider.length] = dp2;

            }
            dataProvider_second.splicea(dataProvider_second.length, 0, arrayHours);                                                           
        }
        return dataProvider_second; 
    };
    
    let initHourGrid_Prim = function(){
        let dataProvider_second = new ArrayEx();
        for (let j = 0; j < 24; j++)
        {
            let hours = j;
            hours = hours % 12;
            hours = hours ? hours : 12; // Hour: '0' -> '12'
            let ampm = j >=12 ? 'pm':'am';
        
    
            let dp1 = {
                "value":" ",
                "valueHour":hours+":00",
                "startHour":hours+":00"+ " "+ ampm,
                "startHourC":hours+":00",
                "duration":"",
                "endHour":hours+':30',
                "interval":(hours+":00") + "-" + (hours+':30') + ampm,
                "timing": ampm,
                "descriptionField":" ",
                "children": new ArrayEx([]),
            }
            
            dp1[_self.guidField] = StringUtils.guid();

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
            
            dp2[_self.guidField] = StringUtils.guid();
            dataProvider_second.splicea(dataProvider_second.length, 0, [dp1, dp2]);                                                           
        }
        return dataProvider_second; 
    };
    
    this.previous = function(){
        let two_weeks_a = new Date(_dataProvider[0].dateContent[0]);
        let two_weeks_ago = new Date(two_weeks_a.getTime() - 7 * 24 * 60 * 60 * 1000) ;
        let new_dp_prev = _createDataProvider(two_weeks_ago);
        _self.nowDate = two_weeks_ago;
        let new_dp_prev_1 = new_dp_prev;
        let dp_first = _repeater_for_week.dataProvider;
        dp_first.splicea(0,dp_first.length,new_dp_prev_1);
        _self.dataProvider = new_dp_prev;
    }


    this.next = function() {
        
        let one_week_n = new Date(_dataProvider[0].dateContent[0]);
        let one_week_next = new Date(one_week_n.getTime() + 7 * 24 * 60 * 60 * 1000);
        let new_dp_next = _createDataProvider(one_week_next);
        _self.nowDate = one_week_next;
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
        
        let time =  addDays(_self.calendarStartDate, ra.currentIndex%7);
        let  timeToDate = new Date(time);
        let hourS = event.startHour.split(':');
        let timeToDateHour = timeToDate.setHours(parseInt(hourS[0],10),parseInt(hourS[1],10),0);
        event.startDateTime = new Date(timeToDateHour);
        event.cell = this;
        _self.trigger(event);
    };
    
    let _cmps;
    let fnContainerDelayInit = function(){
        _cmps = [
            {
                ctor: Repeater,
                props: {
                    id: 'repeaterDayHour',
                    rendering: {
                        direction: "vertical",
                        separator: false,
                        wrap: false
                    },
                    classes: ["fc-float"],
                    dataProvider: _dataProvider_Hour_Prim,
                    css: {"margin-top":"60px", "margin-right":"40px"},
                    components: [
                        {
                            ctor: Container,
                            props: {
                                type: ContainerType.NONE,
                                id: "pass_value_hour",
                                label: '{' + _valueHour + '}',
                                classes: ["fc-container-label-hour"],
                                height: 20,
                                width: 20
                            }
                        }
                    ]
                }
            },
            {
                ctor: Container,
                props: {
                    id: 'cntRow',
                    type: ContainerType.NONE,
                    components: [
                        {
                            ctor: Repeater,
                            props: {
                                ownerDocument: _self.ownerDocument,
                                id: "repeater_For_WeekDays_AND_Dates",
                                type: ContainerType.NONE,
                                rendering: {
                                    direction: "horizontal",
                                    separator: false,
                                    wrap: false
                                },
                                css: {display: "flex"},
                                dataProvider: _dataProvider,
                                components: [
                                    {
                                        ctor: Container,
                                        props: {
                                            type: Container.NONE,
                                            id: "Container_Week_Days",
                                            height: 40,
                                            width: 150,
                                            label: '{' + _labelField + '}',
                                            classes: '{' + _classFieldWeek + '}',
                                            classes: ['fc-week-display'],
                                            components: [
                                                {
                                                    ctor: Repeater,
                                                    props: {
                                                        id: "repeater_top",
                                                        dataProvider: "{children}",
                                                        rendering: {
                                                            direction: "vertical",
                                                            separator: false,
                                                            wrap: false
                                                        },
                                                        classes: ["fc-repeater-top"],
                                                        components: [
                                                            {
                                                                ctor: Container,
                                                                props: {
                                                                    type: ContainerType.NONE,
                                                                    top: "{top}",
                                                                    height: "{height}",
                                                                    marginTop: "{marginTop}",
                                                                    marginLeft: "{marginLeft}",
                                                                    id: "Container_top",
                                                                    label: "{descriptionField}",
                                                                    classes: ["fc-event-first"],
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
                            ctor: Repeater,
                            props: {
                                id: 'repeaterDayHour',
                                type: ContainerType.NONE,
                                rendering: {
                                    direction: "horizontal",
                                    separator: false,
                                    wrap: false
                                },
                                classes: ["fc-float"],
                                dataProvider: _dataProvider_Hour,
                                components: [
                                    {
                                        ctor: Container,
                                        props: {
                                            type: ContainerType.NONE,
                                            id: "container_hour_display",
                                            classes: ["fc-hour"],
                                            height: _cellHeight,
                                            width: 150,
                                            components: [
                                            ],
                                            "click": _cellClick,
                                        }
                                    }
                                ]
                            }
                        }
                    ]
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
        if(_props.calendarEvents){
            this.calendarEvents = _props.calendarEvents;
        }
        _dataProvider = _createDataProvider( new Date(_self.nowDate.getTime() ));
        _dataProvider_Hour = initHourGrid();
        _dataProvider_Hour_Prim = initHourGrid_Prim();
        fnContainerDelayInit(); 
        //_props.components = _cmps;
        this.addComponents(_cmps);
        return _rPromise;
    }; 
    
    return r;
}
CalendarWeek.prototype.ctor = 'CalendarWeek';