/**
 * This is a Calendar Component
 * 
 * Kreatx 2019
*/

var Calendar = function(_props){
    _self = this;

    Object.defineProperty(this, "calendarEvents",{
        get: function calendarEvents(){
            return _calendarEvents;
        },
        set: function calendarEvents(v){
            if(_calendarEvents != v){
                _calendarEvents = v;  
            }
        }
    }); 
    Object.defineProperty(this, "calendarDay",{
        get: function calendarDay() {
            return  _calendarDay;
        }
    });
    
    Object.defineProperty(this, "calendarWeek",{
        get: function calendarWeek(){
            return  _calendarWeek;
        }
    });
    Object.defineProperty(this, "calendarMonth",{
        get: function calendarMonth(){
            return  _calendarMonth;
        }
    });
    Object.defineProperty(this, "viewStack",{
        get: function viewStack(){
            return  _viewStack;
        }
    });
    Object.defineProperty(this, "labelMonth",{
        get: function labelMonth(){
            return  _labelMonth;
        }
    });

    Object.defineProperty(this, "labelYear",{
        get: function labelYear() {
            return  _labelYear;
        }
    });
   
    let _defaultParams = {
        nowDate : " ",
        guidField:"guid",
        selectedIndex: 0,
        calendarDay: "",
        calendarWeek:"",
        calendarMonth:"",
        calendarEvents:[],
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm'
    }

    let _calendarDay;
    let _calendarWeek;
    let _calendarMonth;
    let _viewStack;
    let _labelMonth;
    let _labelYear;
    this.beforeAttach = function(e){
        if(e.target.id == this.domID){
            _viewStack = this.container_for_head.viewStack;
            _calendarDay = _viewStack.calendarDay;
            _calendarWeek = _viewStack.calendarWeek;
            _calendarMonth = _viewStack.calendarMonth;
            _labelMonth = this.container_for_head.label_for_month;
            _labelYear = this.container_for_head.label_for_year;
            EventDispatcher.listen([_calendarDay, _calendarWeek, _calendarMonth], "cellClick", function(e){
                _self.trigger(e);
            });
            e.preventDefault();
        }
    }

    let _viewStackComponent;
    let fnViewStackDelayInit = function(){
        _viewStackComponent = {
            ctor: Container,
            props: {
                type:ContainerType.NONE,
                id:"container_for_head",
                components:[
                    {
                        ctor: Label,
                        props:{
                            id:"label_for_month",
                            label:CalendarConstants.Months[_nowDate.getMonth()],
                            labelType:LabelType.label,
                            classes:["fc-label-month-w"],
                        },
                    },
                    {
                        ctor: Label,
                        props:{
                            id:"label_for_year",
                            label:_nowDate.getFullYear(),
                            labelType:LabelType.label,
                            classes:["fc-label-year-w"]
                        }
                    },
                    {
                        ctor: Button,
                        props:{
                            id:"button_for_day",
                            label:"day",
                            type:'button',
                            classes:[ButtonSize.SMALL,"fc-button-left-w"],
                            "click":_clickDay,
                        }
                    },
                    {
                        ctor: Button,
                        props:{
                            id:"button_for_week",
                            label:"week",
                            type:"button",
                            classes:[ButtonSize.SMALL,"fc-button-center-w"],
                            "click":_clickWeek,
                        }
                    },
                    {
                        ctor: Button,
                        props:{
                            id:"button_for_month",
                            label:"month",
                            type:"button",
                            classes:[ButtonSize.SMALL,"fc-button-right-w"],
                            "click":_clickMonth,
                        }
                    },
                    {
                        ctor: Button,
                        props:{
                            id:"button_previous_week",
                            type:"button",
                            classes:["fc-button-prev-w",ButtonSize.LARGE],
                            components:[{
                                ctor:Label,
                                props:{
                                    id:'fa',
                                    labelType:LabelType.i,
                                    classes:["fas","fa-arrow-left"],
                                }
                            }],
                            "click": _prevHandler,
                        }
                    },
                    {
                        ctor: Button,
                        props:{
                            id:"button_next_week",
                            type:"button",
                            classes:["fc-button-next-w",ButtonSize.LARGE],
                            components:[{
                                ctor:Label,
                                props:{
                                    id:'fad',
                                    labelType:LabelType.i,
                                    classes:["fas","fa-arrow-right"],
                                }
                            }],
                        "click": _nextHandler,
                        }
                    },
                    {  
                        ctor: ViewStack,
                        props:{
                            id:'viewStack',
                            selectedIndex:0,
                            enabled:true,
                            components:[
                                {
                                    ctor:CalendarDay,
                                    props:{
                                        id:'calendarDay',
                                        labelField:"value",
                                        labelField1:"value",
                                        startHour:"startHour",
                                        interval:"interval",
                                        endHour:"endHour",
                                        childrenField:"children",
                                        descriptionField:"descriptionField",
                                        timing:"timing",
                                        nowDate:new Date(),
                                        dateContent:"dateContent",
                                        calendarEvents:_calendarEvents,
                                        inputFormat: _inputFormat,
                                        outputFormat:_outputFormat                 
                                    }
                                },
                                {
                                    ctor:CalendarWeek,
                                    props:{
                                        id:'calendarWeek',
                                        nowDate:new Date(),
                                        startHourCalendar:0,
                                        endHourCalendar:24,
                                        labelField:"value",
                                        startHour:"startHour",
                                        duration:"duration",
                                        valueHour:"valueHour",
                                        interval:"interval",
                                        endHour:"endHour",
                                        startRow:"startRow",
                                        childrenField:"children",
                                        descriptionField:"descriptionField",
                                        timing:"timing",
                                        dateContent:"dateContent",
                                        dataProvider_week:"dataProvider_week",
                                        classField1:"classField1",
                                        time:"time",   
                                        top:"top",
                                        height:"height",
                                        marginTop:"marginTop",
                                        marginLeft:"marginLeft",
                                        calendarEvents:_calendarEvents,
                                        inputFormat: _inputFormat,
                                        outputFormat:_outputFormat
                                    }
                                },
                                {
                                    ctor:CalendarMonth,
                                    props: {
                                        id: 'calendarMonth',
                                        labelField:"value",
                                        labelField1:"value",
                                        childrenField: "children",
                                        nowDate:new Date(),
                                        selectedClasses:"selectedClasses",
                                        classField:"classField",
                                        classField1:"classField1",
                                        startField:"startField",
                                        descriptionField:"descriptionField",
                                        dateContent:"dateContent",
                                        nowMonth:new Date().getMonth(),
                                        calendarEvents:_calendarEvents,
                                        inputFormat: _inputFormat,
                                        outputFormat:_outputFormat
                                    }          
                                },
                            ]
                        }
                    }
                ]
            }
        }
        _viewStackComponent.props.ownerDocument = _self.ownerDocument;
    }
    
    _props = extend(false,false,_defaultParams,_props);
    let _nowDate = _props.nowDate;
    let _guidField =  _props.guidField;
    let _selectedIndex = _props.selectedIndex;
    _calendarDay = _props.calendarDay;
    _calendarWeek = _props.calendarWeek;
    _calendarMonth = _props.calendarMonth;
    let _calendarEvents = _props.calendarEvents;
    let _inputFormat = _props.inputFormat;
    let _outputFormat = _props.outputFormat;

    let _clickDay = function(){    
        if(_self.viewStack.selectedIndex < _self.viewStack.components.length){
            _self.viewStack.selectedIndex = 0 ;
            let actualDateforDay =  _self.calendarDay.nowDate;
            _self.labelMonth.label = CalendarConstants.Months[actualDateforDay.getMonth()];
            _self.labelYear.label = actualDateforDay.getFullYear();
        }
    }
    let _clickWeek= function(){
        if(_self.viewStack.selectedIndex < _self.viewStack.components.length){
            _self.viewStack.selectedIndex = 1 ;
            let actualDateforWeek =  _self.calendarWeek.nowDate;
            _self.labelMonth.label = CalendarConstants.Months[actualDateforWeek.getMonth()];
            _self.labelYear.label = actualDateforWeek.getFullYear();
        }
        else{
            _self.viewStack.selectedIndex = 0;
        }
    }
    let _clickMonth = function(){
    
        if(_self.viewStack.selectedIndex < _self.viewStack.components.length){
            _self.viewStack.selectedIndex =  2 ;
            let actualDateforMonth =  _self.calendarMonth.nowDate;
            _self.labelMonth.label = CalendarConstants.Months[actualDateforMonth.getMonth()];
            _self.labelYear.label = actualDateforMonth.getFullYear();
        }
        else {
            _self.viewStack.selectedIndex = 0;
        }
    }


    let _prevHandler = function(){
        if(_self.viewStack.selectedIndex == 0 ){
            _self.calendarDay.previous();
            let actualDateforDay =  _self.calendarDay.nowDate;
            _self.labelMonth.label = CalendarConstants.Months[actualDateforDay.getMonth()];
            _self.labelYear.label = actualDateforDay.getFullYear();
            
        }else if(_self.viewStack.selectedIndex == 1){
            _self.calendarWeek.previous();
            let actualDateforWeek = _self.calendarWeek.nowDate;
            _self.labelMonth.label = CalendarConstants.Months[actualDateforWeek.getMonth()];
            _self.labelYear.label  = actualDateforWeek.getFullYear();
        }else if(_self.viewStack.selectedIndex == 2){
            _self.calendarMonth.previous();
            let actualDateforMonth = _self.calendarMonth.nowDate;
            _self.labelMonth.label = CalendarConstants.Months[actualDateforMonth.getMonth()];
            _self.labelYear.label = actualDateforMonth.getFullYear();
        }
    }
    let _nextHandler = function(){
        if(_self.viewStack.selectedIndex == 0){
            _self.calendarDay.next();
            let actualDateforDay =  _self.calendarDay.nowDate;  
            _self.labelMonth.label = CalendarConstants.Months[actualDateforDay.getMonth()];
            _self.labelYear.label = actualDateforDay.getFullYear();
        }else if(_self.viewStack.selectedIndex == 1){
            _self.calendarWeek.next();
            let actualDateforWeek = _self.calendarWeek.nowDate; 
            _self.labelMonth.label = CalendarConstants.Months[actualDateforWeek.getMonth()];
            _self.labelYear.label = actualDateforWeek.getFullYear();
        }else if(_self.viewStack.selectedIndex == 2){
            _self.calendarMonth.next();
            let actualDateforMonth = _self.calendarMonth.nowDate;
            _self.labelMonth.label = CalendarConstants.Months[actualDateforMonth.getMonth()];
            _self.labelYear.label = actualDateforMonth.getFullYear();
        }
    }
    

    fnViewStackDelayInit();
    _props.components = [_viewStackComponent];
    let r = Container.call(this, _props);
    return r;
}
Calendar.prototype.ctor = 'Calendar';