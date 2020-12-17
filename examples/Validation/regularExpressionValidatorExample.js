var form = new Form({
    components: [{
            ctor: TextInput,
            props: {
                id: "email",
                value: '',
                type: "email",
                placeholder: "Email"
            }
        },
        {
            ctor: RegularExpressionValidator,
            props: {
                controlToValidate: "email",
                errorMessage: "Invalid email.",
                validationExpression: `[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+`,
                modifiers: 'i'
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