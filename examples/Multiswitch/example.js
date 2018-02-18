var ms = new MultiSwitch({
    id: 'multiswitchLonely1',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'multiswitchInputR',
    blockProcessAttr: false,
    required: true,
    multiselect: false,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": 'btn btn-xs btn-default ms1'},
        { "id": "2", "text": "Ministria e Drejtesise 1", "buttonClass": 'btn btn-xs btn-default ms1'},
        { "id": "3", "text": "Ministria e Brendshme 1", "buttonClass": 'btn btn-xs btn-success ms1'},
        { "id": "4", "text": "Ministria e Mbrojtjes 1", "buttonClass": 'btn btn-xs btn-default ms1'}
    ],
    valueField: "id",
    labelField: "text",
    defaultClass: 'btn btn-xs btn-default ms1',
    selectedClass: 'btn btn-xs btn-success ms1',
    value: [{ "id": "3", "text": "Ministria e Brendshme", "buttonClass": 'btn btn-xs btn-success ms1'}],
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
        { "id": "1", "text": "Ministria e Puneve te Jashtme 2", "buttonClass": 'btn btn-xs btn-default ms2'},
        { "id": "2", "text": "Ministria e Drejtesise 2", "buttonClass": 'btn btn-xs btn-default ms2'},
        { "id": "3", "text": "Ministria e Brendshme 2", "buttonClass": 'btn btn-xs btn-success ms2'},
        { "id": "4", "text": "Ministria e Mbrojtjes 2", "buttonClass": 'btn btn-xs btn-default ms2'}
    ],
    valueField: "id",
    labelField: "text",
    defaultClass: 'btn btn-xs btn-default ms2',
    selectedClass: 'btn btn-xs btn-success ms2',
    value: [{ "id": "3", "text": "Ministria e Brendshme", "buttonClass": 'btn btn-xs btn-success ms2'}],
    onclick : function(e){
        console.log("From MultiSwitch ClickAction"); 
        //e.preventDefault();
    }
});                    
$('#root').append(ms.render());
$('#root').append(ms2.render());