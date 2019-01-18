var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var myLabel = new Label({
    id: 'label',
    label: 'Label'
});
myLabel.on('creationComplete', function(e){
    loader.hide();
});
$('#root').append(myLabel.render());