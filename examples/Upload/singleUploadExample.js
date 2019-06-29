/*
var singleUpload = new UploadEx({
    id: 'upload',
    multiple: true
});
$('#root').append(singleUpload.render());
*/
var loader=new Loader({id:'loader'});
$('#root').append(loader.render());
loader.show();

var myForm = new Form({
    id: 'form',
    formName: 'My Form',
    action: "http://192.168.64.2/upload.php"
});   

var multiUpl = new MultiUpload({
    form: myForm
});

multiUpl.on('creationComplete', function () {
    loader.hide();
});


$('#root').append(multiUpl.render());