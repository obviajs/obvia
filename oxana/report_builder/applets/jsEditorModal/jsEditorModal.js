let Implementation = function (applet) {
  let app = applet.app;
  let data = applet.data;

  //variable declaration
  let modal, modalBody, modalFooter;
  let editorBodyContainer, editorContainer;
  let finishButton;
  let cm;

  //bahavior declaration
  let imp = {
    END_DRAW: (e) => {
      modal = applet.view;
      modalBody = modal.modalDialog.modalContent.modalBody;
      modalFooter = modal.modalDialog.modalContent.modalFooter;

      applet.addBehaviors(modal, { shown: "LOAD_CODE" }, false);

      editorBodyContainer = modalBody.editorBodyContainer;
      editorContainer = editorBodyContainer.editorContainer;

      finishButton = modalFooter.finishButton;
      applet.addBehaviors(finishButton, { click: "FINISH" }, false);

      //add Code Mirror to editorContainer
      editorContainer.removeAllChildren(0);
      cm = CodeMirror(editorContainer.$el[0], {
        mode: { name: "javascript", globalVars: false },
        lineNumbers: true,
      });
    },

    FINISH: (e) => {
      // custom event to change the code for the component
      let evt = new jQuery.Event("addCodeToComponent");
      evt.content = cm.getValue();
      modal.trigger(evt);

      modal.hide();
    },

    LOAD_CODE: (e) => cm.setValue(data.workAreaEditorEl.editorCode),
  };

  //helpful functions

  return imp;
};

Implementation.ctor = "Implementation";
export { Implementation };
