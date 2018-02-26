var myCheckboxGroup = new CheckboxGroup({
    id: 'checkboxgroup',
    colspan: '6',
    label: 'Checkboxgroup',
    fieldName: 'checkboxgroupInput',
    blockProcessAttr: false,
    required: true,
    dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme", "checked": true}, { "id": "2", "text": "Ministria e Drejtesise", "checked": false}, { "id": "3", "text": "Ministria e Brendshme", "checked": true }],
    labelField: 'text',
    valueField: 'id',
    enabledField: 'id',
    checkedField: 'checked',
    classField : 'classFieldInDp'
});

$('#root').append(myCheckboxGroup.render());

