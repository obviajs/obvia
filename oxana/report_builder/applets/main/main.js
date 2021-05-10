import { ArrayUtils } from "/flowerui/lib/ArrayUtils.js";
let Implementation = function (applet) {
  let app = applet.app;
  let data = applet.data;

  let activeComponent;
  let activeContainer;
  let _cmpList = new ArrayEx(data.componentList);

  let propertyEditorViewStack,
    propertyEditorContainer,
    propertyEditorContainerTrash,
    fileSelectModal,
    browseFile,
    componentsContainer,
    rightSideNav,
    listHistorySteps,
    workArea,
    title,
    pageHeader,
    detail,
    pageFooter,
    summary,
    workAreaColumn,
    sectionList,
    workAreaRowL2,
    targetBand,
    cmpSearchTextInput,
    undoButton,
    redoButton,
    cmpTrash,
    uploadIcon,
    createNewReport,
    saveLayout,
    selectBtn,
    componentList,
    openUploadReports,
    appLoader,
    middleNav,
    desktopPreview,
    openDatabase,
    dbModal,
    saveReportModal,
    createNewReportModal,
    openUploadReportVersion;
  
  let component_id = 0;
  let workAreaUE = null;

  //guide lines
  let MIN_DISTANCE = 10; // minimum distance to "snap" to a guide
  let guides = [];
  let innerOffsetX, innerOffsetY, chosenGuides, pos;
  let leftPanelWidth;

  //component resize
  let resizable = false;
  let formField;
  let containers = ["Container", "Form", "Header", "Footer", "JRBand"];
  let noNeedFF = [
    "Button",
    "Label",
    "Container",
    "Link",
    "Header",
    "Footer",
    "Form",
    "SideNav",
    "ViewStack",
    "Calendar",
    "Tree",
    "Image",
    "HRule",
    "Heading",
    "Repeater",
    "RepeaterEx",
  ];

  //code editor
  let editorItemId;

  let imp = {
    // "BEGIN_DRAW": function (e) {
    //     //console.log("APPLET_BEGIN_DRAW");
    //     let paths = findMember(applet.literal, "id", [], "listHistorySteps", false);
    //     paths[0].pop();
    //     let propsListHistorySteps = getChainValue(applet.literal, paths[0]);
    //     propsListHistorySteps.dataProvider = app.history.steps;

    //     paths = findMember(applet.literal, "id", [], "componentList", false);
    //     paths[0].pop();
    //     let propsComponentList = getChainValue(applet.literal, paths[0]);
    //     propsComponentList.dataProvider = _cmpList;
    // },

    BEGIN_DRAW: function (e) {
      console.log("APPLET_BEGIN_DRAW");
      let paths = findMember(
        applet.literal,
        "id",
        [],
        "listHistorySteps",
        false
      );
      paths[0].pop();
      let propsListHistorySteps = getChainValue(applet.literal, paths[0]);
      propsListHistorySteps.dataProvider = app.history.steps;

      paths = findMember(applet.literal, "id", [], "componentList", false);
      paths[0].pop();

      let propsComponentList = getChainValue(applet.literal, paths[0]);
      propsComponentList.dataProvider = _cmpList;
    },
    // "END_DRAW": function (e) {
    //     appLoader = app.viewStack.mainContainer.appLoader;
    //     appLoader.hide();

    //     propertyEditorViewStack = app.viewStack.mainContainer.container.rightSideNav.rightSideContainer.propertyEditorViewStack;
    //     propertyEditorContainer = propertyEditorViewStack.propertyEditorContainerWrap.propertyEditorContainer;
    //     propertyEditorContainerTrash = propertyEditorViewStack.propertyEditorContainerWrap.propertyEditorContainerTrash;
    //     fileSelectModal = app.viewStack.mainContainer.container.children.fileSelectModal;
    //     browseFile = fileSelectModal.modalDialog.modalContent.modalBody.browseFile;
    //     componentsContainer = app.viewStack.mainContainer.container.componentsContainer;
    //     middleNav = app.viewStack.mainContainer.nav.middleNav;
    //     rightSideNav = app.viewStack.mainContainer.container.rightSideNav;
    //     listHistorySteps = middleNav.listHistorySteps;
    //     workAreaColumn = app.viewStack.mainContainer.container.workArea.workAreaRow.workAreaColumn;
    //     workAreaRowL2 = workAreaColumn.workAreaCell.workAreaRowL2;
    //     workArea = workAreaRowL2.workAreaColumnL2;
    //     console.log("WA Components",workArea)
    //     title = workArea.title;
    //     pageHeader = workArea.pageHeader;
    //     detail = workArea.detail;
    //     pageFooter = workArea.pageFooter;
    //     summary = workArea.summary;
    //     componentList = componentsContainer.componentList;
    //     sectionList = propertyEditorViewStack.propertyEditorContainerWrap.sectionsList.checkBox;
    //     console.log("SECTIONS33333333333333333333333333333",sectionList);

    //     applet.addBehaviors(applet.view, {
    //         "idChanged": {
    //             "UPDATE_BEHAVIOR_BINDINGS": {
    //                 onPropagation: true
    //             }
    //         }
    //     }, false);

    //     // applet.addBehaviors(componentList, {
    //     //     "rowAdd": "PREPARE_CMP",
    //     // }, false);

    //     applet.addBehaviors(
    //         componentList,
    //         {
    //           rowAdd: "PREPARE_CMP",
    //         },
    //         false
    //       );

    //     applet.addBehaviors(propertyEditorContainer, vspewbehaviors, false);
    //     applet.addBehaviors(propertyEditorContainerTrash, vspewbehaviors, false);

    //     cmpSearchTextInput = app.viewStack.mainContainer.container.componentsContainer.container.cmpSearchTextInput;
    //     applet.addBehaviors(cmpSearchTextInput, {
    //         "keyup": "SEARCH_CMP",
    //     }, false);

    //     undoButton = middleNav.undoButton;
    //     applet.addBehaviors(undoButton, {
    //         "click": "WA_UNDO",
    //     }, false);
    //     redoButton = middleNav.redoButton;
    //     applet.addBehaviors(redoButton, {
    //         "click": "WA_REDO",
    //     }, false);
    //     cmpTrash = app.viewStack.mainContainer.container.rightSideNav.rightSideContainer.propertyEditorViewStack.cmpTrash;
    //     applet.addBehaviors(cmpTrash, daBehaviors, false);

    //     toggleSideNavLeft = app.viewStack.mainContainer.nav.leftNav.toggleSideNavLeft;
    //     applet.addBehaviors(toggleSideNavLeft, {
    //         "click": "TOGGLE_VISIBILITY_LEFT",
    //     }, false);
    //     toggleSideNavRight = app.viewStack.mainContainer.nav.rightNav.toggleSideNavRight;
    //     applet.addBehaviors(toggleSideNavRight, {
    //         "click": "TOGGLE_VISIBILITY_RIGHT",
    //     }, false);

    //     splitHorizontal = middleNav.splitHorizontal;
    //     applet.addBehaviors(splitHorizontal, {
    //         "click": "SPLIT_HOR",
    //     }, false);

    //     splitVertical = middleNav.splitVertical;
    //     applet.addBehaviors(splitVertical, {
    //         "click": "SPLIT_VERT",
    //     }, false);

    //     uploadIcon = middleNav.uploadIcon;
    //     applet.addBehaviors(uploadIcon, {
    //         "click": "OPEN_MODAL_FORM_FOR_SAVE"
    //     }, false);

    //     openUploadForms = middleNav.openUploadForms;
    //     applet.addBehaviors(openUploadForms, {
    //         "click": "OPEN_MODAL_FORMS"
    //     }, false);

    //     desktopPreview = middleNav.desktop;
    //     applet.addBehaviors(desktopPreview, {
    //         "click": "DESKTOP_PREVIEW"
    //     }, false);

    //     saveLayout = middleNav.saveLayout;
    //     applet.addBehaviors(saveLayout, {
    //         "click": "SAVE_LAYOUT",
    //     }, false);
    //     selectBtn = middleNav.selectBtn;
    //     applet.addBehaviors(selectBtn, {
    //         "click": "FILE_SELECT_MODAL",
    //     }, false);

    //     applet.addBehaviors(browseFile, {
    //         "change": "FILE_SELECTED",
    //     }, false);
    //     applet.addBehaviors(listHistorySteps, {
    //         "change": "HISTORY_STEP_DETAILS",
    //     }, false);

    //     //app.behaviors["previewBtn"]["click"] = "PREVIEW";
    //     //applet.addBehaviors(workArea, cmpWaBehaviors, false);
    //     applet.addBehaviors(title, cmpWaBehaviors, false);
    //     applet.addBehaviors(pageHeader, cmpWaBehaviors, false);
    //     applet.addBehaviors(detail, cmpWaBehaviors, false);
    //     applet.addBehaviors(pageFooter, cmpWaBehaviors, false);
    //     applet.addBehaviors(summary, cmpWaBehaviors, false);
    //     applet.addBehaviors(sectionList,sectionListBehaviors,false);

    //     applet.addBehaviors(app, {
    //         "loadLayout": "LOAD_LAYOUT",
    //         "loadHtml": "LOAD_HTML",
    //         "keydown": {
    //             "WA_UNDO": {
    //                 filter: KeyboardUtils.test["CTR+Z"],
    //                 onPropagation: true
    //             },
    //             "WA_REDO": {
    //                 filter: KeyboardUtils.test["CTR+Y"],
    //                 onPropagation: true
    //             },
    //             "DELETE_CMP": {
    //                 filter: KeyboardUtils.test["DEL"],
    //                 onPropagation: true
    //             }
    //         }
    //     }, false);
    // },

    END_DRAW: function (e) {
      appLoader = app.viewStack.mainContainer.appLoader;
      appLoader.hide();

      propertyEditorViewStack =
        app.viewStack.mainContainer.container.rightSideNav.rightSideContainer
          .propertyEditorViewStack;
      propertyEditorContainer =
        propertyEditorViewStack.propertyEditorContainerWrap
          .propertyEditorContainer;
      fileSelectModal =
        app.viewStack.mainContainer.container.children.fileSelectModal;
      dbModal = app.viewStack.mainContainer.container.children.dbModal;
      saveReportModal = app.viewStack.mainContainer.container.children.saveReportModal;
      createNewReportModal = app.viewStack.mainContainer.container.children.createNewReportModal;
      browseFile =
        fileSelectModal.modalDialog.modalContent.modalBody.browseFile;
      componentsContainer =
        app.viewStack.mainContainer.container.componentsContainer;
      middleNav = app.viewStack.mainContainer.nav.middleNav;
      rightSideNav = app.viewStack.mainContainer.container.rightSideNav;
      listHistorySteps = middleNav.listHistorySteps;
      workAreaColumn =
        app.viewStack.mainContainer.container.workArea.workAreaRow
          .workAreaColumn;
      workAreaRowL2 = workAreaColumn.workAreaCell.workAreaRowL2;
      workArea = workAreaRowL2.workAreaColumnL2;
      console.log("WA Components", workArea);
      title = workArea.title;
      pageHeader = workArea.pageHeader;
      detail = workArea.detail;
      pageFooter = workArea.pageFooter;
      summary = workArea.summary;
      //save unedited workArea
      workAreaUE = JSON.stringify(workArea);
      componentList = componentsContainer.componentList;
      sectionList = propertyEditorViewStack.propertyEditorContainerWrap.sectionsList.checkBox;

      applet.addBehaviors(
        applet.view,
        {
          idChanged: {
            UPDATE_BEHAVIOR_BINDINGS: {
              onPropagation: true,
            },
          },
        },
        false
      );

      applet.addBehaviors(
        componentList,
        {
          rowAdd: "PREPARE_CMP",
        },
        false
      );

      let len = componentList.rowItems.length;
      for (let i = 0; i < len; i++) {
        let currentRow = componentList.rowItems[i];
        applet.addBehaviors(
          currentRow.component,
          {
            dragstart: "INITIAL_DRAGSTART",
          },
          false
        );
      }

      applet.addBehaviors(propertyEditorContainer, vspewbehaviors, false);

      cmpSearchTextInput =
        app.viewStack.mainContainer.container.componentsContainer.container
          .cmpSearchTextInput;
      applet.addBehaviors(
        cmpSearchTextInput,
        {
          keyup: "SEARCH_CMP",
        },
        false
      );

      undoButton = middleNav.undoButton;
      applet.addBehaviors(
        undoButton,
        {
          click: "WA_UNDO",
        },
        false
      );
      redoButton = middleNav.redoButton;
      applet.addBehaviors(
        redoButton,
        {
          click: "WA_REDO",
        },
        false
      );

      // duplicateButton = middleNav.duplicateButton;
      // applet.addBehaviors(duplicateButton, {
      //   click: "DUPLICATE_CMP",
      // });

      cmpTrash =
        app.viewStack.mainContainer.container.rightSideNav.rightSideContainer
          .propertyEditorViewStack.cmpTrash;
      applet.addBehaviors(cmpTrash, daBehaviors, false);

      uploadIcon = middleNav.uploadIcon;
      applet.addBehaviors(
        uploadIcon,
        {
          click: "OPEN_MODAL_REPORT_FOR_SAVE",
        },
        false
      );

      createNewReport = middleNav.createNewReport;
      applet.addBehaviors(
        createNewReport,
        {
          click: "OPEN_MODAL_CREATE_NEW_REPORT",
        },
        false
      );

      openUploadReports = middleNav.openUploadReports;
      applet.addBehaviors(
        openUploadReports,
        {
          click: "OPEN_UPLOAD_REPORT_MODAL",
        },
        false
      );

      openDatabase = middleNav.openDatabase;
      applet.addBehaviors(
        openDatabase,
        {
          click: "OPEN_MODAL_DB",
        },
        false
      );

      openUploadReportVersion = middleNav.openUploadReportVersion;
      applet.addBehaviors( openUploadReportVersion, { click: "OPEN_UPLOAD_VERSION_MODAL", }, false );

      desktopPreview = middleNav.desktop;
      applet.addBehaviors(
        desktopPreview,
        {
          click: "DESKTOP_PREVIEW",
        },
        false
      );

      saveLayout = middleNav.saveLayout;
      applet.addBehaviors(
        saveLayout,
        {
          click: "SAVE_LAYOUT",
        },
        false
      );
      selectBtn = middleNav.selectBtn;
      applet.addBehaviors(
        selectBtn,
        {
          click: "FILE_SELECT_MODAL",
        },
        false
      );

      applet.addBehaviors(
        browseFile,
        {
          change: "FILE_SELECTED",
        },
        false
      );
      applet.addBehaviors(
        listHistorySteps,
        {
          change: "HISTORY_STEP_DETAILS",
        },
        false
      );

      // applet.addBehaviors(
      //   removeSearchText,
      //   {
      //     click: {
      //       REMOVE_SEARCH_TEXT: {
      //         onPropagation: true,
      //       },
      //     },
      //   },
      //   true
      // );

      //app.behaviors["previewBtn"]["click"] = "PREVIEW";
      //applet.addBehaviors(workArea, cmpWaBehaviors, false);
      //applet.addBehaviors(footer, cmpWaBehaviors, false);
      applet.addBehaviors(title, cmpWaBehaviors, false);
      applet.addBehaviors(pageHeader, cmpWaBehaviors, false);
      applet.addBehaviors(detail, cmpWaBehaviors, false);
      applet.addBehaviors(pageFooter, cmpWaBehaviors, false);
      applet.addBehaviors(summary, cmpWaBehaviors, false);
      applet.addBehaviors(sectionList, sectionListBehaviors, false);

      applet.addBehaviors(
        app,
        {
          loadLayout: "LOAD_LAYOUT",
          loadHtml: "LOAD_HTML",
          keydown: {
            WA_UNDO: {
              filter: KeyboardUtils.test["CTR+Z"],
              onPropagation: true,
            },
            WA_REDO: {
              filter: KeyboardUtils.test["CTR+Y"],
              onPropagation: true,
            },
            DELETE_CMP: {
              filter: KeyboardUtils.test["DEL"],
              onPropagation: true,
            },
          },
        },
        false
      );
    },

    AFTER_ATTACH: e => {
      leftPanelWidth =
        app.viewStack.mainContainer.container.workArea.$el.offset().left + 15;
    },
    // "UPDATE_BEHAVIOR_BINDINGS": {
    //     do: function (e) {
    //         console.log("UPDATE_BEHAVIOR_BINDINGS");
    //         app.behaviors[e.newValue] = app.behaviors[e.oldValue];
    //         delete app.behaviors[e.oldValue];
    //     }
    //     /**
    //      * catch events thrown by children
    //     */
    // },
    // "ALLOW_DROP": function (e) {
    //     console.log("ALLOW_DROP ", this.domID);
    //     e.preventDefault();
    // },
    // "WA_PREVENT_DRAGSTART": {
    //     description: "Prevent drag start ",
    //     do: function (e) {
    //         console.log('WA_PREVENT_DRAGSTART');
    //         e.preventDefault();
    //     }
    // },
    // "TOGGLE_BIN": function (e) {
    //     console.log("SHOW_BIN : ", propertyEditorViewStack.selectedIndex);
    //     propertyEditorViewStack.selectedIndex = propertyEditorViewStack.selectedIndex == 0 ? 1 : 0;
    //     e.preventDefault();
    //     e.stopPropagation();
    // },

    UPDATE_BEHAVIOR_BINDINGS: {
      do: function (e) {
        console.log("UPDATE_BEHAVIOR_BINDINGS");
        app.behaviors[e.newValueDomId] = app.behaviors[e.oldValueDomId];
        delete app.behaviors[e.oldValueDomId];
      },
      /**
       * catch events thrown by children
       */
    },
    ALLOW_DROP: function (e) {
      console.log("ALLOW_DROP ", this.domID);
      e.preventDefault();
    },
    WA_PREVENT_DRAGSTART: {
      description: "Prevent drag start ",
      do: function (e) {
        console.log("WA_PREVENT_DRAGSTART");
        e.preventDefault();
      },
    },
    TOGGLE_BIN: function (e) {
      console.log("SHOW_BIN : ", propertyEditorViewStack.selectedIndex);
      propertyEditorViewStack.selectedIndex =
        propertyEditorViewStack.selectedIndex == 0 ? 1 : 0;
      e.preventDefault();
      e.stopPropagation();
    },
    ADD_COMPONENT: {
      description: "Add component ",
      do: function (e) {
        if (!formField) {
          formField = data.components["FormField"].literal;
        }
        e.preventDefault();
        // let workArea = Component.instances[e.target.id];
        let targetBand = Component.instances[e.target.id];
        let domID = e.originalEvent.dataTransfer.getData("domID");
        let ctor = e.originalEvent.dataTransfer.getData("ctor");
        let move = e.originalEvent.dataTransfer.getData("move");
        let componentWithData = e.originalEvent.dataTransfer.getData("componentWithData");
        let newComponentValue = e.originalEvent.dataTransfer.getData("fieldName");
        let inst;

        //Activate the band
        if (
          activeContainer &&
          activeContainer != targetBand &&
          activeContainer.classes.indexOf("active-container") > -1
        ) {
          let classes = activeContainer.classes.slice(0);
          let ind = classes.indexOf("active-container");
          if (ind > -1) {
            classes.splice(ind, 1);
          }
          activeContainer.classes = classes;
        }
        let classes = targetBand.classes.slice(0);
        classes.pushUnique("active-container");
        targetBand.classes = classes;
        activeContainer = targetBand;
        let ret = {
          track: false,
        };
        if (move == "") {
          console.log("ADD_COMPONENT_ " + domID);
          let lit = data.components[ctor].literal;
          if(ctor !== 'JRImage') {
            if (
              noNeedFF.indexOf(ctor) == -1 &&
              (targetBand.ctor == "Form" ||
                objectHierarchyGetMatching(
                  targetBand,
                  "ctor",
                  "Form",
                  "parent",
                  1
                )["match"] != null)
            ) {
              let ff = extend(true, formField);
              ff.props.component = lit;
              lit = ff;
            }
            lit = extend(true, lit);
            lit.props.afterAttach = function (e) {
              let evt = new jQuery.Event("dropped");
              this.trigger(evt);
            };
            lit.props.draggable = true;
  
            inst = targetBand.addComponent(lit);
            
            //change id generation for report components
            Builder.selectedReport.component_count =
              parseInt(Builder.selectedReport.component_count) + 1;
            inst.id = inst.ctor + '_' + Builder.selectedReport.component_count

            
            let classes = inst.classes.slice(0);
            classes.pushUnique("selected-component");
            inst.classes = classes;
            
            //jsEditorModal
            if(inst.ctor === 'JRTextInput') 
              applet.addBehaviors(inst, { dblclick: "OPEN_JSEDITOR_MODAL" }, false);

            applet.addBehaviors(inst, cmpWaBehaviors, false);
            //remove resize from jrlabel
            // if (typeof inst.children != "undefined") {
            //   if (typeof inst.children.jr_resizer != "undefined") {
            //     applet.addBehaviors(
            //       inst.children.jr_resizer,
            //       cmpResizeBehaviors,
            //       false
            //     );
            //   }
            // }
  
            let isCont = isContainer.call(inst);
            if (isCont) {
              inst.attr.isNotWa = true;
            }
            inst.attr.isCmp = true;
            inst.section = targetBand.id;
  
            // inst.$el[0].style.left = "0px";
            // inst.$el[0].style.top = "0px";
            inst.x = "0";
            inst.y = "0";
  
            inst.css.width = "100px";
            inst.css.height = "30px";
            inst.width = "100";
            inst.height = "30";
  
            //put a value to new added items with data
            if (componentWithData !== "undefined") {
              inst.value = newComponentValue;
              inst.componentWithData = true
            }
  
            ret.child = lit;
            ret.parent = targetBand;
            ret.container = targetBand;
            ret.track = true;
  
            return ret;
          } else {
            app.appletsMap["imageModal"].init()
          }
        } else {
          inst = Component.instances[domID];
          var instParentID = inst.$el[0].parentElement.id.substring(
            0,
            inst.$el[0].parentElement.id.indexOf("_")
          );
          inst.section = targetBand.id;
          if (instParentID != activeContainer.id) {
            inst.$el.appendTo(activeContainer.$el[0]);
            inst.parent = activeContainer;
            // inst.$el[0].style.left = 420 +'px';
            // inst.$el[0].style.top = 70 + 'px';
          } else {
            var offset = event.dataTransfer.getData("text/plain").split(",");
            var x_drag = event.clientX + parseInt(offset[0], 10);
            var y_drag = event.clientY + parseInt(offset[1], 10);
            // inst.$el[0].style.left = x_drag + "px";
            // inst.$el[0].style.top = y_drag + "px";
            inst.x = x_drag;
            inst.y = y_drag;

            if (inst.ctor != "JRBand") {
              if (
                activeComponent &&
                activeComponent != inst &&
                ((isObject(activeComponent.classes) &&
                  activeComponent.classes["self"].indexOf(
                    "selected-component"
                  )) ||
                  activeComponent.classes.indexOf("selected-component") > -1)
              ) {
                let classes = isObject(activeComponent.classes)
                  ? activeComponent.classes["self"].slice(0)
                  : activeComponent.classes.slice(0);
                let ind = classes.indexOf("selected-component");
                if (ind > -1) classes.splice(ind, 1);
                classes.pushUnique("default-component");
                if (isObject(activeComponent.classes))
                  activeComponent.classes["self"] = classes;
                else activeComponent.classes = classes;
              }
              let classes = isObject(inst.classes)
                ? inst.classes["self"].slice(0)
                : inst.classes.slice(0);
              classes.pushUnique("selected-component");
              if (isObject(inst.classes)) inst.classes["self"] = classes;
              else inst.classes = classes;
            }

            activeComponent = inst;
            let oeLit = {
              ctor: ObjectEditor,
              props: {
                id: "objectEditor",
                instance: inst,
                field: "props",
              },
            };
            propertyEditorContainer.removeAllChildren();
            propertyEditorContainer.components = [oeLit];
            changeFieldProperties(e, inst);
          }
        }
      },
      undo: function () {},
      stopPropagation: true,
    },
    SELECT_COMPONENT: {
      description: "Select Component",
      do: function (e) {
        //console.log("SELECT_COMPONENT " + this.id);
        if (this.ctor != "JRBand") {
          if (
            activeComponent &&
            activeComponent != this &&
            ((isObject(activeComponent.classes) &&
              activeComponent.classes["self"].indexOf("selected-component")) ||
              activeComponent.classes.indexOf("selected-component") > -1)
          ) {
            let classes = isObject(activeComponent.classes)
              ? activeComponent.classes["self"].slice(0)
              : activeComponent.classes.slice(0);
            let ind = classes.indexOf("selected-component");
            if (ind > -1) classes.splice(ind, 1);
            classes.pushUnique("default-component");
            if (isObject(activeComponent.classes))
              activeComponent.classes["self"] = classes;
            else activeComponent.classes = classes;
          }
          let classes = isObject(this.classes)
            ? this.classes["self"].slice(0)
            : this.classes.slice(0);
          classes.pushUnique("selected-component");
          
          //add class to element to show guide lines, remove it from all other elements
          classes.pushUnique("last-selected");
          $(".default-component, .selected-component").not(this.$el).removeClass("last-selected")
          
          if (isObject(this.classes)) this.classes["self"] = classes;
          else this.classes = classes;
        }

        changeFieldProperties(e, this);
      },
      stopPropagation: true,
    },

    DRAGSTART_COMPONENT: {
      description: "Drag Component",
      do: function (e) {
        console.log("I keep on moving...");
        console.log("DRAGSTART_COMPONENT", this.domID);

        var style = window.getComputedStyle(event.target, null);
        e.originalEvent.dataTransfer.setData("domID", this.domID);
        e.originalEvent.dataTransfer.setData("ctor", this.ctor);
        //let $elem = app.viewStack.mainContainer.dragImage.$el[0];
        // e.originalEvent.dataTransfer.setDragImage($elem, 0, 0);
        e.originalEvent.dataTransfer.setData("move", 1);
        e.originalEvent.dataTransfer.setData(
          "text/plain",
          parseInt(style.getPropertyValue("left"), 10) -
            event.clientX +
            "," +
            (parseInt(style.getPropertyValue("top"), 10) - event.clientY)
        );

        //set not-selected elements' guide lines positions
        guides = $.map($(".default-component, .selected-component").not(".last-selected"), computeGuidesForElement);
        innerOffsetX = e.originalEvent.offsetX;
        innerOffsetY = e.originalEvent.offsetY;
      },
    },

    DRAG_COMPONENT: e => {
      // iterate all guides, remember the closest h and v guides
      chosenGuides = { top: { dist: MIN_DISTANCE + 1 }, left: { dist: MIN_DISTANCE + 1 } };
      let $t = $(".last-selected");
      pos = { 
        top: (e.originalEvent.pageY - 50) - innerOffsetY, 
        left: (e.originalEvent.pageX - leftPanelWidth) - innerOffsetX 
      };
      let w = $t.outerWidth() - 1;
      let h = $t.outerHeight() - 1;
      let elemGuides = computeGuidesForElement(null, pos, w, h);

      $.each(guides, (i, guide) => {
        $.each(elemGuides, (i, elemGuide) => {
          if (guide.type == elemGuide.type) {
            let prop = guide.type == "h" ? "top" : "left";
            let d = Math.abs(elemGuide[prop] - guide[prop]);
            if (d < chosenGuides[prop].dist) {
              chosenGuides[prop].dist = d;
              chosenGuides[prop].offset = elemGuide[prop] - pos[prop];
              chosenGuides[prop].guide = guide;
            }
          }
        });
      });

      //show guide lines
      if (chosenGuides.top.dist <= MIN_DISTANCE)
        $("label[id*='guide-h']").css("top", chosenGuides.top.guide.top + 50).show();
      else $("label[id*='guide-h']").hide();

      if (chosenGuides.left.dist <= MIN_DISTANCE)
        $("label[id*='guide-v']").css("left", chosenGuides.left.guide.left + leftPanelWidth).show();
      else $("label[id*='guide-v']").hide();
    },

    DRAGEND_COMPONENT: e => {
      let val;

      //pull element to closest component
      if (chosenGuides.top.dist <= MIN_DISTANCE) {
        val = (chosenGuides.top.guide.top - chosenGuides.top.offset) % 200;
        e.target.style.top = val + 'px';
      } else {
        val = pos.top < 0 ? 0 : pos.top % 200;
        e.target.style.top = val + 'px';
      }

      if (chosenGuides.left.dist <= MIN_DISTANCE) {
        val = chosenGuides.left.guide.left - chosenGuides.left.offset
        e.target.style.left = val + 'px'; 
      } else {
        val = pos.left < 0 ? 0 : pos.left;
        e.target.style.left = val + 'px';
      }

      //remove guide lines
      setTimeout(() => $("label[id*='guide-h'], label[id*='guide-v']").hide(), 1000)
    },

    HISTORY_STEP_DETAILS: function (e) {
      console.log("called HISTORY_STEP_DETAILS.");
    },
    FILE_SELECT_MODAL: function (e) {
      console.log("called FILE_SELECT_MODAL.");
      fileSelectModal.show();
    },

    OPEN_MODAL_DB: e => app.appletsMap["dbModal"].init(),

    OPEN_MODAL_REPORT_FOR_SAVE: e => {
      app.appletsMap["saveReportModal"].init().then(() => {
        data.selectedReport.report_literal = workAreaColumn.literal;
        data.workArea = workArea;
        data.workAreaRowL2lit = workAreaRowL2.literal;
        applet.addBehaviors(app.appletsMap["saveReportModal"].view, {
          loadLayout: "LOAD_LAYOUT_AFTER_SAVE",
        });
      });
    },

    OPEN_MODAL_CREATE_NEW_REPORT: e => {
      app.appletsMap["createNewReportModal"].init().then(() => {
        applet.addBehaviors(app.appletsMap["createNewReportModal"].view, {
          loadLayout: "LOAD_LAYOUT_NEW_REPORT"
        })
      })
    },

    OPEN_UPLOAD_REPORT_MODAL: e => {
      app.appletsMap["uploadReportModal"].init().then(() => {
        applet.addBehaviors(app.appletsMap["uploadReportModal"].view, {
          loadLayout: "LOAD_LAYOUT_UPLOAD_REPORT"
        })
      })
    },
    
    OPEN_UPLOAD_VERSION_MODAL: e => {
      let myApplet = app.appletsMap["uploadVersionModal"] 
      let passDp = () => {
        //kaloji dataproviderin datagrides
        if (!data.dataGridVersions)
          data.dataGridVersions = new ArrayEx([{ revision_name: "...", system_date: "..." }]);
        
        let dg = myApplet.view.modalDialog.modalContent.modalBody.dataGridVersions;
        dg.dataProvider.splicea(0, dg.dataProvider.length, data.dataGridVersions);
        applet.addBehaviors(myApplet.view, { loadLayoutVersion: "LOAD_LAYOUT_UPLOAD_VERSION" })
      }

      if (myApplet.view) {
        myApplet.view.show();
        passDp();
      }
      else myApplet.init().then(() => passDp())
    },

    OPEN_JSEDITOR_MODAL: e => {
      let myApplet = app.appletsMap["jsEditorModal"]
      editorItemId = 
        reverseString(
          reverseString(e.target.id)
          .slice(reverseString(e.target.id).indexOf('_') + 1, e.target.id.length)
        )
      let passData = () => {
        data.workAreaEditorEl = workAreaRowL2.find(editorItemId);
        applet.addBehaviors(
          myApplet.view, 
          { addCodeToComponent: "ADD_CODE_TO_COMPONENT" }
        )
      }

      if (myApplet.view) {
        myApplet.view.show();
        passData();
      }
      else myApplet.init().then(() => passData())
    },
      
    FILE_SELECTED: function (e) {
      console.log("called FILE_SELECTED.");
      if (browseFile.value.length > 0) {
        readFile(browseFile.value[0])
          .then(function (resp) {
            fileSelectModal.hide();
            let evt;
            if (browseFile.value[0].type === "text/html") {
              evt = new jQuery.Event("loadHtml");
              evt.content = resp.content;
            } else if (browseFile.value[0].type === "text/plain") {
              evt = new jQuery.Event("loadLayout");
              evt.content = JSON.parse(resp.content);
            }
            app.trigger(evt);
          })
          .catch(function (resp) {
            alert(resp.description);
          });
      }
    },
    PREPARE_CMP: function (e, r, ra) {
      if (ra) {
        applet.addBehaviors(
          ra.currentRow.component,
          {
            dragstart: "INITIAL_DRAGSTART",
          },
          false
        );
      }

      console.log("PREPARE_CMP");
    },
    INITIAL_DRAGSTART: function (e, ra) {
      console.log(arguments);
      e.originalEvent.dataTransfer.setData("domID", e.target.id);
      e.originalEvent.dataTransfer.setData("ctor", ra.currentItem.ctor);
      e.originalEvent.dataTransfer.setData("componentWithData", ra.currentItem.componentWithData);
      e.originalEvent.dataTransfer.setData("fieldName", ra.currentItem.fieldName);
      let $elem = app.viewStack.mainContainer.dragImage.$el[0];
      e.originalEvent.dataTransfer.setDragImage($elem, 0, 0);
    },

    // SEARCH_CMP: function (e) { // filter components
    //     console.log("search box change");
    //     let value = e.target.value.toLowerCase();
    //     _cmpList.undoAll();
    //     if (value.length > 0) {
    //         _cmpList.filter(function (el) {
    //             let regEx = new RegExp(`${value}`, "gi");
    //             return el.label.toLowerCase().match(regEx);
    //         });
    //     }
    // },

    SEARCH_CMP: function (e) {
      // filter components
      console.log("search box change");
      let value = e.target.value.toLowerCase();
      if (value.length > 0) {
        this.parent.button.css.display = "none";
        this.parent.buttonDel.css.display = "block";
        //this.parent.buttonDel.css.padding = 0;
      } else {
        this.parent.button.css.display = "block";
        this.parent.button.css.top = 0;
        this.parent.buttonDel.css.display = "none";
      }
      _cmpList.undoAll();
      if (value.length > 0) {
        let regEx = new RegExp(`${value}`, "gi");
        _cmpList.filter((el) => el.label.toLowerCase().match(regEx));
        // _cmpList.filter(function (el) {
        //     let regEx = new RegExp(`${value}`, "gi");
        //     return el.label.toLowerCase().match(regEx);
        // });
      }
    },

    REMOVE_SEARCH_TEXT: function (e) {
      console.log("object");
    },

    LOAD_HTML: function (e) {
      let body = BrowserUtils.body(e.content);
      body = BrowserUtils.removeScripts(body);
      let dn = $("<div/>").append(body);
      let s = new Scrap();
      let lit = s.visit(dn);
      let evt = new jQuery.Event("loadLayout");
      evt.content = lit;
      app.trigger(evt);
    },

    // "LOAD_LAYOUT": function (e) {
    //     let _cmp = e.content;
    //     let res = objectHierarchyGetMatchingMember(_cmp, "props.id", "workArea", "props.components");
    //     if (res.match) {
    //         _cmp = res.match;
    //     }
    //     workArea.removeAllChildren(0);
    //     for (let i = 0; i < _cmp.props.components.length; i++)
    //     {
    //         let inst = workArea.addComponent(_cmp.props.components[i]);
    //         let was = objectHierarchyGetMatchingMember(inst, "attr.isWa", true, "children", true);
    //         for (let wi = 0; wi < was.length; wi++)
    //         {
    //             applet.addBehaviors(was[wi].match, cmpWaBehaviors, false);
    //         }
    //         let cmps = objectHierarchyGetMatchingMember(inst, "attr.isCmp", true, "children", true);
    //         for (let ci = 0; ci < cmps.length; ci++)
    //         {
    //             applet.addBehaviors(cmps[ci].match, cmpBehaviors, false);
    //         }
    //     }
    // },
    //  "LOAD_LAYOUT": function (e) {
    //     let _cmp = e.content;
    //     let res = objectHierarchyGetMatchingMember(_cmp, "props.id", "workAreaRowL2", "props.components");
    //     if (res.match) {
    //         _cmp = res.match;
    //     }
    //     workAreaRowL2.removeAllChildren(0);
    //     for (let i = 0; i < _cmp.props.components.length; i++) {
    //         let inst = workAreaRowL2.addComponent(_cmp.props.components[i]);
    //         applet.addBehaviors(inst, cmpWaBehaviors, true);
    //     }
    // },
    LOAD_LAYOUT: function (e) {
      let _cmp = e.content;
      let res = ArrayUtils.objectHierarchyGetMatchingMember(
        _cmp,
        "props.id",
        "workAreaRowL2",
        "props.components"
      );
      if (res.match) {
        _cmp = res.match;
      }
      workAreaRowL2.removeAllChildren(0);
      for (let i = 0; i < _cmp.props.components.length; i++) {
        let inst = workAreaRowL2.addComponent(_cmp.props.components[i]);
        applet.addBehaviors(inst, cmpWaBehaviors, true);
      }
    },

    LOAD_LAYOUT_AFTER_SAVE: e => loadLayout('afterSave'),

    LOAD_LAYOUT_NEW_REPORT: e => loadLayout('newReport'),

    LOAD_LAYOUT_UPLOAD_REPORT: e => loadLayout('uploadReport', e.content),

    LOAD_LAYOUT_UPLOAD_VERSION: e => loadLayout('uploadVersion', e.content),
    
    ADD_CODE_TO_COMPONENT: e => {
      workAreaRowL2.find(editorItemId).editorCode = e.content;
      workAreaRowL2.find(editorItemId).value = e.content;
    },

    HISTORY_STEP_ADDED: function (e) {
      console.log("called HISTORY_STEP_ADDED.", e.current);
      listHistorySteps.value = e.current;
    },

    HISTORY_UNDONE: function (e) {
      console.log("called HISTORY_UNDONE.");
      listHistorySteps.value = e.previous;
    },

    HISTORY_REDONE: function (e) {
      console.log("called HISTORY_REDONE.");
      listHistorySteps.value = e.redone;
    },

    // "DELETE_CMP": {
    //     do: function (e) {
    //         console.log('delete component', this.id);
    //         let domID;
    //         e.preventDefault();
    //         //if is pressed delete
    //         if (activeComponent) {
    //             if (e.keyCode == 46) {
    //                 //domId of element who should delete
    //                 domID = activeComponent.domID;
    //             } else {
    //                 //if drop to delete area
    //                 domID = e.originalEvent.dataTransfer.getData("domID");
    //             }
    //             let inst = Component.instances[domID];
    //             let c = confirm("Do you want to delete " + inst.id.toUpperCase() + "?");
    //             if (c) {

    //                 inst.parent.removeChild(inst, 2);
    //                 let oeLit = {
    //                     ctor: ObjectEditor,
    //                     "props": {
    //                         id: "objectEditor",
    //                         instance: data.selectedForm,
    //                         field: "props"
    //                     }
    //                 };
    //                 propertyEditorContainer.components = [oeLit];
    //             }
    //             activeComponent = null;
    //         } else {
    //             alert("Please select component you want to delete.");
    //         }
    //     },
    //     undo: function () {
    //         //undo
    //     }
    // },
    DELETE_CMP: {
      do: function (e) {
        console.log("delete component", this.id);
        let domID;
        e.preventDefault();
        //if is pressed delete
        if (activeComponent) {
          if (e.keyCode == 46) {
            //domId of element who should delete
            domID = activeComponent.domID;
          } else {
            //if drop to delete area
            domID = e.originalEvent.dataTransfer.getData("domID");
          }
          let inst = Component.instances[domID];

          let c = confirm(
            "Do you want to delete " + inst.id.toUpperCase() + "?"
          );
          if (c) {
            inst.parent.removeChild(inst, 2);
            propertyEditorContainer.components = [];
          }
          activeComponent = null;
        } else {
          alert("Please select component you want to delete.");
        }
      },
      undo: function () {
        //undo
      },
    },

    BECOME_ACTIVE: {
      do: function (e) {
        console.log("Container Became active");
        if (
          activeContainer &&
          activeContainer != this &&
          activeContainer.classes.indexOf("active-container") > -1
        ) {
          let classes = activeContainer.classes.slice(0);
          let ind = classes.indexOf("active-container");
          if (ind > -1) {
            classes.splice(ind, 1);
          }
          activeContainer.classes = classes;
        }
        let classes = this.classes.slice(0);
        classes.pushUnique("active-container");
        this.classes = classes;
        activeContainer = this;
        if (this.id == "title" || this.id == "detail" || this.id == "summary") {
          //Builder.metaProps.form_name.props.change(data.selectedForm, this);
          // let oeLit = {
          //     ctor: ObjectEditor,
          //     "props": {
          //         id: "objectEditor",
          //         instance: data.selectedForm,
          //         field: "props"
          //     }
          // };
          propertyEditorContainer.components = [];
        }
      },
      stopPropagation: true,
    },

    WA_HOVER: {
      do: function (e) {
        console.log("Container hovered " + this.id);
        //this will hold the instance of the component who manifested this behavior (the manifestor)
        let classes = this.classes.slice(0);
        // classes.toggle("hovered");
        this.classes = classes;
      },
      stopPropagation: true,
    },

    IS_WA_RESIZE_NS: {
      do: function (e) {
        console.log("Container Resize NS");
      },
      stopPropagation: true,
    },

    WA_RESIZE: {
      do: function (e) {
        console.log("Resize Event", e);
        let retFromRedoMaybe = arguments[arguments.length - 1];
        if (retFromRedoMaybe.container) {
          console.log("called WA_RESIZE from History(REDO).");
        } else console.log("WA_RESIZE");
        let ret = {
          track: false,
        };

        let manifestor = this,
          dy = e.dy,
          dx = e.dx;
        containerResize(manifestor, dx, dy);
        ret.description =
          "Container resize" +
          (dx ? " dx:" + dx : "") +
          (dy ? " dy:" + dy : "");
        ret.track = true;
        return ret;
      },
      undo: function (e) {
        console.log("Undo WA_RESIZE ", arguments);
        let manifestor = this,
          dy = e.dy,
          dx = e.dx;
        containerResize(manifestor, -1 * dx, -1 * dy);
      },
      stopPropagation: true,
    },

    WA_REMOVE: {
      description: "Container Removed",
      do: function (e) {
        let retFromRedoMaybe = arguments[arguments.length - 1];
        if (retFromRedoMaybe.container) {
          console.log("called WA_REMOVE from History(REDO).");
        }
        let ret = {
          track: false,
        };
        console.log("Container REMOVE ", arguments);
        let c = true;
        if (this.components.length > 0) {
          c = confirm("Container has children, still want to remove ?");
        }
        if (c) {
          if (this.parent.parent.components.length == 1) {
            if (this.parent.components.length > 2) {
              let row = this.parent;
              row.removeChild(this);
              childrenAutoWidth(row);
              ret.track = true;
              ret.container = row;
              ret.child = this;
              ret.removeType = "COLUMN";
            } else {
            }
            console.log("column ", this.parent.components.length);
            //this.parent.components
          } else {
            if (this.parent.parent.components.length > 2) {
              let container = this.parent.parent;
              container.removeChild(this.parent, 0);
              childrenAutoHeight(container);
              ret.track = true;
              ret.container = container;
              ret.child = this.parent;
              ret.removeType = "ROW";
            } else {
            }
            console.log("row ", this.parent.parent.components.length);
          }
        }
        e.preventDefault();
        return ret;
      },
      undo: function () {
        console.log("Undo WA_REMOVE ", arguments);
        /**
         *  Params that we get here:
         *  p.event original parameters of the event that caused this behavior
         *  p.filterReturn optional: return value of filter function
         *  p.behaviorReturn return value of the behavior implementation function
         * */
        /**
         * what if every component generates its undo action for every action called on its instance
         */
        /**
                 * ret.container = container;
                         ret.child = this.parent; */
        let ret = arguments[arguments.length - 1];
        ret.container.addChild(ret.child);
        if (ret.removeType == "COLUMN") {
          childrenAutoWidth(ret.container);
        } else {
          childrenAutoHeight(ret.container);
        }
      },
      stopPropagation: true,
    },

    PREVIEW: {
      do: function (e) {
        let lit = workAreaColumn.literal;
        stripHandle(lit);
        let jsonLayout = JSON.stringify(lit, null, "\t");
        download("workAreaColumn.json.txt", jsonLayout);
      },
      stopPropagation: true,
    },

    DESKTOP_PREVIEW: {
      do: e => {
        let report_name = data.selectedReport.reportName;
        let report_guid = data.selectedReport.report_guid;
        let action = "topdf";
        let source = "pdf";
        let reportFolder = data.selectedReport.repor_folder;
                
        popUpPreviewPdf(
          'pdfpreview.html',
          1024, 768,
          report_name, report_guid, action, source, reportFolder
        );
      },
      stopPropagation: true,
    },

    SAVE_LAYOUT: {
      do: function (e) {
        // let lit = workAreaColumn.literalLite;
        let lit = workAreaRowL2.literal;
        stripHandle(lit);

        var sections = lit.props.components[0].props.components;
        var reportFactory = new ReportFactory();
        
        var xml =
          Builder.dataviewFields ?
            reportFactory.toXml(sections, Builder.dataviewFields[0]) :
            reportFactory.toXml(sections);
        console.log("XML Layout", xml);
        download("targetBand.xml.txt", xml);

        // let jsonLayout = JSON.stringify(lit, null, "\t");
        // console.log("Json Layout", jsonLayout);
        // download("targetBand.json.txt", jsonLayout);
      },
      stopPropagation: true,
    },

    WA_UNDO: {
      do: function (e) {
        console.log("UNDO");
        app.history.undo();
      },
      stopPropagation: false,
    },

    WA_REDO: {
      do: function (e) {
        console.log("REDO");
        app.history.redo();
      },
      stopPropagation: false,
    },

    INITIAL_RESIZE: {
      do: function (e) {
        resizable = true;
      },
      stopPropagation: false,
    },
    CMP_RESIZE: {
      do: function (e) {
        if (containers.indexOf(activeComponent.ctor) == -1) {
          var width_temp =
            e.pageX - activeComponent.$el[0].getBoundingClientRect().left;
          var height_temp =
            e.pageY - activeComponent.$el[0].getBoundingClientRect().top;
          activeComponent.css.width = width_temp + "px";
          activeComponent.css.height = height_temp + "px";

          activeComponent.width = width_temp;
          activeComponent.height = height_temp;
          changeFieldProperties(e, activeComponent);
        }
      },
      stopPropagation: false,
    },

    STOP_RESIZING: {
      do: function (e) {
        resizable = false;
        console.log("Stop Resize");
      },
      stopPropagation: false,
    },
    UPDATE_SECTION_LIST: {
      do: function (e) {
        let inst;
        let currentSection = arguments[2].currentItem;
        var sectionName = currentSection.text;
        var sectionId = currentSection.id;
        var sectionOrder = currentSection.bandOrder;
        if (currentSection.checked == true) {
          workArea.components.forEach(function (item, index) {
            if (item.props.id == sectionId) {
              workArea.removeChildAtIndex(index);
            }
          });
        } else {
          let newSection = {
            ctor: JRBand,
            props: {
              id: sectionId,
              bandOrder: sectionOrder,
              type: "ContainerType.ROW",
              classes: ["band", "border", "col"],
              components: [
                {
                  ctor: "Label",
                  props: {
                    id: sectionId + "Label",
                    label: sectionName,
                    classes: ["bandName"],
                  },
                },
              ],
            },
          };
          workArea.addComponent(newSection);
          let sortedComponents = [...workArea.components.sort(compare)];
          workArea.removeAllChildren(0);
          sortedComponents.forEach(function (item) {
            inst = workArea.addComponent(item);
            applet.addBehaviors(inst, cmpWaBehaviors, false);
          });
        }
      },
    },
  };
  /**
   * Behavior Filters below
   */
  function compare(a, b) {
    const sectionA = a.props.bandOrder;
    const sectionB = b.props.bandOrder;
    let comparison = 0;
    if (sectionA > sectionB) {
      comparison = 1;
    } else if (sectionA < sectionB) {
      comparison = -1;
    }
    return comparison;
  }
  let isContainer = function (e) {
    //console.log("CNT????",this.ctor);
    return containers.indexOf(this.ctor) > -1;
  };
  let isResizable = function (e) {
    return resizable == true;
  };
  let isNotContainer = function (e) {
    return !isContainer.call(this, e);
  };
  let isNotDraggableContainer = function (e) {
    return containers.indexOf(this.ctor) > -1 && this.draggable == false;
  };

  let isDraggable = function (e) {
    return this.draggable == true;
  };

  let changeFieldProperties = function (e, cmp) {
    activeComponent = cmp;
    let oeLit = {
      ctor: ObjectEditor,
      props: {
        id: "objectEditor",
        instance: cmp,
        field: "props",
      },
    };
    propertyEditorContainer.removeAllChildren();
    propertyEditorContainer.components = [oeLit];

    console.log(props, "props changeFieldProperties");
    console.log([oeLit], "[oeLit] changeFieldProperties");
  };
  //filter to determine if mousemove is an "WA_RESIZE_NS" behavior
  let debouncedDragNS;
  let d0;

  let isMouseMoveNS = function (e) {
    if (
      ((e.which && e.which == 1) || (e.buttons && e.buttons == 1)) &&
      (this.parent.parent.components.length >= 2 ||
        this.parent.components.length >= 2)
    ) {
      let manifestor = this;
      let classes = manifestor.classes.slice(0);
      classes = classes.difference(["ns-resize", "ew-resize"]);
      if (d0 && !debouncedDragNS) {
        if (Math.abs(d0.y - e.pageY) > Math.abs(d0.x - e.pageX)) {
          classes.pushUnique("ns-resize");
        } else {
          classes.pushUnique("ew-resize");
        }
        manifestor.classes = classes;
      }
      d0 = {
        x: e.pageX,
        y: e.pageY,
      };

      if (!debouncedDragNS) {
        let p0 = {
          x: e.pageX,
          y: e.pageY,
        };
        console.log("prior of debounced");
        console.log(p0);
        debouncedDragNS = debounce(function (e) {
          console.log("debounced");
          let p1 = {
            x: e.pageX,
            y: e.pageY,
          };
          console.log(p0);
          console.log(p1);
          let dy = p1.y - p0.y;
          let dx = p1.x - p0.x;
          let evt = new jQuery.Event("resize");
          if (dy != 0 && manifestor.parent.components.length >= 2) {
            dy = -dy;
            evt.dy = dy;
          }
          //no need to resize in x direction
          if (dx != 0 && manifestor.parent.components.length >= 2) {
            dx = -dx;
            evt.dx = dx;
          }
          if (dx != 0 || dy != 0) manifestor.trigger(evt);
          console.log("Vertical drag of :", dy, manifestor.$el.height());

          debouncedDragNS = null;

          let classes = manifestor.classes.slice(0);
          classes = classes.difference(["ns-resize", "ew-resize"]);
          //classes.splice(i, 1);
          manifestor.classes = classes;
        }, 500);
      }
      debouncedDragNS(e);
      return true;
      //{qualifies, extraArgs}
      // extraArgs array with additional arguments to be passed to the behavior implementation/do
    } else {
      // let i = this.classes.indexOf("ns-resize")
      // if(i>0){
      let classes = this.classes.slice(0);
      classes = classes.difference(["ns-resize", "ew-resize"]);
      //classes.splice(i, 1);
      this.classes = classes;
      //}
    }
  };

  //behavior can cause another behavior (throws custom event, so we may avoid filter functions...)

  //utility functions

  let childrenAutoWidth = function (container) {
    let children_len = container.components.length;
    let colSpan = Math.floor(12 / children_len);
    let delta = 12 - colSpan * children_len;
    let i = 0;
    for (let childID in container.children) {
      ++i;
      if (i == children_len - 1)
        container.children[childID].spacing.colSpan = colSpan + delta;
      else container.children[childID].spacing.colSpan = colSpan;
    }
  };

  let childrenAutoHeight = function (container) {
    let children_len = container.components.length;
    let height = Math.floor(100 / children_len);
    let delta = 100 - height * children_len;
    let i = 0;
    for (let childID in container.children) {
      ++i;
      if (i == children_len - 1)
        container.children[childID].spacing.h = height + delta;
      else container.children[childID].spacing.h = height;
    }
  };

  let containerResize = function (container, dx, dy) {
    if (
      dy &&
      !isNaN(dy) &&
      dy != 0 &&
      container.parent.components.length >= 2
    ) {
      let mpi = ArrayUtils.indexOfObject(
        container.parent.components,
        "props.id",
        container.parent.id
      );
      if (mpi == container.parent.parent.components.length - 1) {
        dy = -dy;
        --mpi;
      } else ++mpi;

      let ha = container.parent.parent.$el.height();
      let s = dy / Math.abs(dy);
      let ha_rel = Math.floor(Math.abs((dy * 100) / ha)) * s;
      container.parent.spacing.h = container.parent.spacing.h - ha_rel;

      let sibling_id = container.parent.parent.components[mpi].props.id;
      container.parent.parent.children[sibling_id].spacing.h += ha_rel;
    }
    if (
      dx &&
      !isNaN(dx) &&
      dx != 0 &&
      container.parent.components.length >= 2
    ) {
      let mpi = ArrayUtils.indexOfObject(
        container.parent.components,
        "props.id",
        container.id
      );
      if (mpi == container.parent.components.length - 1) {
        dx = -dx;
        --mpi;
      } else ++mpi;
      let wa = container.parent.$el.width();
      let s = dx / Math.abs(dx);
      let wa_rel = Math.floor(Math.abs((dx * 12) / wa)) * s;
      container.spacing.colSpan = container.spacing.colSpan - wa_rel;

      let sibling_id = container.parent.components[mpi].props.id;
      container.parent.children[sibling_id].spacing.colSpan += wa_rel;
    }
  };

  let noNeedClasses = ["selected-component", "default-component"];

  let stripHandle = function (lit) {
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

  let loadLayout = (bhv, content) => {
    let parsedWaLiteral = JSON.parse(workAreaUE).components;

    let _cmp =
      content
      ? content.props.components[0].props.components[0].props.components[0].props.components
      : parsedWaLiteral

    let res =
      objectHierarchyGetMatchingMember(_cmp, "props.id", "workAreaRowL2", "props.components");
    if (res.match) _cmp = res.match;
    workArea.removeAllChildren(0);

    _cmp.forEach((band) => {
      //add band
      let inst = workArea.addComponent(band);
      // add band behavior
      applet.addBehaviors(inst, cmpWaBehaviors, true);
    })

    if (bhv === 'afterSave') data.selectedReport.report_literal = _cmp;
    if (bhv === 'newReport') data.selectedReport = new ReportProperties();
  };

  let computeGuidesForElement = (elem, pos, w, h) => {
    if (elem != null) {
      let $t = $(elem);
      pos = $t.offset();
      pos.top -= 50;
      pos.left -= leftPanelWidth;
      w = $t.outerWidth() - 1;
      h = $t.outerHeight() - 1;
    }
  
    return [
      {
        type: "h",
        left: pos.left,
        top: pos.top,
      },
      {
        type: "h",
        left: pos.left,
        top: pos.top + h,
      },
      {
        type: "v",
        left: pos.left,
        top: pos.top,
      },
      {
        type: "v",
        left: pos.left + w,
        top: pos.top,
      },
      {
        type: "h",
        left: pos.left,
        top: pos.top + h / 2,
      },
      {
        type: "v",
        left: pos.left + w / 2,
        top: pos.top,
      },
    ];
  };

  let popUpPreviewPdf = (url, w, h, report_name, report_guid, action, source, reportFolder) => {
    var left = 0;
    var top = 0;
    // var left = (screen.width / 2) - (w / 2);
    // var top = (screen.height / 2) - (h / 2) - 60;
    var w = open(url, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    
    let openReport = (name, action, source, version, report_guid) => {
      console.log('readyToBePosted')
    }

    w.addEventListener('load', function () {
      openReport(report_name, report_guid, action, source, reportFolder);
    }, true);

    return w;
  };

  let reverseString = (str) => (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);

  let daBehaviors = {
    mouseover: "WA_HOVER",
    mouseout: "WA_HOVER",
    drop: {
      DELETE_CMP: {
        filter: undefined,
        onPropagation: true,
      },
      TOGGLE_BIN: {
        filter: undefined,
        onPropagation: true,
      },
    },
    dragover: "ALLOW_DROP",
    dragleave: "TOGGLE_BIN",
  };

  let vspewbehaviors = {
    dragover: "TOGGLE_BIN",
  };

  let cmpWaBehaviors = {
    mousedown: {
      WA_PREVENT_DRAGSTART: isNotDraggableContainer,
      BECOME_ACTIVE: isContainer,
      SELECT_COMPONENT: (e) => {
        return (e.which && e.which == 1) || (e.buttons && e.buttons == 1);
      },
    },
    mouseover: {
      WA_HOVER: isContainer,
    },
    mouseout: {
      WA_HOVER: isContainer,
    },
    mousemove: {
      //fix this so we can tell the difference between container resize and component resize
      // "IS_WA_RESIZE_NS": isMouseMoveNS,
      CMP_RESIZE: isResizable,
    },
    mouseup: {
      STOP_RESIZING: isResizable,
    },
    resize: {
      WA_RESIZE: isContainer,
    },
    contextmenu: {
      WA_REMOVE: isContainer,
    },
    drop: {
      ADD_COMPONENT: isContainer,
      // "SELECT_COMPONENT": true,
    },
    dragover: {
      ALLOW_DROP: isContainer,
    },
    dragstart: {
      DRAGSTART_COMPONENT: isDraggable,
    },
    drag: "DRAG_COMPONENT",
    dragend: "DRAGEND_COMPONENT",
    dropped: "SELECT_COMPONENT",
  };

  let cmpResizeBehaviors = {
    mousedown: {
      WA_PREVENT_DRAGSTART: true,
      INITIAL_RESIZE: true,
    },
  };
  let sectionListBehaviors = {
    itemClick: "UPDATE_SECTION_LIST",
  };

  // let cmpBehaviors = {
  //     "mousedown": {
  //         "SELECT_COMPONENT": (e) => { return ((e.which && e.which == 1) || (e.buttons && e.buttons == 1));}
  //     },
  //     "dragstart": "DRAGSTART_COMPONENT",
  //     "dropped": "SELECT_COMPONENT"
  // };
  return imp;
};
Implementation.ctor = "Implementation";
export { Implementation };
