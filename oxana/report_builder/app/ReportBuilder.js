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
      dataPromise: _initBaseDP,
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
      dataPromise: _initBaseDP,
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