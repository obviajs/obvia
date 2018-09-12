var myTextField = new TextField({
    id: 'text_field',
    colspan: '6',
    versionStyle: '',
    blockProcessAttr: false,
    required: true,
    mask: 'currency',
    value: '34,444.00'
});

myTextField.on('creationComplete', function(e){
    loader.hide();
    
});

myTextField.on('load', myTextFieldLoaded);

function myTextFieldLoaded(e){
    console.log("TextField Loaded");
}
$('#root').append(myTextField.render());