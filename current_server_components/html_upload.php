<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';
include_once 'database_helper.php';

/**
 * Class html_upload
 *
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi datetime sipas funksioneve qe permban kjo klase.
 *
 */
class html_upload extends html_element {
    /**
     * Funksioni render()
     *
     * Kthen html e ndertimit te elementit.
     * @return html code
     */

	public function render()
	{
        $uploadURL = "?html_uploadCRUD/upload_file/".$this->form_field_id."/".null;
        $getURL = "?html_uploadCRUD/get_documents/".$this->form_field_id."/".null;
        $deleteURL = "?html_uploadCRUD/delete_document/".$this->form_field_id."/".null."/".$this->form_id."/".$this->form_submit_id;
        $form_field_file_extensions = database_helper::form_field_file_extension($this->form_field_id);
        $realFieldId = $this->form_field_id;
        $repeat_index = "";

        if($this->repeated)
        {
            $fieldArr = explode('_', $this->form_field_id);
            $realFieldId = $fieldArr[0];
            $repeat_index = $fieldArr[1];
            $form_field_file_extensions = database_helper::form_field_file_extension($fieldArr[0]);
            $uploadURL = "?html_uploadCRUD/upload_file/".$fieldArr[0]."/".$fieldArr[1];
            $getURL = "?html_uploadCRUD/get_documents/".$fieldArr[0]."/".$fieldArr[1];
            $deleteURL = "?html_uploadCRUD/delete_document/".$fieldArr[0]."/".$fieldArr[1]."/".$this->form_id."/".$this->form_submit_id;
        }

        $extension = " ";
        foreach ($form_field_file_extensions as $form_field_file_extension){
            $file_extensions = database_helper::file_extension($form_field_file_extension["id_file_extension"])[0];
            $extension .= " ." . $file_extensions["extension_type"] . ",";
        }

        $extension = substr($extension, 0, -1);
		return
		"<div id='upload_{$this->form_field_id}' class='row col-lg-12 resizable' style='padding-top: 10px;padding-bottom: 10px;'>
                <div id='alerti_{$this->form_field_id}' class=\"alert alert-danger\" style='display: none'>
                <label {$this->versionStyle} for='{$this->field_name}'>{$this->label} {$this->required}</label>
                </div>
				<input type='hidden' name='{$this->field_name}' id='{$this->field_name}' value='{$this->field_value}'/>
				<div class='col-lg-12'>
					<a id='add_document_$this->form_field_id' href='javascript:void(0);' class='btn btn-sm btn-success  '>
									<span class='fa fa-upload' aria-hidden='true'></span>
									Shto dokument </a>
					<label {$this->versionStyle} for='{$this->field_name}'>{$this->label} {$this->required} ({$extension})</label>
					<span class='block-process'> {$this->block_process_attribute} </span>
				</div>
				<div class='col-lg-12'>
					<table id='treetable_{$this->form_field_id}' class='table table-condensed table-hover'>
					
						<colgroup>
							<col></col>
							<col></col>
							<col></col>
							<col></col>
						</colgroup>
						<thead>
						<tr>
							<th> Nr.# </th>
							<th> Dokument </th>
							<th> Shkarko dokument </th>" .
							(
								$this->hasUploadCategory ? 
									"<th> Shto metadata </th>" : 
									""
							)
							."<th> Fshi dokument </th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td> </td>
							<td> </td>
							<td> </td>" .
							(
								$this->hasUploadCategory ? 
									"<td> </td>" : 
									""
							)
							."<td> </td>
						</tr>
						</tbody>
					</table>
				</div>
				
				<div class='modal fade upload_modal' id='add_document_modal_{$this->form_field_id}' data-backdrop='static'>
					<div class='modal-dialog'>
						<div class='modal-content'>
							<div class='modal-header'>
								<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
								<h4 class='modal-title' id='myModalLabel'>Shto dokument</h4>
							</div>
							<div class='modal-body'>
								<div id='mulitplefileuploader_{$this->form_field_id}' class='btn ajax-file-upload-green' >Zgjidh dokument</div>
							</div>
							<div class='modal-footer'>
								<a id='start_upload_{$this->form_field_id}' href='javascript:void(0);' class='btn btn-success btn-sm' style='display:none'> Ngarko dokument </a>
								<a href='javascript:void(0);' class='btn btn-default btn-sm' data-dismiss='modal'>  Mbyll  </a>
							 </div>
						</div>
					</div>
				</div>
				<div class='modal fade' id='confirm_modal_{$this->form_field_id}' data-backdrop='static'>
					<div class='modal-dialog'>
						<div class='modal-content'>
							<div class='modal-header'>
								<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
								<h4 class='modal-title' id='confirm_modal_title_{$this->form_field_id}'> </h4>
							</div>
							<div class='modal-body'>
								<h5 class='modal-title' id='confirm_modal_message_{$this->form_field_id}'>  </h5>
							</div>
							<div class='modal-footer'>
								<a id='confirm_action_{$this->form_field_id}' href='javascript:void(0);' class='btn btn-default btn-sm'>  Konfirmo </a>
								<a href='javascript:void(0);' class='btn btn-danger btn-sm' data-dismiss='modal'>  Mbyll  </a>
							</div>
						</div>
					</div>
				</div>
				
				<div class='modal fade' id='metadata-modal_{$this->form_field_id}' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel'>
					<div class='modal-dialog' role='document'>
						<div class='modal-content'>
							<div class='modal-header'>
								<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
								<h5 class='modal-title' id='metadata-modal-title_{$this->form_field_id}'>Te dhena per dokumentin</h5>
							</div>
							<div class='modal-body' id='metadata-modal-content_{$this->form_field_id}'>
								<div class='row'>
									<div class='col-md-4'>
										<p><b>Kategoria</b></p>
									</div>
									<div class='col-md-8' id='meta-document-categories_{$this->form_field_id}'>

									</div>
								</div>
								<div class='row'>
									<div class='col-md-12' id='meta-document-categories-forms_{$this->form_field_id}' style='padding: 0'>

									</div>
								</div>
							</div>
							<div class='modal-footer'>
								<button type='button' class='btn btn-sm btn-primary' id='save-metadata_{$this->form_field_id}'>Ruaj</button>
								<button  data-dismiss='modal' class='btn btn-sm btn-default'>Mbyll</button>
							</div>
						</div>
					</div>
				</div>
		</div>
			
			<script>
			
			    var choosen{$this->field_name} = 0;
			    var errorMessage{$this->field_name} = '';
			    
				var document_node_$this->field_name = {
							id_document:0,
							id_group:0,
							document_name:'',
							is_group:false,
							is_dir:true,
							fullRight:true,
							uploaded:$('#$this->field_name').val()
						};
				
					var del_obj = {}
						
					$('#add_document_$this->form_field_id').livequery(function(){
						$(this).click(function(){
							$('#add_document_modal_$this->form_field_id').modal('show');
						});
					});
					var generate_id = function () { return '_' + Math.random().toString(36).substr(2, 9); };
					
					var process_id = $('input[name=id_process]').val();
					var case_id = $('input[name=id_case]').val();
					var document_upload_settings_$this->form_field_id = {
					    url: '$uploadURL/'+process_id+'/'+case_id,
						autoSubmit:false,
						fileName: 'myfile',
						returnType:'json',
						showDelete:false,
						dynamicFormData: function()
						{
							document_node_$this->field_name._id = generate_id();
							return document_node_$this->field_name;
						},
						dragDropStr: '<span>Kap e hidh dokument</span>',
						cancelStr: '<span class=\"hiq{$this->field_name}\" style=\"margin-left:12px\"> Hiq </span>',
						abortStr: '<span> Anullo </span>',
						doneStr : '<span class=\"ok{$this->field_name}\" style=\"margin-left: 6px;\"> Ok </span>',
						onSelect: function(files)
						{
						    choosen{$this->field_name}++;						   
						    if('{$this->MultiDocs}' != '1' && choosen{$this->field_name} > 1){
						        $( \".hiq{$this->field_name}\" ).trigger( \"click\" );
							}
							$('#start_upload_{$this->form_field_id}').show();
						},
						onDeselect: function(numFiles){
							if(numFiles < 1){
								$('#start_upload_{$this->form_field_id}').hide();
							}
						},
						onSuccess:function(files,data,xhr){

							if(data.error == 1){
								$( \".hiq{$this->field_name}\" ).trigger( \"click\" );
								$( \".ok{$this->field_name}\" ).trigger( \"click\" );
								document.getElementById('alerti_{$this->form_field_id}').innerHTML = 'Ngarkimi Deshtoi! <br>' + data.message;
								$('#add_document_modal_$this->form_field_id').modal('hide');
								document.getElementById('alerti_{$this->form_field_id}').style.display = 'block';
								setTimeout(function(){document.getElementById('alerti_{$this->form_field_id}').style.display = 'none'; }, 3000);
								return;
							}

							var currValue = $('#$this->field_name').val();
							if(currValue !='')
								var newValue = currValue + ','+data.temp_doc_upload_id;
							else
								var newValue = data.temp_doc_upload_id;
							
							$('#$this->field_name').val(newValue);
							document_node_$this->field_name.uploaded = newValue;
							
						},
						onError:function(files, status, message) {
						   $( \".hiq{$this->field_name}\" ).trigger( \"click\" );
						   document.getElementById('alerti_{$this->form_field_id}').innerHTML = '<strong>Gabim!</strong> Disa nga dokumentat nuk jane te lejuara per upload!';
						   $('#add_document_modal_$this->form_field_id').modal('hide');
						   document.getElementById('alerti_{$this->form_field_id}').style.display = 'block';
						   setTimeout(function(){document.getElementById('alerti_{$this->form_field_id}').style.display = 'none'; }, 3000);
						},
						afterUploadAll:function(){
							refreshDocTree_$this->form_field_id();
							$('#start_upload_{$this->form_field_id}').hide();
						}
					
					};
					
					var uploadObj_$this->form_field_id = $('#mulitplefileuploader_$this->form_field_id').uploadFile(document_upload_settings_$this->form_field_id, ({$this->MultiDocs} + '' == '1' ? true : false));
					$('#start_upload_$this->form_field_id').click(function() { uploadObj_$this->form_field_id.startUpload(); });
					
					function refreshDocTree_$this->form_field_id(){

						$.ajax({
							type: 'POST',
							url: '$getURL',
							data: document_node_$this->field_name,
							success: function(ret_data) {			    
								if(ret_data)
								{
									$('#treetable_$this->form_field_id').data('ui-fancytree').getTree().reload(ret_data);
									$('#upload_{$this->form_field_id}').parents('form').trigger('change');
								}
								else
								{
									$('#treetable_$this->form_field_id').css('display', 'none');
								}
							},dataType: 'json'
						});
						
					};
								
					var treetable_settings_$this->form_field_id = {
						extensions: ['table'],
						table: {indentation: 20 },
						source: { 
								url: '$getURL',
								type: 'POST',
								dataType: 'json',
								data: document_node_$this->field_name
						},
						renderColumns: function(event, data) {

							if(data)
							{
								$('#treetable_$this->form_field_id').css('display', 'block');
								var node = data.node;
	
								var data_attr = 'data-docId=\"'+node.data.document_id+'\" data-key=\"'+node.key+'\" data-title=\"'+node.title+'\" data-fieldid = \"$this->form_field_id\" ';
							
								var _delHtml 		= 	'<a id=\"delete_document_$this->form_field_id\" href=\"javascript:void(0);\" '+ data_attr +' onclick=\'deleteUpload_$this->form_field_id(this)\' class=\"btn btn-danger btn-xs delete_document\">'+
									' <span class=\"glyphicon glyphicon-trash\"></span> Fshi </a>';
								
								var _downloadHtml 		= 	'<a href=\"?html_uploadCRUD/download_doc/'+node.key+'/$realFieldId' + '/$repeat_index/\" class=\"btn btn-default btn-xs download_document\">'+
										' <span class=\"glyphicon glyphicon-download\"></span>  Shkarko </a>';
								var _metaHtml 		= 	'<a href=\"javascript:void(0);\" '+ data_attr +' onclick=\'addMetadata_$this->form_field_id(this)\' class=\"btn btn-default btn-xs add_metadata\">'+
										' <span class=\"glyphicon glyphicon-plus\"></span>  Shto metadata </a>';
								\$tdList = $(node.tr).find('>td');
								\$tdList.eq(0).text(node.getIndexHier()).addClass('alignRight');
								\$tdList.eq(1).text(node.title.truncate(36,'middle'));
								\$tdList.eq(2).html(_downloadHtml);" .
								(
									$this->hasUploadCategory ? 
										"\$tdList.eq(3).html(_metaHtml);\$tdList.eq(4).html(_delHtml);" : 
										"\$tdList.eq(3).html(_delHtml);"
								) 
							."}
							else
							{
								$('#treetable_$this->form_field_id').css('display', 'none');
							}
						}
					};
					$('#treetable_$this->form_field_id').css('display', 'none');
					$('#treetable_$this->form_field_id').fancytree(treetable_settings_$this->form_field_id);
					
					
					$('#confirm_action_$this->form_field_id').click(function(){
						$.ajax({
							type: 'GET',
							url: '$deleteURL'+ '/' + document_node_$this->field_name.uploaded + '/' + del_obj.key,
							success: function(data) {
								message = 'Dokumenti ';
								var node = $('#treetable_$this->form_field_id');
								
								message +=  '\'' +del_obj.title + '\'' + data.message;
								
								var html_mesage = '';
								if(data.error == 0){
									html_mesage = '<span class=\"alert alert-success\">'+ message + '</span>';
									node.fancytree('getActiveNode').remove();						
									//remove element from hidden value
									$('#$this->field_name').val(data.uploadsID);
									
									document_node_$this->field_name.uploaded = data.uploadsID;
									if(data.extraData.error == 2)
									{
										if(data.extraData.fieldType == 14)
										{
											$('#' + data.extraData.name).multiselect('clearSelection');
											$('#' + data.extraData.name).multiselect('select',data.extraData.value);
											bootbox.alert(data.extraData.message);
										}
									}
									$('#upload_{$this->form_field_id}').parents('form').trigger('change');
								}else{
									html_mesage = '<span class=\"alert alert-danger\">'+ message + '</span>';
								}
								
								$('#confirm_modal_message_$this->form_field_id').html(html_mesage);
								setTimeout(function(){ $('#confirm_modal_$this->form_field_id').modal('hide'); }, 2000);
							},dataType: 'json'
						});
					});
					
					/*
					//old way to delete upload. Problem: delete only first file upload because all delete button had the same id
					$('#delete_document_$this->form_field_id').livequery(function(){
						$(this).click(function(){
							var key = $(this).data('key');
							var title = $(this).data('title');
							$('#confirm_modal_title_$this->form_field_id').html('Fshi dokument');
							$('#confirm_modal_message_$this->form_field_id').html('Doni te fshini dokumentin \"'+title+'\" ?');

							$('#confirm_action_$this->form_field_id').show();
							$('#confirm_modal_$this->form_field_id').modal('show');	

							del_obj.type = 0;
							del_obj.key = key;
							del_obj.title = title;

						});
						
					});*/
				//});
				
				function deleteUpload_$this->form_field_id(d)
				{
					var key = d.getAttribute('data-key');
					var title = d.getAttribute('data-title');
					var fieldId = d.getAttribute('data-fieldid');
					 
					$('#confirm_modal_title_' + fieldId).html('Fshi dokument');
					$('#confirm_modal_message_' + fieldId).html('Doni te fshini dokumentin \"'+title+'\" ?');

					$('#confirm_action_' + fieldId).show();
					$('#confirm_modal_' + fieldId).modal('show');	

					del_obj.type = 0;
					del_obj.key = key;
					del_obj.title = title;
				}

				function addMetadata_$this->form_field_id(d){
					var title = d.getAttribute('data-title');
					var fieldId = d.getAttribute('data-fieldid');
					var docId = d.getAttribute('data-docId');
					
					$('#save-metadata_{$this->form_field_id}').attr('data-docid', docId);
					$('#save-metadata_{$this->form_field_id}').attr('data-version', 'false');

					var options = {
						documentId: docId,
						selectStatus: 'disabled'
					};

					var selectors = {
						documentCategories: $('#meta-document-categories_{$this->form_field_id}'),
						forms: $('#meta-document-categories-forms_{$this->form_field_id}'),
						formsId: '#meta-document-categories-forms_{$this->form_field_id}',
						selectId: 'meta-document-categories-select_{$this->form_field_id}'
					};

					renderFilePreferencesView(selectors, options);

					$('#metadata-modal-title_{$this->form_field_id}').html('Te dhena per dokumentin <b>' + title + '</b>');
					$('#metadata-modal_{$this->form_field_id}').modal('show');	
				}

				$('#save-metadata_{$this->form_field_id}').on('click', function () {
					var dataString = getFormsFilledData($('.formHtml')) + '&documentId=' + $(this).attr('data-docid');
					dataString = window.btoa(dataString);

					var url = '?efilemanager/save_meta_data/false/case_doc';
					if ($(this).attr('data-version') == 'true')
						url = '?efilemanager/save_meta_data/true/case_doc';

					if (!validateForms($('.formHtml'))) {
						stopFocus = 0;
						return;
					}

					$.ajax({
						url: url,
						type: 'post',
						dataType: 'json',
						data: {
							formData: dataString
						},
						success: function (response) {
							if (response.error == 0) {
								$('#metadata-modal_{$this->form_field_id}').modal('hide');
							}
							bootbox.alert(response.message);
						}
					})
				});
				
			</script>
			";
	}

	public function render_modify_form()
	{
		return
		"		
			<div class='row col-lg-12 resizable' style='padding-top: 10px;padding-bottom: 10px;'>
			<label style='padding-left: 20px;'>{$this->label}</label>
				<input type='hidden' name='{$this->field_name}' id='{$this->field_name}' value='{$this->field_value}'/>
				<div class='col-lg-12'>
					<a id='add_document_$this->form_field_id' href='javascript:void(0);' class='btn btn-outline btn-sm btn-success  '>
									<span class='fa fa-upload' aria-hidden='true'></span>
									Shto dokument </a>
				</div>
			</div>
			";
	}

	public function render_old() {
        return
            "<div class='col-lg-12'><label>{$this->label}</label>
			<noscript>
               <input type='hidden' name='redirect' value='http://blueimp.github.io/jQuery-File-Upload/'>
            </noscript>
            <input type='hidden' name='{$this->field_name}' id='upload_files'/>
            <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
            <div class='row fileupload-buttonbar' id='$this->form_field_id'>
				
                <div class='col-lg-12' >
				
                <!-- The fileinput-button span is used to style the file input field as button -->
                <span class='btn btn-success fileinput-button'>
                    <i class='glyphicon glyphicon-plus'></i>
                    <span>Add files...</span>
                    <input type='file' name='files[]' multiple>
                </span>
                <button type='submit' class='btn btn-primary start'>
                    <i class='glyphicon glyphicon-upload'></i>
                    <span>Start upload</span>
                </button>
                <button type='reset' class='btn btn-warning cancel'>
                    <i class='glyphicon glyphicon-ban-circle'></i>
                    <span>Cancel upload</span>
                </button>
                <button type='button' class='btn btn-danger delete'>
                    <i class='glyphicon glyphicon-trash'></i>
                    <span>Delete</span>
                </button>
                <input type='checkbox' class='toggle'>
                <!-- The global file processing state -->
                <span class='fileupload-process'></span>
            </div>
            <!-- The global progress state -->
            <div class='col-lg-12 fileupload-progress fade'>
                <!-- The global progress bar -->
                <div class='progress progress-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100'>
                    <div class='progress-bar progress-bar-success' style='width:0%;'></div>
                </div>
                <!-- The extended global progress state -->
                <div class='progress-extended'>&nbsp;</div>
            </div>
        </div>
        <!-- The table listing the files available for upload/download -->
        <table role='presentation' class='table table-striped'><tbody class='files'></tbody></table>
        <!-- The template to display files available for upload -->
        <script id='template-upload' type='text/x-tmpl'>
            {% for (var i=0, file; file=o.files[i]; i++) { %}
                <tr class='template-upload fade'>
                    <td>
                        <span class='preview'></span>
                    </td>
                    <td>
                        <p class='name'>{%=file.name%}</p>
                        <strong class='error text-danger'></strong>
                    </td>
                    <td>
                        <p class='size'>Processing...</p>
                        <div class='progress progress-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' aria-valuenow='0'>" .
                                "<div class='progress-bar progress-bar-success' style='width:0%;'></div></div>
                        </td>
                    <td>
                        {% if (!i && !o.options.autoUpload) { %}
                            <button class='btn btn-primary start' disabled>
                                <i class='glyphicon glyphicon-upload'></i>
                                <span>Start</span>
                            </button>   
                        {% } %}
                        {% if (!i) { %}
                            <button class='btn btn-warning cancel'>
                                <i class='glyphicon glyphicon-ban-circle'></i> 
                                <span>Cancel</span>
                            </button>
                        {% } %}
                    </td>
                </tr>
            {% } %}
        </script>
        <!-- The template to display files available for download -->
        <script id='template-download' type='text/x-tmpl'>
            {% for (var i=0, file; file=o.files[i]; i++) { %}
                <tr class='template-download fade'>
                    <td>
                        <span class='preview'>
                            {% if (file.thumbnailUrl) { %}
                                <a href='{%=file.url%}' title='{%=file.name%}' download='{%=file.name%}' data-gallery>
                                    <img src='{%=file.thumbnailUrl%}'>
                                </a>
                            {% } %}
                        </span>
                    </td>
                    <td>
                        <p class='name'>
                            {% if (file.url) { %}
                                <a href='{%=file.url%}' title='{%=file.name%}' download='{%=file.name%}' {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
                            {% } else { %}
                                <span>{%=file.name%}</span>
                            {% } %}
                        </p>
                        {% if (file.error) { %}
                            <div><span class='label label-danger'>Error</span> {%=file.error%}</div>
                        {% } %}
                    </td>
                    <td>
                        <span class='size'>{%=o.formatFileSize(file.size)%}</span>
                    </td>
                    <td>
                        {% if (file.deleteUrl) { %}
                            <button class='btn btn-danger delete' data-type='{%=file.deleteType%}'
                                data-url='{%=file.deleteUrl%}' {% if (file.deleteWithCredentials) { %} 
                                data-xhr-fields='{'withCredentials':true}'{% } %}>
                                <i class='glyphicon glyphicon-trash'></i>
                                <span>Delete</span>
                            </button>
                            <input type='checkbox' name='delete' value='1' class='toggle'>
                        {% } else { %}
                            <button class='btn btn-warning cancel'>
                                <i class='glyphicon glyphicon-ban-circle'></i>
                                <span>Cancel</span>
                            </button>
                        {% } %}
                    </td>
                </tr>
            {% } %}
        </script>
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
		return "";
	}

	public function formVariables(){
		 return "
                window.form_variables.upload_{$this->form_field_id} = {
																selector: $('#add_document_{$this->form_field_id}'),
																value: null,
                                                                block: $('#upload_{$this->form_field_id}'),
                                                                source: null
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
