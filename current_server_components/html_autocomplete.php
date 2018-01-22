<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_autocomplete
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi autocomplete sipas funksioneve qe permban kjo klase.
 *
 * @author Stela Dedja
 */
class html_autocomplete extends html_element {
    
    public $autocomplete_action;
    public $browse_action;
    public $load_action;
    public $form_submit_id;
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
            "<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span} resizable' id='{$this->field_name}_container'>
            <label for='{$this->field_name}'>{$this->label} {$this->required}</label>
                <div class='input-group'>
					<span class='block-process'>{$this->block_process_attribute}</span>
                    <input type='hidden' name='{$this->field_name}_select[]' id='{$this->field_name}_select'/>
                    <span class='input-group-btn'>
                        <button type='button' style='margin-left: 5px;'
                            class='glyphicon glyphicon-folder-open btn btn-default'
                            title='go' id='{$this->field_name}_btn'>
                            <b class='caret'></b>
                        </button>
                    </span>
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
        $modal = '<div class="modal" style="margin-top:70px" id="combo_category">'.
    '<div class="modal-dialog">'.
        '<div class="modal-content">'.
            '<div class="modal-header">'.
                '<button type="button" class="close" onclick="closeModalCombo()" data-dismiss="modal" aria-hidden="true">'.
                    '<i class="glyphicon glyphicon-remove-circle"></i></button>'.
                '<h4 class="modal-title">Vlerat e Autocomplete</h4>'.
            '</div>'.

            '<div class="row">'.
                '<div class="modal-body" style="max-height: 300px; max-width:97.5%; overflow-y: auto;">'.
                    '<div class="row">'.
                        '<div class="col-md-12">'.
                            '<div class="table-responsive" style="margin-left:10px;">'.
                                '<table id="combo_category_table" class="table table-striped table-bordered table-hover display" style="width: 100%">'.
                                    '<thead>'.
                                    '<tr>'.
                                        '<th>Emri</th>'.
                                    '</tr>'.
                                    '</thead>'.
                                '</table>'.

                            '</div>'.
                        '</div>'.
                    '</div>'.
                '</div>'.
            '</div>'.
            '<div class="modal-footer">'.
                '<a href="#" onclick="closeModalCombo()" data-dismiss="modal" class="btn">Mbyll</a>'.
            '</div>'.
        '</div>'.
        '<div id = "combo_category_details_popup">'.
            '<!-- The popup with combo to be modified goes here -->'.
        '</div>'.
    '</div>'.
'</div>';
        return 
            "
            $('#{$this->field_name}_btn').click(function() {
                var \$combo_category_table;
                $('#autoselect_modal').html('{$modal}');
                $('#combo_category_table').DataTable().destroy();
                \$combo_category_table = $('#combo_category_table').DataTable({
                    columns: [
                        {\"title\":\"Emri\"},
                    ],
                    data:" . json_encode($this->dataForDataTable) . "
                });
                
                $('#combo_category').fadeIn();
            });
            
            function chooseData(arr, text, fieldname){
                var array_id_multiple = arr.split(/_(.*)/);
                id = array_id_multiple[0];
                multiple = array_id_multiple[1];
                var selectedItems = $(\"#\" + fieldname + \"_select\").select2(\"data\");
                var found = false;
                if(multiple == 'true'){
                    for (var i = 0; i<selectedItems.length; i++){
                        if(selectedItems[i].id == id)
                            found = true;
                    }
                }
                else{
                    if(selectedItems != null)
                        if(selectedItems.id == id)
                            found = true;
                }
                var newData = {
                    id: id,
                    text: text
                }
                
                if(!found){
                    if(multiple == 'true')
                        selectedItems.push(newData);
                    else
                        selectedItems = newData;
                }
                    
                $(\"#\" + fieldname + \"_select\").select2(\"data\", selectedItems);
                $('#combo_category').fadeOut();

            }
            function closeModalCombo(){
                $(\"#combo_category\").modal(\"toggle\")
            }";
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

        return 
            "
            $('#{$this->field_name}_select').select2({
                    multiple: $this->MultipleSelection,
                    minimumInputLength: 2,
                    placeholder: 'Search',
                    allowClear: true,
                    data: ".json_encode($this->optionsData).",
                    formatResult: function(data) {
                        return '<div class=\"select2-user-result\">' + data.text + '</div>';
                    },
                    formatSelection: function(data) {
                        if(data != undefined)
                            return data.text;
                    },
                    separator: ',',
                    width: 'off',
                    initSelection: function(element, callback) { " .
                    (
                        !$this->MultipleSelection ? "callback( " . json_encode($this->selectedOptions[0]) . ");" : "callback(" . json_encode($this->selectedOptions) . ");"        
                    ) .
                    "}
            }).on(\"change\", function (evt) {
                //var evt = document.createEvent(\"HTMLEvents\");
                //evt.initEvent(\"change\", false, true);
                //$('#{$this->field_name}_select').get(0).dispatchEvent(evt);
            });
              $('#{$this->field_name}_select').select2('val', '222');
              $('#s2id_{$this->field_name}_select').addClass('form-control');";
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
