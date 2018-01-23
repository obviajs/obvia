var myText = new Text({
    id: 'text',
    colspan: '6',
    label: 'Text Label',
    fieldName: 'text',
    versionStyle: '',
    blockProcessAttr: false,
    required: false,
});

$('#root').append(myText.render());