var myCheckbox = new Checkbox({
    id: 'checkbox',
    colspan: '6',
    label: 'Arensas checkbox',
    fieldName: 'checkbox',
    blockProcessAttr: false,
    required: false,
    value:true,
    unCheckedLabel:"Jo",
    checkedLabel:"Po"
   
});

$('#root').append(myCheckbox.render());
