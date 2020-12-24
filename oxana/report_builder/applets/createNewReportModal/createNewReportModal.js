let Implementation = function (applet) {
  let app = applet.app;
  let data = applet.data;

  let
    modal,
    modalBody,
    createNewButton,
    saveAndCreateNewButton;
    
  let imp = {
    END_DRAW: e => {
      modal = applet.view;
      modalBody = modal.modalDialog.modalContent.modalBody

      //createNewButton
      createNewButton = modalBody.buttonContainer.createNewButton
      applet.addBehaviors(modal, { "accept": "CREATE_NEW_REPORT" }, false);
      applet.addBehaviors(createNewButton, { click: "CREATE_NEW_REPORT" }, false);

      //saveAndCreateNewButton
      saveAndCreateNewButton = modalBody.buttonContainer.saveAndCreateNewButton
      applet.addBehaviors(saveAndCreateNewButton, { "click": "SAVE_AND_CREATE_NEW" }, false);
    },

    CREATE_NEW_REPORT: e => {
      if(data.dataGridVersions)
        data.dataGridVersions = new ArrayEx([{ revision_name: "...", system_date: "..." }]);

      //merr repeater-in e main-it dhe beji reset componenteve ne panelin majtas ne main
      let mainLeftComponents = app.viewStack.mainContainer.container.componentsContainer.componentList;
      mainLeftComponents.dataProvider = new ArrayEx(data.componentList);

      // custom event to re-create the workArea
      let evt = new jQuery.Event("loadLayout");
      modal.trigger(evt);
      modal.hide();
    },

    SAVE_AND_CREATE_NEW: e => {
      app.appletsMap["saveReportModal"].init();
      modal.hide()
    },
  };     

  return imp;
};
  
  Implementation.ctor = "Implementation";
  export {
    Implementation
  };