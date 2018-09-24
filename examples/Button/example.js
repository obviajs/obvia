
rjs.define('./lib/dependencies/color-picker/jscolor.js', 'jcolor');
var myButton = new Button({
    id: 'button',
    classColor: 'jscolor {valueElement:null,value:"e8eef7"}',
    type: "button",
    value: "",
    style: '',
    class: "btn btn-success",
    onclick : function(e){console.log("From ClickAction");}
});

$('#root').append(myButton.render());