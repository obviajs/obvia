var myTextarea = new TextArea({
    id: 'textarea',
    spellCheck: {
        defaultDictionary: 'English', //Albanian
    },
    value: ''
});

$('#root').append(await myTextarea.render().$el);