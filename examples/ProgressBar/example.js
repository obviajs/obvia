var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

var pbContainer = new Container({
    id: 'pbContainer',
    type:  ContainerType.NONE,
    classes: ["progress"],
    components:[
        {
            constructor: ProgressBar,
            props: {
                id:'progressbar',
                valueNow: 75,
                valueMin: 0,
                valueMax: 100,
                label: "75%",
                width: 600,
                classes: [BgStyle.BG_INFO, ProgressBarStyle.PROGRESS, ProgressBarStyle.PROGRESS_ANIMATED, ProgressBarStyle.PROGRESS_STRIPED]
            }
        }
    ]
});

pbContainer.on('creationComplete', function(e){
    loader.hide();
    myProgressBar = pbContainer.children["progressbar"];
    myProgressBar.valueNow = 85;
    myProgressBar.label = "85%";
});
$('#root').append(pbContainer.render());

