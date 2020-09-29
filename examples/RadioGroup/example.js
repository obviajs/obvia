var myRadioGroup = new RadioGroup({
    id: 'radiogroup',
    dataProvider: [{
            "id": "1",
            "text": "Ministria e Puneve te Jashtme",
            "enabled": true,
            "buttonClass": []
        },
        {
            "id": "2",
            "text": "Ministria e Drejtesise",
            "enabled": true,
            "buttonClass": []
        },
        {
            "id": "3",
            "text": "Ministria e Brendshme",
            "enabled": false,
            "buttonClass": []
        }
    ],
    valueField: 'id',
    direction: "horizontal",
    labelField: 'text',
    classesField: "buttonClass",
    defaultClasses: ['btn btn-xs btn-default'],
    selectedClasses: ['btn btn-xs btn-success'],
    enabledField: "enabled",
    checkedField: "checked",
    value: [{
        "id": "2",
        "text": "Ministria e Drejtesise",
        "enabled": true
    }],
    itemClick: function (e) {
        console.log("From RadioGroup ClickAction");
        //e.preventDefault();
    },
    change: function (e) {
        console.log("From RadioGroup ChangeAction");
        //e.preventDefault();
    }
});

myRadioGroup.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});