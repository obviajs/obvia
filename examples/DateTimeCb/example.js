var myDayMonthYear = new DateTimeCb({
    id: 'dayMonthYear',
    mode: DateTimeMode.DATE,
    inputFormat: 'DD/MM/YYYY',
    outputFormat: 'DD-MM-YYYY',
    value: '06/06/2006'
});

$('#root').append(await myDayMonthYear.render().$el);