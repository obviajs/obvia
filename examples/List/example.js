var list = new List({
    id: 'list',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'list',
    blockProcessAttr: this.blockProcessAttr,
    required: true,
    direction: 'horizontal',
    multiselect: this.multiselect,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": 'btn btn-sm btn-default'},
        { "id": "2", "text": "Ministria e Drejtesise 1", "buttonClass": 'btn btn-sm btn-default'},
        { "id": "3", "text": "Ministria e Brendshme 1", "buttonClass": 'btn btn-sm btn-default'},
        { "id": "4", "text": "Ministria e Mbrojtjes 1", "buttonClass": 'btn btn-sm btn-default'}
    ],
    valueField: "id",
    classField: "buttonClass",
    defaultClass: "btn btn-sm btn-default",
    selectedClass: "btn btn-sm btn-success",    
    value:[{ "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": 'btn btn-xs btn-default'}],      
    components: [
        {
            constructor: Button,
            props: {
                id: 'button',
                type: "button",
                value: "{text}",
                class: "{buttonClass}",
                style: "float: left; border-radius: 0px"
            }
        }
    ],
    onmousedown : onmousedownTest,
    onclick : clickTest,
    onchange : changeTest
});

var list2 = new List({
    id: 'list',
    colspan: '6',
    label: 'Ministrite',
    fieldName: 'list',
    blockProcessAttr: this.blockProcessAttr,
    required: true,
    direction: 'horizontal',
    multiselect: this.multiselect,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": 'btn btn-sm btn-default'},
        { "id": "2", "text": "Ministria e Drejtesise 1", "buttonClass": 'btn btn-sm btn-default'},
        { "id": "3", "text": "Ministria e Brendshme 1", "buttonClass": 'btn btn-sm btn-default'},
        { "id": "4", "text": "Ministria e Mbrojtjes 1", "buttonClass": 'btn btn-sm btn-default'}
    ],
    valueField: "id",
    classField: "buttonClass",
    defaultClass: "btn btn-sm btn-default",
    selectedClass: "btn btn-sm btn-success",    
    value:[{ "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": 'btn btn-xs btn-default'}],      
    components: [
        {
            constructor: Button,
            props: {
                id: 'button',
                type: "button",
                value: "{text}",
                class: "{buttonClass}",
                style: "float: left; border-radius: 0px"
            }
        }
    ],
    onclick : clickTest2,
    onchange : changeTest2
});
$('#root').append(list.render());
$('#root').append(list2.render());

function onmousedownTest()
{
    console.log("mouseDownTest ",arguments);
}
function clickTest()
{
    console.log("clickTest ",arguments);
}
function changeTest()
{
    console.log("changeTest ",arguments);
}
function clickTest2()
{
    console.log("clickTest 2 ",arguments);
}
function changeTest2()
{
    console.log("changeTest 2 ",arguments);
}