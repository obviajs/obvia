var myCalendar = new Calendar({
    id: 'calendar',
    nowDate: new Date(),
    calendarEvents: new ArrayEx([
        { "description": "Event 1", "startDateTime": "2019-10-08 01:00", "endDateTime": "2019-10-08 01:20" },
        { "description": "Event 2", "startDateTime": "2019-10-08 01:00", "endDateTime": "2019-10-08 02:00" },
        { "description": "Event 3", "startDateTime": "2019-10-08 17:30", "endDateTime": "2019-10-08 19:00" },
        { "description": "Event 4", "startDateTime": "2019-10-08 20:00", "endDateTime": "2019-10-08 20:20" }
    ]),
    descriptionField: "description",
});

let instTextDay, instLabelDate, instDate, instDuration, instLabelDuration, instTextInput;

var myModal = new Modal({
    id: 'addEventModal',
    size: ModalSize.LARGE,
    title: 'Add Events',
    components: [
        {
            ctor:"TextInput",
            props:{
                id: 'instTextInput',
                value: " " ,
                classes:["fc-event-input","form-control"]
            },
        },
        {
            ctor:"TextInput",
            props:{
                id: 'instTextDay',
                value: " " ,
                classes:["fc-event-input-w","form-control"]
            },  
        },
        {
            "ctor": "Container",
            "props": {
                "type": "",
                "classes": ["form-row"],
                "components": [
                    {
                        "ctor": "FormField",
                        "props": {
                            "classes": ["col-6"],
                            "label": "Start Date",
                            "component": {
                                "ctor": "DateTime",
                                "props": {
                                    "id": "startDate",
                                    "inputFormat": "YYYY-DD-MM",
                                    "outputFormat": "YYYY-DD-MM",
                                    "displayFormat": "DD/MM/YYYY",
                                    "value": "{moment().format(this.inputFormat)}"
                                }
                            }
                        }
                    },
                    {
                        "ctor": "FormField",
                        "props": {
                            "classes": ["col-6"],
                            "label": "Start Date",
                            "component": {
                                "ctor": "DateTime",
                                "props": {
                                    "id": "endDate",
                                    "inputFormat": "YYYY-DD-MM",
                                    "outputFormat": "YYYY-DD-MM",
                                    "displayFormat": "DD/MM/YYYY",
                                    "value": "{moment().format(this.inputFormat)}"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            ctor: "Label",
            props:{
                id: 'label',
                label: 'Enter description for Your Event ',
                classes:['fc-event-label-title']
            },
        },
        {
            ctor: "TextInput",
            props:{
                id: 'eventDescription',
                value: '',
                classes:["fc-event-input","form-control"]
            },
        },
        {
            ctor: "Button",
            props:{
                id: 'saveButton',
                type: "button",
                label:"Save Event",
                classes: [ButtonSize.LARGE, "btn", "btn-secondary", "btn-dark"],
                click: saveButton_click
            }
        }
    ]
});

function saveButton_click(e)
{
    if (myCalendar.viewStack.selectedIndex == 0)
    {
        var event = {};
        event.interval = instTextInput.value;
        event.description = instDescription.value;
        var today = myCalendar.calendarDay.nowDate.getDate();
        var currentMonth = myCalendar.calendarDay.nowDate.getMonth();
        var currentYear = myCalendar.calendarDay.nowDate.getFullYear();
        var myActualMonth = CalendarConstants.Months[currentMonth];
        event.dateContent = currentYear + '-'+ currentMonth +'-'+ today;
        event.date = myCalendar.calendarDay.nowDate;
        event.startDateTime = event.startDateTime;
        myCalendar.calendarDay.addEvent(event); 
        myModal.hide();
        instDescription.value = " ";
    }
    else if (myCalendar.viewStack.selectedIndex == 1)
    {   
        var _addMinutes = function (time, minsToAdd) 
        {
            var _displayHour = function (h){ return (h<10? '0':'') + h;};
            var split = time.split(':');
            var mins = split[0]*60 + +split[1] + +minsToAdd;
            return _displayHour(mins%(24*60)/60 | 0) + ':' + _displayHour(mins%60);  
        }  
        
        var event = {};
        event.startHour = instTextInput.value;
        event.duration = instDuration.value;
        event.description = instDescription.value;
        event.dateContent = instTextDay.value;
        event.endHour = _addMinutes(event.startHour,event.duration);
        event.time = event.startHour + " - " + event.endHour + " " + instTextDay.value;
        var words = event.startDateTime.split(' ');
        var word0 = words[0];
        var word1 = words[2];
        event.value = word0 + " " + word1;
        myCalendar.calendarWeek.addEvent(event); 
        myModal.hide();
        instDescription.value = " ";
    }
    else if (myCalendar.viewStack.selectedIndex == 2)
    {
        var event = {};
        event.dateContent = instDate.value;
        event.description = instDescription.value;
        event.startDateTime = instDateTime.value;
        myCalendar.calendarMonth.addEvent(event); 
        myModal.hide();
        instDescription.value = " ";
    }
}

myModal.render().then(function (cmpInstance)
{ 
    $('#root').append(cmpInstance.$el);   
});

myCalendar.on('endDraw', function ()
{
    instTextDay = myModal.modalDialog.modalContent.modalBody.instTextDay;
    instLabelDate = myModal.modalDialog.modalContent.modalBody.instLabelDate;
    instDate = myModal.modalDialog.modalContent.modalBody.instDate;
    instDuration = myModal.modalDialog.modalContent.modalBody.instDuration;
    instLabelDuration = myModal.modalDialog.modalContent.modalBody.instLabelDuration;
    instTextInput = myModal.modalDialog.modalContent.modalBody.instTextInput;
    instDescription = myModal.modalDialog.modalContent.modalBody.eventDescription;

    this.on("cellClick", function (e) {
        myModal.show();
        if(myCalendar.viewStack.selectedIndex == 0 ){
            instTextDay.enabled = false;
            instLabelDate.enabled = false;
            instDate.enabled = false;
            instDuration.enabled = false;
            instLabelDuration.enabled = false;
            instTextInput.value = e.interval;
            myModal.show();
        }
        else if(myCalendar.viewStack.selectedIndex == 1 ){
            instTextInput.enabled = true;
            instTextDay.enabled = false;
            instLabelDate.enabled = false;
            instDate.enabled = false;
            instDuration.enabled = true;
            instLabelDuration.enabled = true;
            instTextInput.value = e.startHour;
            myModal.show();
        }
        else if(myCalendar.viewStack.selectedIndex == 2 ){
            instLabelDate.enabled = true;
            instDate.enabled = true;
            instTextInput.enabled = false;
            instTextDay.enabled = false;
            instLabelDuration.enabled = false;
            instDuration.enabled = false;
            instDate.value = e.dateContent;
            myModal.show();
        }
        else{
            console.log("Error!");
        }       
    });
});

myCalendar.render().then(function (cmpInstance)
{ 
    $('#root').append(cmpInstance.$el);    
});