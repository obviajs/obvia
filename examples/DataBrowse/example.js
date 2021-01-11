var myDataBrowser = new DataBrowse({

    id: 'DataBrowse',
    bindingDefaultContext: window,
    labelField: "customer_name",
    valueField: "customer_name",
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

    dataProvider: "{?AutoB}",
});
window.AutoB = new ArrayEx([{
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
]);

myDataBrowser.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});