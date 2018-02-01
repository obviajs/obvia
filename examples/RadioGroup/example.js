var myRadioGroup = new RadioGroup({
    id: 'radiogroup',
    colspan: '6',
    label: 'Arensas radiogroup',
    fieldName: 'radioInput',
    blockProcessAttr: false,
    required: false,
    dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme"}, { "id": "2", "text": "Ministria e Drejtesise"}, { "id": "3", "text": "Ministria e Brendshme"}],
    labelField: 'text',
    valueField: 'id',
    value: "3"  
});

$('#root').append(myRadioGroup.render());

