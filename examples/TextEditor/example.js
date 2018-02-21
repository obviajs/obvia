var myTextEditor = new TextEditor({
    id: 'textEditor',
    colspan: '6',
    label: 'TextEditor',
    versionStyle: '',
    blockProcessAttr: false,
    required: true,
    spellCheck: {
        defaultDictionary: 'English',//Albanian
    },
    value: ''
});

$('#root').append(myTextEditor.render());