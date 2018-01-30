var myRadioGroup = new RadioGroup({
    id: 'radiogroup',
    colspan: '6',
    label: 'Arensas radiogroup',
    fieldName: 'radioInput',
    blockProcessAttr: false,
    required: false,
   
   
});

$('#root').append(myRadioGroup.render());

