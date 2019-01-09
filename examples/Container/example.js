var myContainer = new Container({
    id: 'subreport',
    label:"container"
});
myContainer.on('creationComplete', function(e){
    loader.hide();    
});
$('#root').append(myContainer.render());

