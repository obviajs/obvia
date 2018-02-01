var myTextarea = new Textarea({
    id: 'textarea',
    colspan: '6',
    label: 'Textarea Label',
    fieldName: 'textareaField',
    versionStyle: '',
    blockProcessAttr: false,
    required: true,
    defaultDictionary:'English',//Albanian
    value: ''
});

$('#root').append(myTextarea.render());