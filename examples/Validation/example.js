var form = new Form({
    components: [
        {
            ctor: TextInput,
            props: {
                id: "username",
                value: '',
                type: "password",
                placeholder: "Username"
            }
        },
        {
            ctor: RequiredFieldValidator,
            props: {
                controlToValidate: "username",
                errorMessage: "Please fill this field."
            }
        }
    ]
});

let validationTrigger = function (e) {
    ValidationManager.getInstance().validate().then((result) => { 
        console.log(`Validation result is: ${result}`);
    });
};

var btn = new Button({
    label: "Validate",
    click: validationTrigger
});

form.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

btn.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});
