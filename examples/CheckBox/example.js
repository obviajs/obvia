var myCheckBox =  CheckBox({
    id: 'checkBoxField',
    colspan: '6',
    label: 'CheckBox Label',
    versionStyle: '',
    blockProcessAttr: false,
    value: "1",
    enabled:true,
    checked:false
});

$('#root').append(myCheckBox.render());