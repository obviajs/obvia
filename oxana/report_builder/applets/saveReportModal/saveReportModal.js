let Implementation = function (applet) {
    let app = applet.app;
    let data = applet.data;
  
    let 
      modal,
      modalBody,
      modalFooter,
      reportName,
      reportNameValue,
      reportDescription,
      reportDescriptionValue,
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
      },

      REPORT_NAME_CHANGED: e => reportNameValue = e.target.value ,

      REPORT_DESCRIPTION_CHANGED: e => reportDescriptionValue = e.target.value ,

      SAVE_REPORT: e => {
        //show error if all fields are not completed 
        reportErrorLabel.visible =
          !(reportNameValue && reportNameValue.length > 0 &&
            reportDescriptionValue && reportDescriptionValue.length > 0);
        
        //data to be posted
        data.selectedReport.report_name = reportNameValue;
        data.selectedReport.description = reportDescriptionValue;
        data.selectedReport.date_created = data.todayDateSaveReport;
        data.selectedReport.author_id_user = 'user';

        if (!reportErrorLabel.visible) {
          let gaiaReport = new GaiaAPI_reports();
          gaiaReport.reportsClient
            .post(data.selectedReport)
            .then(res => {
              //don't close the modal if all fields aren't completed
              reportErrorLabel.visible = false;
              modal.hide();
            })
            .catch(err => reportErrorLabel.visible = true);
        }
      },

      SAVE_AND_NEW_REPORT: e => {
        //show error if all fields are not completed 
        reportErrorLabel.visible =
          !(reportNameValue && reportNameValue.length > 0 &&
            reportDescriptionValue && reportDescriptionValue.length > 0);
        
        //data to be posted
        data.selectedReport.report_name = reportNameValue;
        data.selectedReport.description = reportDescriptionValue;
        data.selectedReport.date_created = data.todayDateSaveReport;
        data.selectedReport.author_id_user = 'user';

        if (!reportErrorLabel.visible) {
          var gaiaReport = new GaiaAPI_reports();
          let promise = gaiaReport.reportsClient.post(data.selectedReport);
          promise.then(res => {
            reportErrorLabel.visible = false;
            data.selectedReport = new ReportProperties();
            data.workArea.removeAllChildren(0);
            reportNameValue.value = "";
            reportDescriptionValue.value = "";
            //don't close the modal if all fields aren't completed
            modal.hide();
          });
          promise.catch(err => reportErrorLabel.visible = true );
        }
      }
    };      
  
    return imp;
  };
  
  Implementation.ctor = "Implementation";
  export {
    Implementation
  };