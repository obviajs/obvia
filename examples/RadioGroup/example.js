var myRadioGroup = new RadioGroup({
    id: 'radiogroup',
    colspan: '6',
    label: 'Radiogroup',
    fieldName: 'radioInput',
    blockProcessAttr: false,
    required: false,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme", "enabled":true}, 
        { "id": "2", "text": "Ministria e Drejtesise", "enabled":true},
        { "id": "3", "text": "Ministria e Brendshme", "enabled":false}
    ],
    valueField: 'id',
    labelField: 'text',
    classField: "buttonClass",
    defaultClass: 'btn btn-xs btn-default',
    selectedClass: 'btn btn-xs btn-success',
    enabledField: "enabled",
    value: [{ "id": "2", "text": "Ministria e Drejtesise", "enabled":true}],
    onclick : function(e){
        console.log("From RadioGroup ClickAction"); 
        //e.preventDefault();
    } 
});

$('#root').append(myRadioGroup.render());