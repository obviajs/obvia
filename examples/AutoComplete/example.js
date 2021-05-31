var loader = new Loader({
    id: 'loader'
});
$('#root').append(await loader.render().$el);
loader.show();

var myAutoComplete = new AutoCompleteEx({
    id: 'autocomplete',
    valueField: "value",
    labelField: "Ministries",
    maxSuggestionsCount: 1,
    allowNewItem: false, //allow the user to add items that are not included in the specified dataProvider
    dataProvider: new ArrayEx([{
        "value": "1",
        "ministri": "Ministry of Foreign Affairs"
    }, {
        "value": "2",
        "ministri": "Ministry of Defense"
    }, {
        "value": "3",
        "ministri": "Ministry of Healthcare"
    }]),
    value: new ArrayEx([{
        "value": "1",
        "ministri": "Ministry of Foreign Affairs"
    }]),
    remote: {
        getData_Action: "http://139.162.158.49/rca/index.php",
        recordsPerPage: 5
    },
    multiSelect: false,
    matchType: StringMatchType.STARTS_WITH
});
myAutoComplete.on('endDraw', function() {
    loader.hide();
    myAutoComplete.on('noSuggestionsFound', function(e, toMatch) {
        console.log("Nothing found for:" + toMatch);
    });
});
myAutoComplete.render().then(function(cmpInstance) {
    $('#root').append(cmpInstance.$el);
});