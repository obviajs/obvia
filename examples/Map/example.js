var myMap = new GoogleMap({
    id: 'map3',
    colspan: '6',
    label: 'Vendodhja Gjeografike',
    fieldName: 'mapField3',
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
