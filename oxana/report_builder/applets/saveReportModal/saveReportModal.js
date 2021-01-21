let Implementation = function (applet) {
    let app = applet.app;
    let data = applet.data;
  
    let
      modal,
      modalBody,
      modalFooter,
      reportName,
      reportNameTarget,
      reportDescription,
      reportDescriptionTarget,
      reportErrorLabel,
      saveAndNewButton;
  
    // set today's date for the date section
    data.todayDateSaveReport = new Date();
  
    let imp = {
      END_DRAW: e => {
        modal = applet.view;
        modalBody = modal.modalDialog.modalContent.modalBody
        modalFooter = modal.modalDialog.modalContent.modalFooter

        //reportName
        reportName = modalBody.reportNameContainer.reportNameInput
        applet.addBehaviors(reportName, { keyup: "REPORT_NAME_CHANGED" }, false);

        //reportDescription
        reportDescription = modalBody.reportDescriptionContainer.reportDescriptionInput
        applet.addBehaviors(reportDescription, { keyup: "REPORT_DESCRIPTION_CHANGED" }, false);

        //reportErrorLabel
        reportErrorLabel = modalBody.reportErrorContainer.reportErrorLabel
        
        //saveButton
        saveAndNewButton = modalFooter.saveAndNewButton
        applet.addBehaviors(modal, { "accept": "SAVE_REPORT" }, false);
        applet.addBehaviors(saveAndNewButton, { click: "SAVE_AND_NEW_REPORT" }, false);

        //cancel
        applet.addBehaviors(modal, { "dismiss": "CANCEL_REPORT" }, false);
        
        //suggest report name
        applet.addBehaviors(modal, { "shown": "FILL_NAME" }, false);
      },

      REPORT_NAME_CHANGED: e =>  reportNameTarget = e.target,

      REPORT_DESCRIPTION_CHANGED: e =>  reportDescriptionTarget = e.target,

      SAVE_REPORT: e => {
        e.preventDefault();

        ValidationManager.getInstance().validate().then(result => {
          let canContinue = !(result.includes(false))
          if (canContinue) {
            //merr repeater-in e main-it dhe kaloji dataview fields ne context , per tu bere post
            let mainLeftComponentsDP =
              app.viewStack.mainContainer.container.componentsContainer.componentList.dataProvider.slice(0);
            
            //add xml
            stripHandle(data.workAreaRowL2lit);
            var sections = data.workAreaRowL2lit.props.components[0].props.components;
            var reportFactory = new ReportFactory();
            data.selectedReport.xml =
              Builder.dataviewFields ?
                reportFactory.toXml(sections, Builder.dataviewFields[0]) :
                reportFactory.toXml(sections);

            //data to be posted
            data.selectedReport.dataviewFields_list =
              mainLeftComponentsDP.filter(el => el.componentWithData)
            data.selectedReport.report_name =
              reportNameTarget ? reportNameTarget.value : reportName.value;
            data.selectedReport.description = reportDescriptionTarget.value;

            let gaiaReport = new GaiaAPI_reports();
            gaiaReport.reportsClient
              .post(data.selectedReport)
              .then(res => {
                reportErrorLabel.label = 'Success'
                reportErrorLabel.visible = true;
                canContinue = false
                data.selectedReport = { ...res }
                versionListCall(res)
              })
              .catch(err => {
                reportErrorLabel.label = 'Error'
                reportErrorLabel.visible = true
              });
          }
        });
        
      },

      SAVE_AND_NEW_REPORT: e => {
        ValidationManager.getInstance().validate().then(result => {
          let canContinue = !(result.includes(false))
          if (canContinue) {
            //merr repeater-in e main-it dhe kaloji dataview fields ne context , per tu bere post
            let mainLeftComponents =
              app.viewStack.mainContainer.container.componentsContainer.componentList;
            
              //data to be posted
            data.selectedReport.dataviewFields_list =
              mainLeftComponents.dataProvider.slice(0).filter(el => el.componentWithData)
            data.selectedReport.report_name = reportNameTarget ? reportNameTarget.value : reportName.value;
            data.selectedReport.description = reportDescriptionTarget.value;
            
            var gaiaReport = new GaiaAPI_reports();
            let promise = gaiaReport.reportsClient.post(data.selectedReport);
            promise.then(res => {
              reportErrorLabel.label = 'Success'
              reportErrorLabel.visible = true
              if (reportNameTarget) reportNameTarget.value = "";
              reportName.value = "";
              reportDescriptionTarget.value = "";
              reportDescription.value = "";
              canContinue = false
              data.selectedReport = new ReportProperties();
              //beji reset komponenteve ne panelin majtas ne main              
              mainLeftComponents.dataProvider = data.componentList;
              
              // custom event to re-create the workArea
              let evt = new jQuery.Event("loadLayout");
              modal.trigger(evt);
            });
            promise.catch(err => {
              reportErrorLabel.label = 'Error'
              reportErrorLabel.visible = true
            });
          }
        });
          
      },

      CANCEL_REPORT: e => {
        //empty all fields
        if(reportNameTarget) reportNameTarget.value = "";
        if(reportDescriptionTarget) reportDescriptionTarget.value = "";
        reportErrorLabel.visible = false
      },

      FILL_NAME: e => {
        if(data.dataGridVersions && data.dataGridVersions[0].revision_name !== "...") 
          reportName.value = data.selectedReport.report_name
      }
    }; 
  
    //helpful functions
    let versionListCall = async (res) => {
      //bej thirrjen ne api per listen e versioneve te raportit
      let api_reports_revision = GaiaAPI_dataview_pid_11.getInstance();
      data.id_document_revision = parseInt(res.id_document)
      let resReportVersions = new RemoteArray({
        recordsPerPage: 5, // pagination
        fetchPromise: p =>
          api_reports_revision.dataview_pid_11Client.post(data.id_document_revision)
      });
      data.dataGridVersions = new ArrayEx(resReportVersions);
      return Promise.all([data.dataGridVersions.init()]).then(res => data)
    };

  let stripHandle = function (lit) {
      let noNeedClasses = ["selected-component", "default-component"];
      if (lit.props["components"] && Array.isArray(lit.props["components"]))
        for (let i = 0; i < lit.props.components.length; i++) {
          if (
            lit.props.components[i].props["attr"] &&
            lit.props.components[i].props.attr["handle"]
          ) {
            lit.props.components[i] = lit.props.components[i].props.components[0];
          }
  
          if (
            lit.props.components[i].props["classes"] &&
            lit.props.components[i].props.classes.length > 0
          ) {
            let diffClasses = lit.props.components[i].props.classes.difference(
              noNeedClasses
            );
            lit.props.components[i].props.classes = diffClasses;
          }
  
          if (
            lit.props.components[i].props["components"] &&
            Array.isArray(lit.props.components[i].props["components"])
          )
            stripHandle(lit.props.components[i]);
        }
    };

    return imp;
  };
  
  Implementation.ctor = "Implementation";
  export {
    Implementation
  };