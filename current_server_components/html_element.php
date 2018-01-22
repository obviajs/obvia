<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Abstract Class html_element
 * 
 * Merr te gjitha propertit per nje element.
 * <br/>Rendit te gjitha fuksionet qe do ti sherbejne nje elementi te caktuar.
 * per te marr html, kodet script validimin rregullat dhe mesazhet
 *  si dhe array perkatesisht me filet .js dhe .css per ti vendosur te referencat.
 *
 */
abstract class html_element {
    
    public $field_name;
    public $form_name;
    public $form_field_id;
    public $type_name;
    public $tooltip;
    public $col_span;
    public $row_span;
    public $label;
    public $field_value;
    public $selectedElements;
    public $checked;
    public $control_blocked_attribute;
	public $required;
	public $block_process_attribute;
	public $form_status_options;

    public abstract function render();

    public abstract function validation_rules();
    
    public abstract function validation_messages();
    
    public abstract function script_load();

    public abstract function formVariables();
    
    public abstract function script_additional();    
    
    public function html_tooltip() {
        return 
            "<div class='tooltip_'>" .
                "<div class='pointer_'>&nbsp &nbsp</div>" .
                "<div class='container_'>$this->tooltip</div>" . 
            "</div>";
    }
    public abstract function include_styles();
    
    public abstract function include_scripts(); 
}
