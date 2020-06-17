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
                validationExpression: `/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`,
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

form.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

btn.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});