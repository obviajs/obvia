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
    dbModalRepeaterLeftSearch,
    dbModalRepeaterRightSearch,
    dbModalContainerMiddleButtonRight,
    dbModalContainerMiddleButtonLeft,
    dbModalAddFieldsButton,
    mainLeftComponents,
    mainLeftComponentsDataProvider,
    mainLeftComponentsDataProviderLength;
  let itemsLeft = [];
  let itemsRight = [];
  let leftSearch, rightSearch;
  let buttonClicked = false;
  
  let cache = Cache.getInstance();
  let datasourceList = cache.get('datasourceList').slice(0);

  let api_RB_Data = new GaiaAPI_report_source()

  let imp = {
    BEGIN_DRAW: function (e) {},

    END_DRAW: function (e) {
      modal = applet.view;

      //dataSource dropdown
      dsDropDown = modal.find('dbModalDatasourceDropdown');
      dsDropDown.dataProvider = datasourceList;
      applet.addBehaviors(dsDropDown, { change: "DROPDOWN_DATASOURCE" }, false);

      //dataView dropdown
      dvDropDown = modal.find('dbModalDataviewDropdown')
      applet.addBehaviors(dvDropDown, { change: "DROPDOWN_DATAVIEW" }, false);

      //left repeater search
      dbModalRepeaterLeftSearch = modal.find('dbModalRepeaterLeftSearch');
      applet.addBehaviors(dbModalRepeaterLeftSearch, { keyup: "SEARCH" }, false);
      
      //right repeater
      dbModalRepeaterRight = modal.find('dbModalRepeaterRight');
      
      //right repeater search
      dbModalRepeaterRightSearch = modal.find('dbModalRepeaterRightSearch');
      applet.addBehaviors(dbModalRepeaterRightSearch, { keyup: "SEARCH" }, false);

      //right arrow button click
      dbModalContainerMiddleButtonRight = modal.find('dbModalContainerMiddleButtonRight');
      dbModalContainerMiddleButtonRight.enabled = false;
      applet.addBehaviors(dbModalContainerMiddleButtonRight, { click: "ADD_FIELDS" }, false);

      //left arrow button click
      dbModalContainerMiddleButtonLeft = modal.find('dbModalContainerMiddleButtonLeft');
      dbModalContainerMiddleButtonLeft.enabled = false;
      applet.addBehaviors(dbModalContainerMiddleButtonLeft, { click: "ADD_FIELDS" }, false);

      //add fields button click
      dbModalAddFieldsButton = modal.find('dbModalAddFieldsButton');
      applet.addBehaviors(dbModalAddFieldsButton, { click: "ADD_COMPONENT_FIELDS" }, false);

      //merr repeater-in e main-it
      mainLeftComponents = app.viewStack.mainContainer.container.componentsContainer.componentList;
      mainLeftComponentsDataProvider = mainLeftComponents.dataProvider.slice(0);
      mainLeftComponentsDataProviderLength = mainLeftComponentsDataProvider.length;

      //mer linqet dhe vendosi behavior
      // let links = modal.modalDialog.modalContent.modalBody.dbModalContainer
      //   .stepsRowCnt.colCnt.wizardTree.components
      // console.log(links)
      // links.forEach(link => 
      //   // applet.addBehaviors(link.props.bindingDefaultContext.currentItem, 
      //   applet.addBehaviors(link.props, 
      //     { click: "HANDLE_LINK_CLICK" }, 
      //   false)
      // )
    },

    // HANDLE_LINK_CLICK: e => {
    //   console.log('insideHANDLE_LINK_CLICK')
    // },

    SEARCH: function (e) {
      //check which search is changed 
      if (e.currentTarget.id.includes("dbModalRepeaterLeftSearch")) {
        leftSearch = e.target.value

        if (rightSearch && rightSearch.length > 0) {
          buttonClicked = true
        }

        itemsLeft =
          !buttonClicked
          ? data.dataviewFields[0].fields.slice(0).difference(dbModalRepeaterRight.dataProvider)
          : data.dataviewFields[0].fields.slice(0).difference(itemsRight)

        //vendos vleren e provider-it
        dbModalRepeaterLeft.dataProvider =
          leftSearch.length === 0
          ? itemsLeft
          : itemsLeft.filter(el => el.fieldDisplay.includes(leftSearch))

        //left repeater label click
        dbModalRepeaterLeftLabel = dbModalRepeaterLeft.dbModalRepeaterLeftLabel;
        applet.addBehaviors(dbModalRepeaterLeftLabel, {
          click: "SELECT_ITEM"
        }, false);
      } else {
        rightSearch = e.target.value

        if (leftSearch && leftSearch.length > 0) {
          buttonClicked = true
        }

        itemsRight =
          !buttonClicked
          ? data.dataviewFields[0].fields.slice(0).difference(dbModalRepeaterLeft.dataProvider)
          : data.dataviewFields[0].fields.slice(0).difference(itemsLeft)

        //vendos vleren e provider-it
        dbModalRepeaterRight.dataProvider =
          rightSearch.length === 0 ? 
          itemsRight : 
          itemsRight.filter(el => el.fieldDisplay.includes(rightSearch))

        //right repeater label click
        dbModalRepeaterRightLabel = dbModalRepeaterRight.dbModalRepeaterRightLabel;
        applet.addBehaviors(dbModalRepeaterRightLabel, {
          click: "SELECT_ITEM"
        }, false);
      }
    },

    SELECT_ITEM: function (e, ra) {
      buttonClicked = false
      
      //bej toggle klasat perkatese
      if (ra.currentRow.dbModalRepeaterRightLabel) {
        let newClasses = ra.currentRow.dbModalRepeaterRightLabel.classes.slice(0)
        newClasses.toggle("deselectedItem")
        ra.currentRow.dbModalRepeaterRightLabel.classes = newClasses
      } else {
        let newClasses = ra.currentRow.dbModalRepeaterLeftLabel.classes.slice(0)
        newClasses.toggle("selectedItem")
        ra.currentRow.dbModalRepeaterLeftLabel.classes = newClasses
      }

      //bej enable butonin perkates
      dbModalContainerMiddleButtonRight.enabled = !ra.currentRow.dbModalRepeaterRightLabel;
      dbModalContainerMiddleButtonLeft.enabled = ra.currentRow.dbModalRepeaterRightLabel;

      //shto ose hiq element nga array perkates
      if (!(leftSearch && leftSearch.length > 0 && rightSearch && rightSearch.length > 0)) {
        [itemsLeft, itemsRight].forEach((dir) => {
          dir.toggle(ra.currentItem, "fieldName");
          acSort(dir, "fieldName");
        });
      }
    },

    ADD_FIELDS: function (e) {
      buttonClicked = true

      // vendos dataProvider-at e Repeater-ave perkates
      dbModalRepeaterLeft.dataProvider =
        leftSearch && leftSearch.length !== 0 ?
        data.dataviewFields[0].fields.slice(0).difference(itemsRight)
        .filter(item => item.fieldDisplay.includes(leftSearch)) :
        data.dataviewFields[0].fields.slice(0).difference(itemsRight)

      dbModalRepeaterRight.dataProvider =
        rightSearch && rightSearch.length !== 0 ?
        data.dataviewFields[0].fields.slice(0).difference(itemsLeft)
        .filter(item => item.fieldDisplay.includes(rightSearch)) :
        data.dataviewFields[0].fields.slice(0).difference(itemsLeft)

      // right repeater label
      dbModalRepeaterRightLabel =
        dbModalRepeaterRight.dbModalRepeaterRightLabel &&
        dbModalRepeaterRight.dbModalRepeaterRightLabel;

      //shto behaviors pasi repetaer-i behet bosh
      [dbModalRepeaterLeftLabel, dbModalRepeaterRightLabel].forEach((lbl) =>
        applet.addBehaviors(lbl, {
          click: "SELECT_ITEM"
        }, false)
      );

      [dbModalRepeaterLeftLabel, dbModalRepeaterRightLabel].forEach((rep) => {
        // hiq klasat nga elementet e selektuar
        rep.forEach(el => {
          let newClasses = el.classes.slice(0)
          newClasses.splice(0, 1)
          el.classes = newClasses
        })
      });
    },

    ADD_COMPONENT_FIELDS: function (e) {
      //shtoji propet e reja
      dbModalRepeaterRight.dataProvider = dbModalRepeaterRight.dataProvider.map((el) => {
        let newEl = {
          ctor: 'JRTextInput',
          label: el.fieldDisplay,
          componentWithData: true,
          ...el,
        };
        return newEl;
      });

      //shtoji komponentet e reja
      dbModalRepeaterRight.dataProvider.forEach(el =>
        mainLeftComponentsDataProvider.pushUnique(el, "id_row")
      )
      mainLeftComponents.dataProvider = mainLeftComponentsDataProvider

      //ndrysho stilin
      mainLeftComponents.dataProvider.forEach((el, index) => {
        if (index >= mainLeftComponentsDataProviderLength)
          el.currentRow.component.$el[0].className = "border comp_side newLeftRepeaterComponent";
        return el;
      });

      //mbyll modalin
      modal.hide();
    },

    DROPDOWN_DATASOURCE: async (e) => {
      let foundIndex = indexOfObject(datasourceList, "id", dsDropDown.selectedItem.id)

      //merr dataview per datasource-in e selektuar
      if(!datasourceList[foundIndex].dataviewList)
        datasourceList[foundIndex].dataviewList = 
          await api_RB_Data.getDataviewOfDatasourceClient.get();
      // if(!dsDropDown.dataProvider[foundIndex].dataviewList)
      //   dsDropDown.dataProvider[foundIndex].dataviewList = 
      //     await api_RB_Data.getDataviewOfDatasourceClient.get();

      dvDropDown.dataProvider = datasourceList[foundIndex].dataviewList.slice(0);
    },

    DROPDOWN_DATAVIEW: async (e) => {
      let foundIndex = indexOfObject(dvDropDown.dataProvider, "id", dvDropDown.selectedItem.id)

      //merr fields per dataview te selektuar
      if(!dvDropDown.dataProvider[foundIndex].dataviewFields)
        dvDropDown.dataProvider[foundIndex].dataviewFields = 
          await api_RB_Data.getDataViewFieldsClient.get();
      
      //left repeater
      dbModalRepeaterLeft = modal.find('dbModalRepeaterLeft');
      dbModalRepeaterLeft.dataProvider =
        dvDropDown.dataProvider[foundIndex].dataviewFields[0].fields.slice(0);
      itemsLeft = dvDropDown.dataProvider[foundIndex].dataviewFields[0].fields.slice(0);

      //left repeater label click
      dbModalRepeaterLeftLabel = dbModalRepeaterLeft.dbModalRepeaterLeftLabel;
      applet.addBehaviors(dbModalRepeaterLeftLabel, { click: "SELECT_ITEM" }, false);
    }
  };

  return imp;
};

Implementation.ctor = "Implementation";
export {
  Implementation
};