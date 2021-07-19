/**
 * This is a MapLocationPicker component
 * 
 * Kreatx 2018
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var LeafletMap = function (_props) {
    let _self = this,
        _markers = [],
        _layerGroup,
        _latitudeField,
        _longitudeField,
        _latitude, _longitude,
        _dataProvider, _zoomLevel, _map,
        _selectedItem,
        _allowNewItem,
        _centerCircle;

    let _initMap = function (e) {
        if (!_map) {
            _map = L.map(_self.domID).setView([_latitude | 0, _longitude | 0], _zoomLevel | 0);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(_map);
            _self.centerMap();
            _map.on('click', _mapClick);
            _map.on('zoomend', _zoomEnd);
        }
        if (!_layerGroup) {
            _layerGroup = L.layerGroup();
        }
    };

    let _zoomEnd = function (e) {
        _zoomLevel = e.target._zoom;
    };

    this.centerMap = function (lat = _latitude, lng = _longitude) {
        if ((!lat || !lng) && _dataProvider.length > 0) {
            lat = _dataProvider[0][_latitudeField];
            lng = _dataProvider[0][_longitudeField];
        }
        if (lat && lng) {
            _latitude = lat;
            _longitude = lng;
            let center = [lat, lng];
            _map.flyTo(center, _zoomLevel);

            if (_centerCircle) {
                _map.removeLayer(_centerCircle);
            }

            let circleOptions = {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0
            };
            _centerCircle = L.circle(center, 250, circleOptions);
            _centerCircle.addTo(_map);
        }
    };

    let _initMarker = function (latlng) {
        let marker;
        if (_map) {
            marker = L.marker(latlng, {
                draggable: _props.marker.draggable
            }).addTo(_map);
            marker.on('dragend', function (e) {
                let pos = e.target.getLatLng();
                let m = ArrayUtils.getMatching(_dataProvider, _layerIdField, e.target._leaflet_id, true);
                m.objects[0][_latitudeField] = pos.lat;
                m.objects[0][_longitudeField] = pos.lng;
            });
            marker.on('click', _markerClick);
            _map.addLayer(marker);
        }
        return marker;
    };

    let _markerClick = function (e) {
        let m = ArrayUtils.getMatching(_dataProvider, _layerIdField, e.target._leaflet_id, true);
        _self.selectedItem = m.objects[0];
    };

    Object.defineProperty(this, "selectedItem", {
        get: function selectedItem() {
            return _selectedItem;
        },
        set: function selectedItem(v) {
            if (v != _selectedItem) {
                _selectedItem = v;
                this.trigger("change");
            }
        },
        enumerable: true
    });

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
        if (_allowNewItem) {
            let pos = e.latlng;
            let m = _initMarker(pos);
            let nr = {};
            nr[_layerIdField] = _layerGroup.getLayerId(m);
            nr[_latitudeField] = pos.lat;
            nr[_longitudeField] = pos.lng;
            _dataProvider.push(nr);
            _self.selectedItem = nr;
        }
    };

    Object.defineProperty(this, "layerIdField", {
        get: function layerIdField() {
            return _layerIdField;
        }
    });

    Object.defineProperty(this, "latitudeField", {
        get: function latitudeField() {
            return _latitudeField;
        }
    });

    Object.defineProperty(this, "longitudeField", {
        get: function longitudeField() {
            return _longitudeField;
        }
    });

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            _initMap();

            let len = _markers.length;
            for (let i = 0; i < len; i++) {
                _map.removeLayer(_markers[i]);
            }
            _markers.splice(0, len);
            if (v) {
                len = v.length;
                for (let i = 0; i < len; i++) {
                    let m = _initMarker([v[i][_latitudeField], v[i][_longitudeField]]);
                    v[i][_layerIdField] = _layerGroup.getLayerId(m);
                    _markers.push(m);
                }
                _dataProvider = v;
                _self.centerMap();
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
            if (_props.allowNewItem) {
                _allowNewItem = _props.allowNewItem;
            }
            if (_props.layerIdField) {
                _layerIdField = _props.layerIdField;
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

    let _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        marker: {
            draggable: true
        },
        zoomLevel: 7,
        classes: ["wrap"],
        latitudeField: "lat",
        longitudeField: "lng",
        layerIdField: "layerId",
        allowNewItem: false
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["change"];
    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    let r = Container.call(this, _props);
    return r;
};
//component prototype
LeafletMap.prototype.ctor = 'LeafletMap';
export {
    LeafletMap
};