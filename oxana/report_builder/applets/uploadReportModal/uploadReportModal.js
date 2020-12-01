let Implementation = function (applet) {
    let app = applet.app;
    let data = applet.data;
  
  let
    modal,
    uploadSearch,
    uploadRepeater,
    uploadRepeaterLabel;
  
    let imp = {
      END_DRAW: e => {
        modal = applet.view;

        uploadRepeater = modal.find('uploadRepeater')
        uploadRepeater.dataProvider = data.reportsList;
        
        uploadSearch = modal.find('uploadSearch')
        applet.addBehaviors(uploadSearch, { keyup: "SEARCH_REPORT" }, false);

        uploadRepeaterLabel = uploadRepeater.uploadRepeaterLabel;
        applet.addBehaviors(uploadRepeaterLabel, { click: "SELECT_REPORT" }, false);
      },

      SEARCH_REPORT: e => {
        data.reportsList.filterData = {
          "condition": "AND",
          "rules": [
            {
              "id": "report_name",
              "field": "report_name",
              "type": "string",
              "input": "text",
              "operator": "contains",
              "value": e.target.value.toLowerCase()
            }
          ],
          "valid": true
        };
        data.reportsList.filter();
        uploadRepeater.dataProvider = data.reportsList;

        uploadRepeaterLabel = uploadRepeater.uploadRepeaterLabel;
        applet.addBehaviors(uploadRepeaterLabel, { click: "SELECT_REPORT" }, false);
      },
      
      SELECT_REPORT: async (e, ra) => {
        let api_reports = GaiaAPI_reports.getInstance();
        await api_reports.reportsClient
          .get(ra.currentItem.report_guid)
          .then(res => {
            // custom event to add the elements to the workArea
            let evt = new jQuery.Event("loadLayout");
            evt.content = res[0].report_literal;
            modal.trigger(evt);
            modal.hide();
          })
          .catch(error => console.log(error, 'upload Report Modal Error'))
      }
    };     
  
    return imp;
  };
  
  Implementation.ctor = "Implementation";
  export {
    Implementation
  };