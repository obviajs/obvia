Builder.initComponentList();

var oxana = new App({
});

let mainApplet = new Applet({
    app: oxana,
    url: "./oxana/builder/applets/main/"
});

let selectedForm = new FormProperties();
let formField;

let containers = ["Container", "Form", "Header", "Footer"];
let noNeedFF = ["Button", "Label", "Container", "Link", "Header", "Footer", "Form", "SideNav", "ViewStack", "Calendar", "Tree", "Image", "HRule", "Heading", "Repeater", "RepeaterEx"];

/*
    this.init = function () {
        let promises = [];
        let len = _applets.length;
        for (let i = 0; i < len; i++) { 
            promises.push(_applets[i].init());
        }
        return Promise.all(promises);
    };
*/

mainApplet.init().then((p) => { 
    _initDP();

    console.log("Applet initialized");
    let paths = findMember(mainApplet.literal, "id", [], "listHistorySteps", false);
    paths[0].pop();
    let propsListHistorySteps = getChainValue(mainApplet.literal, paths[0]);
    propsListHistorySteps.dataProvider = oxana.history.steps;

    paths = findMember(mainApplet.literal, "id", [], "componentList", false);
    paths[0].pop();
    let propsComponentList = getChainValue(mainApplet.literal, paths[0]);
    propsComponentList.dataProvider = Builder.componentList;
    
    oxana.components.splicea(oxana.components.length, 0, [{
        ctor: ViewStack,
        props: {
            id:"viewStack",
            type: ContainerType.NONE,
            components: [mainApplet.literal]
        }
    }]);
    oxana.addImplementation(mainApplet.implementation);
    oxana.renderPromise().then(function (cmpInstance) {
        $(document.body).append(cmpInstance.$el);
    });
});

function _initDP() {
    Builder.masks;
    Builder.maskValueField = "";
    Builder.maskLabelField = "";

    Builder.componentValueField = "ctor";
    Builder.componentLabelField = "label";
    
    Builder.providerValueField = "dataview_id";
    Builder.providerLabelField = "description";
    
    let api_dv_dataviews = new GaiaAPI_DV_dataviews();
    let api_dv_forms = new GaiaAPI_DV_forms();
    Builder.recordsPerPage = 5;

    let raDvs = new RemoteArray(
        {
            recordsPerPage: Builder.recordsPerPage,
            fetchPromise: function (p) {
                let dvInp = new dvInput();
                dvInp.tableData = new tableData({
                    currentRecord: p.startPage * p.recordsPerPage,
                    recordsPerPage: p.recordsPerPage
                });
                return api_dv_dataviews.dataview_pid_2Client.post(dvInp);
            }
        }
    );
    
    let raFrms = new RemoteArray(
        {
            recordsPerPage: Builder.recordsPerPage,
            fetchPromise: function (p) {
                let dvInp = new dvInput();
                dvInp.tableData = new tableData({
                    currentRecord: p.startPage * p.recordsPerPage,
                    recordsPerPage: p.recordsPerPage
                });
                return api_dv_forms.dataview_pid_1Client.post(dvInp);
            }
        }
    );

    Builder.sources = new ArrayEx(raDvs);         
    Builder.forms = new ArrayEx(raFrms);
    Builder.data = {};

    Promise.all([Builder.forms.init(), Builder.sources.init()]).then(function (result) { 
        Builder.initComponentLiterals();
        Builder.initMetaProps();
    }); 
}