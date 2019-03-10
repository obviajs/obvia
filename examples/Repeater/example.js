var myRepeater = new Repeater({
    id: 'repeater',
    label: 'Example Repeater',
	rendering: {
				direction: 'vertical',
				separator: true,
				actions: false
			},
    defaultItem: {
        comboLabel: 'Zgjidh Shtetin',
        comboValue: "",
        autocompleteLabel: 'Ministrite',
        autocompleteValue: [],
        textLabel: 'Emri',
        textValue: '',
        mapValue: {
            latitude: 41.1533,
            longtitude: 20.1683,
            zoomLevel: 7
        }
    },
    dataProvider:  
		[
            {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "",
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [{ "id": "2", "text": "Ministria e Drejtesise" }],
                textLabel: 'Emri',
                textValue: 'Jacky Qwerty',
                radioValue: "1",
                mapValue: {
                    latitude: 51.1533,
                    longtitude: 30.1683,
                    zoomLevel: 7
                },
                checkboxValue:true
            },
            {
                comboLabel: 'Zgjidh Shtetin',
                comboValue: "1",
                autocompleteLabel: 'Ministrite',
                autocompleteValue: [{ "id": "3", "text": "Ministria e Brendshme" }],
                textLabel: 'Emri',
                textValue: 'Cowboy Bebop',
                radioValue: "3",
                mapValue: {
                    latitude: 41.1533,
                    longtitude: 20.1683,
                    zoomLevel: 7
                },
                checkboxValue:false
            }
        ],
    components: [
       /* {
            constructor: AutoComplete,
            props: {
                id: 'autocomplete',
                colspan: '6',
                label: '{autocompleteLabel}',
                fieldName: 'autocomplete',
                blockProcessAttr: false,
                required: false,
                multipleSelection: true,
                tableData: [["Ministria e Puneve te Jashtme"], ["Ministria e Drejtesise"], ["Ministria e Brendshme"]],
                dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme" }, { "id": "2", "text": "Ministria e Drejtesise" }, { "id": "3", "text": "Ministria e Brendshme" }],
                value: '{autocompleteValue}'
            }
        },
        {
            constructor: ComboBox,
            props: {
                id: 'combo',
                colspan: '6',
                label: '{comboLabel}',
                fieldName: 'combobox',
                blockProcessAttr: false,
                required: true,
                dataProvider: [{ "value": "1", "text": "Shqiperi" }, { "value": "2", "text": "Greqi" }, { "value": "3", "text": "SHBA" }],
                value: '{comboValue}'
            }
        },
        {
            constructor: TextInput,
            props: {
                id: 'text',
                colspan: '6',
                label: '{textLabel}',
                fieldName: 'text',
                blockProcessAttr: false,
                required: false,
                value: '{textValue}'
            }
        },
        {
            constructor: CheckBox,
            props: {
                id: 'checkbox',
                colspan: '6',
                label: 'Aktiv',
                fieldName: 'checkbox',
                blockProcessAttr: false,
                required: true,
                value: '{checkboxValue}',
                unCheckedLabel:"Jo",
                checkedLabel:"Po"
            }
        },
        {
            constructor: GoogleMap,
            props: {
                id: 'map3',
                colspan: '6',
                label: 'Vendodhja Gjeografike',
                fieldName: 'mapField3',
                versionStyle: "",
                blockProcessAttr: false,
                required: false,
                value: '{mapValue}'
            }
        },
        {
            constructor: RadioGroup,
            props: {
                id: 'radiogroup',
                colspan: '6',
                label: 'Radio',
                fieldName: 'radioInput',
                blockProcessAttr: false,
                required: false,
                dataProvider: [{ "id": "1", "text": "Ministria e Puneve te Jashtme"}, { "id": "2", "text": "Ministria e Drejtesise"}, { "id": "3", "text": "Ministria e Brendshme"}],
                labelField: 'text',
                valueField: 'id',
                value: '{radioValue}' 
            }
        }*/
        {
            constructor: Button,
            props: {
                id: 'button',
                type: "button",
                value: "{textValue}",
                label:"{textValue}",
                class: "btn btn-success",
                click : function(e, rargs){
                    console.log("From ClickAction");
                    myRepeater.dataProvider[rargs.currentIndex].textValue = "Clicked";
                }
            }
        }
    ]
});

$('#root').append(myRepeater.render());