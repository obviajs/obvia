let myLi = new Li({
    id: "Li",
    value: "5",
    label: "Li",
    type: ContainerType.NONE

});

myLi.on('creationComplete', function () {
    myLi.on('click', function () {
        // alert("test");
    });
});
myLi.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});