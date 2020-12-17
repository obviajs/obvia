var loader = new Loader({
    id: 'loader'
});
$('#root').append(await loader.render().$el);
loader.show();

var myAutoComplete = new AutoCompleteEx({
    id: 'autocomplete',
    valueField: "value",
    labelField: "ministri",
    maxSuggestionsCount: 1,
    allowNewItem: false, //allow the user to add items that are not included in the specified dataProvider
    dataProvider: new ArrayEx([{
        "value": "1",
        "ministri": "Ministria e Puneve te Jashtme"
    }, {
        "value": "2",
        "ministri": "Ministria e Drejtesise"
    }, {
        "value": "3",
        "ministri": "Ministria e Brendshme"
    }]),
    value: new ArrayEx([{
        "value": "1",
        "ministri": "Ministria e Puneve te Jashtme"
    }]),
    remote: {
        getData_Action: "http://139.162.158.49/rca/index.php",
        recordsPerPage: 5
    },
    multiSelect: false,
    matchType: StringMatchType.STARTS_WITH
});
myAutoComplete.on('creationComplete', function () {
    loader.hide();
    myAutoComplete.on('noSuggestionsFound', function (e, toMatch) {
        console.log("Nothing found for:" + toMatch);
    });
});
myAutoComplete.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

/*
closeIconSide:"left",
itemRenderer:{
                ctor: CheckBox,
                props: {
                    id: 'checkbox',
                    colspan: '6',
                    label: 'Vertete',
                    fieldName: 'checkbox',
                    blockProcessAttr: false,
                    required: true,
                    value: '{id}',
                    checked: '{checkboxValue}',
                    unCheckedLabel:"Jo",
                    checkedLabel:"Po"
                }
            },
           

*/