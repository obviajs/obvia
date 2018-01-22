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
 * @author Kreatx
 */
class html_repeater extends html_element {
    /**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */
    public function render() {

        //is submited ?
        if($this->field_value == 0)
        $html =
            "<div class = 'col-lg-4 resizable'>".
                "<label {$this->versionStyle} >" . $this->label . ' ' . $this->required ."</label>".
                "<div class='form-group form-inline'>".
                "<div id='holder'></div>".
                "<input type='hidden' value='0' name='".$this->field_name."_length' id='length_input'>".
                "<button type='button' class='btn btn-default' id='add_input'>".
                    "<span class='glyphicon glyphicon-plus'></span>".
                "</button>".
                " <button type='button' class='btn btn-danger' id='remove_input'>".
                    "<span class='glyphicon glyphicon-remove'></span>".
                "</button>".
                "</div>".
            "</div>".
            "<script>".
                "   $('#remove_input').hide();
                    var counter = 0;
                    $('#add_input').click(function(){
                        $('#remove_input').show();
                        counter++;
                        $('#length_input').val(counter);
                        $('#holder').append('<input type=\'number\' class=\'col-lg-2 form-control\' name=\'".$this->field_name."_'+counter+'\' style=\'margin-right:5px; margin-bottom:5px\' placeholder=\'".$this->tooltip."\'>');
                    });
                    $('#remove_input').click(function(){
                        var length = $('#holder input').length;
                        if(length == 1)
                           $('#remove_input').hide();
                        $('#holder input:last-child').remove();
                        counter--;
                        $('#length_input').val(counter);
                });".
            "</script>";
        else
            $html =
                "<div class = 'col-lg-4 resizable'>".
                    "<label>" . $this->label . ' ' . $this->required ."</label>".
                    "<div class='form-group form-inline'>".
                        "<div id='holder'>".
                        $this->holderHTML.
                        "</div>".
                        "<input type='hidden' value='0' name='".$this->field_name."_length' id='length_input'>".
                        "<button type='button' class='btn btn-default' id='add_input'>".
                        "<span class='glyphicon glyphicon-plus'></span>".
                        "</button>".
                    " <button type='button' class='btn btn-danger' id='remove_input'>".
                    "<span class='glyphicon glyphicon-remove'></span>".
                    "</button>".
                    "</div>".
                "</div>".
                "<script>".
                    "var counter =  $('#holder input').length;
                    $('#length_input').val(counter);
                    $('#add_input').click(function(){
                        $('#remove_input').show();
                        counter++;
                        $('#length_input').val(counter);
                        $('#holder').append('<input type=\'number\' class=\'col-lg-2 form-control\' name=\'".$this->field_name."_'+counter+'\' style=\'margin-right:5px; margin-bottom:5px\' placeholder=\'".$this->tooltip."\'>');
                    });
                    $('#remove_input').click(function(){
                        var length = $('#holder input').length;
                        if(length == 1)
                           $('#remove_input').hide();
                        $('#holder input:last-child').remove();
                        counter--;
                        $('#length_input').val(counter);
                });".
                "</script>";
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
