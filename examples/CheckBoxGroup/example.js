var myCheckboxGroup = new CheckboxGroup({
    id: 'checkBoxGroupLonely1',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'checkBoxGroupInputR',
    blockProcessAttr: false,
    required: true,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": 'btn btn-xs btn-default', "enabled":true},
        { "id": "2", "text": "Ministria e Drejtesise 1", "buttonClass": 'btn btn-xs btn-default', "enabled":true},
        { "id": "3", "text": "Ministria e Brendshme 1", "buttonClass": 'btn btn-xs btn-success', "enabled":true},
        { "id": "4", "text": "Ministria e Mbrojtjes 1", "buttonClass": 'btn btn-xs btn-default', "enabled":true}
    ],
    valueField: "id",
    labelField: "text",
    classField: "buttonClass",
    defaultClass: 'btn btn-xs btn-default',
    selectedClass: 'btn btn-xs btn-success',
    enabledField: "enabled",
    value: [{ "id": "3", "text": "Ministria e Brendshme", "buttonClass": 'btn btn-xs btn-success', "enabled":true}],
    onclick : function(e){
        console.log("From CheckBoxGroup ClickAction"); 
        //e.preventDefault();
    }
});

$('#root').append(myCheckboxGroup.render());

