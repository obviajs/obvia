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
          click: "SELECT_ITEM_LEFT",
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
          click: "ADD_FIELDS_RIGHT",
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
          click: "ADD_FIELDS_LEFT",
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

    SELECT_ITEM_LEFT: function (e, ra) {
      // bej toggle klasen
      e.target.parentElement.firstElementChild.classList.toggle("selectedItem");

      // gjej el nqs ekziston tek array itemsRight
      let foundRight = itemsRight.find(
        (el) => el.dataview_id === ra.currentItem.dataview_id
      );

      if (foundRight) {
        // hiq el tek array itemsRight dhe shto tek itemsLeft
        let indexRight = null;
        for (let i = 0; i < itemsRight.length; i++) {
          if (itemsRight[i].dataview_id === ra.currentItem.dataview_id) {
            indexRight = i;
            itemsRight.splice(indexRight, 1);
            itemsLeft.push(foundRight);
            itemsLeft.sort((a, b) => a.dataview_id - b.dataview_id);
            break;
          }
        }
      } else {
        // shto el tek array itemsRight dhe hiq tek itemsLeft
        itemsRight.push(ra.currentItem);
        itemsRight.sort((a, b) => a.dataview_id - b.dataview_id);
        let index = null;
        for (let i = 0; i < itemsLeft.length; i++) {
          if (itemsLeft[i].dataview_id === ra.currentItem.dataview_id) {
            index = i;
            itemsLeft.splice(index, 1);
            break;
          }
        }
      }

      // bej enable dhe disable butonat perkates
      dbModalContainerMiddleButtonRight.enabled = true;
      dbModalContainerMiddleButtonLeft.enabled = false;
    },

    SELECT_ITEM_RIGHT: function (e, ra) {
      // bej toggle klasen
      e.target.parentElement.firstElementChild.classList.toggle(
        "deselectedItem"
      );

      // gjej el nqs ekziston tek array itemsLeft
      let foundLeft = itemsLeft.find(
        (el) => el.dataview_id === ra.currentItem.dataview_id
      );

      if (foundLeft) {
        // hiq el tek array itemsLeft dhe shto tek itemsRight
        let indexLeft = null;
        for (let i = 0; i < itemsLeft.length; i++) {
          if (itemsLeft[i].dataview_id === ra.currentItem.dataview_id) {
            indexLeft = i;
            itemsLeft.splice(indexLeft, 1);
            itemsRight.push(foundLeft);
            itemsRight.sort((a, b) => a.dataview_id - b.dataview_id);
            break;
          }
        }
      } else {
        // hiq el tek array itemsRight dhe shto tek itemsLeft
        itemsLeft.push(ra.currentItem);
        itemsLeft.sort((a, b) => a.dataview_id - b.dataview_id);
        let index = null;
        for (let i = 0; i < itemsRight.length; i++) {
          if (itemsRight[i].dataview_id === ra.currentItem.dataview_id) {
            index = i;
            itemsRight.splice(index, 1);
            break;
          }
        }
      }

      // bej enable dhe disable butonat perkates
      dbModalContainerMiddleButtonRight.enabled = false;
      dbModalContainerMiddleButtonLeft.enabled = true;
    },

    ADD_FIELDS_RIGHT: function (e) {
      // vendos array-t perkates tek dataProvider-at e Repeater-ave perkates
      dbModalRepeaterLeft.dataProvider = itemsLeft;
      dbModalRepeaterRight.dataProvider = itemsRight;

      // right repeater label
      dbModalRepeaterRightLabel =
        dbModalRepeaterRight.dbModalRepeaterRightLabel;
      //right repeater label click
      applet.addBehaviors(
        dbModalRepeaterRightLabel,
        {
          click: "SELECT_ITEM_RIGHT",
        },
        false
      );

      // hiq klasat nga elementet e selektuar
      var arr = Array.prototype.slice.call(dbModalRepeaterLeft.$el[0].children);
      arr.map((el) => {
        el.children[0].className = "";
      });
    },

    ADD_FIELDS_LEFT: function (e) {
      // vendos array-t perkates tek dataProvider-at e Repeater-ave perkates
      dbModalRepeaterLeft.dataProvider = itemsLeft;
      dbModalRepeaterRight.dataProvider = itemsRight;

      //re-adding left-repeater-label behavior
      applet.addBehaviors(
        dbModalRepeaterLeftLabel,
        {
          click: "SELECT_ITEM_LEFT",
        },
        false
      );

      // hiq klasat nga elementet e selektuar
      var arr = Array.prototype.slice.call(
        dbModalRepeaterRight.$el[0].children
      );
      arr.map((el) => {
        el.children[0].className = "";
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
