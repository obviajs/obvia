var myDataBrowse = new DataBrowse({
    
    dataProvider: new ArrayEx([

        {
            name: "Hello"
        }

    ]),
});


myDataBrowse.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});