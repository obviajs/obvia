var myImage = new Image({
    id: 'image',
    src: 'https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781451648539_9781451648539_hr.jpg',
    alt: "Steve Jobs",
    height: 200,
    width: 200,
    onload: myImageLoaded

});

myImage.on('creationComplete', function(e){
    loader.hide();
    
});
myImage.on('load', myImageLoaded);
$('#root').append(myImage.render());

function myImageLoaded(e){
    console.log("Image Loaded");
}