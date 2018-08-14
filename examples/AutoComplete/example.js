var myAutoComplete = new AutoComplete({
    id: 'autocomplete',
    colspan: '6',
    label: 'Ministrite',
    blockProcessAttr: false,
    required: false,
    multipleSelection: true,
    displayTable: true,
    valueField: "value",
    labelField: "ministri",
    tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
    dataProvider: [{
        "value": "1",
        "ministri": "Ministria e Puneve te Jashtme"
    }, {
        "value": "2",
        "ministri": "Ministria e Drejtesise"
    }, {
        "value": "3",
        "ministri": "Ministria e Brendshme"
    }],
    value: [{ "value": "1", "ministri": "Ministria e Puneve te Jashtme" }]
});

$('#root').append(myAutoComplete.render());
