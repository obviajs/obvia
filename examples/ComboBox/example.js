var myCombo = new ComboBox({
    id: 'combo',
    colspan: '6',
    label: 'Zgjidh Shtetin',
    fieldName: 'combobox',
    dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
    versionStyle: "",
    blockProcessAttr: false,
    required: false,
    value: "2"
});

$('#root').append(myCombo.render());
