let fields = new ArrayEx([{
        "description": "Price",
        "field": "price",
        "type": "double",
        "itemEditor": {
            "ctor": "TextInput",
            "props": {
                "classes": ["form-control", "form-control-sm"]
            }
        }
    },
    {
        "description": "Item",
        "field": "item_name",
        "type": "string"
    },
    {
        "description": "Supplier",
        "field": "supplier_name",
        "type": "string"
    },
]);

var myFilter = new Filter({
    dataProvider: fields,
    labelField: "description",
    valueField: "field",
    typeField: "type",
    itemEditorField: "itemEditor"
});
//Map that has entries for each type, and for each operator(recurse?) chosen the enries are the itemEditors for the filter value for this field
myFilter.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

//myFilter.validate().then((valid)=>{if(valid){console.log(myFilter.rules)}})