var myRadio = new RadioButton({
    id: 'radio',
    value: "male",
    label: "Male",
    onclick : function(e){console.log("Radio Clicked");}
});

$('#root').append(myRadio.render());