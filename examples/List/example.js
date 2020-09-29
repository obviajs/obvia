var list = new List({
    id: 'list',
    multiselect: true,
    dataProvider: new ArrayEx([{
            "id": "1",
            "text": "Option 1",
            "buttonClass": ["btn-default"]
        },
        {
            "id": "2",
            "text": "Option 2",
            "buttonClass": ["btn-default"]
        },
        {
            "id": "3",
            "text": "Option 3",
            "buttonClass": ["btn-default"]
        },
        {
            "id": "4",
            "text": "Option 4",
            "buttonClass": ["btn-default"]
        }
    ]),
    valueField: "id",
    classesField: "buttonClass",
    defaultClasses: ["btn-default"],
    selectedClasses: ["btn-success"],
    value: [{
        "id": "1"
    }],
    components: [{
        ctor: Button,
        props: {
            id: 'button',
            type: "button",
            value: "{id}",
            label: "{text}",
            classes: "{buttonClass}",
            click: clickTest
        }
    }],
    change: changeTest
});
list.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

function clickTest() {
    console.log("clickTest ", arguments);
}

function changeTest() {
    console.log("changeTest ", arguments);
}