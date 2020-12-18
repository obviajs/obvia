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
  let itemsLeftSearch = [];
  let itemsRight = [];
  let itemsRightSearch = [];
  let leftSearchEvent, rightSearchEvent;
  let foundDsIndex, foundDvIndex;
  
  let cache = new Cache({ ttl: 3600000 });
  let datasourceList = cache.get('datasourceList');

  let api_RB_Data = new GaiaAPI_report_source()

  let imp = {
    END_DRAW: e => {
      modal = applet.view;
  
      //dataSource dropdown
      dsDropDown = modal.find('dbModalDatasourceDropdown');
      dsDropDown.dataProvider = datasourceList.slice(0);
      applet.addBehaviors(dsDropDown, { change: "DROPDOWN_DATASOURCE" }, false);

      //dataView dropdown
      dvDropDown = modal.find('dbModalDataviewDropdown')
      applet.addBehaviors(dvDropDown, { change: "DROPDOWN_DATAVIEW" }, false);

      //left repeater search
      dbModalRepeaterLeftSearch = modal.find('dbModalRepeaterLeftSearch');
      applet.addBehaviors(dbModalRepeaterLeftSearch, { keyup: "SEARCH" }, true);
      
      //right repeater
      dbModalRepeaterRight = modal.find('dbModalRepeaterRight');
      
      //right repeater search
      dbModalRepeaterRightSearch = modal.find('dbModalRepeaterRightSearch');
      applet.addBehaviors(dbModalRepeaterRightSearch, { keyup: "SEARCH" }, true);

      //left arrow button click
      dbModalContainerMiddleButtonLeft = modal.find('dbModalContainerMiddleButtonLeft');
      dbModalContainerMiddleButtonLeft.enabled = false;
      applet.addBehaviors(dbModalContainerMiddleButtonLeft, { click: "ADD_FIELDS" }, true);

      //right arrow button click
      dbModalContainerMiddleButtonRight = modal.find('dbModalContainerMiddleButtonRight');
      dbModalContainerMiddleButtonRight.enabled = false;
      applet.addBehaviors(dbModalContainerMiddleButtonRight, { click: "ADD_FIELDS" }, true);

      //add fields button click
      dbModalAddFieldsButton = modal.find('dbModalAddFieldsButton');
      applet.addBehaviors(dbModalAddFieldsButton, { click: "ADD_COMPONENT_FIELDS" }, false);

      //merr repeater-in e main-it
      mainLeftComponents = app.viewStack.mainContainer.container.componentsContainer.componentList;
      mainLeftComponentsDataProvider = mainLeftComponents.dataProvider.slice(0);
      mainLeftComponentsDataProviderLength = mainLeftComponentsDataProvider.length;

      applet.addBehaviors(modal, { "dismiss": "CANCEL_FIELD_SELECT" }, false);

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

    DROPDOWN_DATASOURCE: async (e) => {
      foundDsIndex = indexOfObject(datasourceList, "id", dsDropDown.selectedItem.id)
      
      //kontrollo cache nqs ekziston dataviewList per datasource-in e selektuar
      let foundDvList = datasourceList[foundDsIndex].dataviewList
      if (!foundDvList) {
        foundDvList = await api_RB_Data.getDataviewOfDatasourceClient.get();
        if (!foundDvList.status_description) {
          datasourceList[foundDsIndex].dataviewList = foundDvList.slice(0)
          cache.set('datasourceList', datasourceList);
        } else {
          console.error(foundDvList.status_description, 'error inside getDataviewOfDatasourceClient')
        }
        cache.persist();
      }
      
      //merr dataview per datasource-in e selektuar
      dvDropDown.dataProvider = cache.get('datasourceList')[foundDsIndex].dataviewList;
    },

    DROPDOWN_DATAVIEW: async (e) => {
      //vendos id e dataview-se ne kontekst per ta shtuar tek report properties
      data.selectedReport.id_dataview = dvDropDown.selectedItem.id

      foundDvIndex = indexOfObject(dvDropDown.dataProvider, "id", dvDropDown.selectedItem.id)
      
      //merr fields per dataview te selektuar
      let foundDvFields =
        cache.get('datasourceList')[foundDsIndex].dataviewList[foundDvIndex].dvFields
      if(!foundDvFields) {
        foundDvFields = await api_RB_Data.getDataViewFieldsClient.get();
        if (!foundDvFields.status_description) { 
          datasourceList[foundDsIndex].dataviewList[foundDvIndex].dvFields = foundDvFields.slice(0)[0].fields;
          dvDropDown.dataProvider[foundDvIndex].dvFields = foundDvFields.slice(0)[0].fields;
          cache.set('datasourceList', datasourceList);
          cache.persist();
          //add to context
          data.dataviewFields = foundDvFields.slice(0);
        } else {
          console.error(foundDvFields.status_description, 'error inside getDataViewFieldsClient')
        }
      }
      
      //left repeater
      dbModalRepeaterLeft = modal.find('dbModalRepeaterLeft');
      dbModalRepeaterLeft.dataProvider = dvDropDown.dataProvider[foundDvIndex].dvFields;
      itemsLeftSearch = dvDropDown.dataProvider[foundDvIndex].dvFields;
      addLabelLeft();
    },

    SELECT_ITEM: (e, ra) => {
      let attributes = [
        { name: 'Left', className: 'selectedItem', arr: itemsLeft },
        { name: 'Right', className: 'deselectedItem', arr: itemsRight }
      ]
      
      let checkLabel = ra.currentRow.dbModalRepeaterLeftLabel

      let selAttr = checkLabel ? attributes[0] : attributes[1]
      
      //bej toggle klasat perkatese
      let label = `dbModalRepeater${selAttr.name}Label`
      let newClasses = ra.currentRow[label].classes.slice(0)
      newClasses.toggle(selAttr.className)
      ra.currentRow[label].classes = newClasses

      //shto ose hiq element nga array perkates
      selAttr.arr.toggle(ra.currentItem, "fieldName");
      acSort(selAttr.arr, "fieldName");

      //bej enable butonin perkates
      dbModalContainerMiddleButtonRight.enabled = checkLabel;
      dbModalContainerMiddleButtonLeft.enabled = !checkLabel;

      if (selAttr) {
        if (ra.currentRow.dbModalRepeaterLeftLabel) emptyRight(e);
        else emptyLeft(e);
      }
    },

    ADD_FIELDS: e => {
      let attributes = [
        { name: 'Left', arr: itemsLeft, arrSearch: itemsLeftSearch, rep: dbModalRepeaterLeft },
        { name: 'Right', arr: itemsRight, arrSearch: itemsRightSearch, rep: dbModalRepeaterRight }
      ]

      let selAttr = e.target.id.includes('Left') ? attributes[0] : attributes[1]
      let notSelAttr = selAttr.name === 'Left'? attributes[1] : attributes[0]

      // shto dhe hiq el ne dataProvider respektive
      let DP = selAttr.arrSearch.slice(0)
      notSelAttr.arr.forEach(el => DP.push(el))
      selAttr.rep.dataProvider = DP
      notSelAttr.rep.dataProvider = notSelAttr.arrSearch.difference(notSelAttr.arr)  

      itemsLeft = []
      itemsRight = []
      itemsLeftSearch = dbModalRepeaterLeft.dataProvider.slice(0)
      itemsRightSearch = dbModalRepeaterRight.dataProvider.slice(0)
      if (rightSearchEvent) rightSearchEvent.target.value = ""
      if (leftSearchEvent) leftSearchEvent.target.value = ""
      if (selAttr) {
        emptyLeft(e);
        emptyRight(e);
      }

      addLabelLeft();
      addLabelRight();
    },

    SEARCH: e => {
      let attributes = [
        {
          name: 'Left',
          searchEvent: dbModalRepeaterLeftSearch,
          rep: dbModalRepeaterLeft,
          arrSearch: itemsLeftSearch,
        },
        {
          name: 'Right',
          searchEvent: dbModalRepeaterRightSearch,
          rep: dbModalRepeaterRight,
          arrSearch: itemsRightSearch,
        },
      ]
      
      //pass value to var so you can access it in other behaviors & functions
      if (e.target.id.includes('Left')) leftSearchEvent = e
      else rightSearchEvent = e

      let selAttr = e.target.id.includes('Left') ? attributes[0] : attributes[1]
      let notSelAttr = selAttr.name === 'Left' ? attributes[1] : attributes[0]

      selAttr.searchEvent.value = e.target.value

      //vendos vleren e provider-it
      selAttr.rep.dataProvider =
        selAttr.arrSearch.filter(item => item.fieldDisplay.includes(selAttr.searchEvent.value))

      if (notSelAttr.searchEvent.value) {
        notSelAttr.searchEvent.value = ""
        notSelAttr.rep.dataProvider = notSelAttr.arrSearch
      }

      //repeater label click
      if (selAttr.name === 'Left') addLabelLeft();
      else addLabelRight();

      // if (e.target.value.length > 0) {
        emptyLeft(e);
        emptyRight(e);
      // };
    },

    ADD_COMPONENT_FIELDS: e => {
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

    CANCEL_FIELD_SELECT: e => {
      itemsLeft = []
      itemsRight = []
      itemsLeftSearch = 
        dvDropDown.dataProvider[foundDvIndex]
        && dvDropDown.dataProvider[foundDvIndex].dvFields
      itemsRightSearch = []
      if (dbModalRepeaterLeft)
        dbModalRepeaterLeft.dataProvider = 
        dvDropDown.dataProvider[foundDvIndex]
        && dvDropDown.dataProvider[foundDvIndex].dvFields
      if (dbModalRepeaterRight) dbModalRepeaterRight.dataProvider = []
      if(leftSearchEvent) leftSearchEvent.target.value = ""
      if(rightSearchEvent) rightSearchEvent.target.value = ""
    },
  };

  //helpful functions
  let emptyLeft = e => {
    // hiq klasat nga elementet e selektuar, boshatis array-n
    if (dbModalRepeaterLeftLabel) {
      dbModalRepeaterLeftLabel.forEach(el => {
        let newClasses = el.classes.slice(0)
        newClasses.splice(0, 1)
        el.classes = newClasses
      });
      itemsLeft = [];
    }
  }

  let emptyRight = e => {
    // hiq klasat nga elementet e selektuar, boshatis array-n
    if(dbModalRepeaterRightLabel) {
      dbModalRepeaterRightLabel.forEach(el => {
        let newClasses = el.classes.slice(0)
        newClasses.splice(0, 1)
        el.classes = newClasses
      });
      itemsRight = [];
    }
  }

  let addLabelLeft = e => {
    // left repeater label
    dbModalRepeaterLeftLabel =
      dbModalRepeaterLeft.dbModalRepeaterLeftLabel && dbModalRepeaterLeft.dbModalRepeaterLeftLabel;
    //shto behaviors pasi repetaer-i behet bosh
    applet.addBehaviors(dbModalRepeaterLeftLabel, { click:  "SELECT_ITEM" }, false)
  }

  let addLabelRight = e => {
    // right repeater label
    dbModalRepeaterRightLabel =
      dbModalRepeaterRight.dbModalRepeaterRightLabel && dbModalRepeaterRight.dbModalRepeaterRightLabel;
    //shto behaviors pasi repetaer-i behet bosh
    applet.addBehaviors(dbModalRepeaterRightLabel, { click:  "SELECT_ITEM" }, false)
  }

  return imp;
};

Implementation.ctor = "Implementation";
export {
  Implementation
};