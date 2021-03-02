var myForm = new Form({
    id: 'form',
    action: "http://ui/?UploadManager/test"
});

var multiUpl = new MultiUpload({
    form: myForm
});

multiUpl.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

var singleUpload = new UploadEx({
    id: 'upload',
    multiple: true,
    form: myForm,
    fullUrlField: "full_url"
});

singleUpload.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});