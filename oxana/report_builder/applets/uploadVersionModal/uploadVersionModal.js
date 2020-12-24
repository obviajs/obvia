let Implementation = function (applet) {
  let app = applet.app;
  let data = applet.data;

  let modal;
  let dataGridVersions;

  let imp = {
    END_DRAW: (e) => {
      modal = applet.view;

      //datagrid
      dataGridVersions = modal.find("dataGridVersions");
      applet.addBehaviors(dataGridVersions, { rowDblClick: "SELECT_VERSION" }, false);
    },

    SELECT_VERSION: async (e, r, ra) => {
      if (ra.currentItem.revision_name !== "...") {
        let api_reports_revision = new GaiaAPI_reports();
        let res = await api_reports_revision.getRevisionsClient.get(ra.currentItem.revision_guid);
        if (!res.status_description) {
          data.selectedReport = {
            ...res.revision_extradata,
            revision_literal: res.revision_literal
          }

          // custom event to add the components to the workArea
          let evt = new jQuery.Event("loadLayoutVersion");
          evt.content = res.revision_literal
          modal.trigger(evt);
          modal.hide()
        } else console.error('error inside SELECT_VERSION')
      }
    },
  };

  //helpful functions

  return imp;
};

Implementation.ctor = "Implementation";
export {
  Implementation
};