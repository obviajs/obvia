var myCheckboxGroup = new CheckBoxGroup({
    id: 'checkBoxGroupLonely1',
    dataProvider: [{
            "id": "1",
            "text": "Ministria e Puneve te Jashtme 1",
            "buttonClass": ['btn', 'btn-xs', 'btn-default'],
            "enabled": true,
            "checked": false
        },
        {
            "id": "2",
            "text": "Ministria e Drejtesise 1",
            "buttonClass": ['btn', 'btn-xs', 'btn-default'],
            "enabled": true,
            "checked": false
        },
        {
            "id": "3",
            "text": "Ministria e Brendshme 1",
            "buttonClass": ['btn', 'btn-xs', 'btn-success'],
            "enabled": true,
            "checked": true
        },
        {
            "id": "4",
            "text": "Ministria e Mbrojtjes 1",
            "buttonClass": ['btn', 'btn-xs', 'btn-default'],
            "enabled": true,
            "checked": false
        }
    ],
    valueField: "id",
    labelField: "text",
    classesField: "buttonClass",
    defaultClasses: ['btn', 'btn-xs', 'btn-default'],
    selectedClasses: ['btn', 'btn-xs', 'btn-success'],
    enabledField: "enabled",
    checkedField: "checked",
    value: [{
        "id": "3",
        "text": "Ministria e Brendshme",
        "buttonClass": ['btn', 'btn-xs', 'btn-success'],
        "enabled": true
    }],
    itemClick: function (e) {
        console.log("From CheckBoxGroup ClickAction");
        //e.preventDefault();
    },
    change: function (e) {
        console.log("From CheckBoxGroup ChangeAction");
        //e.preventDefault();
    }
});
myCheckboxGroup.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});