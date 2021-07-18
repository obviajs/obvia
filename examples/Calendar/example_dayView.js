var myCalendarDay = new CalendarDay({
    id: 'calendarDay',
    labelField: "value",
    labelField1: "value",
    startTime: "startTime",
    interval: "interval",
    endTime: "endTime",
    childrenField: "children",
    descriptionField: "descriptionField",
    timing: "timing",
    nowDate: new Date(),
    dateContent: "dateContent",
    click: function (e) {
        console.log("From Click Action");
    },

});

var myTextInput = {
    ctor: "TextInput",
    props: {
        id: 'TextInput',
        value: " ",
        classes: ["fc-event-input", "form-control"]
    },
}
var myLabel = {
    ctor: "Label",
    props: {
        id: 'label',
        label: 'Enter Title for Your Event ',
        classes: ['fc-event-label-title']
    },
}

var myTextInputEvent = {
    ctor: "TextInput",
    props: {
        id: 'TextInput',
        value: '',
        classes: ["fc-event-input", "form-control"]
    },
}
var mySaveEventButton = {
    ctor: "Button",
    props: {
        id: 'button',
        type: "button",
        label: "Save Event",
        classes: [ButtonSize.LARGE, "btn", "btn-secondary", "btn-dark"],
    }
}

var myModal = new Modal({
    id: 'autocomplete-modal',
    size: ModalSize.LARGE,
    title: 'Add Events',
});

myModal.addComponent(myTextInput);
myModal.addComponent(myLabel);
myModal.addComponent(myTextInputEvent);
var inst = myModal.addComponent(mySaveEventButton);

inst.on('click', function () {
    var event = {};
    event.interval = myModal.children[myModal.components[0].props.id].value;
    event.descriptionField = myModal.children[myModal.components[2].props.id].value;
    var today = myCalendarDay.nowDate.getDate();
    var currentMonth = myCalendarDay.nowDate.getMonth();
    var currentYear = myCalendarDay.nowDate.getFullYear();
    var myActualMonth = CalendarConstantsMonths[currentMonth];
    event.dateContent = today + '-' + myActualMonth + '-' + currentYear;
    event.date = myCalendarDay.nowDate;
    myCalendarDay.addEvent(event);
    myModal.hide();
    myModal.children[myModal.components[2].props.id].value = " ";
})
$('#root').append(await myModal.render().$el);
myCalendarDay.on('endDraw', function () {
    this.on("cellClick", function (e) {
        myModal.children[myModal.components[0].props.id].value = e.interval;
        myModal.show();

    })
});
console.log("Modal after adding a new component", myModal);
$('#root').append(await myCalendarDay.render().$el);