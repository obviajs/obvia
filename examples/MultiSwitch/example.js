var ms = new MultiSwitch({
    id: 'multiswitchLonely1',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'multiswitchInputR',
    blockProcessAttr: false,
    required: true,
    multiselect: false,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": 'btn btn-xs btn-default'},
        { "id": "2", "text": "Ministria e Drejtesise 1", "buttonClass": 'btn btn-xs btn-default'},
        { "id": "3", "text": "Ministria e Brendshme 1", "buttonClass": 'btn btn-xs btn-success'},
        { "id": "4", "text": "Ministria e Mbrojtjes 1", "buttonClass": 'btn btn-xs btn-default'}
    ],
    valueField: "id",
    labelField: "text",
    classField: "buttonClass",
    defaultClass: 'btn btn-xs btn-default',
    selectedClass: 'btn btn-xs btn-success',
    value: [{ "id": "3", "text": "Ministria e Brendshme", "buttonClass": 'btn btn-xs btn-success'}],
    onclick : function(e){
        console.log("From MultiSwitch ClickAction"); 
        //e.preventDefault();
    }
});

var ms2 = new MultiSwitch({
    id: 'multiswitchLonely2',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'multiswitchInputR2',
    blockProcessAttr: false,
    required: true,
    multiselect: false,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme 2", "buttonClass": 'btn btn-xs btn-default'},
        { "id": "2", "text": "Ministria e Drejtesise 2", "buttonClass": 'btn btn-xs btn-default'},
        { "id": "3", "text": "Ministria e Brendshme 2", "buttonClass": 'btn btn-xs btn-success'},
        { "id": "4", "text": "Ministria e Mbrojtjes 2", "buttonClass": 'btn btn-xs btn-default'}
    ],
    valueField: "id",
    labelField: "text",
    classField: "buttonClass",
    defaultClass: 'btn btn-xs btn-default',
    selectedClass: 'btn btn-xs btn-success',
    value: [{ "id": "3", "text": "Ministria e Brendshme", "buttonClass": 'btn btn-xs btn-success'}],
    onclick : function(e){
        console.log("From MultiSwitch ClickAction"); 
        //e.preventDefault();
    }
});                    
$('#root').append(ms.render());
$('#root').append(ms2.render());