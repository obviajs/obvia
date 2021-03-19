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

let eventDescription, startDate, endDate;

var myModal = new Modal({
    id: 'addEventModal',
    size: ModalSize.LARGE,
    title: 'Add Events',
    components: [
        {
            "ctor": "Container",
            "props": {
                "type": "",
                "classes": ["form-row"],
                "id": "dtFieldsRow",
                "components": [
                    {
                        "ctor": "FormField",
                        "props": {
                            "classes": ["col-6"],
                            "label": "Start Date",
                            "id": "f_startDate",
                            "component": {
                                "ctor": "DateTime",
                                "props": {
                                    "id": "startDate",
                                    "inputFormat": "YYYY-DD-MM HH:mm",
                                    "outputFormat": "YYYY-DD-MM HH:mm",
                                    "displayFormat": "DD/MM/YYYY hh:mm A",
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
                            "id": "f_endDate",                                
                            "component": {
                                "ctor": "DateTime",
                                "props": {
                                    "id": "endDate",
                                    "inputFormat": "YYYY-DD-MM HH:mm",
                                    "outputFormat": "YYYY-DD-MM HH:mm",
                                    "displayFormat": "DD/MM/YYYY hh:mm A",
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
                label: 'Enter description for Your Event '
            },
        },
        {
            ctor: "TextInput",
            props:{
                id: 'eventDescription',
                value: '',
                classes:["form-control"]
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
    let methods = [myCalendar.calendarDay.addEvent, myCalendar.calendarWeek.addEvent, myCalendar.calendarMonth.addEvent];
    var event = {};
    event[myCalendar.descriptionField] = eventDescription.value;
    event.startDate = startDate.value;
    event.endDate = endDate.value;

    methods[myCalendar.viewStack.selectedIndex](event);

if (myCalendar.viewStack.selectedIndex == 1)
    {   
        var _addMinutes = function (time, minsToAdd) 
        {
            var _displayHour = function (h){ return (h<10? '0':'') + h;};
            var split = time.split(':');
            var mins = split[0]*60 + +split[1] + +minsToAdd;
            return _displayHour(mins%(24*60)/60 | 0) + ':' + _displayHour(mins%60);  
        }  
        
        var event = {};
        event.startTime = instTextInput.value;
        event.duration = instDuration.value;
        event.description = instDescription.value;
        event.dateContent = instTextDay.value;
        event.endTime = _addMinutes(event.startTime,event.duration);
        event.time = event.startTime + " - " + event.endTime + " " + instTextDay.value;
        var words = event.startDateTime.split(' ');
        var word0 = words[0];
        var word1 = words[2];
        event.value = word0 + " " + word1;
        myCalendar.calendarWeek.addEvent(event); 
    }
    else if (myCalendar.viewStack.selectedIndex == 2)
    {
        var event = {};
        event.dateContent = instDate.value;
        event.description = instDescription.value;
        event.startDateTime = instDateTime.value;
        myCalendar.calendarMonth.addEvent(event);    
    }
    myModal.hide();
} 

myModal.render().then(function (cmpInstance)
{ 
    $('#root').append(cmpInstance.$el);   
});

myCalendar.on('endDraw', function ()
{
    startDate = myModal.modalDialog.modalContent.modalBody.dtFieldsRow.f_startDate.startDate;
    endDate = myModal.modalDialog.modalContent.modalBody.dtFieldsRow.f_endDate.endDate;
    eventDescription = myModal.modalDialog.modalContent.modalBody.eventDescription;
});

myCalendar.on("cellClick", function (e) {
    if(myCalendar.viewStack.selectedIndex == 0 ){        
    }
    else if(myCalendar.viewStack.selectedIndex == 1 ){
    }
    else if(myCalendar.viewStack.selectedIndex == 2 ){
    }
    eventDescription.value = "";
    let dtStr = moment(e.startDateTime).format(startDate.inputFormat);
    startDate.value = dtStr;
    endDate.value = dtStr;
    myModal.show();
});

myCalendar.render().then(function (cmpInstance)
{ 
    $('#root').append(cmpInstance.$el);    
});