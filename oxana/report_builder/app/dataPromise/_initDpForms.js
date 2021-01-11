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