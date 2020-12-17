var mySelect = new Select({
    id: 'select',
    dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
    labelField: "text",
    valueField: "value",
    value: "2",
});

mySelect.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
  });
