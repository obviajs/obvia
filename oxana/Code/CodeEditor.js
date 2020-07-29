var _initDP = async function () {

    let processId = 1;
    CodeEditor.recordsPerPage = 5;
    let api_dv_process = new GaiaAPI_DV_process();
    let api_forms = new GaiaAPI_forms();

    let frmsProcess = new GaiaAPI_processes();
    let forms = await frmsProcess.getFormsClient.get(processId);
    let formsArray = new ArrayEx(forms);

    let raPrL = new RemoteArray({
        recordsPerPage: CodeEditor.recordsPerPage, // pagination
        fetchPromise: function (p) {
            let dvInp = new dvInput();
            dvInp.tableData = new tableData({
                currentRecord: p.startPage * p.recordsPerPage,
                recordsPerPage: p.recordsPerPage
            });
            return api_dv_process.dataview_pid_4Client.post(dvInp);
        }
    });

    let raForms = new RemoteArray({
        recordsPerPage: CodeEditor.recordsPerPage, // pagination
        fetchPromise: function (p) {
            let dvInp = new dvInput();
            dvInp.tableData = new tableData({
                currentRecord: p.startPage * p.recordsPerPage,
                recordsPerPage: p.recordsPerPage
            });
            return frmsProcess.getFormsClient.get(processId);
        }
    });

    CodeEditor.process = new ArrayEx(raPrL);
    CodeEditor.componentList = new ArrayEx();
    CodeEditor.processForms = new ArrayEx(raForms);
    CodeEditor.data = {};

    return Promise.all([CodeEditor.process.init(), CodeEditor.processForms.init()]).then(function (result) {
        return CodeEditor;
    });

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