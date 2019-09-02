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
    var a_events=[];
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
                _dataProvider = _createData(datanow,event);
                _cmpCalendar = this.addComponent(_componentCalendar);
                _cmpModal = this.addComponent(_component_Modal_Event);
        
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
        startField:" ",
        descriptionField:" ",
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
    

    var _createData = function(currentDate,event)
    {
        // var va_1=[];
        if(event && event[0])
        {  
            if( event[0].dateContent in a_events){ 

                a_events[event[0].dateContent].push(event[0]);
            }else
            {
                a_events[event[0].dateContent] = [];
                a_events[event[0].dateContent].push(event[0]);
            }

            // va_1 = Object.keys(a_events);
        }
       //var a_events=[{"startField":"29-07-2019","descriptionField":"Event 1"},{"startField":"02-08-2019","descriptionField":"Event2"},{"startField":"02-08-2019","descriptionField":"Event3"}];
        // var ac = ["12-08-2019", "12-08-2019","14-08-2019","15-08-2019"];
        // console.log("a",ac);
        
        //a_events = a_events.groupReduce(function(el){return moment(el, "DD-MM-YYYY").toDate().getDay()});
        // console.log("b",b);
        
      
      
        
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
                var m =_getLastMonth(currentDate)+1;
                var m_content = m;
                if(m <= 9) {
                    m_content  = '0'+ m;
                }
                // if(j<=9) {
                // var day_content = '0'+ j;
                // }
            
                var dp1 = {
                    "value":j,
                    "selected":selected,
                    "classField":["fc-past-days"],
                    "dateContent": j +'-'+ m_content +'-'+ currentYear,
                
                }

        

                var data_controll_past = j+'-'+ m_content +'-'+currentYear;
                    // if(va_1.indexOf(data_controll_past) >= 0){
                    //    var index_past = va_1.indexOf(data_controll_past);
                    if(data_controll_past in a_events){
                        var children = [];
                        for(var cr=0;cr<a_events[data_controll_past].length;cr++){
                                children[cr] = {
                                    "value":a_events[data_controll_past][cr].descriptionField,
                                    "classes":["fc-event-inner"],
                                
                                };
                        }
            
                // var event_var = event[0].dateContent;
                
                // if(_saveEvent(e)){
                //      if(dp1.dateContent = event[0].dateContent){
                var dp1={
                        "value":j,
                        "selected" :true,
                        "classField":["fc-past-days"],
                        "dateContent":j +'-'+ m_content +'-'+currentYear,
                        "children":new ArrayEx(children),
                    }
                }
            
                // var k = 0;
                //         while(event.length){

                //         va_1[k] = event[k].startField;
                //         var b = va_1.groupReduce(function(el)
                //             {
                //                 return moment(el,"DD-MM-YYYY").toDate().getDay()
                //             });
                //                 console.log("b",b); 
                //                 k++;
                //         }
                
            
                dataProvider.pushUnique(dp1);
            
        }


        for(var i=1;i<=_daysInMonth(currentMonth,currentYear);i++) {

            var iterationday = new Date(currentYear, currentMonth, i).getDay();
            var mm = currentMonth+1;
            var mm_content = mm ;
            if(mm <= 9) {
                mm_content = '0'+ mm;
            }
            var i_content = i ;
            if(i<=9) {
                i_content = '0'+ i;
            }
            if(today == i){
            
                var dp1={
                    "value":i,
                    "selected" :true,
                    "classField":["fc-state-highlight"],
                    "dateContent":i_content+'-'+ mm_content +'-'+currentYear,//new Date().toJSON().slice(0,10).split('-').reverse().join('-'),
                    // "children":new ArrayEx([
                    //     {"value":"Event 1"}
                    // ])
                    
                }
            }
            var data_controll_actual = i_content +'-'+ mm_content +'-'+currentYear;
                // else if(dp1.children){
                
                    if(data_controll_actual in a_events){
                        var children_actual = [];
                        for(var hr=0;hr<a_events[data_controll_actual].length;hr++){
                                children_actual[hr] = {
                                    "value":a_events[data_controll_actual][hr].descriptionField,
                                    "classes":["fc-event-inner"],
                                };
                        }
                // if(va_1.indexOf(data_controll_actual) >= 0){
                //    var index_actual = va_1.indexOf(data_controll_actual) ;
                    var dp1={
                        "value":i,
                        "selected" :true,
                        "classField":["fc-state-highlight"],
                        "dateContent":i_content+'-'+ mm_content +'-'+currentYear,
                            "children":new ArrayEx(children_actual)
                        }
                    
            }else if(iterationday == 0 || iterationday == 6){
               
                var dp1={
                    "value":i,
                    "selected" :false,
                    "classField":["fc-past-days"],
                    "dateContent":i_content+'-'+ mm_content + '-' + currentYear,
                    // "children":new ArrayEx([
                    //     {"value":"Event 2"}
                    // ])
                }
                // if(dp1.children){

                // if(va_1.indexOf(data_controll_actual) >= 0){
                //      var index_2 = (va_1.indexOf(data_controll_actual));

                if(data_controll_actual in a_events){
                    var children_actual_2 = [];
                    for(var ccr=0;ccr<a_events[data_controll_actual].length;ccr++){
                            children_actual_2[ccr] = {
                                "value":a_events[data_controll_actual][ccr].descriptionField,
                                "classes":["fc-event-inner"],
                            };
                    }
                    var dp1={
                        "value":i,
                        "selected" :true,
                        "classField":["fc-past-days"],
                        "dateContent":i_content+'-'+ mm_content +'-'+currentYear,
                        // "children":new ArrayEx([
                        //         {   

                        //             // "dateContent":event.startField,
                        //             "value":a_events[index_2][0].descriptionField,
                        //         }
                        // ])
                        "children": new ArrayEx(children_actual_2),
                        }
            }
        }
            else{
            
                var dp1={
                        "value":i,
                        "selected":false,
                        "dateContent":i_content+'-'+mm_content+'-'+currentYear,
                        "classField":["fc-border-weekdays"],
                        
                    }
                    // if(dp1.children){
                    // if(va_1.indexOf(data_controll_actual) >= 0){
                    //     var index_3 = (va_1.indexOf(data_controll_actual));
                    if(data_controll_actual in a_events){
                        var children_week = [];
                        for(var rc=0;rc<a_events[data_controll_actual].length;rc++){
                            children_week[rc] = {
                                    "value":a_events[data_controll_actual][rc].descriptionField,
                                    "classes":["fc-event-inner"],
                                };
                        }
                        var dp1={
                            "value":i,
                            "selected" :true,
                            "classField":["fc-border-weekdays"],
                            "dateContent":i_content+'-'+ mm_content +'-'+currentYear,
                            // "children":new ArrayEx([
                            //     {
                            //         "value":a_events[index_3][0].descriptionField,
                            //     }
                            // ])
                            "children":new ArrayEx(children_week),
                        }
                    }
                }
            // for(var cr=0;cr< a_events.length;cr++){
            //     if(data_controll_actual == a_events[cr].startField){
            //         var dp1={
            //             "value":i,
            //             "selected" :true,
            //             "classField":["fc-state-highlight"],
            //             "dateContent":i+'-'+ mm +'-'+currentYear,
            //             "children":new ArrayEx([
            //                 {"value":a_events[cr].descriptionField}
            //             ])
                        
            //         }
            //     }
            // } 
            // if(va_1.indexOf(data_controll_past) >= 0){
            //     var index_4 = (va_1.indexOf(data_controll_past));
                    // var dp1={
            //         "value":i,
            //         "selected" :true,
            //         "classField":["fc-border-weekdays"],
            //         "dateContent":j +'-'+ mm_content +'-'+ currentYear,
            //         "children":new ArrayEx([
            //             {
            //                 "value":"",
            //                 // "dateContent":event.startField,
            //                 // "value":event.descriptionField,
            //             }
            //         ])
            //     }
            dataProvider.pushUnique(dp1);

        }
        var nextMonthfirstDay=1;
        if(lastDayOfCurrentMonth !=0){
            for(var i=lastDayOfCurrentMonth;i<7;i++){
               
             var month_next = currentMonth + 2;
             var  month_next_content = month_next ;
             if(month_next <= 9) {
                 month_next_content = '0'+ month_next;
            }
            var  nextMonthfirstDay_content = nextMonthfirstDay;
            if(nextMonthfirstDay<=9) {
                     nextMonthfirstDay_content = '0'+ nextMonthfirstDay;
                }
             var data_controll_next = nextMonthfirstDay_content +'-' + month_next_content + '-' + currentYear;
            
                var dp1={
                            "value":nextMonthfirstDay,
                            "selected":selected,
                            "classField":['fc-past-days'],
                            "dateContent": nextMonthfirstDay_content +'-' + month_next_content + '-' + currentYear,
                        }
                        // if(dp1.children) {
                       
                        // if(va_1.indexOf(data_controll_next) >= 0){
                        //     var index = va_1.indexOf(data_controll_next);
                        if(data_controll_next in a_events){
                            var children_next = [];
                            for(var rs=0;rs<a_events[data_controll_next].length;rs++){
                                children_next[rs] = {
                                        "value":a_events[data_controll_next][rs].descriptionField,
                                        "classes":["fc-event-inner"],
                                    };
                            }
                            dp1={
                                "value":nextMonthfirstDay,
                                "selected":selected,
                                "classField":['fc-past-days'],
                                "dateContent": nextMonthfirstDay_content +'-' + month_next_content + '-' + currentYear,
                                // "children":new ArrayEx([
                                //     { 
                                        
                                //         // "dateContent":event.startField,
                                //         "value": a_events[index][0].descriptionField,
                                //     }
                                // ])
                                "children":new Array(children_next),
                            }
                        }
                dataProvider.pushUnique(dp1);
                nextMonthfirstDay++;
            } 
        }
    return dataProvider;
}

var _container;
var _saveEvent = function(e){

    // for(var i=0;i<_self.dataProvider.length;i++){
    //     var begin_Date_1 = _self.children.OutcontainerForWeekDays_169.children.listRepeater_185.dataProvider.toArray()[i].dateContent;
    // }
    
    var begin_Date  = _cmpModal.children.datetime_325.value.slice(0,10).split('/').join('-');
    var event_Text = _cmpModal.children.TextInput_327.value;
    var array_events = [{"dateContent":begin_Date,"descriptionField":event_Text}]
    var new_dp_event = _createData(_nowDate,array_events);
        
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
        var va_1=[];
        for(var i=0;i<array_events.length;i++){
            va_1[i] = array_events[i].startField;
        }
        //var index = va_1.indexOf(begin_Date);
        var va_2=[];
        for(var j=0;j<array_events.length;j++){
            va_2 [j] =array_events[j].descriptionField;
        }
    //_self.children.OutcontainerForWeekDays_169.children.listRepeater_185.dataProvider.toArray()[i].children.toArray()[0].value
    //_self.children.OutcontainerForWeekDays_169.children.listRepeater_185.components[0].props.components[1].props.dataProvider.toArray().splicea(0,_self.children.OutcontainerForWeekDays_169.children.listRepeater_185.components[0].props.components[1].props.dataProvider.length,new_dp_event); 
    _self.literal.props.components[0].props.components[5].props.dataProvider.splicea(0, _self.literal.props.components[0].props.components[5].props.dataProvider.length,new_dp_event);
    
    _cmpModal.children.datetime_325.$el[0].value  = " ";
    _cmpModal.children.TextInput_327.value = " ";
    _cmpModal.hide();  


}



    //

// var _clickHandler = function (e) 
// {
//     _cmpModal = this.addComponent(_component_Modal_Event);
//     _component_Modal_Event.show();   
//         e.stopPropagation();
// };




// var _openModalEvents = function(e) {

//     var labelBeginDate = {
//         constructor: "Label",
//         props:{
//             id: 'label',
//             label: 'Begin Date',
//             classes:['fc-event-date']
//             },
//     };

//     var myDateBegin = {
//         constructor:"DateTime",
//         props:{
//         id: 'datetime',
//         inputFormat: 'DD/MM/YYYY',
//         outputFormat: 'DD/MM/YYYY',
//         displayFormat: 'MM/DD/YYYY',
//         value: _dateContent,
        
//         classes:['fc-event-date-end']
//         }
//     };

//     // var myDateEnd = {
//     //     constructor:"DateTime",
//     //     props:{
//     //     id: 'datetime',
//     //     inputFormat: 'DD/MM/YYYY',
//     //     outputFormat: 'DD/MM/YYYY',
//     //     displayFormat: 'MM/DD/YYYY',
//     //     value: '04/02/2090',
//     //     classes:['fc-event-date-end']
//     //     }
//     // };

//     // var labelEndDate = {constructor: "Label",
//     // props:{
//     //     id: 'label',
//     //     label: 'End Date',
//     //     classes:['fc-event-date']
//     // }
//     // };
//     var labelForTitle = {
//         constructor: "Label",
//         props:{
//             id: 'label',
//             label: 'Enter Title for Your Event ',
//             classes:['fc-event-label']
//             },
//     };

//     var inputText = {
//         constructor: "TextInput",
//         props:{
//             id: 'TextInput',
//             value: '',
//             classes:['fc-event-input']
            
//             },
//         };
    
//     var myButton = {
//         constructor: "Button",
//         props:{
//             id: 'button',
//             type: "button",
//             label:"Save Event",
//             classes:[],
//             click: _saveEvent,
//         }
//     };
//     var myModal = new Modal({
//         id: 'autocomplete-modal',
//         size: ModalSize.LARGE,
//         title: 'Add Events',
    
//     });
//     myModal.addComponent(labelBeginDate, 0);
//     myModal.addComponent(myDateBegin, 1);
//     // myModal.addComponent(labelEndDate, 2);
//     // myModal.addComponent(myDateEnd, 3);
//     myModal.addComponent(labelForTitle, 2);
//     myModal.addComponent(inputText, 3);
//     myModal.addComponent(myButton,4);
//     myModal.show();
//  }
    var _repeater;
    var _cmpCalendar;
    var _cmpModal;
    _props = extend(false,false,_defaultParams,_props);
    var eve = [];
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
    var _startField = _props.startField;
    var  _descriptionField = _props.descriptionField;
    var  _nowDate = _props.nowDate;
    var _dateContent = _props.dateContent;
    var _click = _props.click;
    var _dataProvider  = _createData(_nowDate,eve);
    var _btnPrev;

    _props.beforeAttach = function(e) {
        this.$container = this.$el;
        _cmpCalendar = this.addComponent(_componentCalendar);
        _cmpModal = this.addComponent(_component_Modal_Event);
        this.dataProvider = _props.dataProvider;
        _dataProvider = _createData(_nowDate,eve);
       
        e.preventDefault();
        // _componentCalendar.props.bindingDefaultContext = _dataProvider;
        //_componentCalendar.props.components.push(_cmpRepeater);
        // _cmpCalendar = this.props.addComponent(_repeater);
        // _repeater = this.addComponent(_cmpRepeater);
        // _componentCalendar.components = _self.eventCalendar();
        // _self.addComponents(_componentCalendar.components);
    };

    var _previous = function(eve){
        if(_nowDate.getMonth() == 0){
            _nowDate.setMonth(11);
            _nowDate.setFullYear(_nowDate.getFullYear() - 1);
        } else {
            _nowDate.setMonth(_nowDate.getMonth() - 1);
        }
        console.log("dataProvider",_dataProvider);
        console.log("create",_createData(_nowDate,eve));
        //return _createData(_nowDate);
        var new_dp_prev = _createData(_nowDate,eve); 
        
        if(new_dp_prev.length>0)
        {
            for(var i=0 ; i< new_dp_prev.length;i++)
            {
                if(!new_dp_prev[i][_guidField]) {
                    new_dp_prev[i][_guidField] = StringUtils.guid();
                }
                // if(new_dp.length[i]){
                //     _cmp.props.attr = {};
                //     _cmp.props.attr[_guidField] = dp[i][_guidField];

                // }
            }
        }
       //_self.literal.props.components[0].props.components[5].props.dataProvider = _dataProvider;

        // var  new_dp_prev = _createData(_nowDate);
        // _self.children.OutcontainerForWeekDays_163.children.listRepeater_179.dataProvider.splicea(0,_self.children.OutcontainerForWeekDays_163.children.listRepeater_179.dataProvider.length,new_dp_prev);
        _self.literal.props.components[0].props.components[5].props.dataProvider.splicea(0,_self.literal.props.components[0].props.components[5].props.dataProvider.length,new_dp_prev);
        _self.$el[0].children[0].children[0].innerText = months[_nowDate.getMonth()];
        _self.$el[0].children[0].children[1].innerText = _nowDate.getFullYear();

        
    }
    
    var _label_months;
    var _label_year;
    var _cmp;
    var _next = function (eve){
        
        //_cmp = Component.fromLiteral(_self);
        console.log("ComponentCalendar",_cmp);
        if (_nowDate.getMonth() == 11) {
            _nowDate.setMonth(0);
            _nowDate.setFullYear(_nowDate.getFullYear() + 1);
        } else {
            _nowDate.setMonth( _nowDate.getMonth() + 1);
        }

        var new_dp = _createData(_nowDate,eve);

        if(new_dp.length>0)
        {
            for(var i=0 ; i< new_dp.length;i++)
            {
                if(!new_dp[i][_guidField]) {
                    new_dp[i][_guidField] = StringUtils.guid();
                }
                // if(new_dp.length[i]){
                //     _cmp.props.attr = {};
                //     _cmp.props.attr[_guidField] = dp[i][_guidField];

                // }
            }
        }

    console.log("cmp",_cmp);
    _self.literal.props.components[0].props.components[5].props.dataProvider.splicea(0,_self.literal.props.components[0].props.components[5].props.dataProvider.length,new_dp);
    _self.$el[0].children[0].children[0].innerText = months[_nowDate.getMonth()];
    _self.$el[0].children[0].children[1].innerText = _nowDate.getFullYear();

    //_label_months = _cmp.children[_self.my("label_1")];
    //console.log("_label",_label_months)
    // console.log("component",_componentCalendar);
    // _label_months = _cmp.my("OutcontainerForWeekDays").children[_self.my("label_1")];
    // console.log("label_months",_label_months);
    // _self.children.OutcontainerForWeekDays_200.children.listRepeater_216.dataProvider.splicea(0, _self.children.OutcontainerForWeekDays_200.children.listRepeater_216.dataProvider.length,new_dp);
    // _self.children.OutcontainerForWeekDays_200.children.label_1_201.$el[0].innerText = months[_nowDate.getMonth()];
    // _self.children.OutcontainerForWeekDays_200.children.label_2_202.$el[0].innerText =  _nowDate.getFullYear();
    // _componentCalendar.props.components[5].props.dataProvider.splicea(0, _componentCalendar.props.components[5].props.dataProvider.length,new_dp);
    // _componentCalendar.props.components[0].props.label = months[_nowDate.getMonth()];
    // _componentCalendar.props.components[1].props.label =  _nowDate.getFullYear();
    //_self.children.OutcontainerForWeekDays_165.children.listRepeater_181.dataProvider.splicea(0,_self.children.OutcontainerForWeekDays_165.children.listRepeater_181.dataProvider.length,new_dp);
   
    
    };

    var _clickHandler_Event = function (e){
        console.log("_cmpModal",_cmpModal.show());
       // _cmpModal.show();

    }

    var _component_Modal_Event = {
                constructor: Modal,
                props:{
                id: 'autocomplete-modal',
                size: ModalSize.LARGE,
                title: 'Add Events',
                components:[
                    {
                        constructor: Label ,
                        props:{
                            id: 'label',
                            label: 'Begin Date',
                            classes:['fc-event-date']
                                },
                        
                    },
                    {
                        constructor: DateTime,
                        props:{
                        id: 'datetime',
                        inputFormat: 'DD-MM-YYYY',
                        outputFormat: 'DD-MM-YYYY',
                        displayFormat: 'MM-DD-YYYY',
                        value: "",
                        
                        classes:["fc-event-date-end","form-control"]
                            }
                     },
                     {
                        constructor: Label,
                        props:{
                            id: 'label',
                            label: 'Enter Title for Your Event ',
                            classes:['fc-event-label-title']
                            },
                    },
                
                    {
                        constructor: TextInput,
                        props:{
                            id: 'TextInput',
                            value: '',
                            classes:["fc-event-input","form-control"]
                            
                            },
                    },
                    
                    {
                        constructor: Button,
                        props:{
                            id: 'button',
                            type: "button",
                            label:"Save Event",
                            classes:[ButtonSize.LARGE,"btn","btn-secondary","btn-dark"],
                            "click": _saveEvent,
                        }
                    }
                ]               
            }
         
    };
 
    var _componentCalendar = {
     
        constructor: Container,
        props: {
            
            type: ContainerType.NONE,
            id: "OutcontainerForWeekDays",
           
            components:[
                {
                    constructor: Label,
                    props:{
                        id:'label_1',
                        label:months[_nowDate.getMonth()],
                        labelType:LabelType.p,
                        classes:["fc-label-month"],
                    }
                },
                {
                    constructor: Label,
                    props:{
                        id:'label_2',
                        label: _nowDate.getFullYear(),
                        labelType:LabelType.p,
                        classes:["fc-label-year"],
                    }
           
                },
                // {
                //     constructor:Button,
                //     props:{
                //         id:'buttonDay',
                //         type:"button",
                //         classes:[ButtonSize.SMALL,"button-class"],
                //     }
                // },
                // {
                //     constructor:Button,
                //     props:{
                //         id:'buttonWeek',
                //         type:"button",
                //         classes:[ButtonSize.SMALL,"button-class"],
                //     }
                // },
                // {
                //     constructor:Button,
                //     props:{
                //         id:'buttonMonth',
                //         type:"button",
                //         classes:[ButtonSize.SMALL,"button-class"],
                //     }
                // },
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
                    classes:["border-c"],
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
                                    }
                        },
                        {
                            constructor:Repeater,
                                props:{
                                id:"eventRepeater",
                                dataProvider:"{currentItem.children}",
                                components: [
                                        {
                                    constructor:Container,
                                    props:{
                                        type:ContainerType.NONE,
                                        //  label:'{'+_labelField+'}',
                                        id:"eventContainer",
                                        label:"{value}",
                                        classes:["fc-event-inner"],//"fc-event-time","fc-event-title"
                                       // classes:'{'+_classField+'}',
                                            }
                                        }
                                    ]
                                }   
                        }
                            ],
                    "click":_clickHandler_Event,
                }
                                    }
                                ],
                            }
                        }
                    ]
                }
    }

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