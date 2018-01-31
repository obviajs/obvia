var myForm = new Form({
    id: 'form',
    formName: 'My Form',
    viewMode: 'steps',
    components: [
        new Text({
            id: 'text',
            colspan: '6',
            label: 'Text Label',
            fieldName: 'textField',
            versionStyle: '',
            blockProcessAttr: false,
            required: true,
            mask: false,
            value: ""
        }),
        new AutoComplete({
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
        }),
        new ComboBox({
            id: 'combo',
            colspan: '6',
            label: 'Zgjidh Shtetin',
            fieldName: 'combobox',
            dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
            versionStyle: "",
            blockProcessAttr: false,
            required: false,
            value: "2"
        }),
        new GoogleMap({
            id: 'map3',
            colspan: '6',
            label: 'Vendodhja Gjeografike',
            fieldName: 'mapField3',
            versionStyle: "",
            blockProcessAttr: false,
            required: false,
            value: {
                latitude: 41.1533,
                longtitude: 20.1683,
                zoomLevel: 7
            }
        }),
        new Checkbox({
            id: 'checkbox',
            colspan: '6',
            label: 'Arensas checkbox',
            fieldName: 'checkboxInput',
            blockProcessAttr: false,
            required: false,
            value: true,
            unCheckedLabel: "Jo",
            checkedLabel: "Po"
        }),
        new Repeater({
            id: 'repeater',
            defaultItem: {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "",
                checkboxValue: true,
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [],
                textLabel: 'Emri',
                textValue: '',
                mapValue: {
                    latitude: 41.1533,
                    longtitude: 20.1683,
                    zoomLevel: 7
                }
            },
            dataProvider: {
                items: [
                    {
                        comboLabel: 'Zgjidh Shtetin',
                        comboValue: "",
                        checkboxValue: true,
                        autocompleteLabel: 'Ministrite',
                        autocompleteValue: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                        textLabel: 'Emri',
                        textValue: 'Mateo Jovani',
                        mapValue: {
                            latitude: 51.1533,
                            longtitude: 30.1683,
                            zoomLevel: 7
                        }
                    },
                    {
                        comboLabel: 'Zgjidh Shtetin',
                        comboValue: "1",
                        checkboxValue: true,
                        autocompleteLabel: 'Ministrite',
                        autocompleteValue: [{ "id": "3", "text": "Ministria e Brendshme" }],
                        textLabel: 'Emri',
                        textValue: '',
                        mapValue: {
                            latitude: 41.1533,
                            longtitude: 20.1683,
                            zoomLevel: 7
                        }
                    }
                ]
            },
            components: [
                {
                    constructor: AutoComplete,
                    props: {
                        id: 'autocompleteR',
                        colspan: '6',
                        label: '{autocompleteLabel}',
                        fieldName: 'autocompleteR',
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
                        id: 'comboR',
                        colspan: '6',
                        label: '{comboLabel}',
                        fieldName: 'comboboxR',
                        blockProcessAttr: false,
                        required: true,
                        dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
                        value: '{comboValue}'
                    }
                },
                {
                    constructor: Text,
                    props: {
                        id: 'textR',
                        colspan: '6',
                        label: '{textLabel}',
                        fieldName: 'textR',
                        blockProcessAttr: false,
                        required: true,
                        value: '{textValue}'
                    }
                },
                {
                    constructor: Checkbox,
                    props: {
                        id: 'checkboxR',
                        colspan: '6',
                        label: 'Aktiv',
                        fieldName: 'checkboxR',
                        blockProcessAttr: false,
                        required: true,
                        value: '{checkboxValue}',
                        unCheckedLabel: "Jo",
                        checkedLabel: "Po"
                    }
                },
                {
                    constructor: GoogleMap,
                    props: {
                        id: 'mapR',
                        colspan: '6',
                        label: 'Vendodhja Gjeografike',
                        fieldName: 'mapFieldR',
                        versionStyle: "",
                        blockProcessAttr: false,
                        required: false,
                        value: '{mapValue}'
                    }
                }
            ]
        })
    ]
});

$('#root').append(myForm.render());