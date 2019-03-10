var list = new List({
    id: 'list',
    direction: 'horizontal',
    multiselect: true,
    dataProvider: [
        { "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": ['btn btn-sm btn-default']},
        { "id": "2", "text": "Ministria e Drejtesise 1", "buttonClass": ['btn btn-sm btn-default']},
        { "id": "3", "text": "Ministria e Brendshme 1", "buttonClass": ['btn btn-sm btn-default']},
        { "id": "4", "text": "Ministria e Mbrojtjes 1", "buttonClass": ['btn btn-sm btn-default']}
    ],
    valueField: "id",
    classesField: "buttonClass",
    defaultClasses: ["btn btn-sm btn-default"],
    selectedClasses: ["btn btn-sm btn-success"],    
    value:[{ "id": "1", "text": "Ministria e Puneve te Jashtme 1", "buttonClass": ['btn btn-xs btn-default']}],      
    component: {
        constructor: Button,
        props: {
            id: 'button',
            type: "button",
            value: "{id}",
            label: "{text}",
            classes: "{buttonClass}",
            style: "float: left; border-radius: 0px",
            click: clickTest
        }
    },
    change: changeTest
});
$('#root').append(list.render());

function clickTest()
{
    console.log("clickTest ",arguments);
}
function changeTest()
{
    console.log("changeTest ",arguments);
}