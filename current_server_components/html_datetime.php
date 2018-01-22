<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_datetime
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi datetime sipas funksioneve qe permban kjo klase.
 *
 */
class html_datetime extends html_element {
	
    public $is_datetime = false;
    public $is_datetimeType = true;
	/**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */
    public function render() {
		if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
			$this->col_span = 2;
		
       // print_r("html_datetime");
        //print_r(json_encode($this->is_datetime));exit;
		if($this->is_datetime == true)
		{
			if($this->field_value != null && $this->field_value != "0000-00-00 00:00:00")
				$this->field_value = date("d/m/Y H:i", strtotime( $this->field_value));
			$dateFormat = "DD/MM/YYYY HH:mm";
		}	
		else if($this->is_datetime == false)
		{
			if($this->field_value != null && $this->field_value != "0000-00-00 00:00:00")
				$this->field_value = date("d/m/Y", strtotime( $this->field_value));
			$dateFormat = "DD/MM/YYYY";
		}
	
		return 
            "<div class='form-group col-lg-{$this->col_span} resizable'>" .
                "<div id='{$this->field_name}-block'>" .
                "<label for='{$this->field_name}'>{$this->label} {$this->required}</label>
				<span class='block-process'> {$this->block_process_attribute} </span>
                <input type='{$this->type_name}' name='{$this->field_name}' value='{$this->field_value}'
                class='form-control data-calendar' id='date_{$this->form_field_id}' 
                placeholder=\"{$this->label}\" autofocus/>".
            $this->html_tooltip() . 
            "</div></div>
			";
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
        return "
            window.form_variables.{$this->field_name} = {    
                                                            selector: $('#{$this->field_name}'),
                                                            value: $('#date_{$this->form_field_id}').val(),
                                                            source: '$(\'#date_{$this->form_field_id}\').val()',
                                                            block: $('#{$this->field_name}-block')
                                                        };
        ";
    }

    /**
     * Funksioni script_load()
     * 
     * Merr te gjitha scriptet qe duhet te vendosen ne document ready qe te jene gati ne loadimin e formes.
     * @return string
     */
    public function script_load() {
		if($this->is_datetime == true)
			$dateFormat = "DD/MM/YYYY HH:mm";
		else if($this->is_datetime == false)
			$dateFormat = "DD/MM/YYYY";
        return 
            $this->formVariables() .
            " 
				$('#date_{$this->form_field_id}').datetimepicker({
						format: '{$dateFormat}',
						minDate: '01/01/1900',
						maxDate: '01/01/2100',
						showTodayButton: true,
						showClear: true,
						widgetPositioning: {
							horizontal: 'left',
							vertical: 'auto'
						}
				});
			 ";
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
					required: 'Zgjidhni një datë'
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
					required: true
				}";
		}
		else
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
