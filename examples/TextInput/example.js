//var flowerCM = window.flowerCM || {};
//rjs.define('./js/components/TextInput.js', 'TextInput');
//rjs.define('./lib/flower_dependencies/scripts/jquery.inputmask.bundle.min.js', 'InputMaskBundle');
//rjs.require(["InputMaskBundle", "TextInput"], function () {
var myText = new TextInput({
    id: 'textField',
    mask: 'currency',
    value: '',
    type: "password",
    placeholder: "Username"
});

myText.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});
