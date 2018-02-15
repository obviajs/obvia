var myMap = new GoogleMap({
    id: 'map',
    colspan: '6',
    label: 'Vendodhja Gjeografike',
    versionStyle: "",
    blockProcessAttr: false,
    required: false,
    value: {
        latitude: 41.1533,
        longtitude: 20.1683,
        zoomLevel: 7
    }
});

$('#root').append(myMap.render());
