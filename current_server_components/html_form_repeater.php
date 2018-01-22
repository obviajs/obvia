<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_repeater
 *
 * Ben extends html_element.php.
 * <br/>
 *
 * @author Mateo Jovani
 */
class html_form_repeater extends html_element {
    /**
     * Funksioni render()
     *
     * Kthen html e ndertimit te elementit.
     * @return html code
     */

    public $repeated_form_id;

    public $repeat_depth;

    public function render() {

        if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
            $this->col_span = 2;

        if($this->repeat_depth == 0 || $this->repeat_depth == '')
            $this->repeat_depth = 1;


        $html =
            "<div id='holder_".$this->field_name."'></div>".
            "<input type='hidden' value='".$this->repeated_form_id."' name='repeated_form_id'>".
            "<div id='actions_".$this->field_name."'' class = 'col-md-offset-10 col-lg-2'>".
            "<button type='button' class='btn btn-default' id='add_".$this->field_name."'>".
            "<span class='glyphicon glyphicon-plus'></span>".
            "</button>".
            " <button type='button' class='btn btn-danger' id='remove_".$this->field_name."'>".
            "<span class='glyphicon glyphicon-remove'></span>".
            "</button>".
            "</div>".
            "<script>
					var id_process = $(\"[name='id_process']\").val();
					var id_case = $(\"[name='id_case']\").val();
                    var data;
                    var counter = ".$this->repeat_depth.";
                    if(counter == 1) $('#remove_".$this->field_name."').hide();
					
			";

        for($i=1; $i<=$this->repeat_depth; $i++){
            $html .= "	    setTimeout(function(){ 
                                $.ajax({url: '?forms/generate_form_repeat_data/".$this->repeated_form_id."/'+id_process+'/'+id_case+'/".$i."', 
								success: function(data)
								{
									data = JSON.parse(data);    
								
									$('#holder_".$this->field_name."').append('<div class=\'child_form\'>'+data.render+'<div class=\'col-lg-12\'><hr></div></div>');
									var script = document.createElement( 'script' );
									script.type = 'text/javascript';
									script.id = 'script_holder_".$this->field_name."_".$i."';
									$('#holder_".$this->field_name."').append(script);
									$('#'+script.id).html(data.script_load);
									$('.checkbox').bootstrapToggle();

								}
							    });
                            }, ".$i."*500);
					
							";

        }

        $html .=   "$(document).on('click', '#add_".$this->field_name."', function(){						
                        $('#remove_".$this->field_name."').show();
                        counter++;
						$('#length_input_".$this->field_name."').val(counter);
						$.ajax({url: '?forms/generate_form_repeat_data/".$this->repeated_form_id."/'+id_process+'/'+id_case+'/'+counter, 
                            success: function(data)
                            {
                                data = JSON.parse(data);                             
                                $('#holder_".$this->field_name."').append('<div class=\'child_form\'>'+data.render+'<div class=\'col-lg-12\'><hr></div></div>');
                                var script = document.createElement( 'script' );
                                script.type = 'text/javascript';
                                script.id = 'script_holder_".$this->field_name."_'+counter;
                                $('#holder_".$this->field_name."').append(script);
                                $('#'+script.id).html(data.script_load);
                                $('.checkbox').bootstrapToggle();
                            }
                        });
                    });
                    
                    $('#remove_".$this->field_name."').click(function(){
                        $('#script_holder_".$this->field_name."_'+counter).remove();
                        counter--;
                        $('#holder_".$this->field_name." .child_form')[counter].remove();
						$('#length_input_".$this->field_name."').val(counter);
						if($('#holder_".$this->field_name." .child_form').length == 1)
								$('#remove_".$this->field_name."').hide();
                });".
            "</script>";

        return $html;

    }

    public function render_modify_form() {
        if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
            $this->col_span = 2;

        $html =
            "<div class = 'col-lg-".$this->col_span."'>".
            "<button type='button' class='btn btn-default' id='add_".$this->field_name."'>".
            "<span class='glyphicon glyphicon-plus'></span>".
            "</button>".
            " <button type='button' class='btn btn-danger' id='remove_".$this->field_name."'>".
            "<span class='glyphicon glyphicon-remove'></span>".
            "</button>".
            "</div>";

        return $html;
    }

    public function render_for_export()
    {
        $html = html_generator::generate_form_filledData($this->repeated_form_id, null, 0, 0, 0)->render;
        $html .=
            "<div id='holder_".$this->field_name."'></div>".
            "<input type='hidden' value='".$this->repeated_form_id."' name='repeated_form_id'>".
            "<div class = 'col-md-offset-10 col-lg-2'>".
            "<button type='button' class='btn btn-default' id='add_".$this->field_name."'>".
            "<span class='glyphicon glyphicon-plus'></span>".
            "</button>".
            " <button type='button' class='btn btn-danger' id='remove_".$this->field_name."'>".
            "<span class='glyphicon glyphicon-remove'></span>".
            "</button>".
            "</div>";

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
