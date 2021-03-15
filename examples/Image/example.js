var loader = new Loader({
    id: 'loader'
});
$('#root').append(await loader.render().$el);
loader.show();

var myImage = new Image({
    id: 'image',
    src: 'https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781451648539_9781451648539_hr.jpg',
    alt: "Steve Jobs",
    height: 200,
    width: 200,
    load: myImageLoaded

});

myImage.on('endDraw', function (e) {
    loader.hide();

});
myImage.on('load', myImageLoaded);
$('#root').append(await myImage.render().$el);

function myImageLoaded(e) {
    console.log("Image Loaded");
}