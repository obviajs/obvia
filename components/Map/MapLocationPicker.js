/**
 * This is a MapLocationPicker component
 * 
 * Kreatx 2018
 */

//component definition
var MapLocationPicker = function (_props, overrided = false) {
    let _self = this;    

    var _initMap = function(e){
        if(!_map){
            _map = L.map(_mapCnt.domID).setView([_value.latitude, _value.longitude], _zoomLevel); 
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(_map);
            _map.on('click', _mapClick);
        }
        _moveMarker([_value.latitude, _value.longitude]);
    }

    var _initMarker = function(latlng){
        if(_map){
            _marker = L.marker(latlng, {draggable: _props.marker.draggable}).addTo(_map);
            _marker.on('dragend', function(event){
                let pos = event.target.getLatLng();
                _self.value = {latitude:pos.lat, longitude:pos.lng};    
            });
            _map.addLayer(_marker);
        }
        return _marker;
    }

    var _moveMarker = function(latlng){
        if(!_marker){
            _marker = _initMarker(latlng);
        }else{
            _marker.setLatLng(latlng, {draggable:'true'}).bindPopup(latlng).update();
        }
    }

    var _mapClick = function(e){
        let pos = e.latlng;
        if(!_marker){
            _marker = _initMarker(pos);
            _self.value = {latitude:pos.lat, longitude:pos.lng};
        }
    }

    Object.defineProperty(this, "value", 
    {
        get: function value() 
        {
            return _value;
        },
        set: function value(v) 
        {
            if(v){
                let c = false;
                if((v.latitude && !_value )|| (_value && v.latitude != _value.latitude)){
                    if(!_value){
                        _value = {};
                    }
                    c = true;
                }
                if((v.longitude && !_value ) || (_value && v.longitude != _value.longitude)){
                    if(!_value){
                        _value = {};
                    }
                    c = true;
                }
                if(c){
                    _oldValue = extend(true, _value);
                    _value.latitude = v.latitude;
                    _value.longitude = v.longitude;
                    let pos = {};
                    pos.lat = _latitude.value = _modalLatitude.value = _value.latitude;
                    pos.lng = _longitude.value = _modalLongitude.value = _value.longitude;
                    _moveMarker([pos.lat, pos.lng]);
                    this.trigger("change");
                }
            }
        },
        enumerable:true
    });

    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            this.$container = this.$el;
            fnContainerDelayInit();
            this.components = _cmps;
            this.addComponents();
            _latitude = this.children[this.components[0].props.id];
            _longitude = this.children[this.components[1].props.id];
            _modal = this.children[this.components[3].props.id];
            _mapCnt = _modal.modalDialog.modalContent.modalBody.mapContainer;
            _modalLatitude = _modal.modalDialog.modalContent.modalBody.inputsRow.inputsColumn.mLatitude;
            _modalLongitude = _modal.modalDialog.modalContent.modalBody.inputsRow.inputsColumn.mLongitude;
            if(_props.zoomLevel){
                _zoomLevel = _props.zoomLevel;
            }
            if(_props.value){
                this.value = _props.value;
            }
            e.preventDefault();
        }
    }

    var _manualChange = function(lat, lng){
        _self.value = {latitude:lat, longitude:lng};
    }

    let _cmps, _modal, _latitude, _longitude, _zoomLevel, _value, _map, _marker, _mapCnt, _modalLatitude, _modalLongitude;
    var fnContainerDelayInit = function(){
        _cmps = 
        [ 
            {
                ctor: TextInput,
                props: {
                    id: "latitude",
                    spacing: {mr:1},
                    blur: function(){
                        _manualChange(this.parent.latitude.value, this.parent.longitude.value);
                    }
                }
            },
            {
                ctor: TextInput,
                props: {
                    id: "longitude",
                    spacing: {mr:1},
                    blur: function(){
                        _manualChange(this.parent.latitude.value, this.parent.longitude.value);
                    }
                }
            },
            {
                ctor: Button,
                props: {
                    id: 'selectBtn',
                    type: "button",
                    components: [{
                        ctor: Label,
                        props: {
                            id: 'fa',
                            labelType: LabelType.i,
                            classes: ["fas","fa-map-marker", "no-form-control"]
                        }
                    }],
                    click: _showLocationSelectModal
                }
            },                    
            {
                ctor: Modal,
                props: {
                    id: 'locationSelectModal',
                    size: ModalSize.LARGE,
                    title: 'Pick Location',
                    displayListUpdated: _initMap,
                    dismiss: _rollbackLocation,
                    components: {
                    modalBody:
                        [
                            {
                                ctor: Container,
                                props: {
                                    id: "inputsRow",
                                    type: ContainerType.ROW,
                                    spacing:{mb:1},
                                    components: [
                                        {
                                            ctor: Container,
                                            props: {
                                                id: "inputsColumn",
                                                type: ContainerType.COLUMN,
                                                spacing:{colSpan:12},
                                                components: [
                                                    {
                                                        ctor: TextInput,
                                                        props: {
                                                            id: "mLatitude",
                                                            spacing: {mr:1},
                                                            blur: function(){
                                                                _manualChange(this.parent.mLatitude.value, this.parent.mLongitude.value);
                                                            }
                                                        }
                                                    },
                                                    {
                                                        ctor: TextInput,
                                                        props: {
                                                            id: "mLongitude",
                                                            blur: function(){
                                                                _manualChange(this.parent.mLatitude.value, this.parent.mLongitude.value);
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }       
                            },
                            {
                                ctor: Container,
                                props: {
                                    type: ContainerType.ROW,
                                    id: "mapContainer",
                                    height:500,
                                    components: []
                                }
                            }
                        ]
                    }
                }
            }            
        ];
    }

    var _showLocationSelectModal = function(e){
        _modal.show();
    }

    let _oldValue;
    var _rollbackLocation = function(e){
        _self.value = _oldValue;
    }

    var _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        attr:{"data-triggers":"browse"},   
        value: {
            latitude: 41.1533,
            longitude: 20.1683,
            
        }, 
        marker: {
            draggable: true
        },
        zoomLevel: 7,
        classes: ["wrap"]                         
    };

    _props = extend(false, false, _defaultParams, _props);
    Container.call(this, _props);
};

//component prototype
MapLocationPicker.prototype.ctor = 'MapLocationPicker';