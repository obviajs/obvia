<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_day_month_year_hour_min
 * 
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi combobox sipas funksioneve qe permban kjo klase.
 * @var string $newrecord_action 
 * @var string $save_action
 * @var string $retrieve_action
 */
class html_day_month_year_hour_min extends html_element {
    
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
		if(isNullOrEmpty($this->col_span) || $this->col_span < 6)
			$this->col_span = 6;
		
        $fieldValue = $this->field_value;
		$selectedFieldValue = $this->field_value;
		if($fieldValue != "0000-00-00 00:00:00" && $fieldValue != "0000-00-00" && $fieldValue != null )
		{
            $date = DateTime::createFromFormat('Y-m-d h:i:s', $fieldValue);
            $yearValue = $date->format('Y');
            $monthValue = $date->format('m');
            $dayValue = $date->format('d');
			$hourValue = $date->format('h');
			$minValue = $date->format('i');
		}
		else
		{
			/* $yearValue = date("Y");
			$monthValue = date("m");
			$dayValue = date("d");
			$selectedFieldValue = date("Y-m-d"); */
			$selectedFieldValue = "";
		}
		
		$yearStart = 1900;
		$yearEnd = 2100;
		//$years = array_combine(range(date("Y"), $yearStart), range(date("Y"), $yearStart));
		$years = array_combine(range($yearEnd, $yearStart), range($yearEnd, $yearStart));
		foreach ($years as $item)
		{ 
			$selectedYear = "";
			if($item == (int)$yearValue)
				$selectedYear = "selected=\"selected\"";
			$yearHtml .= "<option value=\"$item\" $selectedYear >$item</option>";
		}
		for($day=1; $day<32; $day++)
		{ 
			if($day < 10)
				$day = "0".$day;
			else
				$day = (string)$day;
			$selectedDay = "";
			if($day == $dayValue)
				$selectedDay = "selected=\"selected\"";
			$dayHtml .= "<option value=\"$day\" $selectedDay >$day</option>";
		}
		for($month=1; $month<13; $month++)
		{ 
			if($month < 10)
				$month = "0".$month;
			else
				$month = (string)$month;
			$selectedMonth = "";
			if($month == $monthValue)
				$selectedMonth= "selected=\"selected\"";
			if($month == '01')
				$monthName = "Janar";
			if($month == '02')
				$monthName = "Shkurt";
			if($month == '03')
				$monthName = "Mars";
			if($month == '04')
				$monthName = "Prill";
			if($month == '05')
				$monthName = "Maj";
			if($month == '06')
				$monthName = "Qershor";
			if($month == '07')
				$monthName = "Korrik";
			if($month == '08')
				$monthName = "Gusht";
			if($month == '09')
				$monthName = "Shtator";
			if($month == '10')
				$monthName = "Tetor";
			if($month == '11')
				$monthName = "Nentor";
			if($month == '12')
				$monthName = "Dhjetor";
			
			$monthHtml .= "<option value=\"$month\" $selectedMonth >$monthName</option>";
		}
		for($hour=0; $hour<24; $hour++)
		{ 
			if($hour < 10)
				$hour = "0".$hour;
			else
				$hour = (string)$hour;
			$selectedHour = "";
			if($hour == $hourValue)
				$selectedHour = "selected=\"selected\"";
			$hourHtml .= "<option value=\"$hour\" $selectedHour >$hour</option>";
		}
		for($min=0; $min<60; $min++)
		{ 
			if($min < 10)
				$min = "0".$min;
			else
				$min = (string)$min;
			$selectedMin = "";
			if($min == $minValue)
				$selectedMin = "selected=\"selected\"";
			$minHtml .= "<option value=\"$min\" $selectedMin >$min</option>";
		}
		return 
            "<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span} resizable'
				id=\"{$this->field_name}_container\" >
				<div id='{$this->field_name}-block'>
				<label>{$this->label}</label> (Dite/Muaj/Vit Ore:minute)
				<div style=\"width: 100% !important;\"></div>
				<input type='hidden' name='{$this->field_name}' id='{$this->field_name}' value='{$selectedFieldValue}'/>
				<div style=\"width: 100% !important; float: left;\">
					
					<div style=\"width: 20% !important; float: left; padding-right: 5px;\">
						<!--label for='{$this->form_field_id}_day'>Dita{$this->required}</label-->
						<select class=\"form-control day_month_year_hour_min\"
							name=\"{$this->form_field_id}_day\" id=\"{$this->form_field_id}_day\">
							<option value=\"\">-Dita-</option>
							$dayHtml
						</select> 
					</div >
					<div style=\"width: 25% !important; float: left; padding-right: 5px;\">
						<!--label for='{$this->form_field_id}_month'>Muaji{$this->required}</label-->
						<select class=\"form-control day_month_year_hour_min\" name=\"{$this->form_field_id}_month\" id=\"{$this->form_field_id}_month\">
							<option value=\"\">-Muaji-</option>
							$monthHtml
						</select> 
					</div >
					<div style=\"width: 20% !important; float: left; padding-right: 5px;\">
						<!--label for='{$this->form_field_id}_Viti'>Viti{$this->required}</label-->
						<select class=\"form-control day_month_year_hour_min\" name=\"{$this->form_field_id}_year\" id=\"{$this->form_field_id}_year\">
							<option value=\"\">-Viti-</option>
							$yearHtml
						</select> 		
					</div>
					
					<div style=\"width: 20% !important; float: left; padding-left: 15px; padding-right: 5px;\">
						<!--label for='{$this->form_field_id}_Viti'>Ora{$this->required}</label-->
						<select class=\"form-control day_month_year_hour_min\" name=\"{$this->form_field_id}_hour\" id=\"{$this->form_field_id}_hour\">
							<option value=\"\">-Ore-</option>
							$hourHtml
						</select> 		
					</div>
					<div style=\"width: 15% !important; float: left;\">
						<!--label for='{$this->form_field_id}_Viti'>Ora{$this->required}</label-->
						<select class=\"form-control day_month_year_hour_min\" name=\"{$this->form_field_id}_min\" id=\"{$this->form_field_id}_min\">
							<option value=\"\">-Min-</option>
							$minHtml
						</select> 		
					</div>
				</div>
				</div>
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
	
	public function formVariables(){
        return "
            window.form_variables.{$this->field_name} = {
															selector: $('[id^={$this->form_field_id}_]'),
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
		   
			"$('.day_month_year_hour_min').change(function () {  
                
                var year = $('#{$this->form_field_id}_year').val();
                var month = $('#{$this->form_field_id}_month').val();
                var day = $('#{$this->form_field_id}_day').val();
                var hour = $('#{$this->form_field_id}_hour').val();
                var min = $('#{$this->form_field_id}_min').val();
				var dateVal = year + '-' + month + '-' + day + ' ' + hour + ':' + min; 
				//console.log(dateVal);
                $('#{$this->field_name}').val(dateVal);
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