let Context = {};
Context.localizationManager = new LocalizationManager({
  selectedLocale: {
      displayLanguage: "English",
      localeString: "en_US"
  },
  fetchPromise: function (p) { 
    return get(BrowserManager.getInstance().base+ "/oxanaui/app/locale/" + p.localeString + ".json", "application/json")
  }
});
//myButton.localizationManager = localizationManager;
var myContainer = new Container({
  components: [
    {
      ctor: Button,
      props: {
        id: 'button1',
        type: "",
        value: "",
        label: "Fixed Label",
        classes: ["btn", "btn-success"],
        click: function (e) {
          console.log("From ClickAction");
        },
        bindingDefaultContext: Context
      }
    },
    {
      ctor: Button,
      props: {
        id: 'button2',
        type: "",
        value: "",
        label: "{localizationManager.getLocaleString('Forms', 'successfullySaved', localizationManager.selectedLocale) + button1.label}",
        classes: ["btn", "btn-success"],
        click: function (e) {
          console.log("From ClickAction");
        },
        bindingDefaultContext: Context
      }
    }
  ]
});

Context.localizationManager.loaded.then((d) => {
  myContainer.render().then(function (cmpInstance) {
    myContainer.button1.on('click', function () {
      Context.localizationManager.setSelectedLocale({
          displayLanguage: "English",
          localeString: "sq_AL"
      })
    });
    $('#root').append(cmpInstance.$el);
  });
});
