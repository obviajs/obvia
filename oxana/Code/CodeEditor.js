var _initDP = async function () {

    CodeEditor.processId = 7;
    CodeEditor.recordsPerPage = 5;

    let frmsProcess = new GaiaAPI_processes();

    let raForms = new RemoteArray({
        recordsPerPage: CodeEditor.recordsPerPage, // pagination
        fetchPromise: function (p) {
            return frmsProcess.getFormsClient.get(CodeEditor.processId);
        }
    });

    CodeEditor.componentList = new ArrayEx();
    CodeEditor.eventsList = new ArrayEx();
    CodeEditor.processForms = new ArrayEx(raForms);
    CodeEditor.data = {};

    return Promise.all([CodeEditor.processForms.init()]).then(function (result) {
        return CodeEditor;
    });

}();

var uiRoute = function (applet) {
    let viewContainer = applet.parent.find(applet.port);
    return viewContainer.addChild(applet.view);
};

var modalRoute = function (applet) {
    if (applet.view.attached) {
        applet.view.show();
    } else {
        applet.view.render().then(function (cmpInstance) {
            applet.view.show();
        });
    }
};


var codeEditor = new App({
    applets: [{
            url: "./flowerui/oxana/Code/applets/main/",
            anchor: "main",
            dataPromise: _initDP,
            port: "container",
            uiRoute
            //forceReload: true
        },
        {

            url: "./flowerui/oxana/Code/applets/versions/",
            anchor: "versions",
            dataPromise: _initDP,
            port: "container",
            "uiRoute": modalRoute
            //forceReload: true}
        }
    ],
    components: [{
        ctor: Container,
        props: {
            id: "container",
            type: ContainerType.NONE,
            components: []
        }
    }]
});

codeEditor.render().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});