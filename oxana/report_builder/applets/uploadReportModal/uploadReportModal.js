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
        await api_reports.reportsClient
          .get(ra.currentItem.report_guid)
          .then(async (res) => {
            //merr repeater-in e main-it
            mainLeftComponents = app.viewStack.mainContainer.container.componentsContainer.componentList;
            mainLeftComponents.dataProvider = new ArrayEx(data.componentList);
            mainLeftComponentsDataProvider = new ArrayEx(data.componentList);
            mainLeftComponentsDataProviderLength = mainLeftComponentsDataProvider.length;
    
            //check if report has a connection to a dataview
            if (res[0].id_dataview && res[0].id_dataview !== "0") {
              let dvList = await api_RB_Data.getDataViewFieldsClient.get(res[0].id_dataview)
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
            let evt = new jQuery.Event("loadLayout");
            evt.content = res[0].report_literal;
            modal.trigger(evt);
            modal.hide();
          })
          .catch(error => console.log(error, 'upload Report Modal Error'))
      },
  };     

    return imp;
  };
  
  Implementation.ctor = "Implementation";
  export {
    Implementation
  };