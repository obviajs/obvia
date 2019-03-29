var myTextarea = new TextArea({
    id: 'textarea',
    spellCheck: {
        defaultDictionary: 'English',//Albanian
    },
    value: ''
});

$('#root').append(myTextarea.render());