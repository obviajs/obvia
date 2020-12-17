var repeater = new Repeater({
    dataProvider: new ArrayEx([
        { label: "field 1"},
        { label: "field 2" },
        { label: "field 3" },
        { label: "field 4"}
    ]),
    components: [
        {
            ctor: Label,
            props: {
                label: "{label}"
            }
        },
        {
            ctor: TextInput,
            props: {
                id: "username",
                value: '',
                placeholder: "Username"
            }
        },
        {
            ctor: RequiredFieldValidator,
            props: {
                controlToValidate: "{currentRow.username.props.id}",
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

repeater.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

btn.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

