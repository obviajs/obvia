var loader = new Loader({
    id: 'loader'
});

loader.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
    loader.show();
});
let apiClient = new ApiClient();
apiClient.get("https://api.mocki.io/v1/8dea432f").then(r => {
    var myDataGrid = new DataGrid({
        id: 'DataGrid',
        height: 300,
        width: 800,
        allowNewItem: true, //allow the user to add items that are not included in the specified dataProvider
        rowCount: 5, //visible rows count - virtual scrolling wil be applied on scroll
        dataProvider: new ArrayEx(r.response),
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
                        value: '{favoriteFruit}'
                    }
                }
            }
        ]
    });
    myDataGrid.on('creationComplete', function () {
        loader.hide();
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
    });
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
        if (itemEditorInfo.itemEditor["labelField"] && isObject(value[0]) && value[0][itemEditorInfo.itemEditor.labelField]) {
            label = value[0][itemEditorInfo.itemEditor.labelField];
        }
    }
    //e.preventDefault();
    //this.dataProvider[rowIndex][column.field] = value;
    return label;
};