var myUpload = new Upload({
    id: 'upload',
    colspan: '6',
    allowedExtensions: ['pdf','png','jpg'],
    multiple: true,
    allowDrop: true,
    target: '/api/upload'
});

$('#root').append(myUpload.render());