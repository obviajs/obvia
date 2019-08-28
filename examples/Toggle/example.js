var myToggle = new Toggle({
    id: 'checkbox',
    value: 1,
    checked: true,
    change: changeTest,
    classes:{
        "checkBox":[ToggleBgStyle.BG_INFO],
        "span":["slider", "round"]
    }
});
function changeTest(){
    console.log("Toggle ChangeTest");
}
$('#root').append(myToggle.render());
