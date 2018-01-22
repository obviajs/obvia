<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once 'html_element.php';

/**
 * Class html_textarea
 *
 * Ben extends html_element.php.
 * <br/>
 * Realizon shfaqjen e nje elementi textarea sipas funksioneve qe permban kjo klase.
 *
 * @author Kreatx
 */
class html_text_editor extends html_element {
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
            "<div class='form-group col-lg-{$this->col_span} rowspan{$this->row_span}'>
                <label for='{$this->field_name}'>{$this->label} {$this->required}</label>
				<span class='block-process'> {$this->block_process_attribute} </span>
                <textarea type='text' name='{$this->field_name}' 
                    id='{$this->field_name}' class='form-control rowspan{$this->row_span} summernote' placeholder=\"{$this->label}\" autofocus></textarea>" .
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
        $Spelling = '$Spelling';
        $script = "
        
        var SpellCheckButton = function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class=\'fa fa-search\' aria-hidden=\'true\'></i> Spell Check',
                tooltip: 'Spell Check',
                click: function (e) {
                    var editingArea = $('#{$this->field_name}').parent().find('.note-editing-area');
                    var dialog = editingArea.spellCheckInDialog({defaultDictionary:'Albanian'});
                    dialog.onDialogClose = function(){
                        $('#".$this->field_name."').summernote('code', editingArea.find('.note-editable').html());
                    }
                }
            });

            return button.render(); 
        }

		$('#".$this->field_name."').summernote({
			height: 70 ,
			toolbar: [
				['style', ['bold', 'italic', 'underline', 'clear']],
				['font', ['strikethrough']],
				['fontsize', ['fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['insert', ['link']],
                ['misc', ['codeview']],
                ['mybutton', ['spellCheck']]
            ],
            buttons: {
                spellCheck: SpellCheckButton
            }
		 });
		 ";
        if($this->field_value != '')
            $script .= "$('#".$this->field_name."').summernote('code', \"".trim(preg_replace('/\s+/', ' ', addslashes($this->field_value)))."\");";


        return $script;
    }
    /**
     * Funksioni validation_messazhe()
     *
     * Ky funsksion merr te gjith mesazhet e validimit qe do te kthen nga validimi i elementeve.
     * @return string mesazhet e validimit ne nje array.
     */
    public function validation_messages() {
        if($this->required != "")
        {
            return
                "$this->field_name: { 
                required: 'Plotësoni fushën \"$this->label\"'
            }";
        }
        else
            return "";
    }
    /**
     * Funksioni validation_rules()
     *
     * Ky funsksion merr te gjith rregullat e validimit qe do te vendosen per validimi i elementeve.
     * @return array rregullat e validimit ne nje array.
     */
    public function validation_rules() {
        if($this->required != "")
        {
            return
                "$this->field_name: { 
                required: true
            }";
        }
        else
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
