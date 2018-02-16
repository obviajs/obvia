var myForm = new Form({
    id: 'form',
    formName: 'My Form',
    viewMode: 'steps',
    components: [
        new TextInput({
            id: 'text',
            colspan: '6',
            label: 'Text Label',
            versionStyle: '',
            blockProcessAttr: false,
            required: true,
            mask: 'currency',
            value: "33"
        }),
        new AutoComplete({
            id: 'autocomplete',
            colspan: '6',
            label: 'Ministrite',
            blockProcessAttr: false,
            required: false,
            multipleSelection: false,
            tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
            dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
            value: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }]
        }),
        new ComboBox({
            id: 'combo',
            colspan: '6',
            label: 'Zgjidh Shtetin',
            dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
            versionStyle: "",
            blockProcessAttr: false,
            required: false,
            value: "2"
        }),
        new GoogleMap({
            id: 'map',
            colspan: '6',
            label: 'Vendodhja Gjeografike',
            versionStyle: "",
            blockProcessAttr: false,
            required: false,
            value: {
                latitude: 41.1533,
                longtitude: 20.1683,
                zoomLevel: 7
            }
        }),
        new ToggleSwitch({
            id: 'checkbox',
            colspan: '6',
            label: 'Checkbox',
            blockProcessAttr: false,
            required: false,
            value: true,
            unCheckedLabel: "Jo",
            checkedLabel: "Po"
        }),
        // new Trippleswitch({
        //     id: 'trippleswitch',
        //     colspan: '6',
        //     label: 'This is a survey. Are you happy?',
        //     fieldName: 'tripple',
        //     versionStyle: "",
        //     blockProcessAttr: false,
        //     required: false,
        //     dataProvider: {
        //         left: "Yes", //1
        //         middle: "Somewhat",//-1
        //         right: "No" //0
        //     },
        //     value: "1" //1,-1,0
        // }),
        // new MultiSwitch({
        //     id: 'multiswitch',
        //     colspan: '6',
        //     label: 'Ministrite',
        //     fieldName: 'multiswitchInput',
        //     blockProcessAttr: false,
        //     required: true,
        //     multiselect: false,
        //     dataProvider: [
        //         { "id": "1", "text": "Ministria e Puneve te Jashtme" },
        //         { "id": "2", "text": "Ministria e Drejtesise" },
        //         { "id": "3", "text": "Ministria e Brendshme" },
        //         { "id": "4", "text": "Ministria e Mbrojtjes" }
        //     ],
        //     valueField: "id",
        //     labelField: "text",
        //     defaultClassField: 'btn btn-xs btn-default',
        //     selectedClassField: 'btn btn-xs btn-success',
        //     value: []
        // }),
        new Repeater({
            id: 'repeater',
            rendering: {
                direction: 'vertical',
                seperator: true,
                actions: true
            },
            defaultItem: {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "",
                checkboxValue: false,
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [],
                textLabel: 'Emri',
                textValue: '',
                trippleValue: "-1",
                multiValue: [],
                mapValue: {
                    latitude: 41.1533,
                    longtitude: 20.1683,
                    zoomLevel: 7
                }
            },
            dataProvider: [
                {
                    comboLabel: 'Zgjidh Shtetin',
                    comboValue: "",
                    checkboxValue: true,
                    autocompleteLabel: 'Ministrite',
                    autocompleteValue: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                    textLabel: 'Emri',
                    textValue: 'Mateo Jovani',
                    trippleValue: "-1",
                    multiValue: [{ "id": "3", "text": "Ministria e Brendshme" }],
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
                    trippleValue: "1",
                    multiValue: [{ "id": "3", "text": "Ministria e Brendshme" }, { "id": "2", "text": "Ministria e Drejtesise" }],
                    mapValue: {
                        latitude: 41.1533,
                        longtitude: 20.1683,
                        zoomLevel: 7
                    }
                }
            ],
            components: [
                {
                    constructor: AutoComplete,
                    props: {
                        id: 'autocompleteR',
                        colspan: '6',
                        label: '{autocompleteLabel}',
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
                        blockProcessAttr: false,
                        required: true,
                        dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
                        value: '{comboValue}'
                    }
                },
                {
                    constructor: TextInput,
                    props: {
                        id: 'textR',
                        colspan: '6',
                        label: '{textLabel}',
                        blockProcessAttr: false,
                        required: true,
                        value: '{textValue}'
                    }
                },
                {
                    constructor: ToggleSwitch,
                    props: {
                        id: 'checkboxR',
                        colspan: '6',
                        label: 'Aktiv',
                        blockProcessAttr: false,
                        required: false,
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
                },
                // {
                //     constructor: Trippleswitch,
                //     props: {
                //         id: 'trippleswitchR',
                //         colspan: '6',
                //         label: 'This is a survey. Are you happy?',
                //         fieldName: 'trippleR',
                //         versionStyle: "",
                //         blockProcessAttr: false,
                //         required: false,
                //         dataProvider: {
                //             left: "Yes", //1
                //             middle: "Somewhat",//-1
                //             right: "No" //0
                //         },
                //         value: "{trippleValue}" //1,-1,0
                //     }
                // },
                // {
                //     constructor: MultiSwitch,
                //     props: {
                //         id: 'multiswitchR',
                //         colspan: '6',
                //         label: 'Ministrite',
                //         fieldName: 'multiswitchInputR',
                //         blockProcessAttr: false,
                //         required: true,
                //         multiselect: true,
                //         dataProvider: [
                //             { "id": "1", "text": "Ministria e Puneve te Jashtme"},
                //             { "id": "2", "text": "Ministria e Drejtesise" },
                //             { "id": "3", "text": "Ministria e Brendshme" },
                //             { "id": "4", "text": "Ministria e Mbrojtjes" }
                //         ],
                //         valueField: "id",
                //         labelField: "text",
                //         defaultClassField: 'btn btn-xs btn-default',
                //         selectedClassField: 'btn btn-xs btn-success',
                //         value: '{multiValue}'
                //     }
                // }
            ]
        })
    ]
});


// $(document).on('onBeforeRowAdd', function (e, repeater, args) {
//     e.preventDefault();
    
//     bootbox.confirm("Do you want to add row?", function (result) {
//         if (result) {
//             repeater.addRow(args.currentItem, args.currentIndex);
//         }
//     })
    
// });

$(document).on('onBeforeRowDelete', function (e, repeater, args) {
    e.preventDefault();

    bootbox.confirm("Do you want to remove row?", function (result) {
        if (result) {
            repeater.removeRow(args.currentIndex);
        }
    })
});

$('#root').append(myForm.render());
