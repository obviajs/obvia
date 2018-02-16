var myToggleSwitch = new ToggleSwitch({
    id: 'checkbox',
    colspan: '6',
    label: 'Checkbox',
    blockProcessAttr: false,
    required: false,
    value: true,
    unCheckedLabel: "Jo",
    checkedLabel: "Po"
});

$('#root').append(myToggleSwitch.render());
