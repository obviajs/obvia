var myTextEditor = new TextEditor({
    id: 'textEditor',
    colspan: '6',
    spellCheck: {
        defaultDictionary: 'English',//Albanian
    },
    value: ''
});

  myTextEditor.renderPromise().then(function (cmpInstance)
  {
    $('#root').append(cmpInstance.$el);
  });