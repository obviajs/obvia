var myAutoComplete = new AutoComplete({
    id: 'autocomplete',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'autocomplete',
    blockProcessAttr: false,
    required: false,
    multipleSelection: true,
    tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
    dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
    value: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }]
});

$('#root').append(myAutoComplete.render());