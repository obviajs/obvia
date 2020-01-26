var myMap = new MapLocationPicker({
    id: 'map',
    value: {
        latitude: 41.1533,
        longitude: 20.1683
    },
    zoomLevel: 7
});

myMap.renderPromise().then(function (cmpInstance)
{
  $('#root').append(cmpInstance.$el);
});
