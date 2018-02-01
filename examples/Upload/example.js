var myUpload = new Upload({
    id: 'upload',
    colspan: '6',
    label: 'Uplad Test',
    fieldName: 'upload_test',
    dataProvider: "",
    versionStyle: "",
    extension: ['pdf','png','jpg'],
    blockProcessAttr: false,
    required: false,
    multiple:true,
    process_id: 10,
    case_id:  27437
});

$('#root').append(myUpload.render());