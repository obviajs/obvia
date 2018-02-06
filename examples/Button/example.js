var myButton = new Button({
    id: 'button',
    type: "button",
    value: "Clicked Me",
    style: '',
    class: "btn btn-success"
});

$('#root').append(myButton.render());
