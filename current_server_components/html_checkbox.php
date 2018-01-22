<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_checkbox
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi checkbox sipas funksioneve qe permban kjo klase.
 *
 * @author Stela Dedja
 */
class html_checkbox extends html_element {
    /**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */
    public function render() {
		if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
			$this->col_span = 2;
		
        $html =
            "<div id='checkbox_{$this->field_name}' class='form-group col-lg-{$this->col_span} rowspan{$this->row_span} resizable'>" .
            //for bootstrap-toogle doesn't work edit mode.
            " <div id='{$this->field_name}-block'>" .
            " <label {$this->versionStyle} for='{$this->field_name}'>{$this->label} {$this->required} </label>".
            "   <div class=\"row\">" .
            "       <div class=\"col-xs-12\">" .
            "           <div class=\"col-xs-2\">" .
            "               <input {$this->checked} switch-toggle='toggle' data-on='{$this->CheckedLabel}' data-off='{$this->UnCheckedLabel}'
                                data-style='slow' type='checkbox' id='{$this->field_name}' class='checkbox' name='{$this->field_name}'/>".
            "           </div>" .
            "           <div class=\"col-xs-10\" style=\"padding-left:20px;\">" .
            "               <div style=\"padding-top: 5px;\">" .
            "                   <div>
    					           
    					            <span class='block-process'> {$this->block_process_attribute} </span>
    				            </div>" .
                            $this->html_tooltip() . 
            "               </div>" .
            "           </div>" .
            "       </div>" .
            "    </div>" .
            "    </div>" .
            "</div>";

        return $html;
			
    }   
    
    public function formVariables() {
        return "
            window.form_variables.{$this->field_name} = {
                                                            block: $('#{$this->field_name}-block'),
                                                            selector: $('#{$this->field_name}'),
                                                            value: $('#{$this->field_name}')[0] ? $('#{$this->field_name}')[0].checked.toString() : undefined, 
                                                            source: '$(\'#{$this->field_name}\')[0].checked.toString()'
                                                        };
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
        return $this->formVariables();
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
