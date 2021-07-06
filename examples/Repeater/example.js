import { Button } from "../../components/Button/Button.js";
import { Label } from "../../components/Label.js";
import { Repeater } from "../../components/Repeater/Repeater.js";
import { ArrayEx } from "../../lib/ArrayEx.js";

let myRepeater;
myRepeater = new Repeater({
    id: 'repeater',
    css: { width: "30%" },
    dataProvider: new ArrayEx({
        name: "Test name",
        company: "Test company"
    }, {
        name: "Test name",
        company: "Test company"
    }, {
        name: "Test name",
        company: "Test company"
    }, {
        name: "Test name",
        company: "Test company"
    }),
    components: [{
        ctor: Label,
        props: {
            id: 'lblCmp',
            label: "{currentIndex}",
            css: {
                "margin-right": "2rem",
                "margin-top": "1.4rem"
            },

        }
    },
    {
        ctor: Button,
        props: {
            id: 'btnCmp',
            label: "{name}",
            classes: ["button", "form-control"],
            css: {
                display: "inline",
                width: "80%"
            }

        }
    }
    ]
});

myRepeater.render().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});


export { myRepeater }

/*
var dp = new ArrayEx([{label:"test"}, {label:"anonimous", children:[{label:"hulk"}]}]);
var myRepeater = new Repeater({
    id: 'repeater',
    dataProvider:dp,
    components: [
        {
            ctor: Repeater,
            props:{
                id: 'repeater',
                dataProvider:"{currentItem.children}",
                components:[
                    {
                        ctor: Button,
                        props: {
                            id: 'component',
                            label: "{label}",
                        }
                    }
                ]
            }
        }
    ]
});




var myRepeater = new Repeater({
    id: 'repeater',
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
         {
            ctor: AutoComplete,
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
            ctor: ComboBox,
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
            ctor: TextInput,
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
            ctor: CheckBox,
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
            ctor: GoogleMap,
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
            ctor: RadioGroup,
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
        }
        {
            ctor: Button,
            props: {
                id: 'button',
                type: "button",
                value: "{textValue}",
                label:"{textValue}",
                classes: ["btn btn-success"],
                click : function(e, rargs){
                    console.log("From ClickAction");
                    myRepeater.dataProvider[rargs.currentIndex].textValue = "Clicked";
                }
            }
        }
    ]
});
*/