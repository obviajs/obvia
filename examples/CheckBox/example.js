var myCheckBox = new CheckBox({
    id: 'checkBoxField',
    colspan: '6',
    label: 'CheckBox Label',
    versionStyle: '',
    blockProcessAttr: false,
    value: "1",
    enabled:true
});

$('#root').append(myCheckBox.render());