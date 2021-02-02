var myForm = new Form({
    id: 'form',
    formName: 'My Form',
    action: "http://ui/upload.php"
});

var multiUpl = new MultiUpload({
    form: myForm
});

multiUpl.render().then(function (cmpInstance) {
    //$('#root').append(cmpInstance.$el);
});

var singleUpload = new UploadEx({
    id: 'upload',
    multiple: true,
    form: myForm
});
singleUpload.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});