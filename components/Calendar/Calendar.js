/**
 * This is a Calendar Component
 * 
 * Kreatx 2019
 */

var Calendar = function(_props)
{
    _self = this;
    var _creationFinished;
    var _oldDataProvider;
    var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var _cmp;
   
    Object.defineProperty(this, "dataProvider",
    {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                if(_dpWatcher){
                    _dpWatcher.reset();
                    _dataProvider.off("propertyChange", _dpMemberChanged);
                }
                _dataProvider = !ArrayEx.isArrayEx(v)? new ArrayEx(v):v;
                _dpWatcher = ChangeWatcher.getInstance(_dataProvider);
                _dpWatcher.watch(_dataProvider, "length", _dpLengthChanged);
                _dataProvider.on("propertyChange", _dpMemberChanged);
                _self.removeAllChildren();
                var datanow = new Date();
                _dataProvider = _createData(datanow);
                _cmpCalendar = this.addComponent(_componentCalendar);
                
        
        }
    }
});   

  
    var _dpWatcher;
    var _dpLengthChanged = function(e)
    {
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
                    this.children["OutcontainerForWeekDays"].removeChildAtIndex(toRemove.a1_indices[i]);
                }
                for(var i=0;i<toAdd.a1_indices.length;i++){
                    if(toRefresh.indexOf(toAdd.a1_indices[i])==-1){
                        var ind = toAdd.a1_indices[i]; 
                        var cmp = this.createCalendar([this.dataProvider[ind]]);
                        this.children["OutcontainerForWeekDays"].addComponent(cmp[0],ind);
                    }
                }    
            //for the rows that we just added there is no need to refreshBindings
            for(var i=0; i<toRefresh.length;i++)
            {
                    var cmp = this.children["OutcontainerForWeekDays"].children[this.children["OutcontainerForWeekDays"].components[toRefresh[i]].props.id];
                    cmp.refreshBindings(this.dataProvider[toRefresh[i]]);
                    cmp.$el.attr(_guidField, this.dataProvider[toRefresh[i]][_guidField]);
                    cmp.attr[_guidField] = this.dataProvider[toRefresh[i]][_guidField];
                }
                _oldDataProvider = extend(true,false,this.dataProvider);
        };
    

    }

    this.afterAttach = function (e) {
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
            _creationFinished = true;
    }
    var _defaultParams = {
        dataProvider: [],
        // childrenField: "children",
        labelField:'label',
        labelField1:'label',
        classField1:" ",
        guidField:"guid",
        classField:" ",
        dateContent:'DD/MM/YYYY',
        nowDate :new Date(),
       
    };

    var _getLastMonth = function (d) {
        if (d.getMonth() == 0) {
            return 11
        } else {
            return d.getMonth() - 1;
        }
    }
    

    var _createData = function(currentDate)
    {
       
        // var currentDate = new Date();
        var today = currentDate.getDate();
        var currentMonth=currentDate.getMonth(); // read the current month
        var currentYear=currentDate.getFullYear(); // read the current year
        var nthDay = currentDate.getDay();
        var dataProvider = [];
        var selected  = false;
    
        var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // leap year?
        currentYear % 4 == 0 && currentYear != 1900 ? days_in_month[1] = 29 : days_in_month;
        
        var _daysInMonth = function(iMonth,iYear)
        {
    
        return 32 - new Date(iYear,iMonth,32).getDate();
        //do ktheje diten e fundit te muajit
        // nese i zbresim 32 marrim diten e fundit te muajit
        }

        //Calculating days of last month
        var previousDaysofMonth = currentDate;
        previousDaysofMonth.setDate(1);
        var previousDay = previousDaysofMonth.getDay();
        // Last date of the selected month
        var lastDayOfCurrentMonth = new Date(currentYear, currentMonth +1, 0).getDay();
        if(previousDay == 0){
            previousDay = 7;
        }
        
        //adding daysof last month
        for (var i=1;i<previousDay;i++){
            var j = days_in_month[_getLastMonth(currentDate)]-((previousDay-1)-i);
            var m =_getLastMonth(currentDate)+2;
            var dp1={
                "value":j,
                "selected":selected,
                "classField":"fc-past-days",
                "dateContent":j+'/'+m+'/'+currentYear,
            }
            dataProvider.pushUnique(dp1);
        }


        for(var i=1;i<=_daysInMonth(currentMonth,currentYear);i++) {

            var iterationday = new Date(currentYear, currentMonth, i).getDay();
            if(today == i){
            //    selected = true;
            //    classField="fc-state-highlight";
            
                var dp1={
                    "value":i,
                    "selected" :true,
                    "classField":"fc-state-highlight",
                    "dateContent":new Date().toJSON().slice(0,10).split('-').reverse().join('/'),
                    "children":new ArrayEx([
                        {"value":"Event 1"}
                    ])
                    
                }
            }else if(iterationday == 0 || iterationday == 6){
                var mm = currentMonth+1;
                var dp1={
                    "value":i,
                    "selected" :false,
                    "classField":"fc-past-days",
                    "dateContent":i+'/'+mm+'/'+currentYear,
                    "children":new ArrayEx([
                        {"value":"Event 2"}
                    ])
                }
            }
            else{
                var dp1={
                        "value":i,
                        "selected":false,
                        "dateContent":i+'/'+mm+'/'+currentYear,
                        "classField":"fc-border-weekdays",
                        
                    }
            }

            dataProvider.pushUnique(dp1);

        }
        var nextMonthfirstDay=1;
        if(lastDayOfCurrentMonth !=0){
            for(var i=lastDayOfCurrentMonth;i<7;i++){
                var dp1={
                            "value":nextMonthfirstDay,
                            "selected":selected,
                            "classField":'fc-past-days',
                        }
                dataProvider.pushUnique(dp1);
                nextMonthfirstDay++;
            } 
        }
    return dataProvider;
}

this.openModalEvents = function() {

    var labelBeginDate = {
        constructor: "Label",
        props:{
            id: 'label',
            label: 'Begin Date',
            classes:['fc-event-date']
            },
    };

    var myDateBegin = {
        constructor:"DateTime",
        props:{
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD/MM/YYYY',
        displayFormat: 'MM/DD/YYYY',
        value: _dateContent,
        classes:['fc-event-date-end']
        }
    };

    var myDateEnd = {
        constructor:"DateTime",
        props:{
        id: 'datetime',
        inputFormat: 'DD/MM/YYYY',
        outputFormat: 'DD/MM/YYYY',
        displayFormat: 'MM/DD/YYYY',
        value: '04/02/2090',
        classes:['fc-event-date-end']
        }
    };

    var labelEndDate = {constructor: "Label",
    props:{
        id: 'label',
        label: 'End Date',
        classes:['fc-event-date']
    }
    };
    var labelForTitle = {
        constructor: "Label",
        props:{
            id: 'label',
            label: 'Enter Title for Your Event ',
            classes:['fc-event-input']
            },
    };

    var inputText = {
        constructor: "TextInput",
        props:{
            id: 'TextInput',
            value: '',
            //classes:['fc-event-input']
            
            },
        };
    var myModal = new Modal({
        id: 'autocomplete-modal',
        size: ModalSize.LARGE,
        title: 'Add Events',
    
    });
    myModal.addComponent(labelBeginDate, 0);
    myModal.addComponent(myDateBegin, 1);
    myModal.addComponent(labelEndDate, 2);
    myModal.addComponent(myDateEnd, 3);
    myModal.addComponent(labelForTitle, 4);
    myModal.addComponent(inputText, 5);
    myModal.show();


 }
    var _repeater;
    var _cmpCalendar;
    _props = extend(false,false,_defaultParams,_props);
    
    var _beforeAttach = _props.beforeAttach;
    var _labelField = _props.labelField;
    var _lb = _props.lb;
    var _guidField = _props.guidField;
    var _dayClasses = _props._dayClasses;
    //this.dataProvider = new ArrayEx(_props.dataProvider);
    var _childrenField = _props.childrenField;
    var _labelField1  = _props.labelField1;
    var _classField1 = _props.classField1;
    var _classField = _props.classField;
    var  _nowDate = _props.nowDate;
    var _dateContent = _props.dateContent;
    var _click = _props.click;
    var _dataProvider  = _createData(_nowDate);
    var _btnPrev;

    _props.beforeAttach = function(e) {
        this.$container = this.$el;
        _cmpCalendar = this.addComponent(_componentCalendar);
        this.dataProvider = _props.dataProvider;
        _dataProvider = _createData(_nowDate);
       
        e.preventDefault();
        // _componentCalendar.props.bindingDefaultContext = _dataProvider;
        //_componentCalendar.props.components.push(_cmpRepeater);
        // _cmpCalendar = this.props.addComponent(_repeater);
        // _repeater = this.addComponent(_cmpRepeater);
        // _componentCalendar.components = _self.eventCalendar();
        // _self.addComponents(_componentCalendar.components);
    };

    var _previous = function(e){
        if(_nowDate.getMonth() == 0){
            _nowDate.setMonth(11);
            _nowDate.setFullYear(_nowDate.getFullYear() - 1);
        } else {
            _nowDate.setMonth(_nowDate.getMonth() - 1);
        }
        console.log("dataProvider",_dataProvider);
        console.log("create",_createData(_nowDate));
        //return _createData(_nowDate);
        _dataProvider = _createData(_nowDate);
        
        _self.children.OutcontainerForWeekDays_169.children.listRepeater_185.dataProvider =_dataProvider;
        // _btnPrev = _componentCalendar.children
        // _self.components = _createCalendar(_dataProvider);
        // _cmpCalendar = this.addComponent(_createCalendar(_dataProvider));
        // return _nowDate;
        // var children = _self.children.OutcontainerForWeekDays.children;
        // _self.children.OutcontainerForWeekDays.removeAllChildren();
        // //_cmpCalendar = _self.addComponent(_self.createCalendar(_dataProvider));
        // _self.components = _self.createCalendar(_dataProvider,_nowDate.getMonth(),_nowDate.getFullYear());
        // _self.children.OutcontainerForWeekDays.children = _cmpCalendar.children;
        // _self.children.OutcontainerForWeekDays.addComponents(_self.components.props.components);
        // // _self.addComponents(_self.components.props.components);
    }
    
    var _next = function (e){
        if (_nowDate.getMonth() == 11) {
            _nowDate.setMonth(0);
            _nowDate.setFullYear(_nowDate.getFullYear() + 1);
        } else {
            _nowDate.setMonth( _nowDate.getMonth() + 1);
        }

        var new_dp = _createData(_nowDate);

        if(new_dp.length>0)
        {
            for(var i=0 ; i< new_dp.length;i++)
            {
                if(!new_dp[i][_guidField]) {
                    new_dp[i][_guidField] = StringUtils.guid();
                }
            }
        }
        
        console.log(" old dataProvider1",_dataProvider);
        _self.children.OutcontainerForWeekDays_169.children.listRepeater_185.dataProvider.toArray().splicea(0,_self.children.OutcontainerForWeekDays_169.children.listRepeater_185.dataProvider.toArray().length,new_dp);
       // _self.children.OutcontainerForWeekDays_169.children.listRepeater_185.dataProvider.toArray().splicea(0,_self.children.OutcontainerForWeekDays_169.children.listRepeater_185.dataProvider.length);
      
        // _dataProvider = _createData(_nowDate);
        // _cmpCalendar = this.addComponent(_componentCalendar);
        // console.log("Cmp Calendar",_cmpCalendar);
    };
    
  
 
    var _componentCalendar = {
     
        constructor: Container,
        props: {
            
            type: ContainerType.NONE,
            id: "OutcontainerForWeekDays",
           
            components: [
                {
                    constructor:Label,
                    props:{
                        id:'label',
                        label:months[_nowDate.getMonth()],
                        labelType:LabelType.p,
                        classes:["fc-label-month"],
                    }
                },
                {
                    constructor:Label,
                    props:{
                        id:'label2',
                        label: _nowDate.getFullYear(),
                        labelType:LabelType.p,
                        classes:["fc-label-year"],
                    }
           
                },
                {
                    constructor:Button,
                    props:{
                        id:'buttonPrev',
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
                        "click": _previous,
                    }
                },
              
                {
                    constructor:Button,
                    props:{
                        id:'buttonNext',
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
                   
                       "click": _next,
                    }
                },
                {
        constructor: Repeater,
        props:{
            id:'repeaterForWeekDays',
            rendering: {
                direction: "horizontal",
                separator: false
            },
            
            dataProvider:new ArrayEx([
                    {value:'Monday',classField1:'fc-border'},
                    {value:'Tuesday',classField1:'fc-border'},
                    {value:'Wednesday',classField1:'fc-border'},
                    {value:'Thursday',classField1:'fc-border'},
                    {value:'Friday',classField1:'fc-border'},
                    {value:'Saturday',classField1:'fc-border-Saturday-Sunday'},
                    {value:'Sunday',classField1:'fc-border-Saturday-Sunday'},
                ]),
                components:[
                    {
                    constructor:Container,
                    props:{
                        type:ContainerType.NONE,
                        id:"IncontainerForWeekDays",
                        label:'{'+_labelField1+'}',
                        classes:'{'+_classField1+'}',
                        // classes:["border"],
                        height:40,
                        width:140,
                        }
                    }
                ]
            }
        },
      {
        constructor:Repeater ,
        props : {
            id: "listRepeater",
            //guidField:_guidField,
            rendering: {
                direction: "horizontal",
                separator: false
            },
            dataProvider:_dataProvider,
            components: [
                {
                constructor: Container,
                props:{
                    type:ContainerType.NONE,
                    id:"containerOneDay",
                    classes:["border"],
                    //dataId:dateContent,
                    height:140,
                    width:140,
                    components:[
                        {constructor: Container,
                            props:{
                                type:ContainerType.NONE,
                                id:"containerforDays",
                                classes:"{"+_classField+"}",
                                label: '{'+_labelField+'}',
                               // class:"{"+_classField+"}",
                               // style: "background-color: #ff3b30; color: #FFFFFF;margin: 4px;",
                            }
                        },
                        {
                            constructor:Repeater,
                            
                            props:{
                                id:"eventRepeater",
                                dataProvider:"{currentItem.children}",
                                components:[{
                                    constructor:Container,
                                    props:{
                                        type:ContainerType.NONE,
                                        //  label:'{'+_labelField+'}',
                                        id:"eventContainer",
                                        label:"{value}",
                                        classes:["fc-event-inner","fc-event-time","fc-event-title"],
                                       // classes:'{'+_classField+'}',
                                    }
                                }]
                            }
                        }
                    ],
                    "click": this.openModalEvents
                }
                                    }
                                ],
                            }
                        }
                    ]
                }
    }
   
   


    // this.eventCalendar = function(e){
    //     var dp = dp || _dataProvider;
    //     var components=[];
    //     if(dp && dp.forEach){
    //         if (dp.length>0){
    //             for (var i=0;i<dp.length;i++){
    //                 if(!dp[i][_guidField])
    //                 dp[i][_guidField] = StringUtils.guid();
                    
    //                 if(dp[i][_childrenField] && dp[i][_childrenField].length>0)
    //                 {
    //                     var cmpR = extend(true,_cmpRepeater);
    //                     console.log("cmpr",cmpR);
    //                     cmpR.props.bindingDefaultContext = dp[i];
    //                     cmpR.props.id = "repeater";
    //                     cmpR.props.attr = {};
    //                     cmpR.props.attr[_guidField] = dp[i][_guidField];
    //                     cmpR.props.dataProvider = dp[i][_childrenField];
                        
    //             }
    //             components.push(cmpR);
    //         }
    //     }
    //     }
    //     return components;
    // }
 


    this.select=function(start,end){
        newEvent(start);
    };
    this.eventClick=function(calEvent,jsEvent,view){
        editEvent(calEvent);
    }
    
    // _props.click=function(){
    //     if(typeof _click=='function')
    //     _click.apply(this,arguments);
    //     var e = arguments[0];
    //     if(!e.isDefaultPrevented()){
    //         _self.previous();
    //     }
    // }

    Container.call(this,_props);

    };
    Calendar.prototype.ctor = 'Calendar';