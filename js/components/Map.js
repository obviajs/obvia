/**
 * This is a Map component
 * 
 * Kreatx 2018
 */

//component definition
var GoogleMap = KxGenerator.createComponent({

    value: {
        latitude: 41.1533,
        longtitude: 20.1683,
        zoomLevel: 7
    },

    initModel: function () {
        return {
            modalLatitude: this.value.latitude,
            modalLongtitude: this.value.longtitude,

            marker: null,
            map: null,
            mapCheckSetLatLng: false,
            mapSetLatDisabled: true,
            mapSetLongDisabled: true,
            setLatLongOkBtnClass: 'btn btn-success hide',
            setLatLongCancelBtnClass: 'btn btn-danger hide',
            openMap: this.openMap.bind(this),
            changeCoordinatesManually: this.changeCoordinatesManually.bind(this),
            setLatLngManually: this.setLatLngManually.bind(this),
            mapAcceptPosition: this.mapAcceptPosition.bind(this),

            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            disabled: false
        }
    },

    registerEvents: function () {
        // return {
        //     'change'
        // }
    },


    afterAttach: function () {
        var _self = this;
        var model = this.getModel();
        
        this.$el.find('#' + this.id + '_map-modal').on('shown.bs.modal', function () {
            google.maps.event.trigger(model.map, 'resize');

            // after the resize event, we need to adjust the center of the map
            if (model.marker) {
                model.map.setCenter(model.marker.getPosition());
            }

            _self.moveMarker(model.map, model.marker, _self.value.latitude, _self.value.longtitude);
        });

        setTimeout(function () { _self.initMap(); }, 200)
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        var model = this.getModel();
        this.value = value;
        this.moveMarker(model.map, model.marker, this.value.latitude, this.value.longtitude);

        this.$el.trigger('change');

        return this;
    },

    openMap: function (e) {
        e.preventDefault();
        $('#' + this.id + '_map-modal').modal('show');
    },

    mapAcceptPosition: function (e) {
        e.preventDefault();
        var model = this.getModel();

        var location = model.marker.getPosition();
        var zoom = model.map.getZoom();

        this.value.latitude = location.lat();
        this.value.longtitude = location.lng();
        this.value.zoomLevel = zoom;

        this.$el.trigger('change');

        $('#' + this.id + '_map-modal').modal('hide');
    },

    moveMarker: function(map, marker, lat, lng) {
        //delayed so you can see it move
        setTimeout( function() {
            marker.setPosition(new google.maps.LatLng(lat, lng));
            map.panTo(new google.maps.LatLng(lat, lng));
        }, 500);
    },

    placeMarker: function (location, marker, map) {
        var model = this.getModel();

        if (marker != null)
            marker.setPosition(location);
        else
            marker = new google.maps.Marker({
                position: location,
                map: map
            });
        
        var location = marker.getPosition();
        model.modalLatitude = location.lat();
        model.modalLongtitude = location.lng();
    },

    initMap: function () {
        var _self = this;
        var model = this.getModel();

        var pos = {
            lat: this.value.latitude,
            lng: this.value.longtitude
        };

        model.map = new google.maps.Map(document.getElementById(this.id + '_map'), {
            center: pos,
            zoom: this.value.zoomLevel
        });
        
        model.marker = new google.maps.Marker({
            position: pos,
            map: model.map
        });
        
        google.maps.event.addListener(model.map, 'click', function (event) {
            _self.placeMarker(event.latLng, model.marker, model.map);
        });
    
    },

    changeCoordinatesManually: function (e) {
        e.preventDefault();
    
        var model = this.getModel();

        if (model.mapCheckSetLatLng) {
            model.mapSetLatDisabled = false;
            model.mapSetLongDisabled = false;

            model.setLatLongOkBtnClass = 'btn btn-success';
            model.setLatLongCancelBtnClass = 'btn btn-danger';
        }
        else {
            model.mapSetLatDisabled = true;
            model.mapSetLongDisabled = true;

            model.setLatLongOkBtnClass = 'btn btn-success hide';
            model.setLatLongCancelBtnClass = 'btn btn-danger hide';
        }
    },

    setLatLngManually: function (e, action) {
        e.preventDefault();

        var model = this.getModel();

        if (action == 'false') {
            model.mapCheckSetLatLng = false;
            this.changeCoordinatesManually();
        }
        else if (action == 'true') {
            this.moveMarker(model.map, model.marker, model.modalLatitude, model.modalLongtitude);
            model.mapCheckSetLatLng = false;
           
            this.changeCoordinatesManually();
        }
    },

    enable: function () {
        var model = this.getModel();
        model.disabled = false;

        return this;    
    },

    disable: function () {
        var model = this.getModel();
        model.disabled = true;

        return this;
    },

    template: function () {
        return "<div id='" + this.id + "-wrapper'>" +
            "<div class='form-group form-inline col-lg-" + this.colspan + " rowspan" + (this.rowspan ? this.rowspan : '') + " resizable'>" +
                "<label>{label}</label><br>" +
                    "<div class='col-sm-12' style='padding:0px'>" + 
                    "<label style='margin-right:5px'>Latitude: </label>" + 
                    "<input type='text' class='form-control' rv-value='value.latitude' rv-placeholder='value.latitude' disabled>" +
                    "<label style='margin-right:5px; margin-left:5px'>Longtitude: </label>" + 
                    "<input type='text' class='form-control' rv-value='value.longtitude' rv-placeholder='value.longtitude' disabled>" +
                    "<button class='form-control btn btn-default' rv-disabled='model.disabled' rv-on-click='model.openMap'><span style='color:#f39c12'>Harta</span> <span style='color:#f39c12' class='glyphicon glyphicon-map-marker'></span></button>" +
                "</div>" + 
            "</div>" +
            "<div id='" + this.id + "_map-modal' class='modal fade' role='dialog'>" + 
                "<div class='modal-dialog'>" +
                    "<div class='modal-content'>" +
                        "<div class='modal-header'>" +
                            "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
                            "<h4 class='modal-title'>Zgjidh Vendodhjen</h4>" +
                        "</div>" + 
                        "<div class='modal-body'>" +
                            "<div class='col-lg-12'>" +
                            "<div class='form-group row'>" +
                                "<div class='col-xs-2' style='padding-top:8px'>" +
                                   "<div>" +
                                        "<label class='control-label'>" +
                                            "<input type='checkbox' rv-checked='model.mapCheckSetLatLng' rv-on-change='model.changeCoordinatesManually'><strong>Ndrysho</strong>" + 
                                        "</label>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='col-xs-4' style='padding:0px'>" +
                                    "<div class='col-xs-3' style='padding-right:0px; padding-top:10px'>" +
                                        "<label for='" + this.id + "_mapSetLat'>Lat:</label>" + 
                                    "</div>" +
                                    "<div class='col-xs-9' style='padding:0px'>" +
                                        "<input type='number' class='form-control' rv-value='model.modalLatitude' rv-placeholder='value.latitude' rv-disabled='model.mapSetLatDisabled'>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='col-xs-4' style='padding:0px'>" +
                                    "<div class='col-xs-3' style='padding-right:0px; padding-top:10px'>" +
                                        "<label for='" + this.id + "_mapSetLng' > Lng: </label>" +
                                    "</div>" +
                                    "<div class='col-xs-9' style='padding:0px'>" +
                                        "<input type='number' class='form-control' rv-value='model.modalLongtitude' rv-placeholder='value.longtitude' rv-disabled='model.mapSetLongDisabled'>" +
                                    "</div>" +
                                "</div>" +
                               "<div class='col-xs-2 pull-right' style='padding-right:0px'>" +
                                    "<button rv-class='model.setLatLongOkBtnClass' rv-on-click='model.setLatLngManually' data-on-click='true'>Ok</button>" +
                                    "<button rv-class='model.setLatLongCancelBtnClass' rv-on-click='model.setLatLngManually' data-on-click='false'>X</button>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                        "<div id='" + this.id + "_map' style='height: 400px;width: 100%;'></div>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                        "<button class='btn btn-success' rv-on-click='model.mapAcceptPosition'>Ruaj Koordinatat</button>" +
                    "</div>" +
                "</div>" +
            "</div>" +
            "</div>"+
        "</div>";        
    
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
GoogleMap.type = 'map';

//register dom element for this component
KxGenerator.registerDOMElement(GoogleMap, 'kx-map');