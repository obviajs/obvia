var myCalendarWeek = new CalendarWeek({
    id:'calendarWeek',
    nowDate:new Date(),
    labelField:"value",
    //labelFieldHour:"startHour",
    startHour:"startHour",
    valueHour:"valueHour",
    interval:"interval",
    endHour:"endHour",
    childrenField:"children",
    descriptionField:"descriptionField",
    timing:"timing",
    dateContent:"dateContent",







click:function(e){
    console.log("From Click Action");
    }
});

myCalendarWeek.on('creationComplete',function(){

});

$('#root').append(myCalendarWeek.render());