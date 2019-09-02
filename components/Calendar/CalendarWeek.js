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
    
    Object.defineProperty(this,"dataProvider",
    {
        get: function dataProvider() {
            return _oldDataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider !=v)
            {
                _dataProvider = !ArrayEx.isArrayEx(v)? new ArrayEx(v):v;



            }
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
        timing :" ",
        startHour:" ",
        endHour:" ",
    }


    var _createDataProvider = function(currentDate,event){
        var dataProvider = [];
        var today = currentDate;



        var _dates = function(today) {
            var week= []; 
            // Starting Monday not Sunday
            today.setDate((today.getDate() - today.getDay() +1));
            // today.setDate(first);
            for (var i = 0; i < 7; i++) {
                week.push(
                    new Date(today)
                ); 
                today.setDate(today.getDate() +1);
              
            }
            return week; 
        }

        var input = currentDate;
        var result = _dates(input);
        var result_final=result.map(d=> d.toString());
        
        for (var i=0;i<result_final.length;i++){
           
            var day_dp = result_final[i].split(" ").slice(0,1);
            var date_dp = result_final[i].split(" ").slice(2,3);
            var day_string = day_dp[0];
            var date_string = date_dp[0];
            var result_complete = day_string + " " + date_string;
            console.log("result",result_complete);
            var dp1 = {
                "value":result_complete,    
                "startHour":"",
                "interval":"",
            }
        
        dataProvider.push(dp1);   
        }
        for(var j=0;j<24;j++){

            var hours = j;
            hours = hours % 12;
            hours = hours ? hours :12 ; // Hour: '0' -> '12'
            var ampm = j >=12 ? 'pm':'am';


            var dp1 = {
                "value":" ",
                "valueHour":hours+":00",
                "startHour":hours+":00",
                "endHour":hours+':30',
                "interval":(hours+":00") + "-" + (hours+':30') + ampm,
                "timing": ampm,
                // "dateContent":today+'-'+ myActualMonth +'-'+currentYear,
                "children": new ArrayEx([]),
            }

            dataProvider.pushUnique(dp1);

            var dp2 = {
                "value":" ",
                "valueHour":" ",
                "startHour":hours+":30",
                "endHour":(hours+1)+':00',
                "interval":(hours+":30") + "-" + ((hours == 12 ) ? ((j%12)+1) : (hours+1))+':00' + ampm,
                "timing":ampm,
                //"dateContent":today+'-'+ myActualMonth +'-'+currentYear,
                "children":new ArrayEx([]),
                }

            dataProvider.push(dp2);
            }
       
        
            
        
        














    return dataProvider;
    }
    

    _props = extend(false,false,_defaultParams,_props);
    var _beforeAttach = _props.beforeAttach;
    var _nowDate = _props.nowDate;
    // var _guidField = _props.guidField;
    var _labelField = _props.labelField;
    var _labelFieldHour = _props._labelFieldHour;
    var _startHour = _props.startHour;
    var _endHour = _props.endHour;
    var _interval = _props.interval;
    var _childrenField = _props.childrenField;
    var _descriptionField = _props.descriptionField;
    var _dateContent = _props.dateContent;
    var  _timing = _props.timing;
    var eve = [];
    var _dataProvider = _createDataProvider(_nowDate);
    var _cmpCalendar_Week ;


    _props.beforeAttach = function(e){
        this.$container = this.$el;
        _cmpCalendar_Week = this.addComponent(_componentCalendarWeek);


        this.dataProvider = _props.dataProvider;
        _dataProvider = _createDataProvider(_nowDate);
        e.preventDefault();
    }


    var _prev_week = function(eve){

    }


    var _next_week = function(eve){

    }

    
    var _componentCalendarWeek = {

        constructor: Container,
        props: {
            type: ContainerType.NONE,
            id:"Out_Week_Container",
            components:[
                {
                    constructor: Container,
                    props:{
                        type:ContainerType.NONE,
                        id:"Container_Month_Year_Prev_Next_Button",
                        components:[
                            {
                                constructor: Label,
                                props:{
                                    id:'label_for_month',
                                    label:CalendarConstantsMonths[new Date().getMonth()],
                                    labelType:LabelType.p,
                                    classes:["fc-label-month-w"],
                                }
                            },
                            {
                                constructor: Label,
                                props:{
                                    id:'label_for_year',
                                    label:_nowDate.getFullYear(),
                                    labelType:LabelType.p,
                                    classes:["fc-label-year-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:'button_for_day',
                                    label:'day',
                                    type:'button',
                                    classes:[ButtonSize.SMALL,"fc-button-left-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:'button_for_week',
                                    label:'week',
                                    type:'button',
                                    classes:[ButtonSize.SMALL,"fc-button-center-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:'button_for_month',
                                    label:'month',
                                    type:'button',
                                    classes:[ButtonSize.SMALL,"fc-button-right-w"]
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:'button_previous_week',
                                    type:'button',
                                    classes:["fc-button-prev-w",ButtonSize.LARGE],
                                    components:[{
                                        constructor:Label,
                                        props:{
                                            id:'fa',
                                            labelType:LabelType.i,
                                            classes:["fas","fa-arrow-left"],
                                        }
                                    }],
                                        //"click":_prev_week,
                                }
                            },
                            {
                                constructor: Button,
                                props:{
                                    id:"button_next_week",
                                    type:"button",
                                    classes:["fc-button-next-w",ButtonSize.LARGE],
                                    components:[{
                                        constructor:Label,
                                        props:{
                                            id:'fad',
                                            labelType:LabelType.i,
                                            classes:["fas","fa-arrow-right"],
                                        }
                                    }],
                                        //"click":_next_week,
                                    
                                }
                            },
                            {
                                constructor: Repeater,
                                props:{
                                    id:'repeater_For_WeekDays_AND_Dates',
                                    rendering:{
                                        direction:"horizontal",
                                        separator:false
                                    },
                                    dataProvider:_dataProvider,
                                    components:[

                                        {
                                            constructor: Container,
                                            props:{
                                                type:Container.NONE,
                                                id:"Container_Week_Days",
                                                height:40,
                                                width:140,
                                                label:'{'+_labelField+'}',
                                                classes:['fc-week-display']
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                constructor: Repeater,
                                props:{
                                    id:'repeater_For_WeekDays_AND_Dates',
                                    rendering:{
                                        direction:"horizontal",
                                        separator:false
                                    },
                                    dataProvider:_dataProvider,
                                        {
                                            constructor:Container,
                                            props:{
                                                type:ContainerType.NONE,
                                                id:"pass_value_hour",
                                                label:'{'+_startHour+'}',
                                                classes:["fc-container-label-hour"],
                                                height:20,
                                                width:20,
                                            }
                                        },
                                        {
                                            constructor:Container,
                                            props:{
                                                type:ContainerType.NONE,
                                                id:"container_hour_display",
                                                components:[
                                                    {
                                                        constructor:Container,
                                                        props:{
                                                            type:ContainerType.NONE,
                                                            id:"container_half",
                                                            label:'{'+_interval+'}',
                                                            classes:["fc-hour"],
                                                            height:10,
                                                            width:1050,
                                                        }
                                                    },
                                                    // {
                                                    //     constructor: Hidden,
                                                    //     props:{
                                                    //         type:ContainerType.NONE,
                                                    //         id:"am_pm",
                                                    //         value:'{'+_timing+'}',
                                                    //     }
                                                    // },
                                                    // {
                                                    //     constructor: Container,
                                                    //     props:{
                                                    //         type:ContainerType.NONE,
                                                    //         id:"Repeater_Container",
                                                    //         components:[
                                                    //             {
                                                    //                 constructor:Repeater,
                                                    //                 props:{
                                                    //                     id:"Repeater_Event",
                                                    //                     dataProvider:"{currentItem.children}",
                                                    //                     rendering:{
                                                    //                         direction:"horizontal",
                                                    //                         separator:false
                                                    //                     },
                                                    //                     components:[
                                                    //                         {
                                                    //                             constructor:Container,
                                                    //                             props:{
                                                    //                                 type:ContainerType.NONE,
                                                    //                                 id:"Container_Container",
                                                    //                                 label:"{value}",
                                                    //                                 classes:["fc-event"],
                                                    //                             }
                                                    //                         }
                                                    //                     ]
                                                    //                 }
                                                    //             },
                                                    //         ]
                                                    //     }
                                                    // },
                                                ],
                                                //"click":_cellClick,
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                           

                ]
                    }
                }
            ]
        }
    }




    














Container.call(this,_props);

}
CalendarWeek.prototype.ctor = 'CalendarWeek';