let fields = new ArrayEx([{
        "description": "Price",
        "field": "price",
        "type": "decimal"
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
    typeField: "type"
});
//Map that has entries for each type, and for each operator(recurse?) chosen the enries are the itemEditors for the filter value for this field
myFilter.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});