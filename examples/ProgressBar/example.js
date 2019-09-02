var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var pbContainer = new ProgressBar({
    id:'progressbar',
    valueNow: 75,
    valueMin: 0,
    valueMax: 100,
    label: "75%",
    width: 600,
    classes: {
        "self": ["progress"],
        "progressBar": [BgStyle.BG_INFO, ProgressBarStyle.PROGRESS, ProgressBarStyle.PROGRESS_ANIMATED, ProgressBarStyle.PROGRESS_STRIPED]
    }
});

pbContainer.on('creationComplete', function(e){
    loader.hide();
    pbContainer.valueNow = 85;
    pbContainer.label = "85%";
});
$('#root').append(pbContainer.render());

