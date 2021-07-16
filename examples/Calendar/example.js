var myCalendar = new Calendar({
    id: 'calendar',
    nowDate: new Date(),
    calendarEvents: new ArrayEx([
        { "description": "Event 1", "startDateTime": "2021-03-19 01:00", "endDateTime": "2021-03-19 01:20" },
        { "description": "Event 2", "startDateTime": "2021-03-19 01:00", "endDateTime": "2021-03-19 02:00" },
        { "description": "Event 3", "startDateTime": "2021-03-19 17:30", "endDateTime": "2021-03-19 19:00" },
        { "description": "Event 4", "startDateTime": "2021-03-19 20:00", "endDateTime": "2021-03-19 20:20" }
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
                                    "value": "{dayjs().format(this.inputFormat)}"
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
                                    "value": "{dayjs().format(this.inputFormat)}"
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
    event[myCalendar.startDateTimeField] = dayjs(startDate.value, startDate.outputFormat).format(myCalendar.inputFormat);
    event[myCalendar.endDateTimeField] = dayjs(endDate.value, endDate.outputFormat).format(myCalendar.inputFormat);

    methods[myCalendar.viewStack.selectedIndex](event);
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

myCalendar.on("calendarEventClick", function (e, ra) {
    e.originalEvent.stopPropagation();
    e.originalEvent.stopImmediatePropagation();
});

myCalendar.on("cellClick", function (e, ra) {
    eventDescription.value = "";
    let dtStr = dayjs(e[myCalendar.startDateTimeField]).format(startDate.inputFormat);
    startDate.value = dtStr;
    endDate.value = dtStr;
    myModal.show();
});

myCalendar.render().then(function (cmpInstance)
{ 
    $('#root').append(cmpInstance.$el);    
});