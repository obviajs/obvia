var myForm = new Form({
    id: 'form',
    formName: 'My Form',
    viewMode: 'steps',
    components: [
        {   
            constructor: TextInput,
            props: {
                id: 'text',
                colspan: '6',
                // spacing: {
                //     ml
                // },
                label: 'Text Label',
                versionStyle: '',
                blockProcessAttr: false,
                required: true,
                mask: 'currency',
                value: "1000"
            }
        },
        {
            constructor: TextInput,
            props: {
                id: 'number',
                colspan: '6',
                label: 'Number Label',
                versionStyle: '',
                blockProcessAttr: false,
                required: true,
                mask: {
                    alias: "currency",
                    prefix: ''
                },
                value: ""
            }    
        },
        {
            constructor: TextArea,
            props: {
                id: 'textarea',
                colspan: '6',
                label: 'Textarea Label',
                versionStyle: '',
                blockProcessAttr: false,
                required: true,
                spellCheck: {
                    defaultDictionary: 'English',//Albanian
                },
                value: ''
            }
        },    
        {
            constructor: TextEditor,
            props: {
                id: 'texteditor',
                colspan: '6',
                label: 'TextEditor',
                versionStyle: '',
                blockProcessAttr: false,
                required: false,
                spellCheck: {
                    defaultDictionary: 'English',//Albanian
                },
                value: 'Test'
            }
        },
        {
            constructor: DateTime,
            props: {
                id: 'datetime',
                colspan: '6',
                label: 'Date',
                versionStyle: '',
                blockProcessAttr: false,
                required: true,
                inputFormat: 'DD/MM/YYYY',
                outputFormat: 'DD-MM-YYYY',
                displayFormat: 'MM/DD/YYYY',
                value: '10/02/2018'
            }
        },
        {
            constructor: DateTimeCb,
            props: {
                id: 'dayMonthYear',
                colspan: '6',
                label: 'Date Mode 2',
                versionStyle: '',
                blockProcessAttr: false,
                required: false,
                startYear: '2005',
                endYear: '2020',
                mode: "datetime",
                inputFormat: 'MM/DD/YYYY H:m',
                outputFormat: 'DD-MM-YYYY H:m',
                value: '02/10/2006 03:34'
            }
        },
        {
            constructor: AutoComplete,
            props: {
                id: 'autocomplete',
                colspan: '6',
                label: 'Ministrite',
                blockProcessAttr: false,
                required: false,
                multipleSelection: false,
                displayTable: false,
                tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
                dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
                value: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }]
            }
        },
        {
            constructor: Amount,
            props: {
                id: 'amount',
                colspan: '6',
                label: 'Pagesa',
                blockProcessAttr: false,
                required: true,
                currencyList: [{ "id": "1", "text": "EUR" }, { "id": "2", "text": "ALL" }, { "id": "3", "text": "GBP" }],
                value: {
                    amount: "132323",
                    currency: "2"
                }
            }    
        },
        {
            constructor: ComboBox,
            props: {
                id: 'combo',
                colspan: '6',
                label: 'Zgjidh Shtetin',
                dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
                versionStyle: "",
                blockProcessAttr: false,
                required: false,
                value: "2"
            }    
        },
        {
            constructor: GoogleMap,
            props: {
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
            }    
        },
        {
            constructor: Toggle,
            props: {
                id: 'checkbox',
                colspan: '6',
                label: 'Checkbox',
                blockProcessAttr: false,
                required: false,
                value: true,
                unCheckedLabel: "Jo",
                checkedLabel: "Po"
            }
        },    
        {
            constructor: TrippleSwitch,
            props: {
                id: 'trippleswitch',
                colspan: '6',
                label: 'This is a survey. Are you happy?',
                versionStyle: "",
                blockProcessAttr: false,
                required: false,
                dataProvider: {
                    left: "Yes", //1
                    middle: "Somewhat",//-1
                    right: "No" //0
                },
                value: "1" //1,-1,0
            }    
        },
        // {
        //     constructor: MultiSwitch,
        //     props: {
        //         id: 'multiswitch',
        //         colspan: '6',
        //         label: 'Ministrite',
        //         blockProcessAttr: false,
        //         required: true,
        //         multiselect: false,
        //         dataProvider: [
        //             { "id": "1", "text": "Ministria e Puneve te Jashtme" },
        //             { "id": "2", "text": "Ministria e Drejtesise" },
        //             { "id": "3", "text": "Ministria e Brendshme" },
        //             { "id": "4", "text": "Ministria e Mbrojtjes" }
        //         ],
        //         valueField: "id",
        //         labelField: "text",
        //         defaultClass: 'btn btn-xs btn-default',
        //         selectedClass: 'btn btn-xs btn-success',
        //         value: [],
        //         onclick: function (e) {
        //             console.log("From MultiSwitch ClickAction");
        //         }
        //     }   
        // },
        {
            constructor: RadioGroup,
            props: {
                id: 'radiogroup',
                colspan: '6',
                label: 'Ministrite',
                blockProcessAttr: false,
                required: true,
                dataProvider: [
                    { "id": "1", "text": "Ministria e Puneve te Jashtme" },
                    { "id": "2", "text": "Ministria e Drejtesise" },
                    { "id": "3", "text": "Ministria e Brendshme" },
                    { "id": "4", "text": "Ministria e Mbrojtjes" }
                ],
                valueField: "id",
                labelField: "text",
                defaultClass: 'btn btn-xs btn-default',
                selectedClass: 'btn btn-xs btn-success',
                value: "3",
                onclick: function (e) {
                    console.log("From Radio ClickAction");
                }
            }
        },
        {
            constructor: Repeater,
            props: {
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
                    },
                    textAreaValue: "",
                    textEditorValue: "",
                    dateValue: "",
                    dayMonthYearValue: "",
                    amountValue: {},
                    radioGroupValue: ""
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
                        },
                        textAreaValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        textEditorValue: "",
                        dateValue: "10/02/2013",
                        dayMonthYearValue: "10/02/2013",
                        amountValue: { currency: "2", amount: "33433" },
                        radioGroupValue: "2"
                    },
                    {
                        comboLabel: 'Zgjidh Shtetin',
                        comboValue: "1",
                        checkboxValue: true,
                        autocompleteLabel: 'Ministrite',
                        autocompleteValue: [{ "id": "3", "text": "Ministria e Brendshme" }],
                        textLabel: 'Emri',
                        textValue: 'Lejdi Koci',
                        trippleValue: "1",
                        multiValue: [{ "id": "3", "text": "Ministria e Brendshme" }, { "id": "2", "text": "Ministria e Drejtesise" }],
                        mapValue: {
                            latitude: 41.1533,
                            longtitude: 20.1683,
                            zoomLevel: 7
                        },
                        textAreaValue: "Lorem Ipsum",
                        textEditorValue: "Lorem Ipsum",
                        dateValue: "",
                        dayMonthYearValue: "",
                        amountValue: {},
                        radioGroupValue: ""
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
                            displayTable: true,
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
                        constructor: Amount,
                        props: {
                            id: 'amount',
                            colspan: '6',
                            label: 'Pagesa',
                            blockProcessAttr: false,
                            required: true,
                            currencyList: [{ "id": "1", "text": "EUR" }, { "id": "2", "text": "ALL" }, { "id": "3", "text": "GBP" }],
                            value: '{amountValue}'
                        }
                    },
                    {
                        constructor: TextEditor,
                        props: {
                            id: 'texteditorR',
                            colspan: '6',
                            label: 'TextEditor',
                            versionStyle: '',
                            blockProcessAttr: false,
                            required: false,
                            value: '{textEditorValue}'
                        }
                    },
                    {
                        constructor: TextArea,
                        props: {
                            id: 'textareaR',
                            colspan: '6',
                            label: 'Textarea Label',
                            versionStyle: '',
                            blockProcessAttr: false,
                            required: true,
                            value: '{textAreaValue}'
                        }
                    },
                    {
                        constructor: DateTime,
                        props: {
                            id: 'datetime',
                            colspan: '6',
                            label: 'Date',
                            versionStyle: '',
                            blockProcessAttr: false,
                            required: true,
                            inputFormat: 'DD/MM/YYYY',
                            outputFormat: 'DD-MM-YYYY',
                            displayFormat: 'MM/DD/YYYY',
                            value: '{dateValue}'
                        }
                    },
                    {
                        constructor: DateTimeCb,
                        props: {
                            id: 'dayMonthYear',
                            colspan: '6',
                            label: 'Date Mode 2',
                            versionStyle: '',
                            blockProcessAttr: false,
                            required: false,
                            mode: "date",
                            inputFormat: 'DD/MM/YYYY',
                            outputFormat: 'DD-MM-YYYY',
                            value: '{dayMonthYearValue}'
                        }
                    },
                    {
                        constructor: Toggle,
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
                    {
                        constructor: RadioGroup,
                        props: {
                            id: 'radiogroup',
                            colspan: '6',
                            label: 'Ministrite',
                            blockProcessAttr: false,
                            required: true,
                            dataProvider: [
                                { "id": "1", "text": "Ministria e Puneve te Jashtme" },
                                { "id": "2", "text": "Ministria e Drejtesise" },
                                { "id": "3", "text": "Ministria e Brendshme" },
                                { "id": "4", "text": "Ministria e Mbrojtjes" }
                            ],
                            valueField: "id",
                            labelField: "text",
                            defaultClass: 'btn btn-xs btn-default',
                            selectedClass: 'btn btn-xs btn-success',
                            value: "{radioGroupValue}",
                            onclick: function (e) {
                                console.log("From Radio ClickAction");
                            }
                        }
                    },
                    // {
                    //     constructor: MultiSwitch,
                    //     props: {
                    //         id: 'multiswitchR',
                    //         colspan: '6',
                    //         label: 'Ministrite',
                    //         blockProcessAttr: false,
                    //         required: true,
                    //         multiselect: true,
                    //         dataProvider: [
                    //             { "id": "1", "text": "Ministria e Puneve te Jashtme" },
                    //             { "id": "2", "text": "Ministria e Drejtesise" },
                    //             { "id": "3", "text": "Ministria e Brendshme" },
                    //             { "id": "4", "text": "Ministria e Mbrojtjes" }
                    //         ],
                    //         valueField: "id",
                    //         labelField: "text",
                    //         defaultClass: 'btn btn-xs btn-default',
                    //         selectedClass: 'btn btn-xs btn-success',
                    //         value: '{multiValue}',
                    //         onclick: function (e) {
                    //             console.log("From MultiSwitch ClickAction");
                    //         }
                    //     }
                    // },
                    {
                        constructor: TrippleSwitch,
                        props: {
                            id: 'trippleswitchR',
                            colspan: '6',
                            label: 'This is a survey. Are you happy?',
                            versionStyle: "",
                            blockProcessAttr: false,
                            required: false,
                            dataProvider: {
                                left: "Yes", //1
                                middle: "Somewhat",//-1
                                right: "No" //0
                            },
                            value: "{trippleValue}" //1,-1,0
                        }
                    }
                ]
            }
        }    
    ]
});

myForm.on('creationComplete', function () {
    myForm.repeater.on('onBeforeRowAdd', function (e) {
        e.preventDefault();
        var repeater = this;
        
        bootbox.confirm("Do you want to add row?", function (result) {
            if (result) {
                repeater.addRow(repeater.defaultItem, repeater.currentIndex + 1);
            }
        })

    });

    myForm.repeater.on('onBeforeRowDelete', function (e) {
        e.preventDefault();
        var repeater = this;

        bootbox.confirm("Do you want to remove row?", function (result) {
            if (result) {
                repeater.removeRow(repeater.currentIndex);
            }
        })
    });

});

$('#root').append(myForm.render());

