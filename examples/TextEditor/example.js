var myTextEditor = new TextEditor({
    id: 'textEditor',
    colspan: '6',
    spellCheck: {
        defaultDictionary: 'English',//Albanian
    },
    value: ''
});

$('#root').append(myTextEditor.render());