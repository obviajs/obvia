var myColor = new Color({
    id: 'color1',
    change: function (e) {
        console.log("Color changed to: " + this.value);
    }
});

myColor.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});