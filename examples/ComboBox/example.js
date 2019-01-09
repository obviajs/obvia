var myCombo = new ComboBox({
    id: 'combo',
    colspan: '6',
    label: 'Zgjidh Shtetin',
    dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
    versionStyle: "",
	valueField:"value",
	textField:"text",
    blockProcessAttr: false,
    required: false,
    value: "2"
});
myCombo.on('creationComplete', function(e){
    loader.hide();    
});
$('#root').append(myCombo.render());
