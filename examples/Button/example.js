var myButton = new Button({
  id: 'button',
  type: "",
  value: "",
  label: "{localizationManager.getLocaleString('Forms', 'successfullySaved', localizationManager.selectedLocale)}",
  classes: ["btn", "btn-success"],
  click: function (e) {
    console.log("From ClickAction");
  }
});
let localizationManager = new LocalizationManager({
  selectedLocale: {
      displayLanguage: "English",
      localeString: "en_US"
  },
  fetchPromise: function (p) { 
    return get(BrowserManager.getInstance().base+ "/oxanaui/app/locale/" + p.localeString + ".json", "application/json")
  }
});
myButton.localizationManager = localizationManager;

myButton.on('click', function () {
  localizationManager.setSelectedLocale({
      displayLanguage: "English",
      localeString: "sq_AL"
  })
});
localizationManager.loaded.then((d) => {
  myButton.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
  });
});
