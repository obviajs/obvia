<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_form_status
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi combobox me statuset e formes sipas funksioneve qe permban kjo klase.
 * @var string $newrecord_action 
 * @var string $save_action
 * @var string $retrieve_action
 */
class html_form_status extends html_element {
    
    public $newrecord_action;
    public $save_action;
    public $retrieve_action;
    
    /**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */
    public function render() 
	{
		$options = $this->createOptions();
		
		return
			"<ul class='nav navbar-top-links navbar-right'>
				<li class='dropdown' >
					<a class='dropdown-toggle' data-toggle='dropdown' href='#' value='{$this->form_field_id}'>
						{$this->label} <i class='fa fa-caret-down'></i>
					</a>
					<ul class='dropdown-menu dropdown-user'>
						{$options}
					</ul>
				</li>
			</ul>";
    }
	
	public function createOptions()
	{
		$options = "";
		foreach($this->form_status_options as $statusOptions)
		{
			$options .= "<li> <a href='#' value='{$statusOptions->phase_status_id}'> {$statusOptions->phase_status_name} </a></li>";
		}
		return $options;
	}
    /**
     * Funksioni render_processView()
     * 
     * Kthen html e ndertimit te elementit. Perdoret vetem ne rastin kur view e formes hapet tek  krijimi i procesit
     * @return html code
     */
    public function render_processView() {
        return 
            "<div class='form-group col-lg-4 colspan{$this->col_span} rowspan{$this->row_span} resizable'
            id=\"{$this->field_name}_container\">
                <label for='{$this->field_name}'>{$this->label}*</label>
                <select name='{$this->field_name}[]' class=\"multiselect\" multiple=\"multiple\"
                id=\"{$this->form_field_id}\"></select> ".
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
		$selectedElements = json_encode($this->selectedElements);
		return
            '$(".btn-group li a").click(function()
			{
				var selText = $(this).text();
				var selVal = $(this).attr("value");
				$(this).parents(".btn-group").find(".dropdown-toggle").attr("value", selVal);
				$(this).parents(".btn-group").find(".dropdown-toggle").html(selText+" <span class=\'caret\'></span>");
			
			});';
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