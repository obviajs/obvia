var loader = new Loader({
    id: 'loader'
});
$('#root').append(await loader.render().$el);
loader.show();

var pbContainer = new ProgressBar({
    id: 'progressbar',
    valueNow: 75,
    valueMin: 0,
    valueMax: 100,
    label: "10%",
    width: 800,
    classes: {
        "self": ["progress"],
        "progressBar": [BgStyle.BG_INFO, ProgressBarStyle.PROGRESS, ProgressBarStyle.PROGRESS_ANIMATED, ProgressBarStyle.PROGRESS_STRIPED]
    }
});

pbContainer.on('creationComplete', function (e) {
    loader.hide();
    pbContainer.valueNow = 75;
    pbContainer.label = "65%";
});
pbContainer.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});