var myCalendar= new Calendar({
    id:'calendar',
    nowDate : new Date(),
    calendarEvents: new ArrayEx([
        {"descriptionField":"Event 1", "startDateTime":"2019-10-08 01:00","endDateTime":"2019-10-08 01:20"},
        {"descriptionField":"Event 2", "startDateTime":"2019-10-08 01:00","endDateTime":"2019-10-08 02:00"},
        {"descriptionField":"Event 3", "startDateTime":"2019-10-08 17:30","endDateTime":"2019-10-08 19:00"},
        {"descriptionField":"Event 4", "startDateTime":"2019-10-08 20:00","endDateTime":"2019-10-08 20:20"}
    ]),
    descriptionField: "descriptionField",
});

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
            ctor: Label ,
            props:{
                id: 'instLabelDate',
                label: 'Begin Date',
                classes:['fc-event-date']
            },
        },
        {
            ctor:"TextInput",
            props:{
                id: 'instDate',
                value: " " ,
                classes:["fc-event-input-w","form-control"]
            },
        },
        {
            ctor: "Label",
            props:{
                id: 'label',
                label: 'Enter Title for Your Event ',
                classes:['fc-event-label-title']
            },
        },
        {
            ctor: "TextInput",
            props:{
                id: 'TextInput',
                value: '',
                classes:["fc-event-input","form-control"]
            },
        },
        {
            ctor: "Label",
            props:{
                id: 'instLabelDuration',
                label: 'Vendosni kohezgjatjen e eventit',
                classes:['fc-event-label-title']
            },
        },
        {
            ctor: "TextInput",
            props:{
                id: 'instDateTime',
                value: '',
                classes:["form-control"]
            }
        },
        {
            ctor:"Select",
            props:{
            id: 'instDuration',
            dataProvider: [{ "value": "20 ", "text": "20 min " },{ "value": "30 ", "text": "30 min " },{ "value": "45", "text": "45 min " }, { "value": "60", "text": "60 min" }, { "value": "120", "text": "120 min" }, { "value": "180", "text": "180 min" }],
            labelField: "text",
            valueField: "value",
            value: "20",
            classes:["form-control"]
            }
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
        event.descriptionField = myModal.children[myModal.components[5].props.id].value;
        var today = myCalendar.calendarDay.nowDate.getDate();
        var currentMonth = myCalendar.calendarDay.nowDate.getMonth();
        var currentYear = myCalendar.calendarDay.nowDate.getFullYear();
        var myActualMonth = CalendarConstants.Months[currentMonth];
        event.dateContent =currentYear + '-'+ currentMonth +'-'+ today;
        event.date = myCalendar.calendarDay.nowDate;
        event.startDateTime = event.startDateTime;
        myCalendar.calendarDay.addEvent(event); 
        myModal.hide();
        instDesctiption.value = " ";
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
        event.descriptionField = instDesctiption.value;
        event.dateContent = instTextDay.value;
        event.endHour = _addMinutes(event.startHour,event.duration);
        event.time = event.startHour + " - " + event.endHour + " " + instTextDay.value;
        event.startDateTime = instDateTime.value;
        var words = event.startDateTime.split(' ');
        var word0 = words[0];
        var word1 = words[2];
        event.value = word0 + " " + word1;
        myCalendar.calendarWeek.addEvent(event); 
        myModal.hide();
        instDesctiption.value = " ";
    }
    else if (myCalendar.viewStack.selectedIndex == 2)
    {
        var event = {};
        event.dateContent =  instDate.value;
        event.descriptionField = instDesctiption.value;
        event.startDateTime = instDateTime.value;
        myCalendar.calendarMonth.addEvent(event); 
        myModal.hide();
        instDesctiption.value = " ";
    }
}

myModal.render().then(function (cmpInstance)
{ 
    $('#root').append(cmpInstance.$el);   
});

myCalendar.on('creationComplete', function ()
{
    let instDateTime = myModal.modalDialog.modalContent.modalBody.instDateTime;
    let instTextDay = myModal.modalDialog.modalContent.modalBody.instTextDay;
    let instLabelDate = myModal.modalDialog.modalContent.modalBody.instLabelDate;
    let instDate = myModal.modalDialog.modalContent.modalBody.instDate;
    let instDuration = myModal.modalDialog.modalContent.modalBody.instDuration;
    let instLabelDuration = myModal.modalDialog.modalContent.modalBody.instLabelDuration;
    let instTextInput = myModal.modalDialog.modalContent.modalBody.instTextInput;
    
    this.on("cellClick",function(e){
        if(myCalendar.viewStack.selectedIndex == 0 ){
            instDateTime.enabled = true;
            instTextDay.enabled = false;
            instLabelDate.enabled = false;
            instDate.enabled = false;
            instDuration.enabled = false;
            instLabelDuration.enabled = false;
            instTextInput.value = e.interval;
            instDateTime.value = e.startDateTime;
            myModal.show();
        }
        else  if(myCalendar.viewStack.selectedIndex == 1 ){
            instTextInput.enabled = true;
            instDateTime.enabled = true;
            instTextDay.enabled = false;
            instLabelDate.enabled = false;
            instDate.enabled = false;
            instDuration.enabled = true;
            instLabelDuration.enabled = true;
            instTextInput.value = e.startHour;
            instDateTime.value = e.startDateTime;
            myModal.show();
        }
        else if(myCalendar.viewStack.selectedIndex == 2 ){
            instLabelDate.enabled = true;
            instDate.enabled = true;
            instDateTime.enabled = true;
            instTextInput.enabled = false;
            instTextDay.enabled = false;
            instLabelDuration.enabled = false;
            instDuration.enabled = false;
            instDate.value = e.dateContent;
            instDateTime.value = e.startDateTime;
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