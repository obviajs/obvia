import { AutoCompleteEx } from "../../components/AutoComplete/AutoCompleteEx.js";
import { ArrayEx } from "../../lib/ArrayEx.js";
import { StringMatchType } from "../../lib/StringUtils.js";

var myAutoComplete = new AutoCompleteEx({
    id: "autocomplete",
    valueField: "value",
    labelField: "ministri",
    maxSuggestionsCount: 1,
    allowNewItem: false, //allow the user to add items that are not included in the specified dataProvider
    dataProvider: new ArrayEx([
        {
            value: "1",
            ministri: "Ministria e Puneve te Jashtme",
        },
        {
            value: "2",
            ministri: "Ministria e Drejtesise",
        },
        {
            value: "3",
            ministri: "Ministria e Brendshme",
        },
    ]),
    value: new ArrayEx([
        {
            value: "1",
            ministri: "Ministria e Puneve te Jashtme",
        },
    ]),
    remote: {
        getData_Action: "http://139.162.158.49/rca/index.php",
        recordsPerPage: 5,
    },
    multiSelect: false,
    matchType: StringMatchType.STARTS_WITH,
});
myAutoComplete.on("endDraw", function () {
    myAutoComplete.on("noSuggestionsFound", function (e, toMatch) {
        console.log("Nothing found for:" + toMatch);
    });
});
myAutoComplete.render().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});


export { myAutoComplete };
