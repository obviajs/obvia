var myCheckbox = new Checkbox({
    id: 'checkbox',
    colspan: '6',
    label: 'Checkbox',
    blockProcessAttr: false,
    required: false,
    value: true,
    unCheckedLabel: "Jo",
    checkedLabel: "Po"
});

$('#root').append(myCheckbox.render());
