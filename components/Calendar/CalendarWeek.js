/**
 * This is a CalendarWeek Component
 * 
 * Kreatx 2019
*/

 var CalendarWeek = function(_props)
{
    _self = this;
    var _creationFinished;
    var _oldDataProvider;
    var dayEvents = [];

    Object.defineProperty(this,"dataProvider",
    {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider !=v)
            {
                if(_dpWatcher){
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange",_dpMemberChanged);
                }
                _dataProvider = !ArrayEx.isArrayEx(v)? new ArrayEx(v):v;
                _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                _dpWatcher.watch(_dataProvider,"length",_dpLengthChanged);
                _dataProvider.on("propertyChange",_dpMemberChanged);
                //_self.removeAllChildren();
            }
        }
    });

    var _dpWatcher;
    var _dpLengthChanged = function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(_creationFinished)
            _self.dataProviderChanged();
    }
    var _dpMemberChanged = function(e)
    {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(_creationFinished && ["length","guid"].indexOf(e.property)==-1)
            _self.dataProviderChanged();
    }
    this.dataProviderChanged = function(){
            //add or remove rows
            for(var i=0;i<_dataProvider.length;i++){
                if(!this.dataProvider[i][_guidField])
                    this.dataProvider[i][_guidField] = StringUtils.guid();
            }
                var toAdd = differenceOnKeyMatch(_dataProvider,_oldDataProvider,_guidField,false,true);
                var toRemove = differenceOnKeyMatch(_oldDataProvider, _dataProvider,_guidField,false,true);
                var toRefresh = intersect(toAdd.a1_indices, toRemove.a1_indices);
                
                for(var i=toRemove.a1_indices.length;i>=0;i--) {
                    if(toRefresh.indexOf(toRemove.a1_indices[i])==-1)
                    this.children["Out_Week_Container"].removeChildAtIndex(toRemove.a1_indices[i]);
                }
                for(var i=0;i<toAdd.a1_indices.length;i++){
                    if(toRefresh.indexOf(toAdd.a1_indices[i])==-1){
                        var ind = toAdd.a1_indices[i]; 
                        var cmp = this.createCalendar([this.dataProvider[ind]]);
                        this.children["Out_Week_Container"].addComponent(cmp[0],ind);
                    }
                }    
            //for the rows that we just added there is no need to refreshBindings
            for(var i=0; i<toRefresh.length;i++){
                var cmp = this.children["Out_Week_Container"].children[this.children["OutcontainerForWeekDays"].components[toRefresh[i]].props.id];
                cmp.refreshBindings(this.dataProvider[toRefresh[i]]);
                cmp.$el.attr(_guidField, this.dataProvider[toRefresh[i]][_guidField]);
                cmp.attr[_guidField] = this.dataProvider[toRefresh[i]][_guidField];
            }
            _oldDataProvider = extend(true,false,this.dataProvider);
    }

    Object.defineProperty(this, "nowDate",{
    get: function nowDate() {
        return  _nowDate;
    }
    });

    this.afterAttach = function(e){
        if(typeof _afterAttach == 'function')
        _afterAttach.apply(this,arguments);
        _creationFinished = true;
    }

    var _defaultParams = {
        dataProvider: [],
        nowDate: new Date(),
        // guidField:"guid",
        labelField:'label',
        labelFieldHour:'label',
        interval:'',
        childrenField:"children",
        dateContent:"",
        time :" ",
        startHour:" ",
        endHour:" ",
        guidField:"guid",
        classField1:" ",
        descriptionField:" ",
    }


    var _createDataProvider = function(_nowDate,event){
        var _dataProvider = [];
        var dataProvider_first = [];
        var dataProvider_second = [];
        var _dates = function(today){
            var week= []; 
            // Starting Monday 
            today.setDate((today.getDate() - today.getDay() +1));
            for (var i = 0; i < 7; i++){
                week.push(new Date(today)); 
                today.setDate(today.getDate() +1);
            }
        return week; 
        }

        var input = _nowDate;
        var result = _dates(input);
        var result_final=result.map(d=> d.toString());
        
        for (var i=0;i<result_final.length;i++){ 
            var day_dp = result_final[i].split(" ").slice(0,1);
            var date_dp = result_final[i].split(" ").slice(2,3);
            var day_string = day_dp[0];
            var date_string = date_dp[0];
            var result_complete = day_string + " " + date_string;
            var dp1 = {
                "value":result_complete,    
                "startHour":"",
                "interval":"",
                "valueHour":" ",
                "classField1":["fc-float-week"],
            }
            dp1[_guidField] = StringUtils.guid();
            dataProvider_first.push(dp1);   
        }

        if(event && event[0])
        {
            if(event[0].dateContent in dayEvents){
                dayEvents[event[0].dateContent].push(event[0]);
            }else{
                dayEvents[event[0].dateContent] = [] ;
                dayEvents[event[0].dateContent].push(event[0]);
            }
        }
        
        for(var j=0;j<24;j++){
            var hours = j;
                hours = hours % 12;
                hours = hours ? hours :12 ; // Hour: '0' -> '12'
                var ampm = j >=12 ? 'pm':'am';
            for(var k=0;k<dataProvider_first.length;k++){
                if(k==0){
                    var dp1 = {
                        "value":" ",
                        "valueHour":hours+":00",
                        "startHour":hours+":00",
                        "endHour":hours+':30',
                        "interval":(hours+":00") + "-" + (hours+':30') + ampm,
                        "timing": ampm,
                        "dateContent":dataProvider_first[k] ,
                        "time":(hours+":00") + "-" + (hours+':30') + ampm+" "+ JSON.parse(JSON.stringify(dataProvider_first[k].value)),
                        "children": new ArrayEx([]),
                    }
                }else{
                    var dp1 = {
                        "value":" ",
                        "valueHour":" ",
                        "startHour":hours+":00",
                        "endHour":hours+':30',
                        "interval":(hours+":00") + "-" + (hours+':30') + ampm,
                        "timing": ampm,
                        "dateContent": dataProvider_first[k] ,
                        "time":(hours+":00") + "-" + (hours+':30') + ampm + " " + JSON.parse(JSON.stringify(dataProvider_first[k].value)),
                        "children": new ArrayEx([]),
                    }
                }
                dp1[_guidField] = StringUtils.guid();
                var hour_interval = dp1.interval + " " + dp1.dateContent.value;
                if(hour_interval in dayEvents){
                    var children_1 = [];
                    for(var rs=0;rs<dayEvents[hour_interval].length;rs++){
                        children_1[rs] = {
                            "value":dayEvents[hour_interval][rs].descriptionField,
                            "classes":["fc-event"],
                        }
                    }
                    dp1.children = new ArrayEx(children_1);
                }
                dataProvider_second.push(dp1);
            }
            for(var r=0;r<dataProvider_first.length;r++){
                var dp2 = {
                    "value":" ",
                    "valueHour":" ",
                    "startHour":" ",
                    "endHour":(hours+1)+':00',
                    "interval":(hours+":30") + "-" + ((hours == 12 ) ? ((j%12)+1) : (hours+1))+':00' + ampm,
                    "dateContent":dataProvider_first[r] ,
                    "time":(hours+":30") + "-" + ((hours == 12 ) ? ((j%12)+1) : (hours+1))+':00'+ ampm + " "+JSON.parse(JSON.stringify(dataProvider_first[r].value)),
                    "children":new ArrayEx([]),
                }
            
            dp2[_guidField] = StringUtils.guid();
            var hourInterval_1 = dp2.interval +" " + dp2.dateContent.value; 
            if(hourInterval_1 in dayEvents){
                var children_2 = [];
                for(var ks=0;ks<dayEvents[hourInterval_1].length;ks++){
                        children_2[ks] = {
                        "value":dayEvents[hourInterval_1][ks].descriptionField,
                        "classes":["fc-event"],
                    }
                }
                dp2.children = new ArrayEx(children_2);
            } 
            dataProvider_second.push(dp2);
            }
               
        }

        _dataProvider.pushUnique(dataProvider_first);
        _dataProvider.pushUnique(dataProvider_second);        
        return _dataProvider;
    }
    

    _props = extend(false,false,_defaultParams,_props);
    var _beforeAttach = _props.beforeAttach;
    var _nowDate = _props.nowDate;
    // var _guidField = _props.guidField;
    var _labelField = _props.labelField;
    var _guidField = _props.guidField;
    var _labelFieldHour = _props._labelFieldHour;
    var _startHour = _props.startHour;
    var _endHour = _props.endHour;
    var _interval = _props.interval;
    var _childrenField = _props.childrenField;
    var _descriptionField = _props.descriptionField;
    var _time = _props.time;
    var _dateContent = _props.dateContent;
    var  _timing = _props.timing;
    var  _valueHour = _props.valueHour;
    var _classField1 = _props.classField1;
    var eve = [];
    var _dataProvider = _props.dataProvider;
    var _cmpCalendar_Week ;
    var _component_Mday;

    this.addEvent = function(event){
        var result = _dataProvider[1];
        result.reduce(function (r, a) { return r.concat(a); }, [])
        var ind = indexOfObject(result,"time",event.time);
        result[ind].children.splice(result[ind].children.length,0,event);
        var key  =  event.time ;
        if(dayEvents[key] == null){
            dayEvents[key] = [];
        }
        dayEvents[key].push(event);
    };
    
    _props.beforeAttach = function(e){
        _dataProvider = _createDataProvider(_nowDate,eve);
        fnContainerDelayInit();
        this.$container = this.$el;
        this.components = [_componentCalendarWeek];
    }

    var _prev_week = function(eve){
        
        var two_weeks_ago = new Date(_nowDate.getTime() - 14 * 24 * 60 * 60 * 1000) ;
        var new_dp_prev = _createDataProvider(two_weeks_ago,eve);
        _nowDate = two_weeks_ago;
        var new_dp_prev_1 = new_dp_prev[0];
        var dp_first = _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("repeater_For_WeekDays_AND_Dates")].dataProvider;
        dp_first.splicea(0,dp_first.length,new_dp_prev_1);
        var dp_new_for_hours_prev = new_dp_prev[1];
        var dp_second = _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("Container_Repeater")].children[_self.my("repeater_for_weekDays_and_dates")].dataProvider;
        dp_second.splicea(0,dp_second.length,dp_new_for_hours_prev);
        _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("label_for_month")].label = CalendarConstantsMonths[_nowDate.getMonth()];
        _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("label_for_year")].label = _nowDate.getFullYear();

    }


    var _next_week = function(eve){
        var new_dp_next = _createDataProvider(_nowDate,eve);
        var new_dp_next_1 = new_dp_next[0];
        var dp_first = _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("repeater_For_WeekDays_AND_Dates")].dataProvider;
        dp_first.splicea(0,dp_first.length,new_dp_next_1);
        var dp_new_for_hours_next = new_dp_next[1];
        var dp_second = _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("Container_Repeater")].children[_self.my("repeater_for_weekDays_and_dates")].dataProvider;
        dp_second.splicea(0,dp_second.length,dp_new_for_hours_next);
        _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("label_for_month")].label = CalendarConstantsMonths[_nowDate.getMonth()];
        _self.children[_self.my("Out_Week_Container")].children[_self.my("Container_Month_Year_Prev_Next_Button")].children[_self.my("label_for_year")].label = _nowDate.getFullYear();
    }


    var _cellClick = function(e,ra) {
        var event = jQuery.Event("cellClick");
        event.interval = ra.currentItem.interval;
        event.dateContent = ra.currentItem.dateContent.value;
        event.cell = this;
        _self.trigger(event);
    }
    
    var _componentCalendarWeek;
    var fnContainerDelayInit = function(){
    _componentCalendarWeek = {
        constructor: Container,
        props: {
            type: ContainerType.NONE,
            id:"Out_Week_Container_"+_self.guid,
            guid: _self.guid,
            components:[
                {
                    constructor: Container,
                    props:{
                        type:ContainerType.NONE,
                        id:"Container_Month_Year_Prev_Next_Button_"+_self.guid,
                        components:[
                            {
                                constructor: Label,
                                props:{
                                    id:"label_for_month_"+_self.guid,
                                    label:CalendarConstantsMonths[new Date().getMonth()],
                                    labelType:LabelType.label,
                                    classes:["fc-label-month-w"],
                                }
                            },
                            {
                                constructor: Label,
                                props:{
                                    id:"label_for_year_"+_self.guid,
                                    label:_nowDate.getFullYear(),
                                    labelType:LabelType.label,
                                    classes:["fc-label-year-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:"button_for_day_"+_self.guid,
                                    label:"day",
                                    type:'button',
                                    classes:[ButtonSize.SMALL,"fc-button-left-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:"button_for_week_"+_self.guid,
                                    label:"week",
                                    type:"button",
                                    classes:[ButtonSize.SMALL,"fc-button-center-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:"button_for_month_"+_self.guid,
                                    label:"month",
                                    type:"button",
                                    classes:[ButtonSize.SMALL,"fc-button-right-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:"button_previous_week_"+_self.guid,
                                    type:"button",
                                    classes:["fc-button-prev-w",ButtonSize.LARGE],
                                    components:[
                                    {
                                        constructor:Label,
                                        props:{
                                            id:'fa',
                                            labelType:LabelType.i,
                                            classes:["fas","fa-arrow-left"],
                                        }
                                    }],
                                "click":_prev_week,
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:"button_next_week_"+_self.guid,
                                    type:"button",
                                    classes:["fc-button-next-w",ButtonSize.LARGE],
                                    components:[
                                    {
                                        constructor:Label,
                                        props:{
                                            id:'fad',
                                            labelType:LabelType.i,
                                            classes:["fas","fa-arrow-right"],
                                        }
                                    }],
                                "click":_next_week,
                                    
                                }
                            },
                            {
                                constructor: Repeater,
                                props:{
                                    id:"repeater_For_WeekDays_AND_Dates_"+_self.guid,
                                    rendering:{
                                        direction:"horizontal",
                                        separator:false
                                    },
                                    dataProvider:_dataProvider[0],
                                    components:[
                                    {
                                        constructor: Container,
                                        props:{
                                            type:Container.NONE,
                                            id:"Container_Week_Days_"+_self.guid,
                                            height:40,
                                            width:150,
                                            placeholder:'{'+_labelField+'}',
                                            classes:'{'+_classField1+'}',
                                            classes:['fc-week-display',"placeholder"]
                                            }
                                    },
                                    
                                    ]
                                }
                            },
                            {
                                constructor:Container,
                                props:{
                                    type:ContainerType.NONE,
                                    id:"Container_Repeater_"+_self.guid,
                                    classes:["fc-float"],
                                    components:[
                                        {
                                            constructor: Repeater,
                                            props:{
                                                id:'repeater_for_weekDays_and_dates_'+_self.guid,
                                                rendering:{
                                                    direction:"horizontal",
                                                    separator:false
                                                },
                                                classes:["fc-float"],
                                                dataProvider:_dataProvider[1],
                                                components:[
                                                    {
                                                        constructor:Container,
                                                        props:{
                                                            type:ContainerType.NONE,
                                                            id:"pass_value_hour_"+_self.guid,
                                                            placeholder:'{'+_valueHour+'}',
                                                            classes:["fc-container-label-hour","placeholder"],
                                                            height:20,
                                                            width:20,
                                                        }
                                                    },
                                                    {
                                                        constructor:Container,
                                                        props:{
                                                            type:ContainerType.NONE,
                                                            id:"container_hour_display_"+_self.guid,
                                                            components:[
                                                                {
                                                                    constructor:Container,
                                                                    props:{
                                                                        type:ContainerType.NONE,
                                                                        id:"container_half_"+_self.guid,
                                                                        placeholder:'{'+_interval+'}',
                                                                        classes:["fc-hour","placeholder-top-left"],
                                                                        height:10,
                                                                        width:150,
                                                                    }
                                                                },
                                                                {
                                                                    constructor: Container,
                                                                    props:{
                                                                        type:ContainerType.NONE,
                                                                        id:"Repeater_Container_"+_self.guid,
                                                                        components:[
                                                                            {
                                                                                constructor:Repeater,
                                                                                props:{
                                                                                    id:"Repeater_Event_"+_self.guid,
                                                                                    dataProvider:"{children}",
                                                                                    rendering:{
                                                                                        direction:"horizontal",
                                                                                        separator:false
                                                                                    },
                                                                                    components:[
                                                                                        {
                                                                                            constructor:Container,
                                                                                            props:{
                                                                                                type:ContainerType.NONE,
                                                                                                id:"Container_Container_"+_self.guid,
                                                                                                placeholder:"{descriptionField}",
                                                                                                classes:["fc-event","placeholder-top-left"],
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
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

    Container.call(this,_props);
}
CalendarWeek.prototype.ctor = 'CalendarWeek';