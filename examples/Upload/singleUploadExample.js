var singleUpload = new SingleUpload({
    id: 'upload',
    colspan: '4',
    spacing: { mb: '5' },
    multiple: true,
    allowDrop: true,
    target: 'http://phptest/upload.php'
});

$('#root').append(singleUpload.render());