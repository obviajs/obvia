<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_multiswitch
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi checkbox sipas funksioneve qe permban kjo klase.
 *
 * @author Kreatx
 */
class html_trippleswitch extends html_element {
    /**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */
    public function render() { 

		if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
			$this->col_span = 2;

        $btnSuccess = $btnDanger = $btnWarning = "";

        if($this->field_value != 1 && $this->field_value != 0) {
            $this->field_value = '-1';
            $btnWarning = "btn-warning";
        }
        else {

            $this->field_value == 1 ? $btnSuccess = "btn-success" : $btnDanger = "btn-danger";
        }

		// per te dhenat e deklaruara nga vete subjekti - 15.12.2016
		$btnSuccess = $btnDanger = $btnWarning = "";

        if($this->field_value != 1 && $this->field_value != 0) {
            $this->field_value = '-1';
            $btnWarning = "btn-warning";
        }
        else {

            $this->field_value == 1 ? $btnSuccess = "btn-success" : $btnDanger = "btn-danger";
        }
		//
		
        // per elemente te lidhura, nese nje element eshte i zgjedhur,
        // elementet e tjere te lidhur nuk mund te zgjidhen, njelloj si radiogroup
        if(isNullOrEmpty($this->ToggleSelected)) {
            $this->ToggleSelected = "";
        }
        /*$html =
            "<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span}'>" .
                    //for bootstrap-toogle doesn't work edit mode.
            "   <div class=\"row\">" .
            "       <div class=\"col-xs-12\">" .
            "           <div class=\"col-xs-2\">" .
            "               <input {$this->checked} switch-toggle='toggle' data-on='{$this->CheckedLabel}' data-off='{$this->UnCheckedLabel}'
                                data-style='slow' type='checkbox' id='{$this->field_name}' name='{$this->field_name}'/>".
            "           </div>" .
            "           <div class=\"col-xs-10\" style=\"padding-left:20px;\">" .
            "               <div style=\"padding-top: 5px;\">" .
            "                   <div>
    					            <label for='{$this->field_name}'>{$this->label} {$this->required} </label>
    					            <span class='block-process'> {$this->block_process_attribute} </span>
    				            </div>" .
                            $this->html_tooltip() . 
            "               </div>" .
            "           </div>" .
            "       </div>" .


            "    </div>" .
            "</div>";*/

            $html ="<div class='col-lg-{$this->col_span}' id='{$this->field_name}-block' resizable' style=\" padding-bottom: 10px;\">" .
			/*"         	<div class='col-lg-2' style='en' > 
							<div class='btn btn-group btn-group-sm disabled' role='group'> " .
			"   	            <button type='button' id='{$this->field_name}_xyz_on' " .
			"      	                 data-target='{$this->field_name}_xyz'" .
			"      	                 class='btn {$btnSuccess_xyz}'>" .
									$this->CheckedLabel . "</button> " .

			"      	             	<button type='button' id= '{$this->field_name}_xyz_null' " .
			"                       	data-target='{$this->field_name}_xyz'" .
			"                       	class='btn {$btnWarning_xyz}'>x</button>" .

			"                  		<button type='button' id='{$this->field_name}_xyz_off'" .
			"                      	 data-target='{$this->field_name}_xyz'" .
			"                        class='btn {$btnDanger_xyz}'>" .
										$this->UnCheckedLabel . "</button> " .
			"             	</div> " .
			"           </div> " .*/
            "   		<div class='col-lg-9' >" .      
			"				<div class='input-group'>" .
			" 	              	<input type='hidden' id='" . $this->field_name . "' name='" . $this->field_name . "' value='{$this->field_value_xyz}' data-toggle-selected='{$this->ToggleSelected}'/>" .
			"      	         	<div style=\" overflow:hidden;\">" .
			"    	              	<label {$this->versionStyle} for='{$this->field_name}'>" . $this->label . ' ' . $this->required . "</label>" .
            "               	</div>" .
            "            	</div>" .
            "       	</div>".
			"         	<div class='col-lg-3' > 
							<div class='btn btn-group btn-group-sm' role='group'> " .
			"   	            <button type='button' id='{$this->field_name}_on' " .
			"      	                 data-target='{$this->field_name}'" .
			"      	                 onclick='handleOnClick(this)' class='btn {$btnSuccess}'>" .
									$this->CheckedLabel . "</button> " .

			"      	             	<button type='button' id= '{$this->field_name}_null' " .
			"                       	data-target='{$this->field_name}'" .
			"                       	onclick='handleNullClick(this)' class='btn {$btnWarning}'>x</button>" .

			"                  		<button type='button' id='{$this->field_name}_off'" .
			"                      	 data-target='{$this->field_name}'" .
			"                       	onclick='handleOffClick(this)' class='btn {$btnDanger}'>" .
										$this->UnCheckedLabel . "</button> " .
			"             	</div> " .
			"           </div> " .
            "       </div>";

        return $html;
			
    }    
    public function render_modify_form() {
		if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
			$this->col_span = 2;

        if(isNullOrEmpty($this->CheckedLabel)) {
            $this->CheckedLabel = "Po";
        }
        if(isNullOrEmpty($this->UnCheckedLabel)) {
            $this->UnCheckedLabel = "Jo";
        }

        $html ="<div class='col-lg-{$this->col_span} resizable'> " .
        "               <label for='{$this->field_name}'>" . $this->label . ' ' . $this->required . "</label>" .
        "           <div class='input-group'>" .
        "               <div class='btn btn-group btn-group-sm' role='group'> " .
        "                   <button type='button'" .
        "                       data-target='{$this->field_name}'" .
        "                       class='btn btn-success'>" .
                                $this->CheckedLabel . "</button> " .

        "                   <button type='button'" .
        "                       data-target='{$this->field_name}'" .
        "                        class='btn btn-warning'>x</button>" .

        "                   <button type='button'" .
        "                       data-target='{$this->field_name}'" .
        "                       class='btn btn-danger'>" .
                                $this->UnCheckedLabel . "</button> " .
        "               </div> " .
        "           </div>" .
        "       </div>";
        //print_r($html);exit;
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

    public function formVariables() {
        return "window.form_variables.{$this->field_name} = {
                                                                selector: $('#{$this->field_name}-block')
                                                                block: $('#{$this->field_name}-block'),
                                                            };";
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
