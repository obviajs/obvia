/**
 * In this script are showcased all implemented components so far
 * Every complete component must be added here
 * Happy coding
 */

/**
 * MODAL Component
 */
$('#root').append("<hr>");
$('#root').append("<div><b>MODAL</b></div>");

var myModal = new Modal({
    id: 'myModal',
    size: 'modal-lg',
    title: 'Modal',
    body: '<div class="row">' +
            'Hello' +    
        '</div>'
});

$('body').append(myModal.render());
$('#root').append("<button onclick='myModal.show()'>Open Modal</button>");

/**
 * Text Component
 */
$('#root').append("<hr>");
$('#root').append("<div><b>TEXT</b></div>");

var myText = new Text({
    id: 'text',
    colspan: '6',
    label: 'Text Label',
    fieldName: 'textField',
    versionStyle: '',
    blockProcessAttr: false,
    required: false,
    mask: 'currency',
    value: '34,444.00'
});

$('#root').append(myText.render());

/**
 * ComboBox Component
 */
$('#root').append("<hr>");
$('#root').append("<div><b>COMBOBOX</b></div>");

var myCombo = new ComboBox({
    id: 'combo',
    colspan: '6',
    label: 'Zgjidh Shtetin',
    fieldName: 'combobox',
    dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
    versionStyle: "",
    blockProcessAttr: false,
    required: false,
    value: "2",
});

$('#root').append(myCombo.render());

//Colspan component

var myColspan = new Colspan({
    id: 'colspan',
    colspan: '3',
    label: 'My colspan',
    fieldName: 'colspanContainer',
    versionStyle: "",
    blockProcessAttr: false
    
});
$('#root').append(myColspan.render());
//$('#root').append("<div><b>COMBOBOX</b></div>");

//Checkbox component

var myCheckbox = new Checkbox({
    id: 'checkbox',
    colspan: '6',
    label: 'My checkbox',
    fieldName: 'checkbox',
    versionStyle: "",
    blockProcessAttr: false,
    required: false,
    value:true,
    unCheckedLabel:"Jo",
    checkedLabel:"Po"
});
$('#root').append(myCheckbox.render());

/**
 * AutoComplete Component
 */
$('#root').append("<hr>");
$('#root').append("<div><b>AUTOCOMPLETE</b></div>");

var myAutoComplete = new AutoComplete({
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
});


/**
 * Repeater Component
 */
$('#root').append("<hr>");
$('#root').append("<div><b>Repeater</b></div>");
