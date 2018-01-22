<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_password
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi password sipas funksioneve qe permban kjo klase.
 *
 * @author Stela Dedja
 */
class html_password extends html_element {
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
            "<div class='form-group col-lg-{$this->col_span} resizable'>
             <label {$this->versionStyle} for='{$this->field_name}'>{$this->label} {$this->required}</label>
			 <span class='block-process'> {$this->block_process_attribute} </span>
                <input type='password' name='{$this->field_name}' value='{$this->field_value}' class='form-control rowspan$this->row_span colspan$this->col_span'
                id='$this->form_field_id' placeholder='{$this->label}' autofocus/><span id='result'></span>".
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
        return "
            $('#form_loader').fadeOut();
            $('#$this->form_field_id').keyup(function()
	{
		$('#result').html(checkStrength($('#$this->form_field_id').val()))
	})	
	

	function checkStrength(password)
	{
		var strength = 0
	
		if (password.length < 6) { 
			$('#result').removeClass()
			$('#result').addClass('short')
			return 'Password too short' 
		}
	
		if (password.length > 7) strength += 1
		
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1
		
		//if it has numbers and characters, increase strength value
		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1 
		
		//if it has one special character, increase strength value
		if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1
		
		//if it has two special characters, increase strength value
		if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
		
		//now we have calculated strength value, we can return messages
		
		//if value is less than 2
		if (strength < 2 )
		{
			$('#result').removeClass()
			$('#result').addClass('weak')
			return 'Password weak'			
		}
		else if (strength == 2 )
		{
			$('#result').removeClass()
			$('#result').addClass('good')
			return 'Password good'		
		}
		else
		{
			$('#result').removeClass()
			$('#result').addClass('strong')
			return 'Password strong'
		}
	}";
    }
    /**
     * Funksioni validation_messazhe()
     * 
     * Ky funsksion merr te gjith mesazhet e validimit qe do te kthen nga validimi i elementeve.
     * @return string mesazhet e validimit ne nje array.
     */
    public function validation_messages() {
        if($this->required != "")
		{
			return
            "$this->field_name: { 
                required: 'Plotësoni fushën \"$this->label\"',
                minlength: 'Plotësoni më shumë se 6 karaktere' 
            }";
		}
		else
			return "";
    }
    /**
     * Funksioni validation_rules()
     * 
     * Ky funsksion merr te gjith rregullat e validimit qe do te vendosen per validimi i elementeve.
     * @return array rregullat e validimit ne nje array.
     */
    public function validation_rules() {
        if($this->required != "")
		{
			return
            "$this->field_name: { 
                required: true,
                minlength: 6 
            }";
		}
		else
			return "";
    }
    /**
     * Funksioni validation_rules()
     * 
     * Ky funsksion merr te gjith rregullat e validimit qe do te vendosen per validimi i elementeve.
     * @return array rregullat e validimit ne nje array.
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
