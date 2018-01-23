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
    fieldName: 'text',
    blockProcessAttr: '',
    value: ''
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
    blockProcessAttr: '',
    multipleSelection: true,
    tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
    optionsData: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
    value: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }]
});

$('#root').append(myAutoComplete.render());

/**
 * Repeater Component
 */
$('#root').append("<hr>");
$('#root').append("<div><b>Repeater</b></div>");

var myRepeater = new Repeater({
    id: 'repeater',
    dataProvider: {
        defaultItem: {
            comboLabel: 'Zgjidh Shtetin',
            comboValue: "",
            autocompleteLabel: 'Ministrite',
            autocompleteValue: [],
            textLabel: 'Emri',
            textValue: ''
        },

        items: [
            {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "1",
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Emri',
                textValue: 'Mateo Jovani'
            },
            {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "",
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Emri',
                textValue: ''
            }
        ]
    },
    components: [
        {
            constructor: AutoComplete,
            props: {
                id: 'autocomplete',
                colspan: '6',
                label: '{autocompleteLabel}',
                fieldName: 'autocomplete',
                blockProcessAttr: '',
                multipleSelection: true,
                tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
                optionsData: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
                value: '{autocompleteValue}'
            }
        },
        {
            constructor: Text,
            props: {
                id: 'text',
                colspan: '6',
                label: '{textLabel}',
                fieldName: 'text',
                blockProcessAttr: '',
                value: '{textValue}'
            }
        }
    ]
});

$('#root').append(myRepeater.render());