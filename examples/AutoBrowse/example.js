import { AutoBrowse } from "../../components/AutoBrowse.js";
import { ArrayEx } from "../../lib/ArrayEx.js";


var myAutoBrowser = new AutoBrowse({

    id: 'AutoBrowse',
    labelField: "customer_name",
    valueField: "NID",
    value: [],
    attr: {
        "data-triggers": "browse"
    },
    fields: [{
        "field": "customer_name",
        "description": "Customer Name"
    },
    {
        "field": "NID",
        "description": "Customer ID"
    }
    ],

    dataProvider: new ArrayEx([{
        customer_name: "Any signal...",
        NID: 1,
    },
    {
        customer_name: "Any signal... (2)",
        NID: 2
    },
    {

        customer_name: "Any signal... (3)",
        NID: 3
    }
    ])

});


myAutoBrowser.render().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});

export { myAutoBrowser }