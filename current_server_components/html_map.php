<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_map
 * 
 * Ben extends html_element.php.
 * <br/>
 *
 * @author Kreatx
 */
class html_map extends html_element {
    /**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */

    private $longitude;
    private $latitude;
    private $zoomlevel;

    public function render() {
        $this->reg = registry::getInstance();
        $connections = json_decode(CONNECTIONS);
        $this->flower = $this->reg->init('dbabstraction', $connections->flower, 'flower');
        $this->flower_generated = $this->reg->init('dbabstraction', $connections->flower_generated, 'flower_generated');

        $this->latitude = 41.1533;
        $this->longitude = 20.1683;
        $this->zoomlevel = 7;
        $id_location = empty($this->field_value) ? -666 : $this->field_value;

        $locationobj = $this->reg->init("location", $this->flower);
        $location = $locationobj->load("location_id = {$id_location} and deleted = 0");

        if(is_array($location) && count($location) > 0) {
            $location = $location[0];
            $this->latitude = $location->latitude;
            $this->longitude = $location->longitude;
            $this->zoomlevel = intval($location->zoomlevel);
        }

        if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
            $this->col_span = 2;
        $html = "
        <style>
            #{$this->field_name}_map {
                height: 400px;
                width: 100%;
            }
        </style>
        <div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span} resizable'>
			<label>{$this->label}</label><br>
			<div class=\"col-sm-4\" style=\"padding:0px\">
				<input type=\"text\" class=\"form-control\" id='{$this->field_name}_viewlat' value='lat:{$this->latitude}' placeholder=\"latitude\"  disabled>
			</div>
			<div class=\"col-sm-4\" style=\"padding:0px\">
				<input type=\"text\" class=\"form-control\" id='{$this->field_name}_viewlng' value='lng:{$this->longitude}' placeholder=\"longitude\" disabled>
			</div>
			<!-- <div class=\"col-sm-3\" style=\"padding:0px\">
				<input type=\"text\" class=\"form-control\" placeholder=\"zoom\">
			</div> -->
			<div class=\"col-sm-4\" style=\"padding:0px\">
				<button class='form-control btn btn-default' id='{$this->field_name}_mapOpenBtn'><span style='color:#f39c12'>Harta</span> <span style='color:#f39c12' class='glyphicon glyphicon-map-marker'></span></button>
			</div>
        </div>
        <div id='{$this->field_name}_map-modal' class='modal fade' role='dialog'>
            <div class='modal-dialog'>
                <div class='modal-content'>
                    <div class='modal-header'>
                        <button type='button' class='close' data-dismiss='modal'>&times;</button>
                        <h4 class='modal-title'>Zgjidh Vendodhjen</h4>
                    </div>
                    <div class='modal-body'>
                        <input type='hidden' name='{$this->field_name}_map_lat' id='{$this->field_name}_map_lat' value='{$this->latitude}'/>
                        <input type='hidden' name='{$this->field_name}_map_lng' id='{$this->field_name}_map_lng' value='{$this->longitude}'/>
                        <input type='hidden' name='{$this->field_name}_map_zoom' id='{$this->field_name}_map_zoom' value='{$this->zoomlevel}'/>
                        <div class=\"col-lg-12\">
                            <div class=\"form-group row\">
                                <div class=\"col-xs-2\" style=\"padding-top:8px\">
                                   <div class=\"\">
                                      <label class=\"control-label\"><input type=\"checkbox\" id='{$this->field_name}_mapCheckSetLatLng' onchange='changeCoordinatesManually()' value=\"\"><strong>Ndrysho</strong></label>
                                   </div>
                                </div>
                                <div class=\"col-xs-4\" style=\"padding:0px\">
                                    <div class=\"col-xs-3\" style=\"padding-right:0px; padding-top:10px\">
                                        <label for='{$this->field_name}_mapSetLat'>Lat:</label>
                                    </div>
                                    <div class=\"col-xs-9\" style=\"padding:0px\">
                                        <input type=\"number\" id='{$this->field_name}_mapSetLat' name='{$this->field_name}_mapSetLat' class=\"form-control\" value='{$this->latitude}' placeholder=\"latitude\" disabled>
                                    </div>
                                </div>
                                <div class=\"col-xs-4\" style=\"padding:0px\">
                                    <div class=\"col-xs-3\" style=\"padding-right:0px; padding-top:10px\">
                                        <label for='{$this->field_name}_mapSetLng'>Lng:</label>
                                    </div>
                                    <div class=\"col-xs-9\" style=\"padding:0px\">
                                        <input type=\"number\" id='{$this->field_name}_mapSetLng' name='{$this->field_name}_mapSetLng' class=\"form-control\" value='{$this->longitude}' placeholder=\"latitude\" disabled>
                                    </div>
                                </div>
                                <!-- <div class=\"col-xs-3\">
                                    <input type=\"text\" class=\"form-control hide\" placeholder=\"zoom\">
                                </div> -->
                                <div class=\"col-xs-2 pull-right\" style=\"padding-right:0px\">
                                    <button id='{$this->field_name}_mapSetLatLngOk' class=\"btn btn-success hide\" onclick='setLatLngManually(true)'>Ok</button>
                                    <button id='{$this->field_name}_mapSetLatLngCancel' class=\"btn btn-warning hide\" onclick='setLatLngManually(false)'>X</button>
                                </div>
                            </div>
                        </div>
                        <div id='{$this->field_name}_map'></div>
                    </div>
                    <div class='modal-footer'>
                        <button class='btn btn-success' id='{$this->field_name}_mapAcceptPosition'>Ruaj Koordinatat</button>
                    </div>
                </div>
            </div>
        </div></br>
        <script>
            var ". $this->field_name ."_map;
            var ". $this->field_name ."_marker = null;
            
            function moveMarker( map, marker, lat, lng ) {
                //delayed so you can see it move
                setTimeout( function(){    
                    marker.setPosition( new google.maps.LatLng( lat, lng ) );
                    map.panTo( new google.maps.LatLng( lat, lng ) );
                }, 500);
            }

            function initMap() {
                var pos = {lat: ". $this->latitude .", lng: ". $this->longitude ."};
                ". $this->field_name ."_map = new google.maps.Map(document.getElementById('". $this->field_name ."_map'), {
                   center: pos,
                   zoom: ". $this->zoomlevel ."
                });
               
                if($id_location != -666) {
                	". $this->field_name ."_marker = new google.maps.Marker({
                    	position: pos, 
                    	map: ". $this->field_name ."_map
                	});
                }
                    
                google.maps.event.addListener(". $this->field_name ."_map, 'click', function(event) {
                    placeMarker(event.latLng);
                });

                function placeMarker(location) {
                    if(". $this->field_name ."_marker != null) ". $this->field_name ."_marker.setMap(null);
                    ". $this->field_name ."_marker = new google.maps.Marker({
                        position: location, 
                        map: ". $this->field_name ."_map
                    });
                    
                    //shkruajme koordinatat e marker
                    var location = ". $this->field_name ."_marker.getPosition();
                    $('#".$this->field_name."_mapSetLat').val( location.lat() );
                    $('#".$this->field_name."_mapSetLng').val( location.lng() );
                }
            }
            
            function changeCoordinatesManually() {
                if($('#{$this->field_name}_mapCheckSetLatLng').is(':checked')) {
                    $('#{$this->field_name}_mapSetLat').prop('disabled', false);
                    $('#{$this->field_name}_mapSetLng').prop('disabled', false);
                    
                    $('#{$this->field_name}_mapSetLatLngOk').removeClass('hide');
                    $('#{$this->field_name}_mapSetLatLngCancel').removeClass('hide');
                }
                else {
                    $('#{$this->field_name}_mapSetLat').prop('disabled', true);
                    $('#{$this->field_name}_mapSetLng').prop('disabled', true);
                    
                    $('#{$this->field_name}_mapSetLatLngOk').addClass('hide');
                    $('#{$this->field_name}_mapSetLatLngCancel').addClass('hide');
                }
            }
            
            function setLatLngManually(action) {
                event.stopPropagation();
                event.preventDefault();
                if(action === false) {
                    $('#{$this->field_name}_mapCheckSetLatLng').prop('checked', false);
                    changeCoordinatesManually();
                    
                    //Cancel clicked, vendosim koordinatat aktuale 
                    var location = ". $this->field_name ."_marker.getPosition();
                    $('#".$this->field_name."_mapSetLat').val( location.lat() );
                    $('#".$this->field_name."_mapSetLng').val( location.lng() );
                }
                else if(action === true) {
                    var newLat = $('#{$this->field_name}_mapSetLat').val();
                    var newLng = $('#{$this->field_name}_mapSetLng').val();
                    
                    moveMarker(". $this->field_name ."_map, ". $this->field_name ."_marker, newLat, newLng );
                    
                    $('#{$this->field_name}_mapCheckSetLatLng').prop('checked', false);
                    changeCoordinatesManually();
                }
            }

            $('#{$this->field_name}_mapOpenBtn').on('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                $('#{$this->field_name}_map-modal').modal('show');
                //$('#form_loader_2').fadeOut(); 
            })

            $('#{$this->field_name}_map-modal').on('shown.bs.modal', function() {
                google.maps.event.trigger(". $this->field_name ."_map, 'resize');

                // after the resize event, we need to adjust the center of the map
                if( ". $this->field_name ."_marker) {
                	". $this->field_name ."_map.setCenter( ". $this->field_name ."_marker.getPosition() );
                }
                moveMarker(". $this->field_name ."_map, ". $this->field_name ."_marker, $('#".$this->field_name."_map_lat').val(), $('#".$this->field_name."_map_lng').val() );
            })

            $('#{$this->field_name}_mapAcceptPosition').on('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                var location = ". $this->field_name ."_marker.getPosition();
                var zoom = ". $this->field_name ."_map.getZoom();

                $('#".$this->field_name."_map_lat').val( location.lat() );
                $('#".$this->field_name."_map_lng').val( location.lng() );
                $('#".$this->field_name."_map_zoom').val( zoom );
                
                // shfaqja e latitude dhe longitude ne forme, ngjitur me btn qe hap harten
                $('#".$this->field_name."_viewlat').val( 'lat:' + location.lat() );
                $('#".$this->field_name."_viewlng').val( 'lng:' + location.lng() );
                
                $('#".$this->field_name."_mapSetLat').val( location.lat() );
                $('#".$this->field_name."_mapSetLng').val( location.lng() );
                
                $('#{$this->field_name}_map-modal').modal('hide');
            })
        </script>
        <script async defer src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyD04Q93F3BcHhGl483rfMC_MD1Y8y7K0lo&callback=initMap\"></script>
        ";
        return $html;

    }    
    public function render_modify_form() {
        $html = "";

        return $html;
    }
    /**
     * Funksioni script_additional
     * 
     * Nese ka scripte qe jane jashte funksioni document.ready() shenohen ketu.
     *  kjo per arsye qe document ready ne fund te gjenerimit te elementeve te perdoret vetem nje here.
     * 
     * @return string Kodi ne javascript
     */
    public function script_additional() {
        return "";
    }

    public function formVariables(){
        return "";
    }

    /**
     * Funksioni script_load()
     * 
     * Merr te gjitha scriptet qe duhet te vendosen ne document ready qe te jene gati ne loadimin e formes.
     * @return string
     */
    public function script_load() {
        return "";
    }
    /**
     * Funksioni validation_messazhe()
     * 
     * Ky funsksion merr te gjith mesazhet e validimit qe do te kthen nga validimi i elementeve.
     * @return string mesazhet e validimit ne nje array.
     */
    public function validation_messages() {
        return "";
    }
    /**
     * Funksioni validation_rules()
     * 
     * Ky funsksion merr te gjith rregullat e validimit qe do te vendosen per validimi i elementeve.
     * @return array rregullat e validimit ne nje array.
     */
    public function validation_rules() {
        return "";
    }
    /**
     * Funksioni include_scripts()
     * 
     * Kthen te gjitha filet .js qe duhet te perfshijme si referenca ne loadin e ketij elementi.
     * <br/>Filet jane te renditur sipas rradhes.
     * @return array filet .js
     */
    public function include_scripts() {
        return array();
    }
    /**
     * Funksioni Include_styles()
     * 
     * Kthen te gjitha filet .css qe duhet te perfshijme si referenca ne loadin e ketij elementi.
     * @return array filet .css
     */
    public function include_styles() {
        return array();
    }

}
