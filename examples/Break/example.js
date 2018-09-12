var myBreak = new Break({
    id: 'break',
    align: "center",
    size: 5,
    width: 1000 ,
    onload: myBreakLoaded

});

myBreak.on('creationComplete', function(e){
    loader.hide();
    
});
myBreak.on('load', myBreakLoaded);
$('#root').append(myBreak.render());
console.log("break loaded")

function myBreakLoaded(e){
    console.log("Break Loaded");
}