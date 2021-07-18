var myCurrencyExRate = new CurrencyExRate({

    id: 'CurrencyExRate',
    labelField: "title",
    valueField: "key",
    value: {
        exRate: "124.4",
        currency: "1",
        label: "Click me"
    },
    currencyList: new ArrayEx([

        {
            key: "f1",
            title: "Folder 1"
        },
        {
            key: "f2",
            title: "Folder 2"
        },
        {
            key: "f3",
            title: "Folder 3"
        },
        {
            key: "f4",
            title: "Folder 4"
        },
        {
            key: "f5",
            title: "Folder 5"
        },
        {
            key: "f6",
            title: "Folder 6"
        },

    ]),
});


myCurrencyExRate.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});