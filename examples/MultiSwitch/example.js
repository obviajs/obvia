var ms = new MultiSwitch({
    id: 'multiswitchLonely1',
    multiselect: false,
    dataProvider: [{
            "id": "1",
            "text": "Ministria e Puneve te Jashtme 1",
            "buttonClasses": ['btn', 'btn-sm', 'btn-default']
        },
        {
            "id": "2",
            "text": "Ministria e Drejtesise 1",
            "buttonClasses": ['btn', 'btn-sm', 'btn-default']
        },
        {
            "id": "3",
            "text": "Ministria e Brendshme 1",
            "buttonClasses": ['btn', 'btn-sm', 'btn-success']
        },
        {
            "id": "4",
            "text": "Ministria e Mbrojtjes 1",
            "buttonClasses": ['btn', 'btn-sm', 'btn-default']
        }
    ],
    valueField: "id",
    labelField: "text",
    classesField: "buttonClasses",
    defaultClasses: ['btn', 'btn-sm', 'btn-default'],
    selectedClasses: ['btn', 'btn-sm', 'btn-success'],
    value: [{
        "id": "3",
        "text": "Ministria e Brendshme",
        "buttonClasses": ['btn', 'btn-sm', 'btn-success']
    }],
    onclick: function (e) {
        console.log("From MultiSwitch ClickAction");
        //e.preventDefault();
    }
});

var ms2 = new MultiSwitch({
    id: 'multiswitchLonely2',
    multiselect: true,
    dataProvider: [{
            "id": "1",
            "text": "Ministria e Puneve te Jashtme 2",
            "buttonClasses": ['btn', 'btn-sm', 'btn-default']
        },
        {
            "id": "2",
            "text": "Ministria e Drejtesise 2",
            "buttonClasses": ['btn', 'btn-sm', 'btn-default']
        },
        {
            "id": "3",
            "text": "Ministria e Brendshme 2",
            "buttonClasses": ['btn', 'btn-sm', 'btn-success']
        },
        {
            "id": "4",
            "text": "Ministria e Mbrojtjes 2",
            "buttonClasses": ['btn', 'btn-sm', 'btn-default']
        }
    ],
    valueField: "id",
    labelField: "text",
    classesField: "buttonClasses",
    defaultClasses: ['btn', 'btn-sm', 'btn-default'],
    selectedClasses: ['btn', 'btn-sm', 'btn-success'],
    value: [{
        "id": "3",
        "text": "Ministria e Brendshme",
        "buttonClasses": ['btn', 'btn-sm', 'btn-success']
    }],
    onclick: function (e) {
        console.log("From MultiSwitch ClickAction");
        //e.preventDefault();
    }
});
ms.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});
ms2.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});