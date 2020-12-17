var myDate = new DateTime({
    id: 'datetime',
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    displayFormat: 'YYYY/MM/DD',
    value: '27/12/2019'
});

myDate.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});