<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_amount
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi moneyamount sipas funksioneve qe permban kjo klase.
 *
 * @author Stela Dedja
 */
class html_amount extends html_element {
    /**
     * Funksioni render()
     * 
     * Kthen html e ndertimit te elementit.
     * @return html code
     */
    public function render() {
		if(isNullOrEmpty($this->col_span) || $this->col_span == 0)
			$this->col_span = 2;

        // kapim rekordin ne tabelen moneyamount me ane te vleres se ruajtur ne forme
        $amount = "";
        $currency = "ALL";
        $moneyamount_id = "-666";
        if(isset($this->field_value) && is_numeric($this->field_value) && $this->field_value > 0) {
            $sql = "select * from moneyamount where moneyamount_id = {$this->field_value}";
            $moneyamount = database_helper::database()->db->executeQuery($sql);
            $moneyamount = (object)$moneyamount[0];
            $amount = $moneyamount->amount;
            $currency = $moneyamount->currency;
            $moneyamount_id = $moneyamount->moneyamount_id;
        }

        // lista e monedhave 
        $monedhat = database_helper::database()->db->executeQuery("select * from monedha where fshire = 0 order by emri");
        $monedhatHtmlCombo = "<select class='form-control' style='display:inline;' name='type_{$this->field_name}' id='{$this->form_field_id}_b'  >";
        foreach ($monedhat as $key => $monedha) {

            $monedha= (object)$monedha;
            if($currency == $monedha->monedha_id) {
                $monedhatHtmlCombo .= "<option value='{$monedha->monedha_id}' selected='selected'>{$monedha->emri}</option>";
            }
            else {
                $monedhatHtmlCombo .= "<option value='{$monedha->monedha_id}'>{$monedha->emri}</option>";
            }
        }
        $monedhatHtmlCombo .="</select>";

		
        return
            "<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span} resizable'>
                <div id='{$this->field_name}-block'>
                <label for='{$this->field_name}'>{$this->label} {$this->required}</label>
				<span class='block-process'> {$this->block_process_attribute} </span>
                <div class='row'>
					<div class='col-lg-8'>
						<input type='text' style='display:inline; '
							class='number form-control' name='{$this->field_name}' id='{$this->field_name}' value='{$amount}' /> 
						
                    </div>
					<div class='col-lg-4'>
                        <input type='hidden' name='moneyamount_id_{$this->field_name}' value='{$moneyamount_id}'/>
						{$monedhatHtmlCombo}
					</div>
                </div>
               ".
                $this->html_tooltip() . 
            "</div>
             </div>";
    }
    public function render_old() {
        return 
            "<div class='form-group col-lg-4 colspan{$this->col_span} rowspan{$this->row_span}'>
                <label for='{$this->field_name}'>{$this->label}</label>
                <div>
                    <input type='text' style='width:152px; padding-right:0px; height:32px; display:inline; margin-right:0px;'
                        class='number form-control' name='{$this->field_name}' id='{$this->form_field_id}' value='{$this->field_value}' /> 
                    <span class='number_type'></span>
                    <select class='form-control' style='width:88px; height:32px; display:inline; padding-left: 4px;'
                        name='type_{$this->field_name}' id='{$this->form_field_id}_b'  >
                        <option value='2' selected='selected'>ALL </option>
                        <option value='1'>EUR &#8364</option>
                        <option value='3'>USD &#36</option>
                    </select>
                </div>".
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

    public function formVariables() {
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
        return 
            $this->formVariables() . 
            "
                $('input.number').formance('format_number');
            ";
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
