var myCheckBox =  CheckBox({
    id: 'checkBoxField',
    label: 'CheckBox Label',
    value: "1",
    checked:false
});

$('#root').append(myCheckBox.render());