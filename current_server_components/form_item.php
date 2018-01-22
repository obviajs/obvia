<?php

/**
 * <code>
 * @include 'form_item_option.php'
 * </code>
 * 
 * Class form_item
 * 
 * Per cdo item te formes merr html, id e field, opsionet dhe fieldType
 * <br/> inicializon dhe nje objekt te tipit form_item()
 */
include_once 'form_item_option.php';

class form_item {
    public $Html = null;
    public $FieldId = 0;
    public $Options = null;
    public $FieldType = null;


    public function form_item() {
        $this->Options = new form_item_option();
    }
    
}