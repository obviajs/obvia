var myMap = new GoogleMap({
    id: 'map',
    colspan: '6',
    label: 'Vendodhja Gjeografike',
    fieldName: 'mapField',
    versionStyle: "",
    blockProcessAttr: false,
    required: false,
    dataProvider: {
        latitude: 41.1533,
        longtitude: 20.1683,
        zoomLevel: 7
    }
});

$('#root').append(myMap.render());
