/**
 * This is a Map component
 * 
 * Kreatx 2018
 */

//component definition
var GoogleMap = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            //hardcoded coordinates
            latitude: '41.1533',
            longtitude: '20.1683',
            zoomLevel: '7',

            modalLatitude: '41.1533',
            modalLongtitude: '20.1683',

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

            label: this.label,
            fieldName: this.fieldName,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            required: this.required 
        }
    },

    registerEvents: function () {
        var _self = this;
        var model = this.getModel();

        this.$el.find('#' + this.fieldName + '_map-modal').on('shown.bs.modal', function () {
            google.maps.event.trigger(model.map, 'resize');

            // after the resize event, we need to adjust the center of the map
            if (model.marker) {
                model.map.setCenter(model.marker.getPosition());
            }
            
            _self.moveMarker(model.map, model.marker, model.latitude, model.longtitude);
        })
    },


    beforeAttach: function () {
        var _self = this;
        var model = this.getModel();
        
        //get data
        if (this.dataProvider != undefined || this.dataProvider != '') {
            if (typeof this.dataProvider == 'string') {
                //ajax call
                KxRequest.promise($.get(_self.dataProvider)).done(function (result) {
                    model.latitude = result.latitude;
                    model.longtitude = result.longtitude;
                    model.zoomLevel = result.zoomLevel;
                    model.modalLatitude = result.latitude;
                    model.modalLongtitude = result.longtitude;

                    this.value = result;
                });

            } else {
                model.latitude = this.dataProvider.latitude;
                model.longtitude = this.dataProvider.longtitude;
                model.zoomLevel = this.dataProvider.zoomLevel;
                model.modalLatitude = this.dataProvider.latitude;
                model.modalLongtitude = this.dataProvider.longtitude;
                
                this.value = this.dataProvider;
            }
        }


    },

    afterAttach: function () {
        var _self = this;
        setTimeout(function () { _self.initMap(); }, 200)
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {

    },

    openMap: function () {
        $('#' + this.fieldName + '_map-modal').modal('show');
    },

    mapAcceptPosition: function () {
        var model = this.getModel();

        var location = model.marker.getPosition();
        var zoom = model.map.getZoom();

        $('#' + this.fieldName + '_map-modal').modal('hide');
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
        model.latitude = location.lat();
        model.longtitude = location.lng();
    },

    initMap: function () {
        var _self = this;
        var model = this.getModel();

        var pos = {
            lat: model.latitude,
            lng: model.longtitude
        };

        model.map = new google.maps.Map(document.getElementById(this.fieldName + '_map'), {
            center: pos,
            zoom: model.zoomLevel
        });
        
        model.marker = new google.maps.Marker({
            position: pos,
            map: model.map
        });
        
        google.maps.event.addListener(model.map, 'click', function (event) {
            _self.placeMarker(event.latLng, model.marker, model.map);
        });
    
    },

    changeCoordinatesManually: function () {
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

    setLatLngManually: function (action) {
        var model = this.getModel();

        if (action === false) {
            model.mapCheckSetLatLng = false;
            this.changeCoordinatesManually();
        }
        else if (action === true) {
            moveMarker(model.map, model.marker, model.latitude, model.longtitude);
            model.mapCheckSetLatLng = false;
           
            this.changeCoordinatesManually();
        }
    },

    template: function () {
        return "<div id='" + this.id + "'>" +
            "<div class='form-group form-inline col-lg-" + this.colspan + " rowspan" + (this.rowspan ? this.rowspan : '') + " resizable'>" +
                "<label>{label}</label><br>" +
                    "<div class='col-sm-12' style='padding:0px'>" + 
                    "<label style='margin-right:5px'>Latitude: </label>" + 
                    "<input type='text' class='form-control' rv-value='latitude' rv-placeholder='latitude'  disabled>" +
                    "<label style='margin-right:5px; margin-left:5px'>Longtitude: </label>" + 
                    "<input type='text' class='form-control' rv-value='longtitude' rv-placeholder='longtitude' disabled>" +
                    "<button class='form-control btn btn-default' rv-on-click='openMap'><span style='color:#f39c12'>Harta</span> <span style='color:#f39c12' class='glyphicon glyphicon-map-marker'></span></button>" +
                "</div>" + 
            "</div>" +
            "<div id='" + this.fieldName + "_map-modal' class='modal fade' role='dialog'>" + 
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
                                            "<input type='checkbox' rv-checked='mapCheckSetLatLng' rv-on-change='changeCoordinatesManually'><strong>Ndrysho</strong>" + 
                                        "</label>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='col-xs-4' style='padding:0px'>" +
                                    "<div class='col-xs-3' style='padding-right:0px; padding-top:10px'>" +
                                        "<label for='" + this.fieldName + "_mapSetLat'>Lat:</label>" + 
                                    "</div>" +
                                    "<div class='col-xs-9' style='padding:0px'>" +
                                        "<input type='number' class='form-control' rv-value='latitude' rv-placeholder='latitude' rv-disabled='mapSetLatDisabled'>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='col-xs-4' style='padding:0px'>" +
                                    "<div class='col-xs-3' style='padding-right:0px; padding-top:10px'>" +
                                        "<label for='" + this.fieldName + "_mapSetLng' > Lng: </label>" +
                                    "</div>" +
                                    "<div class='col-xs-9' style='padding:0px'>" +
                                        "<input type='number'  class='form-control' rv-value='longtitude' rv-placeholder='latitude' rv-disabled='mapSetLongDisabled'>" +
                                    "</div>" +
                                "</div>" +
                               "<div class='col-xs-2 pull-right' style='padding-right:0px'>" +
                                    "<button rv-class='setLatLongOkBtnClass' rv-on-click='setLatLngManually' data-on-click='true'>Ok</button>" +
                                    "<button rv-class='setLatLongCancelBtnClass' rv-on-click='setLatLngManually' data-on-click='false'>X</button>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                        "<div id='" + this.fieldName + "_map' style='height: 400px;width: 100%;'></div>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                        "<button class='btn btn-success' rv-on-click='mapAcceptPosition'>Ruaj Koordinatat</button>" +
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