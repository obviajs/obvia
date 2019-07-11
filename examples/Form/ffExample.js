var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

window.textValue = "Hello :)";
window.autocompleteValue = new ArrayEx([{ "id": "1", "text": "Ministria e Puneve te Jashtme" }]);
//windows its the default context, putting below just for reminding DEVs
Component.defaultContext = window;

var myForm = new Form({
    id: 'form',
    formName: 'My Form',
    action:"",
    components: [
        {
            constructor: FormField,
            props: {
                id: 'formFieldEx2',
                label: 'Example  Input',
                placeholder: 'Example  Input',
                name: 'formFieldEx2',
                size: FormFieldSize.SMALL,
                spacing:{colSpan:2},
                component: {
                    constructor: TextInput,
                    props: {
                        id: 'textField',
                        mask: 'currency',
                        value: '34,444.00'
                    }
                }
            }
        },
        {
            constructor: FormField,
            props: {
                id: 'formFieldEx3',
                label: 'Example Input 3',
                placeholder: 'Example Input 3',
                name: 'formFieldEx3',
                size: FormFieldSize.SMALL,
                spacing:{colSpan:3},
                component: {
                    constructor: TextInput,
                    props: {
                        id: 'textField3',
                        value: 'Bebop'
                    }
                }
            }
        },
        {
            constructor: FormField,
            props: {
                id: 'formFieldEx4',
                label: 'Example Autocomplete',
                placeholder: 'Example Autocomplete',
                name: 'autocomplete',
                size: FormFieldSize.SMALL,
                component: {
                    constructor: AutoCompleteEx,
                    props: {
                        id: 'autocompleteR',
                        valueField: "id",
                        labelField: "text",
                        dataProvider: new ArrayEx([{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }]),
                        value: '{autocompleteValue}'
                    }
                }
            }
        },
        {
            constructor: FormField,
            props: {
                id: 'formFieldEx',
                label: 'Example formField',
                name: 'formFieldEx',
                size: FormFieldSize.SMALL,
                component: {
                    constructor: Button,
                    props: {
                        id: 'button',
                        type: "button",
                        value: "{textValue}",
                        label:"{textValue}",
                        class: "btn btn-success",
                        click : function(e){console.log("From ClickAction");}
                    }
                }
            }
        },
        {
            constructor: Hidden,
            props: {
                id: 'hiddenField4',
                name: 'hiddenField4',
                value: '777'
            }
            
        },
    ]});    

myForm.on('creationComplete', function(e){
    loader.hide();
});

$('#root').append(myForm.render());