import { AutoCompleteEx } from "../../components/AutoComplete/AutoCompleteEx.js";
import { Button } from "../../components/Button/Button.js";
import { DataGrid } from "../../components/DataGrid/DataGrid.js";
import { TextInput } from "../../components/TextInput/TextInput.js";
import { ApiClient } from "../../lib/ApiClientGen/ApiClient.js";
import { ArrayEx } from "../../lib/ArrayEx.js";

var myDataGrid;
let apiClient = new ApiClient();

apiClient.get("https://api.mocki.io/v1/83a89b16").then(r => {
    myDataGrid = new DataGrid({
        id: 'DataGrid',
        height: 300,
        width: 800,
        attr: { "testBindedAttr": "{(new Date()).getFullYear()}" },
        allowNewItem: true, //allow the user to add items that are not included in the specified dataProvider
        rowCount: 5, //visible rows count - virtual scrolling wil be applied on scroll
        dataProvider: new ArrayEx(r.response),
        defaultItem: {
            "name": "Enter Name",
            "age": 17,
            "company": "Acme",
            "favoriteFruit": "Kiwi",
            "selectedFavoriteFruit": null
        },
        columns: [{
            width: 400,
            name: "name",
            field: "name",
            description: "Name",
            sortable: true,
            sortInfo: {
                sortOrder: 0,
                sortDirection: "ASC"
            },
            editable: true
        },
        {
            width: 400,
            name: "age",
            field: "age",
            description: "Age",
            sortable: true,
            sortInfo: {
                sortOrder: 0,
                sortDirection: "ASC"
            },
            editable: true
        },
        {
            width: 200,
            name: "company",
            field: "company",
            description: "Company",
            sortable: false,
            sortInfo: {
                sortOrder: 0,
                sortDirection: "ASC"
            },
            editable: true,
            itemEditor: {
                ctor: TextInput,
                props: {
                    id: 'text',
                    value: '{company}',
                }
            }
        },
        {
            width: 200,
            name: "favoriteFruit",
            field: "favoriteFruit",
            description: "Favorite Fruit",
            sortable: true,
            sortInfo: {
                sortOrder: 0,
                sortDirection: "ASC"
            },
            editable: true,
            itemEditor: {
                ctor: AutoCompleteEx,
                props: {
                    id: 'autocomplete',
                    fieldName: 'autocomplete',
                    multiSelect: false,
                    valueField: "value",
                    labelField: "label",
                    dataProvider: new ArrayEx([{
                        "value": "apple",
                        "label": "apple"
                    }, {
                        "value": "banana",
                        "label": "banana"
                    }, {
                        "value": "strawberry",
                        "label": "strawberry"
                    }]),
                    value: '{selectedFavoriteFruit}'
                }
            }
        }
        ]
    });

    myDataGrid.on('cellEditFinished', function () {

    });

    myDataGrid.render().then(function (cmpInstance) {
        $('#root').append(cmpInstance.$el);
        var myButton = new Button({
            id: 'button',
            type: "",
            value: "",
            label: "Click me",
            classes: ["btn", "btn-success"],
            click: function (e) {
                for (let i = 0; i < 5; i++) {
                    myDataGrid.dataProvider[i].age += 10;
                }
            }
        });
        myButton.render().then(function (cmpInstance) {
            $('#root').append(cmpInstance.$el);
        });

        var myButton2 = new Button({
            id: 'button2',
            type: "",
            value: "",
            label: "Splice",
            classes: ["btn", "btn-success"],
            click: function (e) {
                myDataGrid.dataProvider.splicea(0, 0, [
                    {
                        "_id": "602a4344f759fe17eb84824b",
                        "age": 27,
                        "guid": "cfa08086-cd92-4f4c-b948-9d4eac8289e1",
                        "name": "Anony Mous",
                        "tags": ["est", "Lorem", "duis", "non", "et", "irure", "officia"],
                        "about": "Aliquip enim minim laboris veniam occaecat aute nostrud deserunt non enim excepteur dolore magna aliquip. Non aute sint esse occaecat mollit do enim deserunt nostrud commodo eiusmod sunt labore. Minim duis aute magna deserunt.\r\n",
                        "email": "carmenkramer@peticular.com",
                        "index": 0,
                        "phone": "+1 (844) 427-2140",
                        "gender": "female",
                        "address": "968 Varick Avenue, Faywood, California, 4323",
                        "balance": "$2,175.90",
                        "company": "Kreatx",
                        "friends": [{
                            "id": 0,
                            "name": "Elinor Cardenas"
                        }, {
                            "id": 1,
                            "name": "Ofelia Patton"
                        }, {
                            "id": 2,
                            "name": "Elva Aguirre"
                        }],
                        "picture": "http://placehold.it/32x32",
                        "eyeColor": "blue",
                        "greeting": "Hello, Carmen Kramer! You have 1 unread messages.",
                        "isActive": true,
                        "latitude": -26.608744,
                        "longitude": 105.653813,
                        "registered": "2019-12-24T11:59:56 -01:00",
                        "favoriteFruit": "kiwi"
                    }
                ]);
            }
        });
        myButton2.render().then(function (cmpInstance) {
            $('#root').append(cmpInstance.$el);
        });
        loader.hide();
    });
});

var myDataGrid2 = new DataGrid({
    id: 'DataGrid',
    height: 300,
    width: 800,
    attr: { "testBindedAttr": "{(new Date()).getFullYear()}" },
    allowNewItem: true, //allow the user to add items that are not included in the specified dataProvider
    allowRemoveItem: true,
    rowCount: 5, //visible rows count - virtual scrolling wil be applied on scroll
    defaultItem: {
        "name": "Enter Name",
        "age": 17,
        "company": "Acme",
        "favoriteFruit": "Kiwi",
        "selectedFavoriteFruit": null
    },
    columns: [{
        width: 400,
        name: "name",
        field: "name",
        description: "Name",
        sortable: true,
        sortInfo: {
            sortOrder: 0,
            sortDirection: "ASC"
        },
        editable: false
    },
    {
        width: 400,
        name: "age",
        field: "age",
        description: "Age",
        sortable: true,
        sortInfo: {
            sortOrder: 0,
            sortDirection: "ASC"
        },
        editable: false
    },
    {
        width: 200,
        name: "company",
        field: "company",
        description: "Company",
        sortable: false,
        sortInfo: {
            sortOrder: 0,
            sortDirection: "ASC"
        },
        editable: true,
        itemEditor: {
            ctor: TextInput,
            props: {
                id: 'text',
                value: '{company}',
            }
        }
    },
    {
        width: 200,
        name: "favoriteFruit",
        field: "favoriteFruit",
        description: "Favorite Fruit",
        sortable: true,
        sortInfo: {
            sortOrder: 0,
            sortDirection: "ASC"
        },
        editable: true,
        itemEditor: {
            ctor: AutoCompleteEx,
            props: {
                id: 'autocomplete',
                fieldName: 'autocomplete',
                multiSelect: false,
                valueField: "value",
                labelField: "label",
                dataProvider: new ArrayEx([{
                    "value": "apple",
                    "label": "apple"
                }, {
                    "value": "banana",
                    "label": "banana"
                }, {
                    "value": "strawberry",
                    "label": "strawberry"
                }]),
                value: '{selectedFavoriteFruit}'
            }
        }
    }
    ]
});
myDataGrid2.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

var celleditfinished_ex = function (e, rowIndex, columnIndex, itemEditorInfo) {
    var realRowIndex = rowIndex % this.rowCount;
    //e.preventDefault();
    console.log("celleditfinished_ex");
    // itemEditorInfo.itemEditor
    //itemEditorInfo.dataProviderValueField
    var value = itemEditorInfo.itemEditor.value;
    this.dataProvider[rowIndex][itemEditorInfo.dataProviderValueField] = value;
    //test flash element to get attention if value is not valid and then preventDefault behavior
    //itemEditorInfo.itemEditor.$el.delay(500).fadeTo(100, 0.3, function(){$(this).fadeTo(500,1)});
    // e.preventDefault();

    var label = "";
    if (value.length > 0) {
        if (itemEditorInfo.itemEditor["labelField"] && ObjectUtils.isObject(value[0]) && value[0][itemEditorInfo.itemEditor.labelField]) {
            label = value[0][itemEditorInfo.itemEditor.labelField];
        }
    }
    //e.preventDefault();
    //this.dataProvider[rowIndex][column.field] = value;
    return label;
};

export { myDataGrid }