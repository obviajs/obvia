/**
 * This is a Map component
 * 
 * Kreatx 2018
 */

//component definition
var GoogleMap = KxGenerator.createComponent({
    //default value
    value: {
        latitude: 41.1533,
        longtitude: 20.1683,
        zoomLevel: 7
    },

    //component data
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

            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            disabled: false
        }
    },

    beforeAttach: function () {
        this.$modal = this.$el.find('#' + this.domID + '_map-modal');
        this.$openMapBtn = this.$el.find('#' + this.domID + '_openMapBtn');
        this.$changeCoordiantesBtn = this.$el.find('#' + this.domID + '_changeCoordinates');
        this.$acceptBtn = this.$el.find('#' + this.domID + '_acceptBtn');
        this.$dismissBtn = this.$el.find('#' + this.domID + '_dismissBtn');
        this.$mapAcceptPositionBtn = this.$el.find('#' + this.domID + '_mapAcceptPosition');

    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: { 'afterAttach': this.afterAttach.bind(this) }
            },
            {
                registerTo: this.$openMapBtn, events: { 'click': this.openMap.bind(this) }
            },
            {
                registerTo: this.$changeCoordiantesBtn, events: { 'change': this.changeCoordinatesManually.bind(this) }
            },
            {
                registerTo: this.$acceptBtn, events: {
                    'click': function () {
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        args.splice(1, 0, true);
                        this.setLatLngManually.apply(this, args); 
                    }
                }
            },
            {
                registerTo: this.$dismissBtn, events: {
                    'click': function () {
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        args.splice(1, 0, false);
                        this.setLatLngManually.apply(this, args);
                    }
                }    
            },
            {
                registerTo: this.$mapAcceptPositionBtn, events: { 'click': this.mapAcceptPosition.bind(this) }
            },
            {
                registerTo: this.$modal, events: { 'shown.bs.modal': this.modalOpenedHandler.bind(this) }
            }
        ]
    },

    afterAttach: function (e) {
        var _self = this;
        setTimeout(function () { _self.initMap(); }, 200)

        this.trigger('creationComplete');
    },

    modalOpenedHandler: function (e) {
        var model = this.getModel();

        google.maps.event.trigger(model.map, 'resize');

        // after the resize event, we need to adjust the center of the map
        if (model.marker) {
            model.map.setCenter(model.marker.getPosition());
        }

        this.moveMarker(model.map, model.marker, this.value.latitude, this.value.longtitude);
    },

    setValue: function (value) {
        var model = this.getModel();
        
        this.value = value;
        this.moveMarker(model.map, model.marker, this.value.latitude, this.value.longtitude);

        this.trigger('change');

        return this;
    },

    openMap: function (e) {
        this.$modal.modal('show');
    },

    mapAcceptPosition: function (e) {
        var model = this.getModel();

        var location = model.marker.getPosition();
        var zoom = model.map.getZoom();

        this.value.latitude = location.lat();
        this.value.longtitude = location.lng();
        this.value.zoomLevel = zoom;

        this.trigger('change');

        this.$modal.modal('hide');
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

        model.map = new google.maps.Map(document.getElementById(this.domID + '_map'), {
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
        var model = this.getModel();

        if (action == false) {
            model.mapCheckSetLatLng = false;
            this.changeCoordinatesManually();
        }
        else if (action == true) {
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
        return "<div id='" + this.domID + "-wrapper' class='form-group form-inline col-lg-" + this.colspan + " rowspan" + (this.rowspan ? this.rowspan : '') + " resizable'>" +
                    "<label><b>{label}</b></label><br>" +
                        "<div class='form-group'>" + 
                            "<label style='margin-right:5px'>Latitude: <input type='text' class='form-control' rv-value='value.latitude' rv-placeholder='value.latitude' disabled></label>" + 
                            "<label style='margin-right:5px; margin-left:5px'>Longtitude: <input type='text' class='form-control' rv-value='value.longtitude' rv-placeholder='value.longtitude' disabled> </label>" + 
                            "<button id='" + this.domID + "_openMapBtn' type='button' class='form-control btn btn-primary' rv-disabled='model.disabled'><i class='fas fa-map-marker'></i> Harta</button>" +
                        "</div>" + 
                "<div id='" + this.domID + "_map-modal' class='modal fade' role='dialog'>" + 
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
                                                "<input id='" + this.domID + "_changeCoordinates' type='checkbox' rv-checked='model.mapCheckSetLatLng'><strong>Ndrysho</strong>" + 
                                            "</label>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='col-xs-4' style='padding:0px'>" +
                                        "<div class='col-xs-3' style='padding-right:0px; padding-top:10px'>" +
                                            "<label for='" + this.domID + "_mapSetLat'>Lat:</label>" + 
                                        "</div>" +
                                        "<div class='col-xs-9' style='padding:0px'>" +
                                            "<input type='number' class='form-control' rv-value='model.modalLatitude' rv-placeholder='value.latitude' rv-disabled='model.mapSetLatDisabled'>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='col-xs-4' style='padding:0px'>" +
                                        "<div class='col-xs-3' style='padding-right:0px; padding-top:10px'>" +
                                            "<label for='" + this.domID + "_mapSetLng' > Lng: </label>" +
                                        "</div>" +
                                        "<div class='col-xs-9' style='padding:0px'>" +
                                            "<input type='number' class='form-control' rv-value='model.modalLongtitude' rv-placeholder='value.longtitude' rv-disabled='model.mapSetLongDisabled'>" +
                                        "</div>" +
                                    "</div>" +
                                "<div class='col-xs-2 pull-right' style='padding-right:0px'>" +
                                        "<button type='button' id='" + this.domID + "_acceptBtn' rv-class='model.setLatLongOkBtnClass'>Ok</button>" +
                                        "<button type='button' id='" + this.domID + "_dismissBtn' rv-class='model.setLatLongCancelBtnClass'>X</button>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div id='" + this.domID + "_map' style='height: 400px;width: 100%;'></div>" +
                        "</div>" +
                        "<div class='modal-footer'>" +
                            "<button type='button' id='" + this.domID + "_mapAcceptPosition' class='btn btn-success'>Ruaj Koordinatat</button>" +
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