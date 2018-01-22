<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_combobox
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi radiogroup sipas funksioneve qe permban kjo klase.
 */
class html_checkboxgroup extends html_element {
    
    public $optionsData;
    public $selectedValue;
    
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
			"<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span} resizable' id=\"{$this->field_name}_container\" >
                <div id='{$this->field_name}-block'>
				<label for='{$this->field_name}'>{$this->label} {$this->required}</label>
				<span class='block-process'> {$this->block_process_attribute} </span>
				{$this->createCheckBoxGroupOptions()} ".
                $this->html_tooltip() . "
			</div></div>";
    }
	
	public function createCheckBoxGroupOptions()
	{
		$html = "<div class='panel panel-default'>
					<div class='panel-body'>";
		foreach($this->optionsData as $optData)
		{
			if(in_array($optData->id, $this->selectedValue))
			{
				$html .= "<div class='checkbox-group'>
							<label><input type='checkbox' name='{$this->field_name}[]' id='{$optData->val}' value='{$optData->id}' checked>{$optData->val}</label>
						</div>";
			}
			else
			{
				$html .= "<div class='checkbox-group'>
								<label><input type='checkbox' name='{$this->field_name}[]' id='{$optData->val}' value='{$optData->id}' >{$optData->val}</label>
							</div>";
			}
		}
		$html .= "</div>
				</div>";
		return $html;
	}
	
    /**
     * Funksioni render_processView()
     * 
     * Kthen html e ndertimit te elementit. Perdoret vetem ne rastin kur view e formes hapet tek  krijimi i procesit
     * @return html code
     */
    public function render_processView() {
        return 
            "<div class='form-group col-lg-4 colspan{$this->col_span} rowspan{$this->row_span}' id=\"{$this->field_name}_container\" >
				<label for='{$this->field_name}'>{$this->label} {$this->required}</label>
				<span class='block-process'> {$this->block_process_attribute} </span>
				{$this->createCheckBoxGroupOptions()} ".
                $this->html_tooltip() . "
			</div>";
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
        
    }

    public function formVariables() {
        return "
            window.form_variables.{$this->field_name} = {
                                                                selector: $('#{$this->field_name}'),
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
        return $this->formVariables();
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