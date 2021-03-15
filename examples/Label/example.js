var loader = new Loader({
    id: 'loader'
});
$('#root').append(await loader.render().$el);
loader.show();

var myLabel = new Label({
    id: 'label',
    label: 'Label'
});
myLabel.on('endDraw', function (e) {
    loader.hide();
});
$('#root').append(await myLabel.render().$el);