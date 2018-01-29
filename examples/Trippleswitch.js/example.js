var myTrippleswitch = new GoogleMap({
    id: 'trippleswitch',
    colspan: '12',
    label: 'This is a survey. Are you happy?',
    fieldName: 'tripple',
    versionStyle: "",
    blockProcessAttr: false,
    required: false,
    dataProvider: []
    //value: ,
});

$('#root').append(myTrippleswitch.render());