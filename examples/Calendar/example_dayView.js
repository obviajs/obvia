var myCalendarDay = new CalendarDay({
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
    click:function(e){
        console.log("From Click Action");
    },

});



var myHidden = {
    constructor:"Hidden",
    props:{
        id: 'hidden',
        value: " " ,
        classes:["fc-event-input","form-control"]
    },
};

var myTextInput = {
    constructor:"TextInput",
    props:{
        id: 'TextInput',
        value: " " ,
        classes:["fc-event-input","form-control"]
        },
    
}
var myLabel = {
    constructor: "Label",
    props:{
        id: 'label',
        label: 'Enter Title for Your Event ',
        classes:['fc-event-label-title']
        },
}

var myTextInputEvent = {
    constructor: "TextInput",
    props:{
        id: 'TextInput',
        value: '',
        classes:["fc-event-input","form-control"]
    },
}
var mySaveEventButton = {
    constructor: "Button",
    props:{
        id: 'button',
        type: "button",
        label:"Save Event",
        classes:[ButtonSize.LARGE,"btn","btn-secondary","btn-dark"],
        // click:function(e){
        //     saveEvent() ;
        // }
    }
}


var myModal = new Modal({
    
    id: 'autocomplete-modal',
    size: ModalSize.LARGE,
    title: 'Add Events',
  
});
    
myModal.on('creationComplete', function (e) {
    //trigger autocomplete complete
    e.stopPropagation();
   
   // myModal.show();
});    
myModal.addComponent(myHidden, 0);
myModal.addComponent(myTextInput, 1);
myModal.addComponent(myLabel, 2);
myModal.addComponent(myTextInputEvent, 3);
myModal.addComponent(mySaveEventButton, 4);


$('#root').append(myModal.render());
myCalendarDay.on('creationComplete',function(){
    this.on("cellClick",function(e){
        
        // console.log("this",this);
        // _cmp = Component.fromLiteral(_componentCalendarPerDay);
        // console.log(_cmp);
        // var interval=this.$el[0].children[0].innerText ;
        //var interval = this.children["container_half_1"].label;
        //var hidden = this.$el[0].children[1].value;
        //myModal.$container[0].children[0].value  = hidden; 
        myModal.$container[0].children[1].value = e.interval;
        myModal.show();
    })
});
console.log("Modal after adding a new component",myModal);
$('#root').append(myCalendarDay.render());
