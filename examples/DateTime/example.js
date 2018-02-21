var myDate = new DateTime({
    id: 'datetime',
    colspan: '6',
    label: 'Date',
    versionStyle: '',
    blockProcessAttr: false,
    required: true,
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    displayFormat: 'MM/DD/YYYY',
    value: '2022/02/04'
});

$('#root').append(myDate.render());