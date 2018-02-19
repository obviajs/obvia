var myTextarea = new TextArea({
    id: 'textarea',
    colspan: '6',
    label: 'Textarea Label',
    versionStyle: '',
    blockProcessAttr: false,
    required: true,
    spellCheck: {
        defaultDictionary: 'English',//Albanian
    },
    value: ''
});

$('#root').append(myTextarea.render());