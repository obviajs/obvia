var myRadio = new RadioButton({
    id: 'radio',
    value: "male",
    label: "Male",
    checked: true,
    onclick: function (e) {
        console.log("Radio Clicked");
    }
});

$('#root').append(await myRadio.render().$el);