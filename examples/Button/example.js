var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var myButton = new Button({
    id: 'button',
    type: "button",
    value: "",
    label:"Click Me",
    class: "btn btn-success",
    click : function(e){console.log("From ClickAction");}
});
myButton.on('creationComplete', function(e){
    loader.hide();
});
$('#root').append(myButton.render());




