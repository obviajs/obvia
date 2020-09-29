var myTrippleswitch = new TrippleSwitch({
    id: 'trippleswitch',
    colspan: '6',
    label: 'This is a survey. Are you happy?',
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

myTrippleswitch.render().then(function (cmpInstance)
{
  $('#root').append(cmpInstance.$el);
});