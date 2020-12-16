let Implementation = function (applet) {
    let app = applet.app;
    let data = applet.data;
  
  let
    modal,
    uploadSearch,
    uploadRepeater,
    uploadRepeaterLabel;
  
  let
    mainLeftComponents,
    mainLeftComponentsDataProvider,
    mainLeftComponentsDataProviderLength;
  
  let api_RB_Data = new GaiaAPI_report_source()
  
    let imp = {
      END_DRAW: e => {
        modal = applet.view;

        uploadRepeater = modal.find('uploadRepeater')
        uploadRepeater.dataProvider = data.reportsList;
        applet.addBehaviors(uploadRepeater, { "rowAdd": "PREPARE_ITEM", }, false);
        
        uploadSearch = modal.find('uploadSearch')
        applet.addBehaviors(uploadSearch,
          {
            keyup:
            {
              "SEARCH_REPORT": {
                filter: KeyboardUtils.test["ENTER"]
              } 
            }
          }, false);
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
        data.reportsList.filter()
      },

      PREPARE_ITEM: (e, r, ra) => {
        if (ra) {
          applet.addBehaviors(ra.currentRow.uploadRepeaterLabel, {
            "click": { "SELECT_REPORT": { onPropagation: true } }
          }, false);
        }
      },
      
      SELECT_REPORT: async (e, ra) => {
        let api_reports = GaiaAPI_reports.getInstance();
        let api_reports_revision = GaiaAPI_dataview_pid_11.getInstance();
        let reportRes = await api_reports.getReportsClient.get(ra.currentItem.report_guid)

        if (!reportRes.status_description) {
          //vendos guid e raport-it dhe id_dataview-ne ne kontekst
          data.selectedReport.report_guid = ra.currentItem.report_guid
          data.selectedReport.id_dataview = reportRes[0].id_dataview && reportRes[0].id_dataview
          data.id_document_revision = parseInt(reportRes[0].id_document)
          
          //merr repeater-in e main-it
          mainLeftComponents = app.viewStack.mainContainer.container.componentsContainer.componentList;
          mainLeftComponents.dataProvider = new ArrayEx(data.componentList);
          mainLeftComponentsDataProvider = new ArrayEx(data.componentList);
          mainLeftComponentsDataProviderLength = mainLeftComponentsDataProvider.length;
          
          //check if report has a connection to a dataview
          if (reportRes[0].id_dataview && reportRes[0].id_dataview !== "0") {
            let dvList = await api_RB_Data.getDataViewFieldsClient.get(reportRes[0].id_dataview)
            if (!dvList.status_description) {
              dvList[0].fields.forEach(dv => {
                //shtoji propet e reja
                let newDv = {
                  ctor: 'JRTextInput',
                  label: dv.fieldDisplay,
                  componentWithData: true,
                  ...dv,
                };
                
                mainLeftComponentsDataProvider.pushUnique(newDv, "id_row")
              });
            } else {
              console.error(dvList.status_description, 'error from getDataViewFieldsClient apiCall')
            }
          }

          //shtoji komponentet e reja
          mainLeftComponents.dataProvider = mainLeftComponentsDataProvider

          //ndrysho stilin
          mainLeftComponents.dataProvider.forEach((el, index) => {
            if (index >= mainLeftComponentsDataProviderLength)
              el.currentRow.component.$el[0].className = "border comp_side newLeftRepeaterComponent";
            return el;
          });

          // custom event to add the elements to the workArea
          // let evt = new jQuery.Event("loadLayout");
          // evt.content = reportRes[0].report_literal;
          // modal.trigger(evt);
          modal.hide();
        } else {
          console.error(reportRes.status_description, 'upload Report Modal Error')
        }
        
        //bej thirrjen ne api per listen e versioneve te raportit
        let resReportVersions = await api_reports_revision.dataview_pid_11Client.post(data.id_document_revision)
        if (!resReportVersions.status_description) {
          let uploadReportVersion = app.viewStack.mainContainer.nav.middleNav.uploadReportVersion;
          let r = resReportVersions.slice(0)
          uploadReportVersion.dataProvider = r
          uploadReportVersion.selectedItem = r[0]

          //choose if you're going to show label or input
          data.showNewReportLabel = true
          data.showNewReportTextInput = false
          let name = r[r.length - 1].revision_name
          let num = parseInt(name.charAt(name.length - 1)) + 1
          data.selectedReportName = name.slice(0, name.length - 1) + num
        } else {
          console.error(resReportVersion.status_description, 'error from dataview_pid_11Client apiCall')
        }
      },
  };     

    return imp;
  };
  
  Implementation.ctor = "Implementation";
  export {
    Implementation
  };