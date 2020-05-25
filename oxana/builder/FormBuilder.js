//the dataPromise function should return the dataObject when resolved
//data will be loaded only once :)
var _initDP = function () {
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

    return Promise.all([Builder.forms.init(), Builder.sources.init()]).then(function (result) {
        Builder.initComponentList();
        Builder.initComponentLiterals();
        Builder.initMetaProps();
        return Builder;
    });
}();

//this function will decide where the view will go in the GUI on endDraw
//principles to follow
//a view should be added to one of its parent`s children
var uiRoute = function (applet) {
    //check applet.view.attached if you want to addChild only when its not already
    let _appendTo = "viewStack";
    let viewContainer = applet.parent.find(applet.port);
    return viewContainer.addChild(applet.view);
};

var oxana = new App({
    applets: [
        {
            url: "./flowerui/oxana/builder/applets/main/",
            anchor: "main",
            dataPromise: _initDP,
            port: "viewStack",
            "uiRoute": uiRoute
            //forceReload: true
        }
    ],
    components: [{
        ctor: ViewStack,
        props: {
            id: "viewStack",
            type: ContainerType.NONE,
            components: []
        }
    }]
});

let selectedForm = new FormProperties();
let formField;

let containers = ["Container", "Form", "Header", "Footer"];
let noNeedFF = ["Button", "Label", "Container", "Link", "Header", "Footer", "Form", "SideNav", "ViewStack", "Calendar", "Tree", "Image", "HRule", "Heading", "Repeater", "RepeaterEx"];

//data should be loaded before calling renderPromise so that the current applet (the one in the url) implementation can access it
oxana.renderPromise().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});