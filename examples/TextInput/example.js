import { TextInput } from "../../components/TextInput/TextInput.js";

var myTextInput = new TextInput({
    id: 'textField',
    mask: 'currency',
    value: '',
    type: "password",
    placeholder: "Username"
});

myTextInput.render().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});

export { myTextInput }