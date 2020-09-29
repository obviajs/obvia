var form = new Form({
    components: [{
            ctor: TextInput,
            props: {
                id: "value",
                value: '',
                type: "text",
                placeholder: "Username"
            }
        },
        {
            ctor: CustomValidator,
            props: {
                controlToValidate: "value",
                errorMessage: "Username field is required",
                validationFunction: function () {
                    if (this.controlToValidateInstance.value == "") {
                        return Promise.resolve(false);
                    } else {
                        return Promise.resolve(true);
                    }
                }

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