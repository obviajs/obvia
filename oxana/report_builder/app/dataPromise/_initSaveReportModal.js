var _initSaveReportModal = () => {
    if (!Builder.showNewReportLabel) {
      Builder.showNewReportLabel = false
      Builder.showNewReportTextInput = true
      Builder.selectedReportName = ""
    }
    Builder.reportErrorLabel = ""
    return Promise.resolve(Builder);
  }