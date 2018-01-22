<?php
class html_uploadCRUD extends extended_reserved {

	function __construct() {
        $this->reg = registry::getInstance();
        $connections = json_decode(CONNECTIONS);
        $this->sessionSite = $this->reg->init('sessionSite');
		$this->sysdb = $this->reg->init('dbabstraction', $connections->sysdb, 'sysdb');
        $this->db_task = $this->reg->init('dbabstraction', $connections->db_task, 'db_task');
        $this->flower = $this->reg->init('dbabstraction', $connections->flower, 'flower');
        $this->flower_generated = $this->reg->init('dbabstraction', $connections->flower_generated, 'flower_generated');
        $this->da = $this->reg->init('dbabstraction', $connections->da, 'da');
        $this->input = $this->reg->init('input');
    }

	protected function upload_file($id_form_field, $repeat_index, $id_process, $id_case)
	{

		if(!check_user($this->sessionSite->user->user_id))
			return;

        $this->resp->error = 0;
        $this->resp->message = "Sukses";

        $upload_dir = DOCUMENTS."form_uploads".DIR_SEP;
        $temp_doc_upload = $this->reg->init('temp_doc_upload', $this->flower);

        $form_fields = $this->reg->init('form_field', $this->flower);
        $form_field = $form_fields->load("form_field_id ={$id_form_field} AND deleted = 0")[0];
        $extradata = $form_field->extradata1;
        $form_field_file_extensions = $this->reg->init('form_field_file_extension', $this->flower);
        $form_field_file_extensions = $form_field_file_extensions->load("id_form_field ={$id_form_field}");

        //find case
        $docPattern = "Case_$id_case";
        $document = $this->reg->init('document', $this->da, '', 'da/model');
        $case_doc = $document->load("document_name = '{$docPattern}' and deleted = 0 and id_process = {$id_process}")[0];
        $process_doc = $document->load("document_id = {$case_doc->id_document} and deleted = 0")[0];

        //find form_field
        $form_field = $this->reg->init('form_field', $this->flower);
        $form_field = $form_field->load("form_field_id = {$id_form_field} and deleted = 0")[0];

        if(isset($_FILES["myfile"]))
        {
            if(!is_array($_FILES["myfile"]["name"])) //single file
            {
                //$human_file_name = $_FILES["myfile"]["name"];
                $file_size = $_FILES["myfile"]["size"];
                $_ext_a = explode('.', $_FILES["myfile"]["name"]);

                $_ext = end($_ext_a);

                $found = false;
                foreach ($form_field_file_extensions as $form_field_file_extension) {
                    $file_extensions = $this->reg->init('file_extension', $this->flower);
                    $file_extensions = $file_extensions->load("file_extension_id = {$form_field_file_extension->id_file_extension}")[0];
                    if ($file_extensions->extension_type == $_ext) {
                        $found = true;
                    }
                }
                if (!$found) {
                    $this->resp->error = 2;
                    $this->resp->message = json_encode('Ky dokument nuk lejohet');
                    $temp_doc_upload->rollback();
                    return json_encode($this->resp);
                }

                //get last similar doc
                $similarDocs = $temp_doc_upload->load("id_form_field = {$id_form_field}");
                $lastDoc = end($similarDocs);
                if (count($similarDocs) > 0)
                    $human_file_name = $form_field->label . "_" . count($similarDocs) . "." . $_ext;
                else
                    $human_file_name = $form_field->label . "." . $_ext;

                $file_name = md5(SALT . $this->sessionSite->user->user_id . microtime()) . ".{$_ext}";

                try
                {
					$this->da->db->beginTransaction();

					if ($extradata != 1) {
						$temp_doc_uploads = $temp_doc_upload->load("id_form_field = {$id_form_field} AND deleted = 0");
						foreach ($temp_doc_uploads as $temp_doc) {
							$temp_doc->deleted = 1;
							$temp_doc->save();
						}
					}

					//add document to da
					$document = $this->reg->init('document', $this->da, '', 'da/model');

					$document->_new();
					$document->is_group = 0;
					$document->id_group = 0;
					$document->id_process = $id_process;
					$document->root_dir = 0;
					$document->document_name = $human_file_name;
					$document->document_file_name = $file_name;
					$document->document_path = "form_uploads";
					$document->is_dir = 0;
					$document->byte_size = $file_size;
					$document->id_document = $case_doc->document_id;
					$document->id_user = $this->user->user_id;
					$document->system_date = date('Y-m-d H:i:s');
					$document->last_updated = date('Y-m-d H:i:s');
					$document->active = 0;
					$document->id_document_category = $form_field->extradata2;
					$efilemanagerContr = new efilemanager();
					$efilemanagerContr->updateParentLastModified($case_doc->document_id);
					$efilemanagerContr->updateParentLastModified($process_doc->document_id);
					
					$document->save();
					
					$document->set_id_path($document->document_id);

					//add revision
					$revision = $this->reg->init('revision', $this->da, '', 'da/model');
					$revision->_new();
					$revision->id_document = $document->document_id;
					$revision->id_user = $this->user->user_id;
					$revision->revision_file_name = $file_name;
					$revision->byte_size = $file_size;
					$revision->is_active = 0;
					$rev_date = date('Y-m-d H:i:s');
					$revision->system_date = $rev_date;
					$revision->deleted = 0;
					$revision->save();
						
					$temp_doc_upload->beginTransaction();

					$temp_doc_upload->_new();
					$temp_doc_upload->document_name = $human_file_name;
					$temp_doc_upload->document_file_name = $file_name;
					$temp_doc_upload->id_form_field = $id_form_field;
					$temp_doc_upload->date_created = date("Y-m-d H:i:s");
					$temp_doc_upload->id_user_created = $this->sessionSite->user->user_id;
					$temp_doc_upload->id_document = $document->document_id;
					if($repeat_index)
						$temp_doc_upload->repeat_index = $repeat_index;
					$temp_doc_upload->save();

					$_m = move_uploaded_file($_FILES["myfile"]["tmp_name"], $upload_dir . $file_name);

					if ($_m != 1) {
						$this->resp->error = 1;
						$this->resp->message = "Gabim ne ngarkimin e dokumentit!";
						echo json_encode($this->resp);
						return;
					}

					$this->resp->data = $human_file_name;
					$this->resp->temp_doc_upload_id = $temp_doc_upload->temp_doc_upload_id;
					$temp_doc_upload->commit();
					$this->da->db->commit();

                }
                catch (Exception $e)
                {
                     $this->resp->error = 1;
                     $this->resp->message = $e->getMessage();
                     $temp_doc_upload->rollback();
                     $this->da->db->rollback();
                 }
            }
        }
        echo json_encode($this->resp);
    }
	
	protected function get_documents($id_form_field, $repeat_index){

		if(!check_user($this->sessionSite->user->user_id))
			return;

		//print_r($id_form_field);exit;
		$id_document = $this->da->escape_string($this->input->post("id_document"));
		$id_group = $this->da->escape_string($this->input->post("id_group"));
		$document_name = $this->da->escape_string($this->input->post("document_name"));
		$is_group = $this->da->escape_string($this->input->post("is_group"));
		$is_dir = $this->da->escape_string($this->input->post("is_dir"));
		
		$_docs = array();
		$uploaded = $this->da->escape_string($this->input->post("uploaded"));
		
		$cond = "";
		if($uploaded != "")
		{
			$cond = " AND temp_doc_upload_id IN ({$uploaded})";
            if($repeat_index) $cond .= "AND repeat_index = {$repeat_index}";
		}
		else
		{
			 echo json_encode($_docs);
			 return;
		}
		
		$temp_doc_upload = $this->reg->init('temp_doc_upload', $this->flower);
        $docs = $temp_doc_upload->load("id_form_field = {$id_form_field} and deleted = 0 {$cond}");
		if(count($docs) > 0)
        {
            foreach($docs as $doc)
            {
                $_node = new stdClass();

				$_node->key = $doc->temp_doc_upload_id;
				$_node->document_id = $doc->id_document; 
                $_node->parent_key = 0;
                $_node->title = $doc->document_name;

                $_docs[] = $_node;
            }

        }
		ob_clean();
        echo json_encode($_docs);


    }

	protected function download_doc($temp_doc_upload_id, $id_form_field, $repeat_index){

		if(!check_user($this->sessionSite->user->user_id))
			return;

        // 1->doc

        $cond = "temp_doc_upload_id = {$temp_doc_upload_id} AND id_form_field = {$id_form_field}";
        if($repeat_index)
            $cond .= " AND repeat_index = {$repeat_index}";
		
		$document = $this->reg->init('temp_doc_upload', $this->flower);
		
        $document= $document->load($cond);
       
        $document = $document[0];

        $file_name = $document->document_name;
        $file_path = DOCUMENTS."/form_uploads/".$document->document_file_name;
       

       //echo $file_name.'---'.$file_path.'---'.$file_date;

        $size = filesize($file_path);
        //$content_type = mime_content_type($file_path);
        $content_type = get_mime($file_path);

		header('Content-Description: File Transfer');
        header('Set-Cookie: fileDownload=true; path=/');
        header('Cache-Control: max-age=60, must-revalidate');
        header("Content-type: {$content_type}");
		//   header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.$file_name.'"');
        header("Content-Length: {$size}");


        header('Content-Transfer-Encoding: binary');
        header('Pragma: no-cache');
		//header('Pragma: public');
        header('Expires: 0');
		

        ob_end_clean();//needed when there are large files to be downoloaded
        flush();
        $fp = fopen($file_path, 'rb');
        fpassthru($fp);


    }
	
	protected function changePhaseStatus($id_form, $id_form_submit, $id_form_field){

		if(!check_user($this->sessionSite->user->user_id))
			return;

		$response = new stdClass;
		$response->Error = 0;
		$response->Status = 0;
		$response->Message = "Te dhenat u ruajten me sukses!";
		
		$fieldName = "phase_status_{$id_form}";
		$columnName = "id_{$fieldName}";
		$tableName = "form_{$fieldName}";
		
		//Controll if current status phase is "Perfunduar" (3) 
		$currentStatusSql = "SELECT {$columnName} status
							FROM {$tableName}
							WHERE id_form_submit = {$id_form_submit} AND deleted = 0";
		$currentStatus = $this->flower->db->executeQueryObj($currentStatusSql);
		$currentStatus = $currentStatus[0]->status;
		
		#region Get all field of current form and create condition for empty data
		
		$fieldOfCurrentFormSql = "SELECT *
								FROM form_field
								WHERE id_form = {$id_form} AND visible = 1";
		$fieldOfCurrentForm = $this->flower->db->executeQueryObj($fieldOfCurrentFormSql);
		$cond = "";
		foreach($fieldOfCurrentForm as $formField)
		{
			if($formField->field_name != "phase_status_{$id_form}")
			{
				switch($formField->id_form_field_type)
				{
					case 5: //Datetime
						$cond .= " ({$formField->field_name} = '0000-00-00 00:00:00' OR {$formField->field_name} = NULL) AND";
						break;
					case 6: //Checkbox
						$cond .= " ({$formField->field_name} = '0' OR {$formField->field_name} = NULL) AND";
						break;
					case 14: //Combobox
						$comboValueSql = "	SELECT id_{$formField->field_name} comboName
											FROM form_{$formField->field_name}
											WHERE deleted = 0 AND id_form = {$id_form} AND id_form_submit = {$id_form_submit}";
						$comboValue = $this->flower->db->executeQueryObj($comboValueSql);
						$comboValue = $comboValue[0]->comboName;
						$cond .= " ({$formField->field_name} = '{$comboValue}') AND";
						break;
					case 16://label
						break;
					case 17://breakline
						break;
					default:
						$cond .= " ({$formField->field_name} = '' OR {$formField->field_name} = NULL) AND";
						break;
				}
			}
		}
		$lastSpacePosition = strrpos($cond, ' ');
		$cond = substr($cond, 0, $lastSpacePosition);
		
		#endregion
		
		#region Control if there are any field data for the current form empty. If not the new phase status will be 'Ne Proces' else 'Pa Filluar'
		
		$controlFieldSql = "SELECT COUNT(1) cnt
							FROM form_{$id_form}
							WHERE form_{$id_form}_id = {$id_form_submit} AND {$cond}";
		$controlFieldCount = $this->flower->db->executeQueryObj($controlFieldSql);
		$controlFieldCount = $controlFieldCount[0]->cnt;
		
		#endregion
		
		if($currentStatus == 3)
		{
			// merr emrin e formes per te ruajtur ne fieldupdateHistory
			$form_fieldupdatehistory = new form($this->flower);
			$form_fieldupdatehistory = $form_fieldupdatehistory->load("form_id = {$id_form}");
			$form_fieldupdatehistory = $form_fieldupdatehistory[0];
			
			$currentProcessSql = "SELECT id_process, id_case
									FROM form_{$id_form}
									WHERE form_{$id_form}_id = {$id_form_submit}";
			$id_process = $this->flower->db->executeQueryObj($currentProcessSql);
			$id_case = $id_process[0]->id_case;
			$id_process = $id_process[0]->id_process;
			
			// merr emrin e procesit per te ruajtur ne fieldupdateHistory
			$process_fieldupdatehistory = new process($this->flower);
			$process_fieldupdatehistory = $process_fieldupdatehistory->load("process_id = {$id_process}");
			$process_fieldupdatehistory = $process_fieldupdatehistory[0];
			
			// merr emrin e koncesionit nese ekziston per ta ruajtur ne fieldupdateHistory
			$concessionNameForm_fieldupdatehistory = new form_40($this->flower);
			$concessionNameForm_fieldupdatehistory = $concessionNameForm_fieldupdatehistory->load("id_case = {$id_case}");
			$concessionNameForm_fieldupdatehistory = $concessionNameForm_fieldupdatehistory[0];
			$concessionName_fieldupdatehistory = $concessionNameForm_fieldupdatehistory->concession_name;
			
			$friendlyDesc = "U be submit forma {$id_form} - '{$form_fieldupdatehistory->form_name}' per ceshtjen {$id_form_submit} - '{$process_fieldupdatehistory->process_name}' - '{$concessionName_fieldupdatehistory}'";
			if($controlFieldCount == 1)
			{
				$this->insertNewPhaseStatus($fieldName, $id_form, $id_form_submit, $currentStatus, 1, $friendlyDesc);
				
				$response->Error = 1;
				$response->Status = 1;
				$response->Message = "Nuk eshte plotesuar asnje fushe. Statusi ndryshoi ne 'Pa Filluar'";
			}
			else if($controlFieldCount == 0)
			{
				$this->insertNewPhaseStatus($fieldName, $id_form, $id_form_submit, $currentStatus, 2, $friendlyDesc);
				
				$response->Error = 1;
				$response->Status = 2;
				$response->Message = "Statusi ndryshoi ne 'Ne Process'";
			}
		}
		else if($currentStatus == 2)
		{
			// merr emrin e formes per te ruajtur ne fieldupdateHistory
			$form_fieldupdatehistory = new form($this->flower);
			$form_fieldupdatehistory = $form_fieldupdatehistory->load("form_id = {$id_form}");
			$form_fieldupdatehistory = $form_fieldupdatehistory[0];
			
			$currentProcessSql = "SELECT id_process, id_case
									FROM form_{$id_form}
									WHERE form_{$id_form}_id = {$id_form_submit}";
			$id_process = $this->flower->db->executeQueryObj($currentProcessSql);
			$id_case = $id_process[0]->id_case;
			$id_process = $id_process[0]->id_process;
			
			// merr emrin e procesit per te ruajtur ne fieldupdateHistory
			$process_fieldupdatehistory = new process($this->flower);
			$process_fieldupdatehistory = $process_fieldupdatehistory->load("process_id = {$id_process}");
			$process_fieldupdatehistory = $process_fieldupdatehistory[0];
			
			// merr emrin e koncesionit nese ekziston per ta ruajtur ne fieldupdateHistory
			$concessionNameForm_fieldupdatehistory = new form_40($this->flower);
			$concessionNameForm_fieldupdatehistory = $concessionNameForm_fieldupdatehistory->load("id_case = {$id_case}");
			$concessionNameForm_fieldupdatehistory = $concessionNameForm_fieldupdatehistory[0];
			$concessionName_fieldupdatehistory = $concessionNameForm_fieldupdatehistory->concession_name;
			
			$friendlyDesc = "U be submit forma {$id_form} - '{$form_fieldupdatehistory->form_name}' per ceshtjen {$id_form_submit} - '{$process_fieldupdatehistory->process_name}' - '{$concessionName_fieldupdatehistory}'";
			
			if($controlFieldCount == 1)
			{
				$this->insertNewPhaseStatus($fieldName, $id_form, $id_form_submit, $currentStatus, 1, $friendlyDesc);
				
				$response->Error = 1;
				$response->Status = 1;
				$response->Message = "Nuk eshte plotesuar asnje fushe. Statusi ndryshoi ne 'Pa Filluar'";
			}
		}
		return $response;
	}
	
	protected function insertNewPhaseStatus($fieldName, $form_id, $id_form_submit, $oldStatus, $newStatus, $friendlyDesc){

		if(!check_user($this->sessionSite->user->user_id))
			return;

		$session = $this->reg->init('sessionSite');
		$currId_user = $session->user->user_id;
		$coloumnName = "id_{$fieldName}";
		$tableName = "form_{$fieldName}";
		//make deleted = 1 for old status
		$form_combobox = new $tableName($this->flower);
		$form_combobox->set("deleted",1)
						->where("deleted = 0 AND id_form = {$form_id} AND id_form_submit = {$id_form_submit}")
						->update();
		
		//add new status
		$form_combobox = new $tableName($this->flower);
		$form_combobox->_new();
		$combobox_id = $coloumnName;
		$form_combobox->id_form = $form_id;
		$form_combobox->id_form_submit = $id_form_submit;
		$form_combobox->$combobox_id = $newStatus;
		$form_combobox->id_user = $currId_user;
		$form_combobox->time_created = date("Y-m-d H:i:s");
		$form_combobox->deleted = 0;
		$form_combobox->save();
		
		$fieldupdatehistoryobj = $this->reg->init('fieldupdatehistory',  $this->flower, "/modules/dms/model/db_task");
		$fieldupdatehistoryobj->_new();
		$fieldupdatehistoryobj->subject = $tableName;
		$fieldupdatehistoryobj->subject_friendly_name = $tableName;
		$fieldupdatehistoryobj->id_record = $id_form_submit;
		$fieldupdatehistoryobj->field = $fieldName;
		$fieldupdatehistoryobj->field_friendly_name = $fieldName;
		$fieldupdatehistoryobj->old_value = $oldStatus;
		$fieldupdatehistoryobj->new_value = $newStatus;
		$fieldupdatehistoryobj->id_user = $currId_user;
		$fieldupdatehistoryobj->user = $session->user->username;
		$fieldupdatehistoryobj->friendly_action_description = $friendlyDesc;
		$fieldupdatehistoryobj->flg_hide = 1;
		$fieldupdatehistoryobj->update_date = date("y-m-d h:i:s");
		$fieldupdatehistoryobj->deleted = 0;
		$fieldupdatehistoryobj->save();
		
		$phaseStatusTableName = "phase_status_{$form_id}";
		$statusLabelName_old = $this->phaseStatusName($phaseStatusTableName, $oldStatus);
		$statusLabelName_new = $this->phaseStatusName($phaseStatusTableName, $newStatus);
		
		$fieldupdatehistoryobj = $this->reg->init('fieldupdatehistory',  $this->flower, "/modules/dms/model/db_task");
		$fieldupdatehistoryobj->_new();
		$fieldupdatehistoryobj->subject = $tableName;
		$fieldupdatehistoryobj->subject_friendly_name = $tableName;
		$fieldupdatehistoryobj->id_record = $id_form_submit;
		$fieldupdatehistoryobj->field = $fieldName;
		$fieldupdatehistoryobj->field_friendly_name = $fieldName;
		$fieldupdatehistoryobj->old_value = $statusLabelName_old;
		$fieldupdatehistoryobj->new_value = $statusLabelName_new;
		$fieldupdatehistoryobj->id_user = $currId_user;
		$fieldupdatehistoryobj->user = $session->user->username;
		$fieldupdatehistoryobj->friendly_action_description = $friendlyDesc;
		$fieldupdatehistoryobj->flg_hide = 0;
		$fieldupdatehistoryobj->update_date = date("y-m-d h:i:s");
		$fieldupdatehistoryobj->deleted = 0;
		$fieldupdatehistoryobj->save();
							
	}
	
	protected function phaseStatusName($tableName, $comboStatus, $fieldName = NULL){

		if(!check_user($this->sessionSite->user->user_id))
			return;

		if($fieldName == NULL)
			$fieldName = "{$tableName}_name as status";
		$sql = "SELECT {$fieldName} 
				FROM {$tableName}
				WHERE {$tableName}_id = {$comboStatus}";
		$resp = $this->flower->db->executeQueryObj($sql);
		return $resp[0]->status;
	}
	
	protected function delete_document($id_form_field, $repeat_index, $form_id, $form_submit_id, $all_temp_doc_uploaded, $temp_doc_upload_id){

		if(!check_user($this->sessionSite->user->user_id))
			return;

		$this->resp->error = 0; 
		$this->resp->message = " u fshi me sukses!";
		$extra = new stdClass;
		$extra->error = 0;
		$this->resp->extraData = $extra;
		
		//dokumenti qe po fshihet
        $document = $this->reg->init('temp_doc_upload', $this->flower);
        $daDocumentModel = $this->reg->init('document', $this->da, '', 'da/model');
        $revision = $this->reg->init('revision', $this->da);
        $cond = "temp_doc_upload_id = {$temp_doc_upload_id} AND id_form_field = {$id_form_field}";
		$docs = $document->load($cond);
		
        $daDocument = $daDocumentModel->load("document_id = {$docs[0]->id_document} and deleted = 0")[0];
        $revision = $revision->load("id_document = {$daDocument->document_id} and deleted = 0")[0];
		
		//Te gjithe dokumentat e uploaduar  pervec dokumentit qe po fshihet.
		//Jane dhe dokumentat e uploaduar te paruajtur
		$all_temp_doc_uploaded_array = explode(",",$all_temp_doc_uploaded);
		$index = array_search($temp_doc_upload_id,$all_temp_doc_uploaded_array);
		
		if($index !== FALSE)
			unset($all_temp_doc_uploaded_array[$index]);
			
		$all_temp_doc_uploaded = implode(",", $all_temp_doc_uploaded_array);
		
		//Nqs ka dokument per tu fshire
        if(count($docs) > 0)
        {
			$this_temp_doc_upload = $docs[0];
			
            try
			{
				$this->da->db->beginTransaction();
				$this->flower_generated->db->beginTransaction();
              
                foreach($docs as $doc)
                {
                    $doc->setProperty('deleted', 1);
                    $doc->save();
                }

                $daDocument->setProperty('deleted', 1);
                $daDocument->save();
                if(!empty($revision))
                {
                    $revision->setProperty('deleted', 1);
                    $revision->save();
                }
				
				// merr te gjithe dokumentat e uploaduar dhe te ruajtura pervec dokumentit qe po fshihet
				$sql = "SELECT GROUP_CONCAT(temp_doc_upload_id) as uploadsID 
						FROM temp_doc_upload 
						WHERE deleted = 0 AND temp_doc_upload_id IN ({$all_temp_doc_uploaded}) AND id_form <> 0";
				$uploadsAndSaved = $this->flower->db->executeQuery($sql);
				$uploadsAndSaved = $uploadsAndSaved[0]["uploadsID"];
				
				// merr te gjithe dokumentat e uploaduar jo te ruajtura pervec dokumentit qe po fshihet
				$sql = "SELECT GROUP_CONCAT(temp_doc_upload_id) as uploadsID 
						FROM temp_doc_upload 
						WHERE deleted = 0 AND temp_doc_upload_id IN ({$all_temp_doc_uploaded}) AND id_form = 0";
				$uploadsNotSaved = $this->flower->db->executeQuery($sql);
				$uploadsNotSaved = $uploadsNotSaved[0]["uploadsID"];
				
				// merr te gjithe dokumentat e uploaduar pervec dokumentit qe po fshihet
				$allUploaded_sql = "SELECT GROUP_CONCAT(temp_doc_upload_id) as uploadsID 
									FROM temp_doc_upload 
									WHERE deleted = 0 AND temp_doc_upload_id IN ({$all_temp_doc_uploaded})";
				$allUploaded_sql = $this->flower->db->executeQuery($allUploaded_sql);

				$uploadsID = $allUploaded_sql[0]["uploadsID"];
				if(!isNullOrEmpty($uploadsID))
				{
					$this->resp->uploadsID = $uploadsID;
				}
				else
					$this->resp->uploadsID = "";
				
				$form_name = "form_".$form_id;			
				$form_pk = "form_".$form_id."_id";	
				$form_fieldArr = $this->flower->db->executeQuery("SELECT * FROM form_field WHERE form_field_id = {$id_form_field}");
				$form_field_name = $form_fieldArr[0]["field_name"];
	
				$form_model = new $form_name($this->flower_generated);
				$form_model = $form_model->load("$form_pk = $form_submit_id")[0];
				$form_model->setProperty($form_field_name, $uploadsAndSaved);
				$form_model->save();

				if($this->resp->uploadsID == "")
				{
					$responseChangeStatus = $this->changePhaseStatus($form_id, $form_submit_id, $id_form_field);
					if($responseChangeStatus->Error == 1)
					{
						$dataToChange = new stdClass;
						$dataToChange->name = "phase_status_{$form_id}";
						$dataToChange->value = $responseChangeStatus->Status;
						$dataToChange->fieldType = 14;
						$dataToChange->error = 2;
						$dataToChange->message = $responseChangeStatus->Message;
						$this->resp->extraData = $dataToChange;
					}
				}

				$this->da->db->commit();
				$this->flower_generated->db->commit();
			}
			catch (Exception $e)
            {
                $this->resp->error = 1;
                $this->resp->message = json_encode($e->getMessage());
				$this->resp->message = " nuk u fshi!";
				$this->resp->extraData->error = 1;
                $this->da->db->rollback();
				$this->flower_generated->db->rollback();
            }
        }else{
			$this->resp->error = 1;
			$this->resp->message = " nuk mund te fshihet!";
			$this->resp->extraData->error = 1;
		}
        echo json_encode($this->resp);
    }

}
?>