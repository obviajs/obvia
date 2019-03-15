var myToggle = new Toggle({
    id: 'checkbox',
    value: true,
    offLabel: "Jo",
    onLabel: "Po",
    change: changeTest
});
function changeTest(){
    console.log("Toggle ChangeTest");
}
$('#root').append(myToggle.render());
