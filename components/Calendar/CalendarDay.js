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
                var datanow = new Date();
                //_dataProvider = _createHours(datanow,event);
                //this.addComponent(_componentCalendarPerDay);
                // _component_Mday = this.addComponent(_component_Modal_Event_Day);
                //_component_Cday = this.addComponent(_componentCalendarPerDay);
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
//guidField:"guid",
dateContent:"",
timing :" ",
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
    var dataProvider = [];
        
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
        "timing": ampm,
        "dateContent":today+'-'+ myActualMonth +'-'+currentYear,
        "children": new ArrayEx([]),
    }
    var hourInterval_2 =  dp1.interval +" "+ dp1.timing + " " + dp1.dateContent;
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
    dataProvider.push(dp1);
    
    
    var dp2 = {
        "value":" ",
        "startHour":hours+":30",
        "endHour":(hours+1)+':00',
        "interval":(hours+":30") + "-" + ((hours == 12 ) ? ((i%12)+1) : (hours+1))+':00' + ampm,
        "timing":ampm,
        "dateContent":today+'-'+ myActualMonth +'-'+currentYear,
        "children":new ArrayEx([]),
    }

    var hourInterval_3 = dp2.interval +" "+ dp2.timing + " " +dp2.dateContent; 
    if(hourInterval_3 in dayEvents){
        var children_4=[];
        for(var ks=0;ks<dayEvents[hourInterval_3].length;ks++){
            children_4[ks] = {
            "value":dayEvents[hourInterval_3][ks].descriptionField,
            "classes":["fc-event"],
        }
    }
    dp2.children = new ArrayEx(children_4);
        }   
    dataProvider.push(dp2);
    }
return dataProvider;
}


_props = extend(false,false,_defaultParams,_props);
var _beforeAttach = _props.beforeAttach;
//var _guidField = _props.guidField;
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
var  _timing = _props.timing;
var _component_Mday;
var eve = [];
var _click = _props.click;

    
// var a =_self.dataProvider;
// var b= [] ;
// var c= new Proxy(a,b);
//     console.log("c",c);
//     _self.dataProvider = c;
    

this.saveEvent  =  function(e){
//var startHour_Global = _self.$container[0].children[0].children[2].children[0].children[0].children[0].innerText ;
//this.$el.click();
// var timing = myModal.$container[0].children[0].value;

// _cmp.children[_cmp.my("Label_Displaying_WeekDay")].label  
//var currentDate = _cmp.children[_cmp.my("Label_Displaying_WeekDay")].label ; 
// var myActualDate = currentDate.substr(currentDate.indexOf(" ")+1);
// var currentMonth = _self.children["OutContainer"].children["Container_Month_Year_Button"].children["label_month"].label;
// var currentYear = _self.children["OutContainer"].children["Container_Month_Year_Button"].children["label_year"].label ;
console.log("nowDate",_nowDate);
// var dateContent = current.getDate()+'-'+current.getMonth()+'-'+current.getFullYear();
//var dateContent = myActualDate  + "-" + currentMonth + "-" + currentYear;
var dateContent = _nowDate.getDate() +'-'+ nowDate.getMonth() + '-' + _nowDate.getFullYear();
// var interval = _component_Mday.children.TextInput = ;
var interval = myModal.$container[0].children[1].value + " "+ timing +" "+ dateContent;

console.log("this",interval);
var event_Text = myModal.children["TextInput_356"].value;
var array_events = [{"interval":interval,"descriptionField":event_Text,"timing":timing}]
var new_dp_event = _createHours(_nowDate,array_events);
    
if(new_dp_event.length>0)
    {
        for(var i=0 ; i< new_dp_event.length;i++)
        {
            if(new_dp_event[i].children) {
            if(!new_dp_event[i].children[_guidField]) {
                new_dp_event[i].children[_guidField] = StringUtils.guid();
                }
            }
        }
    }



_self.components[0].props.components[2].props.components[0].props.dataProvider.splicea(0,_self.components[0].props.components[2].props.components[0].props.dataProvider.length,new_dp_event);
//e.stopPropagation();

myModal.children["TextInput_356"].value = " ";
myModal.hide();  

};
   
this.clickHandler = function(e){
// saveEvent;
}
 

_props.beforeAttach = function(e) {
    this.$container = this.$el;
    // fnContainerDelayInit();
    // _componentCalendarPerDay.props.ownerDocument = this.ownerDocument;
    // _cmp = Component.fromLiteral(_componentCalendarPerDay);
    _component_Cday = this.addComponent(_componentCalendarPerDay);
    this.dataProvider = _props.dataProvider;
    _dataProvider = _createHours(_nowDate,eve);
        e.preventDefault();
}


var _prev_day = function(eve){

    _nowDate.setDate(_nowDate.getDate()-1);
    var new_prev = CalendarConstantsDays[_nowDate.getDay()];
    var update_prev_date = _nowDate.getDate();

    var update_prev_date = _nowDate.getDate();

    var new_dp_prev = _createHours(_nowDate,eve);
    if(new_dp_prev>0){
        for(var i=0;i<new_dp_prev.length;i++){
            if(!new_dp_prev[i][_guidField]){
                new_dp_prev[i][_guidField] = StringUtils.guid();
            }
        }
    }

    _self.literal.props.components[0].props.components[2].props.components[0].props.dataProvider.splicea(0,_self.literal.props.components[0].props.components[2].props.components[0].props.dataProvider.length,new_dp_prev);
    fnContainerDelayInit();
    _componentCalendarPerDay.props.ownerDocument = _self.ownerDocument;
    _cmp = Component.fromLiteral(_componentCalendarPerDay);
    _cmp.children[_self.my("Label_Displaying_WeekDay")].label  = new_prev + " "+ update_prev_date; 
    _cmp.children[_self.my("Container_Month_Year_Button")].children[_self.my("label_month")].label = CalendarConstantsMonths[_nowDate.getMonth()];
    _cmp.children[_self.my("Container_Month_Year_Button")].children[_self.my("label_year")].label =_nowDate.getFullYear();
}

var _clickHandler = function(){

}

var _next_day = function(eve){

    _nowDate.setDate(_nowDate.getDate() + 1);
    _nowDate.setMonth(10)  ;
    
    var new_day = CalendarConstantsDays[_nowDate.getDay()];
    var update_date = _nowDate.getDate();
    var new_dp_next = _createHours(_nowDate,eve);
    if(new_dp_next>0){
        for(var i=0;i<new_dp_next.length;i++){
            if(!new_dp_next[i][_guidField]){
                new_dp_next[i][_guidField] = StringUtils.guid();
            }
        }
    }
    
    _self.literal.props.components[0].props.components[2].props.components[0].props.dataProvider.splicea(0,_self.literal.props.components[0].props.components[2].props.components[0].props.dataProvider.length,new_dp_next);
    // fnContainerDelayInit();
    // _componentCalendarPerDay.props.ownerDocument = _self.ownerDocument;
    // _cmp = Component.fromLiteral(_componentCalendarPerDay);
    
    // _cmp.children[_self.my("Label_Displaying_WeekDay")].props.label;// = new_day + " "+ update_date;
    // _cmp.children[_self.my("Container_Month_Year_Button")].children[_self.my("label_month")].label;//= CalendarConstantsMonths[_nowDate.getMonth()];
    // _cmp.children[_self.my("Container_Month_Year_Button")].children[_self.my("label_year")].label;// =_nowDate.getFullYear();

    // _self.children["OutContainer"].children["Container_Month_Year_Button"].children["label_month"].label = months[_nowDate.getMonth()];
    // _self.children["OutContainer"].children["Container_Month_Year_Button"].children["label_year"].label =_nowDate.getFullYear();

}

var _cellClick = function(e, ra) {
        // myModal.show();
        // var interval = this.children["container_half_1"].label;
        // var hidden = this.$el[0].children[1].value;
        // myModal.$container[0].children[0].value  = hidden; 
        // myModal.$container[0].children[1].value = interval;
       
    var event = jQuery.Event("cellClick");
    // event.child = this;
    event.interval = ra.currentItem.interval;
    event.cell = this;
    _self.trigger(event);
    
}

var  _componentCalendarPerDay;
var fnContainerDelayInit  = whenDefined(this,"guid",function(){

_componentCalendarPerDay = {
    constructor: Container,
    props: {
        type: ContainerType.NONE,
        id:"OutContainer_"+_self.guid,
        guid: _self.guid,
        //afterAttach: _registerSurrogate,
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
                                                                dataProvider:"{currentItem.children}",
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
                                                                            placeholder:"{value}",
                                                                            classes:["fc-event", "placeholder-top-left"],
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
});
fnContainerDelayInit();
_componentCalendarPerDay.props.ownerDocument = this.ownerDocument;
_cmp = Component.fromLiteral(_componentCalendarPerDay);
console.log("cmp",_cmp);
Container.call(this,_props);


}
CalendarDay.prototype.ctor = 'CalendarDay';