let Implementation = function (applet) {
  let app = applet.app;
  let data = applet.data;

  let modal,
    dsDropDown,
    dvDropDown,
    dbModalRepeaterLeft,
    dbModalRepeaterRight,
    dbModalRepeaterLeftLabel,
    dbModalRepeaterRightLabel,
    dbModalContainerMiddleButtonRight,
    dbModalContainerMiddleButtonLeft,
    dbModalAddFieldsButton,
    mainLeftComponents,
    mainLeftComponentsDataProvider,
    mainLeftComponentsDataProviderLength;
  let itemsLeft = data.sources.slice(0);
  let itemsRight = [];

  let imp = {
    BEGIN_DRAW: function (e) {},

    END_DRAW: function (e) {
      modal = applet.view;

      //dataSource dropdown dataProvider
      dsDropDown =
        modal.modalDialog.modalContent.modalBody.dbModalContainer
          .dbModalDatasourceContainer.dbModalDatasourceDropdown;
      dsDropDown.dataProvider = data.datasourceList.map((ds) => ds);

      //dataView dropdown dataProvider
      dvDropDown =
        modal.modalDialog.modalContent.modalBody.dbModalContainer
          .dbModalDataviewContainer.dbModalDataviewDropdown;
      dvDropDown.dataProvider = data.sources.map((ds) => ds);

      //left repeater dataProvider
      dbModalRepeaterLeft =
        modal.modalDialog.modalContent.modalBody.dbModalContainer
          .dbModalRepeaterContainer.dbModalRepeaterLeft;
      dbModalRepeaterLeft.dataProvider = data.sources;

      //right repeater
      dbModalRepeaterRight =
        modal.modalDialog.modalContent.modalBody.dbModalContainer
          .dbModalRepeaterContainer.dbModalRepeaterRight;

      //left repeater label click
      dbModalRepeaterLeftLabel = dbModalRepeaterLeft.dbModalRepeaterLeftLabel;
      applet.addBehaviors(
        dbModalRepeaterLeftLabel,
        {
          click: "SELECT_ITEM",
        },
        false
      );

      //right arrow button click
      dbModalContainerMiddleButtonRight =
        modal.modalDialog.modalContent.modalBody.dbModalContainer
          .dbModalRepeaterContainer.componentContainerMiddle
          .dbModalContainerMiddleButtonRight;
      dbModalContainerMiddleButtonRight.enabled = false;
      applet.addBehaviors(
        dbModalContainerMiddleButtonRight,
        {
          click: "ADD_FIELDS",
        },
        false
      );

      //left arrow button click
      dbModalContainerMiddleButtonLeft =
        modal.modalDialog.modalContent.modalBody.dbModalContainer
          .dbModalRepeaterContainer.componentContainerMiddle
          .dbModalContainerMiddleButtonLeft;
      dbModalContainerMiddleButtonLeft.enabled = false;
      applet.addBehaviors(
        dbModalContainerMiddleButtonLeft,
        {
          click: "ADD_FIELDS",
        },
        false
      );

      //add fields button click
      dbModalAddFieldsButton =
        modal.modalDialog.modalContent.modalBody.dbModalContainer
          .dbModalAddFieldsContainer.dbModalAddFieldsButtonContainer
          .dbModalAddFieldsButton;
      applet.addBehaviors(
        dbModalAddFieldsButton,
        {
          click: "ADD_COMPONENT_FIELDS",
        },
        false
      );

      //merr repeater-in
      mainLeftComponents =
        app.viewStack.mainContainer.container.componentsContainer.componentList;
      mainLeftComponentsDataProvider = mainLeftComponents.dataProvider.slice(0);
      mainLeftComponentsDataProviderLength =
        mainLeftComponentsDataProvider.length;
    },

    SELECT_ITEM: function (e, ra) {
      //bej toggle klasen
      e.target.parentElement.firstElementChild.classList.toggle(
        ra.currentRow.dbModalRepeaterRightLabel
          ? "deselectedItem"
          : "selectedItem"
      );

      //bej enable butonin perkates
      dbModalContainerMiddleButtonRight.enabled = !ra.currentRow
        .dbModalRepeaterRightLabel;
      dbModalContainerMiddleButtonLeft.enabled =
        ra.currentRow.dbModalRepeaterRightLabel;

      //shto ose hiq element nga array perkates
      [itemsRight, itemsLeft].map((dir) => {
        dir.toggle(ra.currentItem, "dataview_id");
        acSort(dir, "dataview_id");
      });
    },

    ADD_FIELDS: function (e) {
      // vendos array-t perkates tek dataProvider-at e Repeater-ave perkates
      dbModalRepeaterLeft.dataProvider = itemsLeft;
      dbModalRepeaterRight.dataProvider = itemsRight;

      // right repeater label
      dbModalRepeaterRightLabel =
        dbModalRepeaterRight.dbModalRepeaterRightLabel &&
        dbModalRepeaterRight.dbModalRepeaterRightLabel;

      //shto behaviors pasi repetaer-i behet bosh
      [dbModalRepeaterLeftLabel, dbModalRepeaterRightLabel].map((lbl) =>
        applet.addBehaviors(
          lbl,
          {
            click: "SELECT_ITEM",
          },
          false
        )
      );

      // [dbModalRepeaterLeft, dbModalRepeaterRight].map((rep) => {
      //   // hiq klasat nga elementet e selektuar
      //   let arr = Array.prototype.slice.call(rep.$el[0].children);
      //   arr.map((el) => {
      //     el.children[0].className = "";
      //   });
      // });

      ["dbModalRepeaterLeft", "dbModalRepeaterRight"].map((rep) => {
        // hiq klasat nga elementet e selektuar
        let el =
          rep === "dbModalRepeaterLeft"
            ? dbModalRepeaterLeft.dbModalRepeaterLeftLabel.slice(0)
            : dbModalRepeaterRight.dbModalRepeaterRightLabel.slice(0);
        el.map((e, index) => {
          e.classes.splice(index, 1);
        });
      });
    },

    ADD_COMPONENT_FIELDS: function (e) {
      //shtoji propet e reja
      let modItemsRight = itemsRight.map((el) => {
        let newEl = {
          ctor: "JRTextInput",
          label: el.name,
          ...el,
        };
        return newEl;
      });

      //shtoji komponentet e reja
      mainLeftComponents.dataProvider = mainLeftComponentsDataProvider.concat(
        modItemsRight
      );

      //ndrysho stilin
      let arr = mainLeftComponents.dataProvider.slice(0);
      arr.map((el, index) => {
        if (index >= mainLeftComponentsDataProviderLength && el.currentRow)
          el.currentRow.component.$el[0].className =
            "border comp_side newLeftRepeaterComponent";
        return el;
      });

      //mbyll modalin
      modal.hide();
    },
  };

  return imp;
};

Implementation.ctor = "Implementation";
export { Implementation };
