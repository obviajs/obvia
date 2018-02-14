var myText = new TextInput({
    id: 'textField',
    colspan: '6',
    label: 'Text Label',
    versionStyle: '',
    blockProcessAttr: false,
    required: true,
    mask: 'currency',
    value: '34,444.00'
});

$('#root').append(myText.render());
