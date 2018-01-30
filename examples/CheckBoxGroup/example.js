var myCheckboxGroup = new CheckboxGroup({
    id: 'checkboxgroup',
    colspan: '6',
    //rowspan: '3',
    label: 'Arensas checkboxgroup',
    fieldName: 'checkboxgroupInput',
    blockProcessAttr: false,
    required: true,
    dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
    value: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }]
   
});

$('#root').append(myCheckboxGroup.render());

