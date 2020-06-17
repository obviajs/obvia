var _initDP = function () {

    return Promise.resolve();

}();

var uiRoute = function (applet) {
    let viewContainer = applet.parent.find(applet.port);
    return viewContainer.addChild(applet.view);
};

var codeEditor = new App({
    applets: [{
        url: "./flowerui/oxana/Code/applets/main/",
        anchor: "main",
        dataPromise: _initDP,
        port: "container",
        uiRoute
        //forceReload: true
    }],
    components: [{
        ctor: Container,
        props: {
            id: "container",
            type: ContainerType.NONE,
            components: []
        }
    }]
});

codeEditor.renderPromise().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});