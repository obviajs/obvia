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
      },

      REPORT_NAME_CHANGED: e =>  reportNameTarget = e.target,

      REPORT_DESCRIPTION_CHANGED: e =>  reportDescriptionTarget = e.target,

      SAVE_REPORT: e => {
        e.preventDefault();

        ValidationManager.getInstance().validate().then(result => {
          let canContinue = !(result.includes(false))
          if (canContinue) {
            //data to be posted
            data.selectedReport.report_name = reportNameTarget.value;
            data.selectedReport.description = reportDescriptionTarget.value;

            let gaiaReport = new GaiaAPI_reports();
            gaiaReport.reportsClient
              .post(data.selectedReport)
              .then(res => {
                reportErrorLabel.label = 'Success'
                reportErrorLabel.visible = true;
                canContinue = false
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
            //data to be posted
            data.selectedReport.report_name = reportNameTarget.value;
            data.selectedReport.description = reportDescriptionTarget.value;
            var gaiaReport = new GaiaAPI_reports();
            let promise = gaiaReport.reportsClient.post(data.selectedReport);
            promise.then(res => {
              reportErrorLabel.label = 'Success'
              reportErrorLabel.visible = true
              reportNameTarget.value = "";
              reportName.value = "";
              reportDescriptionTarget.value = "";
              reportDescription.value = "";
              data.selectedReport = new ReportProperties();
              // custom event to re-create the workArea
              let evt = new jQuery.Event("loadLayout");
              modal.trigger(evt);
            });
            promise.catch(err => {
              reportErrorLabel.label = 'Error'
              reportErrorLabel.visible = true
            });
          }
        })
      },

      CANCEL_REPORT: e => {
        //empty all fields
        if(reportNameTarget) reportNameTarget.value = "";
        if(reportDescriptionTarget) reportDescriptionTarget.value = "";
        reportErrorLabel.visible = false
      }
    };     
  
    return imp;
  };
  
  Implementation.ctor = "Implementation";
  export {
    Implementation
  };