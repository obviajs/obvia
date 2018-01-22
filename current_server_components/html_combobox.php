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
 * Realizon shfaqjen e nje elementi combobox sipas funksioneve qe permban kjo klase.
 * @var string $newrecord_action 
 * @var string $save_action
 * @var string $retrieve_action
 */
class html_combobox extends html_element {
    
    public $newrecord_action;
    public $save_action;
    public $retrieve_action;
    
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
            "<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span} resizable'
            id=\"{$this->field_name}_container\" >
                <div id='{$this->field_name}-block'>
				<label {$this->versionStyle} for='{$this->field_name}'>" . $this->label . ' ' . $this->required . "</label>
				<span class='block-process'> {$this->block_process_attribute} </span>
                <select class='form-control' name='{$this->field_name}[]' control-blocked='{$this->control_blocked_attribute}' style='min-width: 250px;'
                id=\"{$this->field_name}\"></select> ".
                $this->html_tooltip() .
            "</div></div>";
    }
    /**
     * Funksioni render_processView()
     * 
     * Kthen html e ndertimit te elementit. Perdoret vetem ne rastin kur view e formes hapet tek  krijimi i procesit
     * @return html code
     */
    public function render_processView() {
        return 
            "<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span}'
            id=\"{$this->field_name}_container\">
                <label {$this->versionStyle} for='{$this->field_name}'>{$this->label} {$this->required}</label>
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
        return "
            window.form_variables.{$this->field_name} = {
                                                            selector: $('#{$this->field_name}'),            
                                                            value: $('#{$this->field_name}').val(), 
                                                            block: $('#{$this->field_name}-block'),
                                                            source: '$(\'#{$this->field_name}\').val()'
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
		$selectedElements = json_encode($this->selectedElements);
        return
            $this->formVariables() .
           "                                            
           $('#{$this->field_name}').change(function (e) {  
                var thisVal = $('#{$this->field_name}').val(); 
                
                if(thisVal[0] == '#{$this->field_name}_new') {  
                    $('#{$this->field_name}_popup').fadeIn();   
                   $('#{$this->field_name}').multiselect('deselect', '#{$this->field_name}_new');
                }
            });          

            getData('{$this->retrieve_action}', '#{$this->field_name}', $selectedElements);                                                       
			//$.ajax({
            //        url: '{$this->newrecord_action}',
            //        type: 'POST',
            //        data: 'form_unique_name={$this->field_name}_popup&element_field_name={$this->field_name}&combo_newrecord_action={$this->newrecord_action}&combo_save_action={$this->save_action}&combo_retrieve_action={$this->retrieve_action}',
            //        success: function (data) {
            //            var html = data.replace('\\r\\n', '');
            //            while (html.indexOf('\\r\\n') > - 1)
            //                html = html.replace('\\r\\n', '');
            //            $('#{$this->field_name}_container').append(html);
            //            eval($('#{$this->field_name}_popup').find('script').text());
            //            //{$this->field_name}_popup_init();
            //        }
            //});";
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