<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_creditcard
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi kredit kard sipas funksioneve qe permban kjo klase.
 *
 * @author Stela Dedja
 */
class html_creditcard extends html_element {
    /**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */
    public function render() {
		if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
			$this->col_span = 2;
		
        return 
            "<div class='form-group  col-lg-{$this->col_span} rowspan{$this->row_span} resizable'>
                <label for='{$this->field_name}'>{$this->label} {$this->required}</label>
				<span class='block-process'> {$this->block_process_attribute} </span>
                <input type='text' class='credit_card_number form-control' name='{$this->field_name}' id='{$this->form_field_id}_a'/>
                <input type='hidden' name='{$this->field_name}_type' id='{$this->form_field_id}'/>
                <span class='credit_card_type' id='type_{$this->form_field_id}_a'></span>" .
                $this->html_tooltip() . 
            "</div>";
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
        return 
            "function getCreditCardType() {
                var id = $(this).attr('id');
                $('#type_'+ id).text(function() {
                    var val = $.formance.creditCardType($('#' + id).val());
                    if (val)
                        return val;
                    else
                        return 'invalid';
                });
                $('input#{$this->form_field_id}').val(function() {
                    var val = $.formance.creditCardType($('input#' + id).val());
                        if (val)
                            return val;
                        else
                            return 'invalid';
                });
            }";
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
        return
            "$('input#{$this->form_field_id}_a').formance('format_credit_card_number');
                
            $('input#{$this->form_field_id}_a')
                .change(getCreditCardType)
                .keypress(getCreditCardType); ";
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
