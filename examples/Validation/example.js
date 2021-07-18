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
                errorMessage: "Please fill this field.",
                validationGroup:"grp"
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

form.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

btn.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

