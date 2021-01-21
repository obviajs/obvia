let Implementation = function (applet) {
  let app = applet.app;
  let data = applet.data;

  //variable declaration
  let modal, modalBody, modalFooter;
  let editorBodyContainer, editorContainer;
  let finishButton;
  let cm;
  let leftContainerRepeater, middleContainerRepeater, rightContainerRepeater;

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

      leftContainerRepeater = modalBody.panelContainers.leftPanelContainer.leftContainerRepeater
      middleContainerRepeater = modalBody.panelContainers.middlePanelContainer.middleContainerRepeater
      rightContainerRepeater = modalBody.panelContainers.rightPanelContainer.rightContainerRepeater
    },

    FINISH: (e) => {
      // custom event to change the code for the component
      let evt = new jQuery.Event("addCodeToComponent");
      evt.content = cm.getValue();
      modal.trigger(evt);

      modal.hide();
    },

    LOAD_CODE: (e) => {
      cm.setValue(data.workAreaEditorEl.editorCode);

      //add fields to the left panel
      leftContainerRepeater.dataProvider = 
        app.viewStack.mainContainer.container.componentsContainer.componentList.dataProvider
        .slice(0)
        .filter(el => el.componentWithData)
      if (leftContainerRepeater.dataProvider.length > 0) {
        applet.addBehaviors(
          leftContainerRepeater.leftRepeaterLabel,
          { dblclick: "ADD_FIELD_TO_TEXT_EDITOR" },
          false
        )  
      }
      
      //add fields to the middle panel
      middleContainerRepeater.dataProvider = new ArrayEx([
        {label: "toFixed(4)"},
        {label: "parseInt()"},
        {label: "parseFloat()"},
      ])
      applet.addBehaviors(
        middleContainerRepeater.middleRepeaterLabel,
        { dblclick: "ADD_FUNCTION_TO_FIELD" },
        false
      )  

      rightContainerRepeater.dataProvider = new ArrayEx([])
    },

    ADD_FIELD_TO_TEXT_EDITOR: (e, ra) => {
      cm.setValue(cm.getValue() + `$F{${ra.currentRow.leftRepeaterLabel.label}} ` + '\r\n')
    },

    ADD_FUNCTION_TO_FIELD: (e, ra) => {
      let { label } = ra.currentRow.middleRepeaterLabel
      var doc = cm.getDoc();
      var cursor = doc.getCursor();

      switch (label) {
        case "toFixed(4)":
          doc.replaceRange("." + label, cursor);
          break;
        case "parseInt()":
        case "parseFloat()":
          let splitValue = cm.getValue().split("$");
          let indexOfCBR = splitValue[cursor.line + 1].indexOf("}") + 1;
          let newValue =
            label.slice(0, label.length - 1) +
            "$" + splitValue[cursor.line + 1].slice(0, indexOfCBR) + ") \r\n";
          splitValue = splitValue.map((element, index) => {
            if (index === cursor.line + 1) element = newValue
            else if(element !== "") element = "$" + element
            return element
          });
          cm.setValue(splitValue.join(""))
          break;
        default:
          "";
      }
    }
  };

  //helpful functions

  return imp;
};

Implementation.ctor = "Implementation";
export { Implementation };
