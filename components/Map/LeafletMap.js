/**
 * This is a MapLocationPicker component
 * 
 * Kreatx 2018
 */

//component definition
var LeafletMap = function (_props) {
    let _self = this,
        _markers = [],
        _latitudeField,
        _longitudeField,
        _latitude, _longitude;

    let _initMap = function (e) {
        if (!_map) {
            _map = L.map(_self.domID).setView([_latitude, _longitude], _zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(_map);
            _map.on('click', _mapClick);
        }
    };

    let _initMarker = function (latlng) {
        let marker;
        if (_map) {
            marker = L.marker(latlng, {
                draggable: _props.marker.draggable
            }).addTo(_map);
            marker.on('dragend', function (event) {
                let pos = event.target.getLatLng();
                _self.value = {
                    latitude: pos.lat,
                    longitude: pos.lng
                };
            });
            _map.addLayer(marker);
        }
        return marker;
    };

    let _moveMarker = function (latlng) {
        if (!_marker) {
            _marker = _initMarker(latlng);
        } else {
            _marker.setLatLng(latlng, {
                draggable: 'true'
            }).bindPopup(latlng).update();
        }
    };

    let _mapClick = function (e) {
        let pos = e.latlng;
        if (!_marker) {
            _marker = _initMarker(pos);
            _self.value = {
                latitude: pos.lat,
                longitude: pos.lng
            };
        }
    };

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            let len = _markers.length;
            for (let i = 0; i < len; i++) {
                _map.removeLayer(_markers[i]);
            }
            _markers.splice(0, len);
            if (v) {
                len = v.length;
                for (let i = 0; i < len; i++) {
                    _markers.push(_initMarker([v[i][_latitudeField], v[i][_longitudeField]]));
                }
            }
        },
        enumerable: true
    });

    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _init == 'function')
                _init.apply(this, arguments);
        }
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.zoomLevel) {
                _zoomLevel = _props.zoomLevel;
            }
            if (_props.value) {
                this.value = _props.value;
            }
            if (_props.latitudeField) {
                _latitudeField = _props.latitudeField;
            }
            if (_props.longitudeField) {
                _longitudeField = _props.longitudeField;
            }
            if (_props.latitude) {
                _latitude = _props.latitude;
            }
            if (_props.longitude) {
                _longitude = _props.longitude;
            }
            e.preventDefault();
        }
    };

    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            _initMap();
            if (_props.dataProvider) {
                this.dataProvider = _props.dataProvider;
            }
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
        }
    };

    let _zoomLevel, _dataProvider, _map;

    let _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        value: {
            latitude: 41.1533,
            longitude: 20.1683,

        },
        marker: {
            draggable: true
        },
        zoomLevel: 7,
        classes: ["wrap"],
        latitudeField: "lat",
        longitudeField: "lng"
    };

    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["change"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    Container.call(this, _props);
};
//component prototype
LeafletMap.prototype.ctor = 'LeafletMap';