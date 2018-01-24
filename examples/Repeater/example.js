var myRepeater = new Repeater({
    id: 'repeater',
    defaultItem: {
        comboLabel: 'Zgjidh Shtetin',
        comboValue: "",
        autocompleteLabel: 'Ministrite',
        autocompleteValue: [],
        textLabel: 'Emri',
        textValue: ''
    },
    dataProvider: {
        items: [
            {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "",
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Emri',
                textValue: 'Mateo Jovani'
            },
            {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "1",
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Emri',
                textValue: ''
            }
        ]
    },
    components: [
        {
            constructor: AutoComplete,
            props: {
                id: 'autocomplete',
                colspan: '6',
                label: '{autocompleteLabel}',
                fieldName: 'autocomplete',
                blockProcessAttr: false,
                required: false,
                multipleSelection: true,
                tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
                dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
                value: '{autocompleteValue}'
            }
        },
        {
            constructor: ComboBox,
            props: {
                id: 'combo',
                colspan: '6',
                label: '{comboLabel}',
                fieldName: 'combobox',
                blockProcessAttr: false,
                required: true,
                dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
                value: '{comboValue}'
            }
        },
        {
            constructor: Text,
            props: {
                id: 'text',
                colspan: '6',
                label: '{textLabel}',
                fieldName: 'text',
                blockProcessAttr: false,
                required: false,
                value: '{textValue}'
            }
        }
    ]
});

$('#root').append(myRepeater.render());