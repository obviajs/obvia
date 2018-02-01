var myTrippleswitch = new Trippleswitch({
    id: 'trippleswitch',
    colspan: '6',
    label: 'This is a survey. Are you happy?',
    fieldName: 'tripple',
    versionStyle: "",
    blockProcessAttr: false,
    required: false,
    dataProvider: {
        left: "Yes", //1
        middle: "Somewhat",//-1
        right: "No" //0
    },
    value: "1" //1,-1,0
});

$('#root').append(myTrippleswitch.render());