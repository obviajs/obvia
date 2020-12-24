//the dataPromise function should return the dataObject when resolved
//data will be loaded only once :)
var _initDP = (function () {
  Builder.masks;
  Builder.maskValueField = "";
  Builder.maskLabelField = "";

  Builder.componentValueField = "ctor";
  Builder.componentLabelField = "label";

  Builder.providerValueField = "dataview_id";
  Builder.providerLabelField = "description";
  Builder.selectedReport = new ReportProperties();

  let api_dv_dataviews = new GaiaAPI_DV_dataviews();
  let api_dv_forms = new GaiaAPI_dataview_pid_1();
  let api_frmsDv_dataviews = new GaiaAPI_FrmsDv_dataview(); //frm dv

  Builder.recordsPerPage = 5;
  Builder.recordsPerPage = 5;

  let raDvs = new RemoteArray({
    recordsPerPage: Builder.recordsPerPage, // pagination
    fetchPromise: function (p) {
      let dvInp = new dvInput();
      dvInp.tableData = new tableData({
        currentRecord: p.startPage * p.recordsPerPage,
        recordsPerPage: p.recordsPerPage,
      });
      return api_dv_dataviews.dataview_pid_2Client.post(dvInp);
    },
  });

  let raFrms = new RemoteArray({
    recordsPerPage: 5, // pagination
    fetchPromise: function (p) {
      let dvInp = new dvInput();
      dvInp.tableData = new tableData({
        currentRecord: p.startPage * p.recordsPerPage,
        recordsPerPage: p.recordsPerPage,
      });
      if (p.filterData) {
        dvInp.advancedSqlFilters = p.filterData;
      }
      return api_dv_forms.dataview_pid_1Client.post(dvInp);
    },
  });

  let raFrmsDataview = new RemoteArray({
    recordsPerPage: 5, // pagination
    fetchPromise: function (p) {
      let dvInp = new dvInput();
      dvInp.tableData = new tableData({
        currentRecord: p.startPage * p.recordsPerPage,
        recordsPerPage: p.recordsPerPage,
      });

      return api_frmsDv_dataviews.dataview_pid_7Client.post(dvInp);
    },
  });

  Builder.sources = new ArrayEx(raDvs);
  Builder.forms = new ArrayEx(raFrms);
  Builder.dataviews = new ArrayEx(raFrmsDataview);
  Builder.data = {};
  

  return Promise.all([Builder.forms.init(), Builder.sources.init()]).then(
    function (result) {
      Builder.initComponentList();
      Builder.initComponentLiterals();
      Builder.initMetaProps();
      console.log("THE BUILDER", Builder);
      return Builder;
    }
  );
})();

var _initDpForms = function () {
  let api_dv_forms = new GaiaAPI_dataview_pid_1();

  let raFrms = new RemoteArray({
    recordsPerPage: 5, // pagination
    fetchPromise: function (p) {
      let dvInp = new dvInput();
      dvInp.tableData = new tableData({
        currentRecord: p.startPage * p.recordsPerPage,
        recordsPerPage: p.recordsPerPage,
      });
      if (p.filterData) {
        dvInp.advancedSqlFilters = p.filterData;
      }
      return api_dv_forms.dataview_pid_1Client.post(dvInp);
    },
  });
  Builder.formList = new ArrayEx(raFrms);

  return Promise.all([Builder.formList.init()]).then(function (result) {
    return Builder;
  });
};

var _initDbModal = async () => {
  let api_rs = GaiaAPI_report_source.getInstance();
  
  //save to cache so you don't make the call to the api more than once for the selected time
  let cache = new Cache({ttl: 3600000});
  if (!cache.get("datasourceList")) {
    let res = await api_rs.report_sourceClient.get()
    if (!res.status_description) {
      cache.set("datasourceList", res);
      cache.persist();
    } else {
      console.error(res.status_description, 'Error inside _initDbModal')
    }
  }

  return Promise.resolve(Builder)
};

var _initUploadReportModal = async () => {
  let api_dv_pID_10 = new GaiaAPI_dataview_pid_10()

  let raRepList = new RemoteArray({
    recordsPerPage: 12, // pagination
    fetchPromise: p => {
      let dvInp = new dvInput();
      dvInp.tableData = new tableData({
        currentRecord: p.startPage * p.recordsPerPage,
        recordsPerPage: p.recordsPerPage
      });
      if (p.filterData) dvInp.advancedSqlFilters = p.filterData;
      return api_dv_pID_10.dataview_pid_10Client.post(dvInp);
    }
  });
  Builder.reportsList = new ArrayEx(raRepList);
    
  return Promise.all([Builder.reportsList.init()]).then(result => Builder);
};


var _initSaveReportModal = () => {
  if (!Builder.showNewReportLabel) {
    Builder.showNewReportLabel = false
    Builder.showNewReportTextInput = true
    Builder.selectedReportName = ""
  }
  Builder.reportErrorLabel = ""
  return Promise.resolve(Builder);
}

var _initCreateNewReportModal = () => Promise.resolve(Builder)

var _initUploadVersionModal = () => Promise.resolve(Builder)

//this function will decide where the view will go in the GUI on endDraw
//principles to follow
//a view should be added to one of its parent`s children
var uiRoute = function (applet) {
  //check applet.view.attached if you want to addChild only when its not already
  let _appendTo = "viewStack";
  let viewContainer = applet.parent.find(applet.port);
  return viewContainer.addChild(applet.view);
};

var modalRoute = applet => {
  if (applet.view.attached) applet.view.show();
  else applet.view.render().then(cmpInstance => applet.view.show() );
};

var oxana = new App({
  applets: [
    {
      url: "./flowerui/oxana/report_builder/applets/main/",
      anchor: "main",
      dataPromise: _initDP,
      port: "viewStack",
      uiRoute: uiRoute,
      //forceReload: true
    },
    {
      url: "./flowerui/oxana/report_builder/applets/formsModal/",
      anchor: "formsModal",
      dataPromise: _initDpForms,
      port: "viewStack",
      uiRoute: modalRoute,
      //forceReload: true
    },
    {
      url: "./flowerui/oxana/report_builder/applets/dbModal/",
      anchor: "dbModal",
      dataPromise: _initDbModal,
      port: "viewStack",
      uiRoute: modalRoute,
      //forceReload: true
    },
    {
      url: "./flowerui/oxana/report_builder/applets/saveReportModal/",
      anchor: "saveReportModal",
      dataPromise: _initSaveReportModal,
      port: "viewStack",
      uiRoute: modalRoute,
      //forceReload: true
    },
    {
      url: "./flowerui/oxana/report_builder/applets/createNewReportModal/",
      anchor: "createNewReportModal",
      dataPromise: _initCreateNewReportModal,
      port: "viewStack",
      uiRoute: modalRoute,
      //forceReload: true
    },
    {
      url: "./flowerui/oxana/report_builder/applets/uploadReportModal/",
      anchor: "uploadReportModal",
      dataPromise: _initUploadReportModal,
      port: "viewStack",
      uiRoute: modalRoute,
      //forceReload: true
    },
    {
      url: "./flowerui/oxana/report_builder/applets/uploadVersionModal/",
      anchor: "uploadVersionModal",
      dataPromise: _initUploadVersionModal,
      port: "viewStack",
      uiRoute: modalRoute,
      //forceReload: true
    }
  ],
  components: [
    {
      ctor: ViewStack,
      props: {
        id: "viewStack",
        type: ContainerType.NONE,
        components: [],
      },
    },
  ],
});

let formField;

let containers = ["Container", "Form", "Header", "Footer"];
let noNeedFF = [
  "Button",
  "Label",
  "Container",
  "Link",
  "Header",
  "Footer",
  "Form",
  "SideNav",
  "ViewStack",
  "Calendar",
  "Tree",
  "Image",
  "HRule",
  "Heading",
  "Repeater",
  "RepeaterEx",
];

//data should be loaded before calling render so that the current applet (the one in the url) implementation can access it
oxana.render().then(function (cmpInstance) {
  $(document.body).append(cmpInstance.$el);
});