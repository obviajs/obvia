/**
 * This is an Upload component
 * 
 * Kreatx 2018
 */

//component definition
var Upload = KxGenerator.createComponent({
    //model binds to the template
    //if you want variables to bind, you must declare them in the model object
    initModel: function () {
        return {
            fieldName: this.fieldName,
            label: this.label,
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            versionStyle: this.versionStyle,
            add_document: this.add_document.bind(this),
            required: this.required
        }
    },
    add_document: function () {
        $('#add_document_modal_'+this.id).modal('show');
    },
    registerEvents: function () {
        var _self = this;
            // console.log(_self);
        this.$el.on('change', function (e) {

        });
    },

    beforeAttach: function () {

    },

    afterAttach: function () {
        var _self = this;
        var choosen = 0;
        var errorMessage = '';
        var document_node = {
                id_document:0,
                id_group:0,
                document_name:'',
                is_group:false,
                is_dir:true,
                fullRight:true,
                uploaded:$('#'+this.fieldName).val()
            };
        var del_obj = {};
        var generate_id = function () { return '_' + Math.random().toString(36).substr(2, 9); };
        var document_upload_settings = {
            url: "http://dms-mpj/?html_uploadCRUD/upload_file/1342//"+_self.process_id+'/'+_self.case_id,
            autoSubmit:false,
            fileName: 'myfile',
            returnType:'json',
            showDelete:false,
            dynamicFormData: function()
            {
                document_node_id = generate_id();
                return document_node;
            },
            dragDropStr: '<span>Kap e hidh dokument</span>',
            cancelStr: '<span class=\"hiq'+_self.fieldName+'\" style=\"margin-left:12px\"> Hiq </span>',
            abortStr: '<span> Anullo </span>',
            doneStr : '<span class=\"ok'+_self.fieldName+'\" style=\"margin-left: 6px;\"> Ok </span>',
            onSelect: function(files)
            {
                choosen++;				   
                if(this.multiple == false && choosen > 1){
                    $(".hiq"+_self.fieldName).trigger('click');
                }
                $('#start_upload_'+_self.id).show();
            },
            onDeselect: function(numFiles){
                if(numFiles < 1){
                    $('#start_upload_'+_self.id).hide();
                }
            },
            onSuccess:function(files,data,xhr){
                if(data.error == 1){
                    $(".hiq"+_self.fieldName).trigger( 'click' );
                    $(".ok"+_self.fieldName).trigger( 'click' );
                    document.getElementById('alerti_'+_self.id).innerHTML = 'Ngarkimi Deshtoi! <br>' + data.message;
                    $('#add_document_modal_'+_self.id).modal('hide');
                    document.getElementById('alerti_'+_self.id).style.display = 'block';
                    setTimeout(function(){document.getElementById('alerti_'+_self.id).style.display = 'none'; }, 3000);
                    return;
                }

                var currValue = $('#'+_self.fieldName).val();
                if(currValue !='')
                    var newValue = currValue + ','+data.temp_doc_upload_id;
                else
                    var newValue = data.temp_doc_upload_id;
                
                $('#'+_self.fieldName).val(newValue);
                document_node.uploaded = newValue;
                
            },
            onError:function(files, status, message) {
                console.log(files);
                console.log(status);
                console.log(message);
               $( ".hiq"+_self.fieldName).trigger( 'click' );
               document.getElementById('alerti_'+_self.id).innerHTML = '<strong>Gabim!</strong> Disa nga dokumentat nuk jane te lejuara per upload!';
               $('#add_document_modal_'+_self.id).modal('hide');
               document.getElementById('alerti_'+_self.id).style.display = 'block';
               setTimeout(function(){document.getElementById('alerti_'+_self.id).style.display = 'none'; }, 3000);
            },
            afterUploadAll:function(){
                // refreshDocTree_$this->form_field_id();
                $('#start_upload_'+_self.id).hide();
            }
        
        };
        var uploadObj = $('#mulitplefileuploader_'+this.id).uploadFile(document_upload_settings, (this.multiple));
        $('#start_upload_'+_self.id).click(function() { uploadObj.startUpload(); }); 
    },

    getValue: function () {

    },

    setValue: function (value) {

    },

    template: function () {
        var test = "<div id='" + this.id + "'class='row col-lg-"+this.colspan+" resizable' style='padding-top: 10px;padding-bottom: 10px;'>"
                            +"<div id='alerti_" +this.id+ "' class=\"alert alert-danger\" style='display: none'>"
                            +"<input type='hidden' name='"+this.fieldName+"' id='"+this.fieldName+"' value='"+this.fieldName+"'/>"
                            +"</div>"
                            +"<div class='col-lg-12'>"
                                +"<a  href='javascript:void(0);' class='btn btn-sm btn-success  '  rv-on-click='add_document'>"
                                +"<span class='fa fa-upload' aria-hidden='true'></span>"
                                +"Shto dokument </a>"
                                +"<label "+this.versionStyle+" for='"+this.fieldName+"' " +this.required+ " ("+this.extension+")>"+this.label+"</label>"
		                        +"<span class='block-process' "+this.blockProcessAttr+ "></span>"
                            +"</div>"
                            +"<div class='col-lg-12'>"
                            +"<table id='treetable_"+this.id+"' class='table table-condensed table-hover'>"
                            +"    <colgroup>"
                            +"       <col></col>"
                            +"       <col></col>"
                            +"       <col></col>"
                            +"       <col></col>"
                            +"    </colgroup>"
                            +"    <thead>"
                            +"    <tr>"
                            +"        <th> Nr.# </th>"
                            +"        <th> Dokument </th>"
                            +"        <th> Shkarko dokument </th>" 
                            +"                <th> Shto metadata </th>"  
                            +"        <th> Fshi dokument </th>"
                            +"    </tr>"
                            +"    </thead>"
                            +"    <tbody>"
                            +"    <tr>"
                            +"        <td> </td>"
                            +"        <td> </td>"
                            +"        <td> </td>"
                            +"        <td> </td>" 
                            +"        <td> </td>"
                            +"    </tr>"
                            +"    </tbody>"
                            +"</table>"
                            +"</div>"
                            +"<div class='modal fade upload_modal' id='add_document_modal_"+this.id+"' data-backdrop='static'>"
                            +"  <div class='modal-dialog'>"
                            +"      <div class='modal-content'>"
                            +"          <div class='modal-header'>"
                            +"              <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"
                            +"              <h4 class='modal-title' id='myModalLabel'>Shto dokument</h4>"
                            +"          </div>"
                            +"          <div class='modal-body'>"
                            +"             <div id='mulitplefileuploader_"+this.id+"' class='btn ajax-file-upload-green' >Zgjidh dokument</div>"
                            +"          </div>"
                            +"          <div class='modal-footer'>"
                            +"              <a id='start_upload_"+this.id+"' href='javascript:void(0);' class='btn btn-success btn-sm' style='display:none'> Ngarko dokument </a>"
                            +"              <a href='javascript:void(0);' class='btn btn-default btn-sm' data-dismiss='modal'>  Mbyll  </a>"
                            +"          </div>"
                            +"      </div>"
                            +"  </div>"
                            +"</div>"
                            +"<div class='modal fade' id='confirm_modal_"+this.id+"' data-backdrop='static'>"
                            +"    <div class='modal-dialog'>"
                            +"        <div class='modal-content'>"
                            +"            <div class='modal-header'>"
                            +"               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"
                            +"                <h4 class='modal-title' id='confirm_modal_title_"+this.id+"'> </h4>"
                            +"            </div>"
                            +"            <div class='modal-body'>"
                            +"                <h5 class='modal-title' id='confirm_modal_message_"+this.id+"'>  </h5>"
                            +"            </div>"
                            +"            <div class='modal-footer'>"
                            +"                <a id='confirm_action_"+this.id+"' href='javascript:void(0);' class='btn btn-default btn-sm'>  Konfirmo </a>"
                            +"                <a href='javascript:void(0);' class='btn btn-danger btn-sm' data-dismiss='modal'>  Mbyll  </a>"
                            +"            </div>"
                            +"        </div>"
                            +"    </div>"
                            +"</div>"
                            +"<div class='modal fade' id='metadata-modal_"+this.id+"' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel'>"
                            +"    <div class='modal-dialog' role='document'>"
                            +"        <div class='modal-content'>"
                            +"            <div class='modal-header'>"
                            +"                <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"
                            +"                <h5 class='modal-title' id='metadata-modal-title_"+this.id+"'>Te dhena per dokumentin</h5>"
                            +"            </div>"
                            +"            <div class='modal-body' id='metadata-modal-content_"+this.id+"'>"
                            +"                <div class='row'>"
                            +"                    <div class='col-md-4'>"
                            +"                        <p><b>Kategoria</b></p>"
                            +"                    </div>"
                            +"                    <div class='col-md-8' id='meta-document-categories_"+this.id+"'>"
                            +"                    </div>"
                            +"                </div>"
                            +"                <div class='row'>"
                            +"                    <div class='col-md-12' id='meta-document-categories-forms_"+this.id+"' style='padding: 0'>"
                            +"                    </div>"
                            +"               </div>"
                            +"            </div>"
                            +"            <div class='modal-footer'>"
                            +"                <button type='button' class='btn btn-sm btn-primary' id='save-metadata_"+this.id+"'>Ruaj</button>"
                            +"                <button  data-dismiss='modal' class='btn btn-sm btn-default'>Mbyll</button>"
                            +"            </div>"
                            +"        </div>"
                            +"    </div>"
                            +"</div>"
                   +"</div>";
        // console.log(test);
        return test;
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Upload.type = 'upload';

//register dom element for this component
KxGenerator.registerDOMElement(Upload, 'kx-Upload');