$('#root').append("<div id='container' class='row'></div>");

var firstUpload = new Upload({
    id: 'upload',
    colspan: '4',
    spacing: { mb: '5' },
    multiple: true,
    allowDrop: true,
    target: 'http://phptest/upload.php'
});

$('#container').append(firstUpload.render());

var secondUpload = new Upload({
    id: 'upload',
    colspan: '8',
    spacing: { mb: '5' },
    allowedExtensions: ['pdf', 'png', 'jpg'],
    multiple: false,
    allowDrop: false,
    target: 'http://phptest/upload.php'
});

$('#container').append(secondUpload.render());