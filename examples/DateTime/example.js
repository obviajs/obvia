var myDate = new DateTime({
    id: 'datetime',
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    displayFormat: 'MM/DD/YYYY',
    value: '27/12/2019'
});

myDate.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});