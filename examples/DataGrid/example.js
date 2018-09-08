var cellStyleFunction_ex = function(currentItem, rowIndex, colIndex)
{
    return "css object";
}
var cellValueFunction_ex = function(currentItem, rowIndex, colIndex)
{
    return "object";
}
var rowStyleFunction_ex = function(currentItem, rowIndex)
{
    return "css object";
}
var myDataGrid = new DataGrid({
    id: 'DataGrid',
    rowStyleFunction:rowStyleFunction_ex,
    dataProvider: [
            {
                id:7,
                ministry: 'Ministria e Drejtesise',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria e Brendshme',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            }
    ],
    columns: [
        {
            dataField: "ministry",
            headerText: "Ministria",
            sortable:true,
            sortInfo:{sortOrder:0, sortDirection:"ASC"},
            cellStyleFunction:cellStyleFunction_ex,
            cellValueFunction:cellValueFunction_ex,
            itemRenderer:null,
            editable:true,

            itemEditor:{
                constructor: AutoComplete,
                props: {
                    id: 'autocomplete',
                    colspan: '6',
                    label: '{autocompleteLabel}',
                    fieldName: 'autocomplete',
                    blockProcessAttr: false,
                    required: false,
                    multipleSelection: true,
                    valueField: "id",
                    labelField: "text",
                    dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
                    value: '{ministry_ac}'
                }
            }
        },
        {
            dataField: "textLabel",
            headerText: "Pija Preferuar",
            sortable:false,
            sortInfo:{sortOrder:0, sortDirection:"ASC"},
            cellStyleFunction:cellStyleFunction_ex,
            cellValueFunction:cellValueFunction_ex,
            itemRenderer:null,
            editable:true,

            itemEditor:{
                constructor: TextInput,
                props: {
                    id: 'text',
                    colspan: '6',
                    label: '{textLabel}',
                    fieldName: 'text',
                    blockProcessAttr: false,
                    required: false,
                    value: '{textLabel}'
                }
            }
        },
        {
            dataField: "checkboxValue",
            headerText: "Vertete",
            sortable:false,
            sortInfo:{sortOrder:0, sortDirection:"ASC"},
            cellStyleFunction:cellStyleFunction_ex,
            cellValueFunction:cellValueFunction_ex,
            itemRenderer:{
                constructor: CheckBox,
                props: {
                    id: 'checkbox',
                    colspan: '6',
                    label: 'Vertete',
                    fieldName: 'checkbox',
                    blockProcessAttr: false,
                    required: true,
                    value: '{id}',
                    checked: '{checkboxValue}',
                    unCheckedLabel:"Jo",
                    checkedLabel:"Po"
                }
            },
           

            itemEditor:{
                constructor: CheckBox,
                props: {
                    id: 'checkbox',
                    colspan: '6',
                    label: 'Aktiv',
                    fieldName: 'checkbox',
                    blockProcessAttr: false,
                    required: true,
                    value: '{checkboxValue}',
                    checked: '{checkboxValue}',
                    unCheckedLabel:"Jo",
                    checkedLabel:"Po"
                }
            }
        }
     
    ]
});
myDataGrid.on('creationComplete', function () {
    loader.hide();
});
$('#root').append(myDataGrid.render());