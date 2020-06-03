let Implementation = function (applet) {

    let app = applet.app;
    let data = applet.data;

    let modal, formsFilter, formsList, cmpForm;
   
    let imp = {
        "BEGIN_DRAW": function (e) {
        },
        "END_DRAW": function (e) {
            modal = applet.view;
            let modalBody = modal.modalDialog.modalContent.modalBody;

            formsFilter = modalBody.formsFilter;
            app.addBehaviors(formsFilter, {
                "keyup": {
                    "SEARCH_FORMS": { filter: KeyboardUtils.test["ENTER"] }
                }
            }, false);
            formsList = modalBody.formsList;
            formsList.dataProvider = data.formList;

            cmpForm = formsList.cmpForm;
            cmpForm.forEach(cmp => {
                app.addBehaviors(cmp, {
                    "click": "DOWNLOAD_FORM"
                }, false);

                app.addBehaviors(cmp.children.lblForms, {
                    "click": "DOWNLOAD_FORM"
                }, false);
            });
        },

        "SEARCH_FORMS": function(e) { // filter forms
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
        
        "DOWNLOAD_FORM": async function(e) {
            let fname = e.target.textContent;
            e.stopPropagation();
            e.preventDefault();
            let found;
            let len = data.formList.length
            for (let i = 0; i < len; i++) {
                let f = data.formList[i];
                if (f.form_name === fname) {
                    found = f;
                    break;
                }
            }
            let gaiaForm = new GaiaAPI_forms();
            let form = gaiaForm.formsClient.get(found.form_id);
            let resolve = await Promise.all([form]);
            let lit = resolve[0][0].literal;
            modal.hide();
            
            let evt = new jQuery.Event("loadLayout");
            evt.content = lit;
            applet.view.trigger(evt);
        },
    };

    return imp;
};

Implementation.ctor = "Implementation";
export { Implementation };