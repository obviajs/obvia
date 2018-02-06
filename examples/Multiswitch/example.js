var myMultiSwitch = new MultiSwitch({
    id: 'multiswitch',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'multiswitchInput',
    blockProcessAttr: false,
    required: true,
    multiselect: true,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme" },
        { "id": "2", "text": "Ministria e Drejtesise" },
        { "id": "3", "text": "Ministria e Brendshme" },
        { "id": "4", "text": "Ministria e Mbrojtjes" }
    ],
    valueField: "id",
    labelField: "text",
    defaultClassField: 'btn btn-xs btn-default',
    selectedClassField: 'btn btn-xs btn-success',
    value: [{ "id": "3", "text": "Ministria e Brendshme" }]
});

$('#root').append(myMultiSwitch.render());

