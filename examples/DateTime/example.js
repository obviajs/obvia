var myDate = new DateTime({
    id: 'datetime',
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    displayFormat: 'MM/DD/YYYY',
    value: '2022/02/04'
});

$('#root').append(myDate.render());