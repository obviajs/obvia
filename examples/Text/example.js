var myText = new Text({
    id: 'text',
    colspan: '6',
    label: 'Text Label',
    fieldName: 'textField',
    versionStyle: '',
    blockProcessAttr: false,
    required: false,
    mask: 'currency',
    value: '34,444.00'
});

$('#root').append(myText.render());