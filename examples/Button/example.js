var myButton = new Button({
    id: 'button',
    type: "button",
    value: "Clicked Me",
    style: '',
    class: "btn btn-success",
    onclick : function(e){console.log("From ClickAction");}
});


myButton.on('afterAttach', function () {
    console.log("afterAttach");
    myButton.on('click', function (e) {
        console.log('click event outside button (in document) with value: '+this.id);
    });
});
$('#root').append(myButton.render());