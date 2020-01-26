var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var myButton = new Button({
    id: 'button',
    type: "",
    value: "",
    label:"Click me",
    classes: ["btn", "btn-success"],
    click : function(e){console.log("From ClickAction");}
});
myButton.on('creationComplete', function () {
    loader.hide();
    myButton.on('click',function (){
        
     // alert("test");
    });
  });
  myButton.renderPromise().then(function (cmpInstance)
  {
    $('#root').append(cmpInstance.$el);
  });




