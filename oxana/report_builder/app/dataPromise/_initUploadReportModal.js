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