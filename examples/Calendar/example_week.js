var myCalendarWeek = new CalendarWeek({
    id: 'calendarWeek',
    nowDate: new Date(),
    labelField: "value",
    //labelFieldHour:"startHour",
    startHour: "startHour",
    valueHour: "valueHour",
    interval: "interval",
    endHour: "endHour",
    childrenField: "children",
    descriptionField: "description",
    timing: "timing",
    dateContent: "dateContent",
    classField1: "classField1",
    time: "time",
    click: function (e) {
        console.log("From Click Action");
    }
});

var myTextInput = {
    ctor: "TextInput",
    props: {
        id: 'TextInput',
        value: " ",
        classes: ["fc-event-input-w", "form-control"]
    },

}
var myTextInput_Day = {
    ctor: "TextInput",
    props: {
        id: 'TextInput',
        value: " ",
        classes: ["fc-event-input-w", "form-control"]
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
myModal.addComponent(myTextInput_Day);
myModal.addComponent(myLabel);
myModal.addComponent(myTextInputEvent);

var inst = myModal.addComponent(mySaveEventButton);

inst.on('click', function () {
    console.log("Instance");
    let event = {};
    event.interval = myModal.children[myModal.components[0].props.id].value;
    event.description = myModal.children[myModal.components[3].props.id].value;
    event.time = event.interval + " " + myModal.children[myModal.components[1].props.id].value;
    myCalendarWeek.addEvent(event);
    myModal.hide();
    myModal.children[myModal.components[3].props.id].value = " ";

});

$('#root').append(await myModal.render().$el);
myCalendarWeek.on('endDraw', function () {
    this.on("cellClick", function (e) {
        myModal.children[myModal.components[0].props.id].value = e.interval;
        myModal.children[myModal.components[1].props.id].value = e.dateContent;
        myModal.show();
    })
});

$('#root').append(await myCalendarWeek.render().$el);