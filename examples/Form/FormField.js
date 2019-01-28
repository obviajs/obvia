var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var myFormField = new FormField({
    id: 'repeater',
    label: 'Example Repeater',
	component:
        {
            constructor: Button,
            props: {
                id: 'button',
                type: "button",
                value: "{textValue}",
                label:"{textValue}",
                class: "btn btn-success",
                click : function(e){console.log("From ClickAction");}
            }
        }
});

myFormField.on('creationComplete', function(e){
    loader.hide();
});

$('#root').append(myFormField.render());