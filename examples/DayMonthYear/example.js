var myDayMonthYear = new DayMonthYear({
    id: 'dayMonthYear',
    colspan: '6',
    label: 'Date Mode 2',
    versionStyle: '',
    blockProcessAttr: false,
    required: false,
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    value: '06/06/2006'
});

$('#root').append(myDayMonthYear.render());