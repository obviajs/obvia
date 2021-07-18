var myMap = new MapLocationPicker({
  id: 'map',
  value: {
    latitude: 41.1533,
    longitude: 20.1683
  },
  zoomLevel: 7
});

myMap.render().then(function (cmpInstance) {
  $('#root').append(cmpInstance.$el);
});

var map = new LeafletMap({
  id: 'map',
  dataProvider: [{
    lat: 41.1533,
    lng: 20.1683
  }],
  width: 300,
  height: 300,
  zoomLevel: 7,
  change: function () {
    alert(JSON.stringify(this.value));
  },
  latitude: 41.1533,
  longitude: 20.1683
});

map.render().then(function (cmpInstance) {
  $('#root').append(cmpInstance.$el);
});