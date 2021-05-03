var myDate = new DateCmp({
    id: 'datetime',
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    displayFormat: 'YYYY/MM/DD',
    value: '27/12/2019'
});

myDate.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

/*
{
    "ctor": "FormField",
    "props": {
        "classes": ["col-3"],
        "label": "End Time",
        "component": {
            "ctor": "Time",
            "props": {
                "id": "endTime",
                "inputFormat": "HH:mm",
                "outputFormat": "HH:mm",
                "displayFormat": "hh:mm A",
                "value": "{moment().format(this.inputFormat)}"
            }
        }
    }
}
*/