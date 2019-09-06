/**
 * This is a CalendarDay Component
 * 
 * Kreatx 2019
 */
var CalendarDay = function(_props)
{
    var _self = this;
    var _creationFinished;
    var _oldDataProvider;
    var dayEvents = [];

    Object.defineProperty(this, "dataProvider",
   {
       get: function dataProvider() {
           return _dataProvider;
       },
       set: function dataProvider(v) 
       {
           if(_dataProvider != v)
           {
        
               _dataProvider = !ArrayEx.isArrayEx(v)? new ArrayEx(v):v;
               _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
               _dpWatcher.watch(_dataProvider, "length", _dpLengthChanged);
               _dataProvider.on("propertyChange", _dpMemberChanged);
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

this.dataProviderChanged = function ()
{
    {
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
                this.children["OutContainer"].removeChildAtIndex(toRemove.a1_indices[i]);
            }
            for(var i=0;i<toAdd.a1_indices.length;i++){
                if(toRefresh.indexOf(toAdd.a1_indices[i])==-1){
                    var ind = toAdd.a1_indices[i]; 
                    var cmp = this.createCalendar([this.dataProvider[ind]]);
                    this.children["OutContainer"].addComponent(cmp[0],ind);
                }
            }    
        //for the rows that we just added there is no need to refreshBindings
        for(var i=0; i<toRefresh.length;i++)
        {
                var cmp = this.children["OutContainer"].children[this.children["OutcontainerForWeekDays"].components[toRefresh[i]].props.id];
                cmp.refreshBindings(this.dataProvider[toRefresh[i]]);
                cmp.$el.attr(_guidField, this.dataProvider[toRefresh[i]][_guidField]);
                cmp.attr[_guidField] = this.dataProvider[toRefresh[i]][_guidField];
            }
            _oldDataProvider = extend(true,false,this.dataProvider);
    };

}
Object.defineProperty(this, "nowDate",
{
    get: function nowDate() {
        return  _nowDate;
    }
});

this.afterAttach = function (e){
    if(typeof _afterAttach == 'function')
    _afterAttach.apply(this,arguments);
    _creationFinished = true;
}

var _defaultParams = {
    dataProvider: [],
    nowDate : new Date(),
    labelField:'label',
    labelField1:'label',
    startHour:" ",
    endHour:" ",
    descriptionField:" ",
    interval:'',
    childrenField:"children",
    dateContent:"",
    guidField:"guid"
}

var _createHours = function (currentDate,event){
        
    if(event && event[0] )
    {
        if(event[0].interval in dayEvents){
            dayEvents[event[0].interval].push(event[0]);
        
        }else{
            dayEvents[event[0].interval] = [];
            dayEvents[event[0].interval].push(event[0]);
        
        }
    }

    var today = currentDate.getDate();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();
    var myActualMonth = CalendarConstantsMonths[currentMonth];
    var _dataProvider = [];
        
    for(var i = 0; i < 24; i++){
    var hours = i;
    hours = hours % 12;
    hours = hours ? hours :12 ; // Hour: '0' -> '12'
    var ampm = i >=12 ? 'pm':'am';
    var dp1 = {
        "value":hours+":00",
        "startHour":hours+":00",
        "endHour":hours+':30',
        "interval":(hours+":00") + "-" + (hours+':30') + ampm,
        "dateContent":today+'-'+ myActualMonth +'-'+currentYear,
        "children": new ArrayEx([]),
    }
    dp1[_guidField] = StringUtils.guid();
    var hourInterval_2 =  dp1.interval +" " + dp1.dateContent;
        if(hourInterval_2 in dayEvents){
            var children_3 = [];
            for(var rs=0;rs<dayEvents[hourInterval_2].length;rs++){
                children_3[rs] = {
                    "value":dayEvents[hourInterval_2][rs].descriptionField,
                    "classes":["fc-event"],
                }
            }
            dp1.children = new ArrayEx(children_3);      
        }
        _dataProvider.push(dp1);
    
    
        var dp2 = {
            "value":" ",
            "startHour":hours+":30",
            "endHour":(hours+1)+':00',
            "interval":(hours+":30") + "-" + ((hours == 12 ) ? ((i%12)+1) : (hours+1))+':00' + ampm,
            "timing":ampm,
            "dateContent":today + '-' +  myActualMonth + '-' + currentYear,
            "children":new ArrayEx([])
        }
        dp2[_guidField] = StringUtils.guid();
        var hourInterval_3 = dp2.interval +" " + dp2.dateContent; 
        if(hourInterval_3 in dayEvents){
            var children_4 = [];
            for(var ks=0;ks<dayEvents[hourInterval_3].length;ks++){
                    children_4[ks] = {
                    "value":dayEvents[hourInterval_3][ks].descriptionField,
                    "classes":["fc-event"],
                }
            }
            dp2.children = new ArrayEx(children_4);
        }   
        _dataProvider.push(dp2);
    }
    return _dataProvider;
}


_props = extend(false,false,_defaultParams,_props);
var _beforeAttach = _props.beforeAttach;
var _guidField = _props.guidField;
var _labelField = _props.labelField;
var _labelField1 = _props.labelField1;
var _nowDate = _props.nowDate;
var _startHour = _props.startHour;
var _endHour = _props.endHour;
var _interval = _props.interval;
var  _dataProvider = _createHours(_nowDate,eve); 
var _component_Cday;
var _childrenField = _props.childrenField;
var _descriptionField = _props.descriptionField;
var _dateContent = _props.dateContent;
var _component_Mday;
var eve = [];

this.addEvent  =  function(event){
    if(event.date.getTime() == _nowDate.getTime()){
        var ind = indexOfObject(_dataProvider,"interval",event.interval);
        _dataProvider[ind].children.splice(_dataProvider[ind].children.length,0,event);
    }
    var key  =  event.interval + " " + event.dateContent;
    if(dayEvents[key] == null){
        dayEvents[key] = [];
    }
    dayEvents[key].push(event);
};
   
_props.beforeAttach = function(e) {
    _dataProvider = _createHours(_nowDate,eve);
    fnContainerDelayInit();
    this.$container = this.$el;
    this.components = [_componentCalendarPerDay];
}


var _prev_day = function(eve){
    _nowDate.setDate(_nowDate.getDate()-1);
    var new_prev = CalendarConstantsDays[_nowDate.getDay()];
    var update_prev_date = _nowDate.getDate();
    var new_dp_prev = _createHours(_nowDate,eve);
    var dataProvider = _self.children[_self.my("OutContainer")].children[_self.my("Container_Repeater")].children[_self.my("repeaterForHours")].dataProvider;
    dataProvider.splicea(0, dataProvider.length, new_dp_prev);
    _self.children[_self.my("OutContainer")].children[_self.my("Label_Displaying_WeekDay")].label =  new_prev + " "+ update_prev_date;
    _self.children[_self.my("OutContainer")].children[_self.my("Container_Month_Year_Button")].children[_self.my("label_month")].label = CalendarConstantsMonths[_nowDate.getMonth()];
    _self.children[_self.my("OutContainer")].children[_self.my("Container_Month_Year_Button")].children[_self.my("label_year")].label = _nowDate.getFullYear();
}


var _next_day = function(eve){
    _nowDate.setDate(_nowDate.getDate() + 1);
    var new_day = CalendarConstantsDays[_nowDate.getDay()];
    var update_date = _nowDate.getDate();
    var new_dp_next = _createHours(_nowDate,eve);
    var dp = _self.children[_self.my("OutContainer")].children[_self.my("Container_Repeater")].children[_self.my("repeaterForHours")].dataProvider;
    //var dp = _self.dataProvider;
    dp.splicea(0, dp.length, new_dp_next);
    _self.children[_self.my("OutContainer")].children[_self.my("Label_Displaying_WeekDay")].label =  new_day + " "+ update_date;
    _self.children[_self.my("OutContainer")].children[_self.my("Container_Month_Year_Button")].children[_self.my("label_month")].label = CalendarConstantsMonths[_nowDate.getMonth()];
    _self.children[_self.my("OutContainer")].children[_self.my("Container_Month_Year_Button")].children[_self.my("label_year")].label = _nowDate.getFullYear();
}

var _cellClick = function(e, ra) {   

    var event = jQuery.Event("cellClick");
    event.interval = ra.currentItem.interval;
    event.cell = this;
    _self.trigger(event); 
}

var  _componentCalendarPerDay;
var fnContainerDelayInit  = function(){
_componentCalendarPerDay = {
    constructor: Container,
    props: {
        type: ContainerType.NONE,
        id:"OutContainer_"+_self.guid,
        guid: _self.guid,
        components:[
            {
                constructor:Container,
                props:{
                    type:ContainerType.NONE,
                    id:"Container_Month_Year_Button_"+_self.guid,
                    components:[
                        {
                            constructor: Label,
                            props:{
                                id:'label_month_'+_self.guid,
                                label:CalendarConstantsMonths[_nowDate.getMonth()],
                                labelType:LabelType.label,
                                classes:["fc-label-month"],
            
                            }
                        },
                        {
                            constructor:Label,
                            props:{
                                id:'label_year_'+_self.guid,
                                label:_nowDate.getFullYear(),
                                labelType:LabelType.label,
                                classes:["fc-label-year"],
                            }
                        },
                        {
                            constructor:Button,
                            props:{
                                id:'buttonDay_'+_self.guid,
                                label:'day',
                                type:"button",
                                classes:[ButtonSize.SMALL,"fc-button-left"]
                            }
                        },
                        {
                            constructor:Button,
                            props:{
                                id:'buttonWeek_'+_self.guid,
                                label:'week',
                                type:"button",
                                classes:[ButtonSize.SMALL,"fc-button-center"]
                            }
                        },
                        {
                            constructor:Button,
                            props:{
                                id:'buttonMonth_'+_self.guid,
                                label:'month',
                                type:"button",
                                classes:[ButtonSize.SMALL,"fc-button-right"]
                            }
                        },
                        {
                            constructor:Button,
                            props:{
                                id:'button_prev_day_'+_self.guid,
                                type:"button",
                                classes:["fc-button-prev",ButtonSize.LARGE],
                                components:[{
                                    constructor:Label,
                                    props:{
                                        id:'fa',
                                        labelType:LabelType.i,
                                        classes:["fas","fa-arrow-left"],
                                    }
                                }],
                                "click": _prev_day,
                            }
                        },
                        {
                            constructor:Button,
                            props:{
                                id:'button_next_day_'+_self.guid,
                                type:"button",
                                classes:["fc-button-next",ButtonSize.LARGE],
                                components:[{
                                    constructor:Label,
                                    props:{
                                        id:'fad',
                                        labelType:LabelType.i,
                                        classes:["fas","fa-arrow-right"],
                                    }
                                }],
                            "click": _next_day,
                            }
                        },
                    ]
                }
            },
            {
                constructor: Label,
                props:{
                    id:'Label_Displaying_WeekDay_'+_self.guid,
                    label:CalendarConstantsDays[_nowDate.getDay() ] +" " +_nowDate.getDate(),
                    classes:["fc-week-day"],
                }
            },
            {
                constructor:Container,
                props:{
                    type: ContainerType.NONE,
                    id:"Container_Repeater_"+_self.guid,
                    classes:["fc-float"],
                    components:[
                        {
                            constructor: Repeater,
                            props: {
                                id:'repeaterForHours_'+_self.guid,
                                rendering:{
                                    direction:"horizontal",
                                    separator:false
                                },
                                classes:["fc-float"],
                                dataProvider: _dataProvider,
                                components:[
                                    { 
                                        constructor:Container,
                                        props:{
                                            type:ContainerType.NONE,
                                            id:"InContainerForHours_"+_self.guid,
                                            placeholder:'{'+_labelField+'}',
                                            classes:["fc-container-label-hour", "placeholder"],
                                            height:20,
                                            width:20,
                                        }
                                    },
                                    {
                                        constructor:Container,
                                        props:{
                                            type:ContainerType.NONE,
                                            id:"container_for_both_"+_self.guid,
                                            components:[
                                                {
                                                    constructor: Container,
                                                    props:{
                                                        type:ContainerType.NONE,
                                                        id:"container_half_1_"+_self.guid,
                                                        placeholder:'{'+_interval+'}',
                                                        classes:["fc-hour", "placeholder-top-left"],
                                                        height:10,
                                                        width:1050,
                                                    }
                                                },
                                                {
                                                    constructor: Container,
                                                    props:{
                                                        type:ContainerType.NONE,
                                                        id:"container_Repeater_"+_self.guid,
                                                        components:[
                                                            {
                                                                constructor:Repeater,
                                                                props:{
                                                                    id:"event_Repeater_"+_self.guid,
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
                                                                                id:"event_Container_"+_self.guid,
                                                                                placeholder:'{descriptionField}',
                                                                                classes:["fc-event", "placeholder"],
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            },
                                                        ]
                                                    }
                                                },
                                            
                                            ],
                                            "click":_cellClick,
                                        }
                                    }
                                ]   
                            } 
                        },
                    ]
                }
            }
        ]
    }
}
_componentCalendarPerDay.props.ownerDocument = _self.ownerDocument;
};

    Container.call(this,_props);
}
CalendarDay.prototype.ctor = 'CalendarDay';