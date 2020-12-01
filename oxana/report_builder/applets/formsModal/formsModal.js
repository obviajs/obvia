let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;

    let modal, formsFilter, formsList;
   
    let imp = {

        "BEGIN_DRAW": function (e) {
        },

        "END_DRAW": function (e) {
            modal = applet.view;
            let modalBody = modal.modalDialog.modalContent.modalBody;
            
            let itemList = modal.find("formsList");
            applet.addBehaviors(itemList, {
                "rowAdd": "PREPARE_ITEM",
            }, false);

            formsFilter = modalBody.formsFilter;
            applet.addBehaviors(formsFilter, {
                "keyup": {
                    "SEARCH_FORMS": { filter: KeyboardUtils.test["ENTER"] }
                }
            }, false);
            formsList = modalBody.formsList;
            formsList.dataProvider = data.formList;
        },

        "PREPARE_ITEM": function (e, r, ra) {
            if (ra) {
                applet.addBehaviors(ra.currentRow.cmpForm, {
                    "click": "ITEM_SELECT",
                }, false);
            }
        },

        "ITEM_SELECT": async function (e, ra) {
            let gaiaForm = new GaiaAPI_forms();
            let currentItem = arguments[1].currentItem;
            let form = gaiaForm.formsClient.get(currentItem.form_id);
            let resolve = await Promise.all([form]);
            let f = resolve[0][0];
            let lit = f.form_literal;
            modal.hide();
            
            let evt = new jQuery.Event("loadLayout");
            evt.content = lit;
            data.selectedForm = new ReportProperties(f);
            modal.trigger(evt);
        },

        "SEARCH_FORMS": function(e) { // filter reports
          data.formList.filterData = {
            "condition": "AND",
            "rules": [
              {
                "id": "form_name",
                "field": "form_name",
                "type": "string",
                "input": "text",
                "operator": "contains",
                "value": e.target.value.toLowerCase()
              }
            ],
            "valid": true
          };
          data.formList.filter();
        },
    };

    return imp;
};

Implementation.ctor = "Implementation";
export { Implementation };