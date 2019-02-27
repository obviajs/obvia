var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var oncellstyling_ex = function(e, rowIndex, columnIndex, column, data)
{
    return "css object";
}
var oncelleditfinished_ex = function(e, rowIndex, columnIndex, itemEditorInfo)
{
    var realRowIndex = rowIndex % this.rowCount;
    //e.preventDefault();
    console.log("oncelleditfinished_ex");
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
    //this.dataProvider[rowIndex][column.dataField] = value;
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
                ministry: 'Ministria 1',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 2',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 3',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 4',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 5',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 6',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 7',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 8',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 9',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 10',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 11',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 12',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 13',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 14',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 15',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 16',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 17',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 18',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 19',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 20',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 21',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 22',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 23',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 24',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 25',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 26',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 27',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 28',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 29',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 30',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 31',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 32',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 33',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'jim beam',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 34',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'black jack',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 35',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'metaxa',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 36',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'vodka',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 37',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'rum',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 38',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'russian standard',
                checkboxValue:false
            },
            {
                id:7,
                ministry: 'Ministria 39',
                ministry_ac: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Kremlin Walls',
                checkboxValue:true
            },
            { 
                id:5,
                ministry: 'Ministria 40',
                ministry_ac: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Jacky Qwerty',
                checkboxValue:false
            }

    ],
    columns: [
        {
            width:400,
            dataField: "ministry",
            headerText: "Ministria",
            sortable:true,
            sortInfo:{sortOrder:0, sortDirection:"ASC"},
            oncellstyling:oncellstyling_ex,
            oncelleditfinished: oncelleditfinished_ex,
            itemRenderer:null,
            editable:true,

            itemEditor:{
                constructor: AutoCompleteEx,
                props: {
                    id: 'autocomplete',
                    embedded: true,
                    fieldName: 'autocomplete',
                    blockProcessAttr: false,
                    required: false,
                    multiSelect: false,
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
            oncellstyling:oncellstyling_ex,
            //oncelleditfinished:oncelleditfinished_ex,
            itemRenderer:null,
            editable:true,

            itemEditor:{
                constructor: TextInput,
                props: {
                    id: 'text',
                    embedded: true,
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
            oncellstyling:oncellstyling_ex,
            //oncelleditfinished:oncelleditfinished_ex,
            itemRenderer:{
                constructor: CheckBox,
                props: {
                    id: 'checkbox',
                    embedded: true,
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
                    embedded: true,
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