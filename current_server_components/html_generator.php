<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Class html_generator
 * 
 * Funksioni statik generate_form()
 * 
 * Merr si parametra id e form dhe id e form submit.
 * <br/>Pasi merr si data rezultetin qe kthehet nga egzekutimi i query ne database
 * fillon dhe merr per secilin element kompleks te dhenat e caktuara nga tabelat.
 * pasi jane kaluar te gjith rastet e tipve kompleks merr te dhenat e pergjithshme
 * qe duhet per fields e nej forme.
 *
 */
include_once 'database_helper.php';

include_once 'html_amount.php';
include_once 'html_autocomplete.php';
include_once 'html_checkbox.php';
include_once 'html_combobox.php';
include_once 'html_creditcard.php';
include_once 'html_datetime.php';
include_once 'html_email.php';
include_once 'html_form.php';
include_once 'html_image.php';
include_once 'html_password.php';
include_once 'html_phone.php';
include_once 'html_text.php';
include_once 'html_textarea.php';
include_once 'html_upload.php';
include_once 'html_radiogroup.php';
include_once 'form_item.php';
include_once 'html_label.php';
include_once 'html_day_month_year.php';
include_once 'html_newline.php';
include_once 'html_colspan.php';
include_once 'html_day_month_year_hour_min.php';
include_once 'html_trippleswitch.php';
include_once 'html_repeater.php';
include_once 'html_map.php';
include_once 'html_text_editor.php';
include_once 'html_form_repeater.php';

class html_generator {

    static public function generate_form($form_id, $form_submit_id) {
        
        $data = database_helper::form_fields($form_id);
        $elements = array();

        foreach ($data as $e) {

            $element = new stdClass();
            switch ($e['type_name']) {

                case "autocomplete":
                    $element = new html_autocomplete();
                    $otherData = database_helper::data_autocomplete($e['extradata1']);
                    $element->autocomplete_action = $otherData["autocomplete_action"];
                    $element->browse_action = $otherData["browse_action"];
                    $element->load_action = $otherData["load_action"];
                    $element->form_submit_id = $form_submit_id;
                    $element->MultipleSelection = $e['extradata2'] ==="1" ? "true" : "false";
                    break;
                case "email":
                    $element = new html_email();
                    break;
                case "amount":
                    $element = new html_amount();
                    $element->form_submit_id = $form_submit_id;
                    $element->form_id = $form_id;
                    break;
                case "checkbox":
                    $element = new html_checkbox();
                    break;
                case "trippleswitch":
                    $element = new html_trippleswitch();
                    break;
				case "repeater":
                    $element = new html_repeater();
                    break;
				case "map":
                    $element = new html_map();
                    break;
                case "combobox":
                    $element = new html_combobox();
                    $otherData = database_helper::data_combobox($e['extradata1']);
                    $element->retrieve_action = $otherData["retrieve_action"];
                    $element->newrecord_action = $otherData["newrecord_action"];
                    $element->save_action = $otherData["save_action"];
                    break;
                case "ccnumber":
                    $element = new html_creditcard();
                    break;
                case "datetime":
                    $element = new html_datetime();
                    break;
                case "img":
                    $element = new html_image();
                    break;
                case "password":
                    $element = new html_password();
                    break;
                case "phone":
                    $element = new html_phone();
                    break;
                case "text":
                    $element = new html_text();
                    break;
				case "number":
                    $element = new html_number();
                    break;
                case "textarea":
                    $element = new html_textarea();
                    break;
                case "upload":
                    $element = new html_upload();
                    break;
                case "radiogroup":
					$element = new html_radiogroup();
                    break;
                case "label":
                    $element = new html_label();
                    break;
				case "newline":
                    $element = new html_newline();
                    break;
				case "colspan":
                    $element = new html_colspan();
                    break;
				case "day_month_year":
                    $element = new html_day_month_year();
                    break;
                case "day_month_year_hour_min":
                    $element = new html_day_month_year_hour_min();
                    break;
                case "text_editor":
                    $element = new html_text_editor();
                    break;
                case "form_repeater":
                    $element = new html_form_repeater();
                    break;
                case "checkboxgroup":
                    $element = new html_checkboxgroup();
                    break;
                default:
                    break;
            }
            $element->col_span = $e["col_span"];
            $element->row_span = $e["row_span"];
            $element->field_name = $e["field_name"];
            $element->form_field_id = $e["form_field_id"];
            $element->label = $e["label"];
            $element->tooltip = $e["tooltip"];
            $element->type_name = $e["type_name"];
            $element->form_name = $e['form_name'];

            array_push($elements, $element);
        }

        $form = new html_form();

        foreach ($elements as $e) {
            $form->render .= $e->render() . "\r\n";
            $form->script_load .= $e->script_load() . "\r\n";
            $form->script_additional .= $e->script_additional() . "\r\n";

            $form->variables[] = $e->formVariables();

            if (strlen($e->validation_rules()) > 0) {
                array_push($form->validation_rules, $e->validation_rules());
            }
            if (strlen($e->validation_messages()) > 0) {
                array_push($form->validation_messages, $e->validation_messages());
            }
        }
		
		//printtofile_r_kxedi($form);
		

        $form_styles = database_helper::form_styles($form_id);
        foreach ($form_styles as $r) {
            array_push($form->include_styles, $r["file_path"]);
        }

        $field_styles = database_helper::form_field_styles($form_id);
        foreach ($field_styles as $r) {
            array_push($form->include_styles, $r["file_path"]);
        }

        $form_javascripts = database_helper::form_javascripts($form_id);
        foreach ($form_javascripts as $r) {
            array_push($form->include_scripts, $r["file_path"]);
        }

        $field_javascripts = database_helper::form_field_javascripts($form_id);
        foreach ($field_javascripts as $r) {
            array_push($form->include_scripts, $r["file_path"]);
        }
        return $form;
    }
	
    static public function generate_form_filledData($form_id, $form_data, $form_submit_id, $id_process,$id_case, $version_mappings){

		//$form_data = $formDataArr['1'];//echo 'form_data  ------  ';print_r($form_data);/**/
		//$form_data_vleresuesi = $formDataArr['2'];//echo 'form_data_vleresuesi  ------ ';print_r($form_data_vleresuesi);
		
		//$form_data_vleresuesi = "";
        $data = database_helper::form_fields($form_id);

        $elements = array();
		$mappings = $version_mappings;

        foreach ($data as $e) {

            $element = new stdClass();
			$field_name = $e["field_name"];
			
            switch ($e['type_name']) {
                case "autocomplete":
                    $element = new html_autocomplete();
                    $element->form_submit_id = $form_submit_id;
                    $element->optionsData = database_helper::get_autocomplete_data($e['extradata1']);
                    $element->dataForDataTable = [];
                    $selectedValuesString = database_helper::autocomplete_selectedValues($e['id_form'], $form_submit_id, $e["field_name"]);
                    $selectedValues = explode(",", $selectedValuesString);
                    $element->selectedOptions = [];
                    foreach($element->optionsData as $option)
                    {
                        if(in_array($option->id, $selectedValues))
                        {
                            $element->selectedOptions[] = $option;
                        }
                        $element->dataForDataTable[] = [$option->text];
                    }
                    
                    $element->MultipleSelection = $e['extradata2'] =="1" ? "true" : "false";
                    $element->form_id = $form_id;
                    break;
                case "email":
                    $element = new html_email();
                    break;
                case "amount":
                    $element = new html_amount();
                    $element->form_submit_id = $form_submit_id;
                    $element->form_id = $form_id;
                    break;
                case "checkbox":
                    $element = new html_checkbox();

					if($form_data->$field_name == "1")
						$element->checked = "checked";
					else
						$element->checked = "";
                    $element->CheckedLabel = $e["extradata1"];
                    $element->UnCheckedLabel = $e["extradata2"];

                    //print_r($element->render());exit;
                    break;
                case "trippleswitch":
                    $element = new html_trippleswitch();

					if($form_data->$field_name == "1")
						$element->checked = "checked";
					else
						$element->checked = ""; 
                    $element->CheckedLabel = empty($e["extradata1"]) ? "Po" : $e["extradata1"];
                    $element->UnCheckedLabel = empty($e["extradata2"]) ? "Jo" : $e["extradata2"];
                    $element->ToggleSelected = $e["extradata3"];
					

					if(isset($mappings[$field_name]))
                    {
                        $element->isOldVersion = $mappings[$field_name]->changed_status;
                    }
                    else
					$element->isOldVersion = 0;

                    //$element->field_value_xyz = 1;

                    //print_r($element->render());exit;
                    break;
				case "repeater":
                    $element = new html_repeater();

                    $element->inputArray = [];

                    //get all the available inputs
                    $repeater_table = "form_" . $form_id . "_repeater_" . $field_name;
                    $sql = "SELECT * FROM {$repeater_table} WHERE id_form_submit = {$form_submit_id} and deleted = 0";
                    $form_repeater  = database_helper::database_flower_generated()->db->executeQueryObj($sql);
                    foreach ($form_repeater as $el)
                    {
                        $input = new stdClass();
                        $input->name = $el->field_name;
                        $input->value = $el->value;

                        $element->inputArray[] = $input;
                    }

                    //generate html
                    $element->holderHTML = "";
                    foreach ($element->inputArray as $input)
                    {
                        $element->holderHTML .= "<input type='number' class='col-lg-2 form-control' name='".$input->name."' value='".$input->value."' style='margin-right:5px; margin-bottom:5px'>";
                    }
                    break;
				 case "map":
                    $element = new html_map();
                    break;
                case "combobox":
                    $element = new html_combobox();
                    $otherData = database_helper::data_combobox($e['extradata1']);
                    $element->retrieve_action = $otherData["retrieve_action"];
                    $element->newrecord_action = $otherData["newrecord_action"];
                    $element->save_action = $otherData["save_action"];

					if(isset($mappings[$field_name]))
                    {

                        $element->isOldVersion = $mappings[$field_name]->changed_status;
                        $selectedCombo = array(array("fieldName" => $mappings[$field_name]->value));
                    }
                    else
                    {
                        $sql_selected = "select $field_name as fieldName from ".FLOWER_GENERATED_DB_NAME.".form_{$form_id} 
                                     where id_form = $form_id and form_{$form_id}_id = $form_submit_id;";
                        $selectedCombo = database_helper::database_flower_generated()->db->executeQuery($sql_selected);

                        $element->isOldVersion = 0;
                    }
                    $element->control_blocked = $otherData["control_blocked"];
					
                    $sql_selected = "select $field_name as fieldName from ".FLOWER_GENERATED_DB_NAME.".form_{$form_id} 
                                     where id_form = $form_id and form_{$form_id}_id = $form_submit_id;";

                    $selectedCombo = database_helper::database_flower_generated()->db->executeQuery($sql_selected);

                   /* $comboboxTableName = "form_".$field_name;
					$id_combobox = "id_".$field_name;
					$sql = "SELECT $id_combobox as fieldName FROM $comboboxTableName 
						WHERE deleted = 0 AND id_form = {$form_id} AND id_form_submit = {$form_submit_id}";
					$selectedCombo = database_helper::database()->db->executeQuery($sql);*/
					$selectedElements = array();
					if(is_array($selectedCombo) && count($selectedCombo) > 0)
					{
						foreach($selectedCombo as $combo)
						{   
                            if(!empty($combo['fieldName']))
							    $selectedElements[] = $combo['fieldName'];
						}
					}
					$element->selectedElements = $selectedElements;

					if($element->control_blocked == 1)
						$element->control_blocked_attribute = "true";
					else
						$element->control_blocked_attribute = "false";
                    break;
                case "ccnumber":
                    $element = new html_creditcard();
                    break;
                case "datetime":
                    $element = new html_datetime();
					$element->is_datetime = $e['extradata1'] == "true" ? true : false;
                    break;
                case "img":
                    $element = new html_image();
                    break;
                case "password":
                    $element = new html_password();
                    break;
                case "phone":
                    $element = new html_phone();
                    break;
                case "text":
                    $element = new html_text();
                    if($e['extradata1'] == '')
                        $element->mask = '';
                    else
                        $element->mask = database_helper::data_input_mask($e['extradata1'])[0]['dataField'];
                    break;
				case "number":
                    $element = new html_number();
					$element->minInput = $e['extradata1'];
					$element->maxInput = $e['extradata2'];
                    break;
                case "textarea":
                    $element = new html_textarea();
                    break;
                case "upload":
                    $element = new html_upload();
					$element->form_submit_id = $form_submit_id;
                    $element->form_id = $form_id;
                    $element->MultiDocs = $e['extradata1'] == "1" ? true : false;
                    $element->UploadDoc = 0;
                    $element->UploadXls = 0;
                    $element->UploadPdf = 0;
                    $element->UploadImage = 0;
                    $form_field_file_extensions = database_helper::form_field_file_extension($e["form_field_id"]);
                    foreach ($form_field_file_extensions as $form_field_file_extension){
                        $file_exten = $form_field_file_extension["id_file_extension"];
                        $file_extension = database_helper::file_extension($file_exten)[0];
                        if($file_extension["extension_type"] == "docx"){
                            $element->UploadDoc = 1;

                        }
                        else if($file_extension["extension_type"] == "xlsx"){
                            $element->UploadXls = 1;

                        }
                        else if($file_extension["extension_type"] == "pdf"){
                            $element->UploadPdf = 1;

                        }
                        else if($file_extension["extension_type"] == "jpg" || $file_extension["extension_type"] == "png" || $file_extension["extension_type"] == "gif"){
                            $element->UploadImage = 1;

                        }
                    }
                    $element->hasUploadCategory = ($e['extradata2'] == 0 ? false : true);
                    
                    break;
                case "label":
                    $element = new html_label();
                    break;
				case "newline":
                    $element = new html_newline();
                    break;
				case "colspan":
                    $element = new html_colspan();
                    break;
				case "day_month_year":
                    $element = new html_day_month_year();
                    break;
				case "day_month_year_hour_min":
                    $element = new html_day_month_year_hour_min();
                    break;
				case "radiogroup":
					$element = new html_radiogroup();
					$element->optionsData = database_helper::data_radiogroup($e['extradata1']);
					$element->selectedValue = database_helper::radiogroup_selectedValue($e['id_form'], $form_submit_id, $e["field_name"]);
                    break;
                case "text_editor":
                    $element = new html_text_editor();
                    break;
                case "form_repeater":
                    $element = new html_form_repeater();
                    $form_data = database_helper::form_data($form_id, $id_process, $id_case)[0];

                    $element->repeat_depth = $form_data->$field_name;
                    $element->repeated_form_id = $e["extradata1"];
                    break;
                case "checkboxgroup":
                    $element = new html_checkboxgroup();
                    $element->optionsData = database_helper::data_checkboxgroup($e['extradata1']);
                    $selectedValueString = database_helper::checkboxgroup_selectedValue($e['id_form'], $form_submit_id, $e["field_name"]);
                    $element->selectedValue = explode(",", $selectedValueString);
                    break;
                default:
                    break;
            }
			//print_r($form_data);
            $element->col_span = $e["col_span"];
            $element->row_span = $e["row_span"];
            $element->field_name = $e["field_name"];
            $element->form_field_id = $e["form_field_id"];
            $element->label = $e["label"];
            $element->tooltip = $e["tooltip"];
            $element->type_name = $e["type_name"];
            $element->form_name = $e['form_name'];
            //$element->field_value = $form_data->$field_name;
			$element->field_value = $form_data->$field_name;
			 if(isset($mappings[$field_name]))
            {

                if($e['type_name'] != 'trippleswitch')
                {
                    $element->isOldVersion = $element->isOldVersion = $mappings[$field_name]->changed_status;
                    $element->field_value = $mappings[$field_name]->value;
                }
                else
                    $element->field_value = $form_data->$field_name;
            }
            else
            {
                $element->field_value = $form_data->$field_name;
                if($e['type_name'] != 'trippleswitch')
                    $element->isOldVersion = 0;
            }
			if($element->isOldVersion > 0)
                $element->versionStyle = ($element->isOldVersion == 1)?"style = 'color:blue;font-style: italic'":"style = 'color:red;font-style: italic'";

			//add * for required
			if($e['required'] == "1")
				$element->required = "*";
			else
				$element->required = "";
			
			//add * for block_process
			if($e['block_process'] == "1")
				$element->block_process_attribute = "*";
			else
				$element->block_process_attribute = "";
				
			//visible 1:visible; 0:invisible
			if($e['visible'] == "1")
				array_push($elements, $element);
        }
		//print_r($elements);exit;
        $form = new html_form($form_id);

        foreach ($elements as $e) {
            if($e->type_name == "newline" || $e->type_name == "colspan")
                $form->render .= $e->render_for_view() . "\r\n";
            else
                $form->render .= $e->render() . "\r\n";
            
            $form->script_load .= $e->script_load() . "\r\n";
            $form->script_additional .= $e->script_additional() . "\r\n";

            if (strlen($e->validation_rules()) > 0) {
                array_push($form->validation_rules, $e->validation_rules());
            }
            if (strlen($e->validation_messages()) > 0) {
                array_push($form->validation_messages, $e->validation_messages());
            }
        }

        $form_styles = database_helper::form_styles($form_id);
        foreach ($form_styles as $r) {
            array_push($form->include_styles, $r["file_path"]);
        }

        $field_styles = database_helper::form_field_styles($form_id);
        foreach ($field_styles as $r) {
            array_push($form->include_styles, $r["file_path"]);
        }

        $form_javascripts = database_helper::form_javascripts($form_id);
        foreach ($form_javascripts as $r) {
            array_push($form->include_scripts, $r["file_path"]);
        }

        $field_javascripts = database_helper::form_field_javascripts($form_id);
        foreach ($field_javascripts as $r) {
            array_push($form->include_scripts, $r["file_path"]);
        }
        return $form;
    }
	
	static public function generate_form_status($form_id, $form_submit_id) 
	{
		$form_status_options = database_helper::form_status_options($form_id);
		
		if(is_array($form_status_options) && count($form_status_options) > 0)
		{
			$phaseStautsNameValue = 0;
			if($form_submit_id != "")
			{
				$last_form_status_selected = database_helper::form_status_selected($form_id, $form_submit_id);
				$last_form_status_selected = $last_form_status_selected[0];
				$phaseStautsName = "id_phase_status_{$form_id}";
				$phaseStautsNameValue = $last_form_status_selected->$phaseStautsName;
			}
			else
			{
				$last_form_status_selected->phase_status_name = "Zgjidh Status";
			}
			$element = new html_form_status();
			$element->label = $last_form_status_selected->phase_status_name;
			$element->form_field_id = $phaseStautsNameValue;
			$element->form_status_options = $form_status_options;
			
			$form_status = new html_form();
			$form_status->render .= $element->render() . "\r\n";
			$form_status->script_load .= $element->script_load() . "\r\n";
			$form_status->script_additional .= $element->script_additional() . "\r\n";
			return $form_status;
		}
		else
		{
			/* $element = new html_form_status();
			$element->label = "Zgjidh Status";
			$element->form_field_id = 0;
			$element->form_status_options = $form_status_options;
			
			$form_status = new html_form();
			$form_status->render .= $element->render() . "\r\n";
			$form_status->script_load .= $element->script_load() . "\r\n";
			$form_status->script_additional .= $element->script_additional() . "\r\n";
			return $form_status;*/
			return "";
		}
		
	}
	
	static public function generate_form_forView($form_id, $form_submit_id) {
        
        $data = database_helper::form_fields($form_id);
        $elements = array();

        foreach ($data as $e) {

            $element = new stdClass();
            switch ($e['type_name']) {

                case "autocomplete":
                    $element = new html_autocomplete();
                    $otherData = database_helper::data_autocomplete($e['extradata1']);
                    $element->autocomplete_action = $otherData["autocomplete_action"];
                    $element->browse_action = $otherData["browse_action"];
                    $element->load_action = $otherData["load_action"];
                    $element->form_submit_id = $form_submit_id;
                    $element->MultipleSelection = $e['extradata2'] =="1" ? "true" : "false";
                    break;
                case "email":
                    $element = new html_email();
                    break;
                case "amount":
                    $element = new html_amount();
                    $element->form_submit_id = $form_submit_id;
                    $element->form_id = $form_id;
                    break;
                case "checkbox":
                    $element = new html_checkbox();
                    break;
                case "trippleswitch":
                    $element = new html_trippleswitch();
                    break;
				case "repeater":
                    $element = new html_repeater();
                    break;	
				case "map":
                    $element = new html_repeater();
                    break;
                case "combobox":
                    $element = new html_combobox();
                    $otherData = database_helper::data_combobox($e['extradata1']);
                    $element->retrieve_action = $otherData["retrieve_action"];
                    $element->newrecord_action = $otherData["newrecord_action"];
                    $element->save_action = $otherData["save_action"];
                    break;
				case "radiogroup":
					$element = new html_radiogroup();
					$element->optionsData = database_helper::data_radiogroup($e['extradata1']);
					$element->optionsDataName = $e['extradata1'];
                    break;
                case "ccnumber":
                    $element = new html_creditcard();
                    break;
                case "datetime":
                    $element = new html_datetime();
                    break;
                case "img":
                    $element = new html_image();
                    break;
                case "password":
                    $element = new html_password();
                    break;
                case "phone":
                    $element = new html_phone();
                    break;
                case "text":
                    $element = new html_text();
                    break;
				case "number":
					$element = new html_number();
                    $field->Options->HasRowSpan = true;
                    break;
                case "textarea":
                    $element = new html_textarea();
                    break;
                case "upload":
                    $element = new html_upload();
					//Kalon per arsyeje sepse nxjerr probleme ne funksionin javascript te delete (confirm_action) ne ndertimin e url-se
					//per te fshire nje file te uploaduar.
					$element->form_submit_id = 0;
					$element->form_id = 0;
                    break;
                case "label":
                    $element = new html_label();
                    break;
                case "newline":
                    $element = new html_newline();
                    break;
                case "colspan":
                    $element = new html_colspan();
                    break;
                case "day_month_year":
                    $element = new html_day_month_year();
                    break;
                case "day_month_year_hour_min":
                    $element = new html_day_month_year_hour_min();
                    break;
                case "text_editor":
                    $element = new html_text_editor();
                    break;
                case "form_repeater":
                    $element = new html_form_repeater();
                    break;
                case "checkboxgroup":
                    $element = new html_checkboxgroup();
                    $element->optionsData = database_helper::data_checkboxgroup($e['extradata1']);
                    $element->optionsDataName = $e['extradata1'];
                    break;
                default:
                    break;
            }
            $element->col_span = $e["col_span"];
            $element->row_span = $e["row_span"];
            $element->field_name = $e["field_name"];
            $element->form_field_id = $e["form_field_id"];
            $element->label = $e["label"];
            $element->tooltip = $e["tooltip"];
            $element->type_name = $e["type_name"];

		     if(isset($mappings[$field_name]))
            {

                if($e['type_name'] != 'trippleswitch')
                {

                    $element->isOldVersion = $element->isOldVersion = $mappings[$field_name]->changed_status;
                    $element->field_value = $mappings[$field_name]->value;
                }
                else

                    $element->field_value = $form_data->$field_name;
            }
            else
            {

                $element->field_value = $form_data->$field_name;
                if($e['type_name'] != 'trippleswitch')
                    $element->isOldVersion = 0;
            }

            if($element->isOldVersion > 0)
                $element->versionStyle = ($element->isOldVersion == 1)?"style = 'color:blue;font-style: italic'":"style = 'color:red;font-style: italic'";


            array_push($elements, $element);
        }

        $form = new html_form();
        foreach ($elements as $e) {
			if( $e->type_name == "combobox")
			{
				$form->render .= $e->render_processView() . "\r\n";
			}
			else
				$form->render .= $e->render() . "\r\n";
            $form->script_load .= $e->script_load() . "\r\n";
            $form->script_additional .= $e->script_additional() . "\r\n";

            if (strlen($e->validation_rules()) > 0) {
                array_push($form->validation_rules, $e->validation_rules());
            }
            if (strlen($e->validation_messages()) > 0) {
                array_push($form->validation_messages, $e->validation_messages());
            }
        }

        $form_styles = database_helper::form_styles($form_id);
        foreach ($form_styles as $r) {
            array_push($form->include_styles, $r["file_path"]);
        }

        $field_styles = database_helper::form_field_styles($form_id);
        foreach ($field_styles as $r) {
            array_push($form->include_styles, $r["file_path"]);
        }

        $form_javascripts = database_helper::form_javascripts($form_id);
        foreach ($form_javascripts as $r) {
            array_push($form->include_scripts, $r["file_path"]);
        }

        $field_javascripts = database_helper::form_field_javascripts($form_id);

        foreach ($field_javascripts as $r) {
            array_push($form->include_scripts, $r["file_path"]);
        }
        return $form;
    }
   
    /**
     * Funksioni generate_form_items()
     * 
     * Per cdo element merr opsionet qe jan mbushur nga perdoruesi: 
     * column span, row span, tooltip, label, name
     * @return array te gjith opsionet per secilen fushe.
     */
    static public function generate_form_items($id_form_type) {
        $types = database_helper::form_field_types($id_form_type);
        $field_attribute = database_helper::form_field_attribute();
        $fields = array();
		
        foreach ($types as $type) {
            $field = new form_item();
            $element = new stdClass();
            switch ($type["type_name"]) {
                case "autocomplete":
                    $field->Options->HasAutocompleteAction = false;
                    $field->Options->HasBrowseAction = false;
                    $field->Options->HasLoadAction = false;

                    //tipet e autocomplete nga te cilat mund te zgjedhim
                    $field->Options->HasAvailableTypes = true;
                    $field->Options->AvailableTypes = database_helper::data_autocomplete_all();
                    $field->Options->IdAvailableType = 0;
                    $field->Options->HasRowSpan = false;

                    $field->Options->HasMultipleSelection = true;
                    $field->Options->MultipleSelection = 1;
                    $element = new html_autocomplete();
                    //$element->autocomplete_action = "autocomplete_action";
                    //$element->browse_action = "browse_action";
                    //$element->load_action = "load_action";
                    $element->form_submit_id = 0;

                    break;
                case "email":
                    $element = new html_email();
                    $field->Options->HasRowSpan = true;
                    break;
                case "amount":
                    $element = new html_amount();
                    $field->Options->HasRowSpan = false;
                    break;
                case "checkbox":
                    $element = new html_checkbox();
                    $field->Options->HasRowSpan = false;
                    $field->Options->HasCheckedLabel = true;
                    $field->Options->CheckedLabel = "Po";
                    $field->Options->HasUnCheckedLabel = true;
                    $field->Options->UnCheckedLabel = "Jo";
                    break;
                case "trippleswitch":
                    $element = new html_trippleswitch();
                    $field->Options->HasRowSpan = false;
                    $field->Options->HasCheckedLabel = true;
                    $field->Options->CheckedLabel = "Po";
                    $field->Options->HasUnCheckedLabel = true;
                    $field->Options->UnCheckedLabel = "Jo";
                    break;
				case "repeater":
                    $element = new html_repeater();
                    $field->Options->HasRowSpan = false;
                    break;	
				 case "map":
                    $element = new html_map();
                    $field->Options->HasRowSpan = false;
                    break;
                case "combobox":
                    $field->Options->HasRetrieveAction = false;
                    $field->Options->HasNewRecordAction = false;
                    $field->Options->HasSaveAction = false;
                    $field->Options->HasRowSpan = false;
					$field->Options->HasControlBlocked = true;

                    $field->Options->HasComboCategoryList = true;
                    $field->Options->ComboCategoryList = database_helper::data_combobox_all();
                    $field->Options->IdComboCategory = 0;

                    $element = new html_combobox();
                    //$element->retrieve_action = "retrieve_action";
                    //$element->newrecord_action = "newrecord_action";
                    //$element->save_action = "save_action";
                     break;
                case "ccnumber":
                    $element = new html_creditcard();
                    $field->Options->HasRowSpan = false;
                    break;
                case "datetime":
                    $element = new html_datetime();
                    $field->Options->HasRowSpan = false;
                    $field->Options->is_datetimeType = true;
                    break;
                case "img":
                    $element = new html_image();
                    $field->Options->HasRowSpan = true;
                    break;
                case "password":
                    $element = new html_password();
                    $field->Options->HasRowSpan = false;
                    break;
                case "phone":
                    $element = new html_phone();
                    $field->Options->HasRowSpan = false;
                    break;
                case "text":
                    $element = new html_text();
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasInputMask = true;
                    $field->Options->InputMaskList = self::inputMaskList();
                    $field->Options->IdInputMask = 0;
                    break;
				case "number":
                    $element = new html_number();
                    $field->Options->HasRowSpan = true;
                    $field->Options->IsNumberInput = true;
                    break;
                case "textarea":
                    $element = new html_textarea();
                    $field->Options->HasRowSpan = true;
                    break;
                case "upload":
                    $element = new html_upload();
                    $field->Options->HasRowSpan = false;
                    $field->Options->HasColumnSpan = false;
                    $field->Options->HasMultipleDocs = 1;
                    $field->Options->MultipleDocs = 1;
                    $field->Options->UploadDoc = 1;
                    $field->Options->UploadXls = 1;
                    $field->Options->UploadPdf = 1;
                    $field->Options->UploadImage = 1;
                    $field->Options->HasUploadCategoryList = true;
                    $field->Options->UploadCategoryList = database_helper::data_uploadCategory_all();
                    $field->Options->IdUploadCategory = 0;
					break;
                case "label":
                    $element = new html_label();
                    $field->Options->HasRowSpan = false;
                    $field->Options->HasColumnSpan = false;
                    break;
				case "newline":
                    $element = new html_newline();
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = false;
                    $field->Options->FieldName = "newLine";
                    $field->Options->Label = "newLine";
                    $field->Options->Tooltip = "newLine";
                    break;
				case "colspan":
                    $element = new html_colspan();
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = true;
                    $field->Options->FieldName = "colSpan";
                    $field->Options->Label = "colSpan";
                    $field->Options->Tooltip = "colSpan";
                    break;
				case "day_month_year":
                    $element = new html_day_month_year();
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = true;
                    break;
				case "day_month_year_hour_min":
                    $element = new html_day_month_year_hour_min();
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = true;
                    $field->Options->ColumnSpan = 6;
                    break;
				case "radiogroup":
                    $element = new html_radiogroup();
                    $field->Options->HasRetrieveAction = false;
                    $field->Options->HasNewRecordAction = false;
                    $field->Options->HasSaveAction = false;
                    $field->Options->HasRowSpan = false;
					$field->Options->HasControlBlocked = true;

                    $field->Options->HasRadioGroupList = true;
                    $field->Options->RadioGroupList = database_helper::data_radiogroup_all();
                    $field->Options->IdComboRadioGroup = 0;
                    break;
                case "text_editor":
                    $element = new html_text_editor();
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = true;
                    break;
                case "form_repeater":
                    $field->Options->HasRepeatedFormId = true;
                    $field->Options->repeatedFormId = 0;
                    $element = new html_form_repeater();

                    break;
                case "checkboxgroup":
                    $element = new html_checkboxgroup();
                    $field->Options->HasRetrieveAction = false;
                    $field->Options->HasNewRecordAction = false;
                    $field->Options->HasSaveAction = false;
                    $field->Options->HasRowSpan = false;
                    $field->Options->HasControlBlocked = true;

                    $field->Options->HasCheckBoxGroupList = true;
                    $field->Options->CheckBoxGroupList = database_helper::data_checkboxgroup_all();
                    $field->Options->IdComboCheckBoxGroup = 0;
                    break;
                default:
					$field->Options->ColumnSpan = 2;
                    break;
            }
            $element->col_span = 0;
            $element->row_span = 0;
            $element->field_name = $type["type_name"];
            $element->form_field_id = $type["type_id"];
            $element->label = $type["type_name"];
            $element->tooltip = "";
            $element->type_name = $type["type_name"];
            
            $field->Options->RowSpan = 0;
            $field->Options->Required = true;
			$field->Options->Visible = 1;
            $field->Options->IsIndex = 0;
            $field->FieldId = $element->form_field_id;
            $field->FieldType = $type["type_name"];
            if($type["type_name"] == "upload") {
                $field->Html = $element->render_modify_form();
            }
            else if($type["type_name"] == "trippleswitch") {
                $field->Html = $element->render_modify_form();
            }
            else if($type["type_name"] == "form_repeater") {
                $field->Html = $element->render_modify_form();
            }
			else
				$field->Html = $element->render();
            $field->Options->FormFieldAttribute = $field_attribute;
            array_push($fields, $field);
        }
        
        return $fields;
    }

    private static function inputMaskList()
    {
        $masks = database_helper::data_input_mask();
        $response = [
            [
                'mask_id' => '0',
                'mask' => 'Asnje'
            ]
        ];
        foreach($masks as $mask){
            $response[] = [
                'mask_id' => $mask['input_mask_id'],
                'mask' => $mask['labelField']
            ];
        }

        return $response;

    }

    /**
     * Funksioni retreive_form_items
     * 
     * Merr te gjith elemente e formes.
     * 
     * @param int  $form_id id e formes
     * @return array $fields kthen te gjitha fushat
     */
    static public function retreive_form_items($form_id) {
        
        $items = database_helper::form_fields($form_id);
        $field_attribute = database_helper::form_field_attribute();
		
        $fields = array();
        
        foreach ($items as $item) 
		{
			$form_field_attribute_value = database_helper::form_field_attribute_value($item["form_field_id"]);
            $field = new form_item();
            switch ($item["type_name"]) 
			{
                case "autocomplete":
                    //$data = database_helper::data_autocomplete($item["extradata1"]);
                    
                    $field->Options->HasBrowseAction = false;
                    //$field->Options->BrowseAction = $data["browse_action"];
                    $field->Options->HasLoadAction = false;
                    //$field->Options->LoadAction = $data["load_action"];
                    $field->Options->HasAutocompleteAction = false;
                    //$field->Options->AutocompleteAction = $data["autocomplete_action"];
                    
                    //tipet e autocomplete nga te cilat mund te zgjedhim
                    $field->Options->HasAvailableTypes = true;

                    $field->Options->AvailableTypes = database_helper::data_autocomplete_all();
                    $field->Options->IdAvailableType = $item["extradata1"];

                    $field->Options->HasMultipleSelection = true;
                    $field->Options->MultipleSelection = $item["extradata2"] == "1" ? 1 : 0;

                    $field->Options->HasRowSpan = false;
                    break;
                case "combobox":
                    $data = database_helper::data_combobox($item["extradata1"]);
                    
                    $field->Options->HasRetrieveAction = false;
                    //$field->Options->RetrieveAction = $data["retrieve_action"];
                    $field->Options->HasNewRecordAction = false;
                    //$field->Options->NewRecordAction = $data["newrecord_action"];
                    $field->Options->HasSaveAction = false;
                    //$field->Options->SaveAction = $data["save_action"];

                    $field->Options->HasComboCategoryList = true;
                    $field->Options->ComboCategoryList = database_helper::data_combobox_all();
                    $field->Options->IdComboCategory = $item["extradata1"];

                    $field->Options->HasRowSpan = false;
                    $field->Options->HasControlBlocked = true;
                    $field->Options->ControlBlocked = $data["control_blocked"];
                    break;
				case "radiogroup":
                    $field->Options->HasRetrieveAction = false;
                    $field->Options->HasNewRecordAction = false;
                    $field->Options->HasSaveAction = false;
                    $field->Options->HasRowSpan = false;
					$field->Options->HasControlBlocked = true;

                    $field->Options->HasRadioGroupList = true;
                    $field->Options->RadioGroupList = database_helper::data_radiogroup_all();
                    $field->Options->IdComboRadioGroup = $item["extradata1"];
                    break;
                case "email":
                case "amount":
                case "checkbox":
                    $field->Options->HasCheckedLabel = true;
                    $field->Options->CheckedLabel = $item["extradata1"];
                    $field->Options->HasUnCheckedLabel = true;
                    $field->Options->UnCheckedLabel = $item["extradata2"];
                    break;
                case "trippleswitch":
                    $field->Options->HasCheckedLabel = true;
                    $field->Options->CheckedLabel = $item["extradata1"];
                    $field->Options->HasUnCheckedLabel = true;
                    $field->Options->UnCheckedLabel = $item["extradata2"];
                    break;
                case "ccnumber":
                case "datetime":
					$field->Options->is_datetimeType = true;
					$field->Options->is_datetime = $item["extradata1"] == "true" ? true : false;
                    break;
                case "password":
                case "phone":
                case "text":
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasInputMask = true;
                    $field->Options->InputMaskList = self::inputMaskList();
                    $field->Options->IdInputMask = $item["extradata1"];
                    break;
				case "number":
                    $element = new html_number();
                    $field->Options->HasRowSpan = true;
                    $field->Options->IsNumberInput = true;
					$field->Options->MinNumberInput = $item["extradata1"];
                    $field->Options->MaxNumberInput = $item["extradata2"];
                    break;
                case "upload":
                    $field->Options->UploadDoc = 0;
                    $field->Options->UploadXls = 0;
                    $field->Options->UploadPdf = 0;
                    $field->Options->UploadImage = 0;
                    $form_field_file_extensions = database_helper::form_field_file_extension($item["form_field_id"]);
                    foreach ($form_field_file_extensions as $form_field_file_extension){
                        $file_exten = $form_field_file_extension["id_file_extension"];
                        $file_extension = database_helper::file_extension($file_exten)[0];
                        if($file_extension["extension_type"] == "docx"){
                            $field->Options->UploadDoc = 1;
                        }
                        else if($file_extension["extension_type"] == "xlsx"){
                            $field->Options->UploadXls = 1;
                        }
                        else if($file_extension["extension_type"] == "pdf"){
                            $field->Options->UploadPdf = 1;
                        }
                        else if($file_extension["extension_type"] == "jpg" || $file_extension["extension_type"] == "png" || $file_extension["extension_type"] == "gif"){
                            $field->Options->UploadImage = 1;
                        }
                    }
                    $field->Options->HasRowSpan = false;
                    $field->Options->HasColumnSpan = false;
                    $field->Options->HasMultipleDocs = true;
                    $field->Options->MultipleDocs = $item["extradata1"] == "1" ? 1 : 0;

                    $field->Options->HasUploadCategoryList = true;
                    $field->Options->UploadCategoryList = database_helper::data_uploadCategory_all();
                    $field->Options->IdUploadCategory = $item["extradata2"];
                    break;
                case "day_month_year":
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = true;
                    break;
                 case "day_month_year_hour_min":
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = true;
                    break;
                case "newline":
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = false;
                    break;
                case "colspan":
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = true;
                    break;
                case "label":
                    $field->Options->HasRowSpan = true;
                    $field->Options->HasColumnSpan = false;
                    break;
                case "form_repeater":
                    $field->Options->HasRepeatedFormId = true;
                    $field->Options->repeatedFormId = $item["extradata1"];
                    break;
                case "checkboxgroup":
                    $field->Options->HasRetrieveAction = false;
                    $field->Options->HasNewRecordAction = false;
                    $field->Options->HasSaveAction = false;
                    $field->Options->HasRowSpan = false;
                    $field->Options->HasControlBlocked = true;

                    $field->Options->HasCheckBoxGroupList = true;
                    $field->Options->CheckBoxGroupList = database_helper::data_checkboxgroup_all();
                    $field->Options->IdComboCheckBoxGroup = $item["extradata1"];
                    break;
                case "img":
                case "textarea":
                default:
                    break;
            }
            $field->Options->ColumnSpan = $item["col_span"];
            $field->Options->RowSpan = $item["row_span"];
            $field->Options->Required = $item["required"];
            $field->FieldId = $item["form_field_type_id"];
            $field->FieldType = $item["type_name"];
            $field->Options->FieldName = $item["field_name"];
            $field->Options->Label = $item["label"];
            $field->Options->Tooltip = $item["tooltip"];
            $field->Html = "";
			$field->Options->FormFieldId = $item["form_field_id"];
			$field->Options->Visible = $item["visible"];
			$field->Options->BlockProcess = $item["block_process"];
            $field->Options->IsIndex = $item["IsIndex"];
            
			if($field->Options->Visible == "0")
				$field->InvisibleCss = "invisibleElement";
			else
				$field->InvisibleCss = "";
				
			$field->Options->FormFieldAttribute = $field_attribute;
			$field->Options->FormFieldAttributeDictinary = $form_field_attribute_value;
			
            array_push($fields, $field);
        }
        return $fields;
    }
}
