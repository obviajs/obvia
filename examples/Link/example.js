var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var mySGRenderer = new SuggestionRenderer({
    id: 'link_sg',
    label: 'Suggestion :)',
    value: 5
});
mySGRenderer.on('creationComplete', function(e){
    loader.hide();
    mySGRenderer.label = "Loaded";
    mySGRenderer.value = 6;
});
$('#root').append(mySGRenderer.render());