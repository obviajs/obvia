var myButton = new Button({
    id: 'button',
    type: "button",
    value: "Clicked Me",
    style: '',
    class: "btn btn-success",
    onclick : function(e){console.log("From ClickAction");}
});

$('#root').append(myButton.render());