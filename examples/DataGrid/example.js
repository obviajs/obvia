var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var oncellstyling_ex = function(e, rowIndex, columnIndex, column, data)
{
    return "css object";
}
var celleditfinished_ex = function(e, rowIndex, columnIndex, itemEditorInfo)
{
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
    if(value.length>0)
    {
        if(itemEditorInfo.itemEditor["labelField"] && isObject(value[0]) && value[0][itemEditorInfo.itemEditor.labelField])
        {
            label = value[0][itemEditorInfo.itemEditor.labelField];
        }
    }
    //e.preventDefault();
    //this.dataProvider[rowIndex][column.field] = value;
    return label;
}
var onrowstyling_ex = function(e, rowIndex, data)
{
    return "css object";
}
var myDataGrid = new DataGrid({
    id: 'DataGrid',
    onrowstyling:onrowstyling_ex,
    allowNewItem: true, //allow the user to add items that are not included in the specified dataProvider
    rowCount:5, //visible rows count - virtual scrolling wil be applied on scroll
    dataProvider: [
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry_ac: [{ "id": "2", "ministry": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry_ac: [{ "id": "3", "ministry": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            }

    ],
    columns: [
        {
            width:400,
            name:"ministry",
            field: "ministry_ac[0].ministry",
            description: "Ministria",
            sortable:true,
            sortInfo:{sortOrder:0, sortDirection:"ASC"},
            cellStyling:oncellstyling_ex,
            cellEditFinished: celleditfinished_ex,
            editable:true,

            itemEditor:{
                ctor: AutoCompleteEx,
                props: {
                    id: 'autocomplete',
                    fieldName: 'autocomplete',
                    multiSelect: false,
                    valueField: "id",
                    labelField: "ministry",
                    dataProvider: [{ "id": "1", "ministry": "Ministria e Puneve te Jashtme" }, { "id": "2", "ministry": "Ministria e Drejtesise" }, { "id": "3", "ministry": "Ministria e Brendshme" }],
                    value: '{ministry_ac}'
                }
            }
        },
        {
            name:"drink",
            field: "textLabel",
            description: "Pija Preferuar",
            sortable:false,
            sortInfo:{sortOrder:0, sortDirection:"ASC"},
            cellStyling:oncellstyling_ex,
            //cellEditFinished:celleditfinished_ex,
            editable:true,

            itemEditor:{
                ctor: TextInput,
                props: {
                    id: 'text',
                    value: '{textLabel}',
                }
            }
        },
        {
            name:"truth",
            field: "checkboxValue",
            description: "Vertete",
            sortable:false,
            sortInfo:{sortOrder:0, sortDirection:"ASC"},
            cellStyling:oncellstyling_ex,
            //cellEditFinished:celleditfinished_ex,
            itemRenderer:{
                ctor: CheckBox,
                props: {
                    id: 'checkbox',
                    label: 'Vertete',
                    value: '{id}',
                    checked: '{checkboxValue}',
                    unCheckedLabel:"Jo",
                    checkedLabel:"Po"
                }
            },
           

            itemEditor:{
                ctor: CheckBox,
                props: {
                    id: 'checkbox',
                    label: 'Aktiv',
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

myDataGrid.renderPromise().then(function (cmpInstance)
{
  $('#root').append(cmpInstance.$el);
});