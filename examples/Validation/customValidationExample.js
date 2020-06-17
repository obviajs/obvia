var form = new Form({
    components: [{
            ctor: TextInput,
            props: {
                id: "value",
                value: '',
                type: "text",
                placeholder: "Custom"
            }
        },
        {
            ctor: CustomValidator,
            props: {
                controlToValidate: "value",
                errorMessage: "Error",
                validationFunction: function () {
                    if (this.controlToValidateInstance.value == "") {
                        throw new Error("Field Custom is required");
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

form.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

btn.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});