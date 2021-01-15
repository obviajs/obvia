let Implementation = function (applet) {
  //variable declaration
  let modal,
    modalBody,
    modalFooter,
    pathSelectorRadioGroup,
    previewLabel,
    imagePreview;

  //bahavior declaration
  let imp = {
    END_DRAW: (e) => {
      modal = applet.view;
      modalBody = modal.modalDialog.modalContent.modalBody;
      modalFooter = modal.modalDialog.modalContent.modalFooter;

      pathSelectorRadioGroup =
        modalBody.imageModalContainer.pathSelectorContainer
          .pathSelectorRadioGroup;
      pathSelectorRadioGroup.dataProvider = new ArrayEx([
        {
          id: "1",
          text: "Ministria e Puneve te Jashtme",
          buttonClass: [],
        },
        {
          id: "2",
          text: "Ministria e Drejtesise",
          buttonClass: [],
        },
        {
          id: "3",
          text: "Ministria e Brendshme",
          buttonClass: [],
        },
      ]);
      applet.addBehaviors(
        pathSelectorRadioGroup,
        { change: "RB_CLICKED" },
        false
      );

      previewLabel =
        modalBody.imageModalContainer.imageSelectionContainer
          .imageSelectionPreviewContainer.previewLabel;
      imagePreview =
        modalBody.imageModalContainer.imageSelectionContainer
          .imageSelectionPreviewContainer.imagePreview;
    },

    RB_CLICKED: (e) => {
      previewLabel.visible = false;
      imagePreview.visible = true;
      imagePreview.src =
        "https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781451648539_9781451648539_hr.jpg";
    },
  };

  //helpful functions

  return imp;
};

Implementation.ctor = "Implementation";
export { Implementation };
