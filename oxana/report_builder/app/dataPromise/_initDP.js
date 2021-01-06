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