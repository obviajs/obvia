var loader = new Loader({
    id: 'loader'
});
$('#root').append(await loader.render().$el);
loader.show();

var mySGRenderer = new SuggestionRenderer({
    id: 'link_sg',
    label: 'Suggestion :)',
    value: 5
});
mySGRenderer.on('endDraw', function (e) {
    loader.hide();
    mySGRenderer.label = "Loaded";
    mySGRenderer.value = 6;
});
$('#root').append(await mySGRenderer.render().$el);