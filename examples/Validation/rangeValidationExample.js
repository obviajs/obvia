var form = new Form({
    components: [{
            ctor: TextInput,
            props: {
                id: "value",
                value: '',
                type: "text",
                placeholder: "Range"
            }
        },
        {
            ctor: RangeValidator,
            props: {
                controlToValidate: "value",
                errorMessage: "Specified value is out of range.",
                min: 5,
                max: 10

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