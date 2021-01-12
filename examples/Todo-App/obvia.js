//the dataPromise function should return the dataObject when resolved
//data will be loaded only once :)
var _initDP = (function() {
    return Promise.resolve();
})();

//this function will decide where the view will go in the GUI on endDraw
//principles to follow
//a view should be added to one of its parent`s children
var uiRoute = function(applet) {
    //check applet.view.attached if you want to addChild only when its not already
    let _appendTo = "viewStack";
    let viewContainer = applet.parent.find(applet.port);
    return viewContainer.addChild(applet.view);
};

var application = new App({
    applets: [{
        url: "/obvia/examples/Todo-App/applets/main/",
        anchor: "main",
        dataPromise: _initDP,
        port: "viewStack",
        uiRoute: uiRoute,
        //forceReload: true
    }, ],
    components: [{
        ctor: ViewStack,
        props: {
            id: "viewStack",
            type: ContainerType.NONE,
            components: [],
        },
    }, ],
});

//data should be loaded before calling renderPromise so that the current applet (the one in the url) implementation can access it
application.render().then(function(cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});