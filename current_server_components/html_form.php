<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Class html_form
 * 
 * <br/>
 * Ne fund eshte kjo klases qe do therritet pasi ka mbledhut te gjith html e elementeve
 * rregullat e validimi dhe scriptet perkatese.
 *
 * @author Stela Dedja
 */
class html_form {

    public $render;
    public $validation_rules;
    public $validation_messages;
    public $script_load;
    public $script_additional;
    public $include_styles;
    public $include_scripts;
    
    public function html_form($form_id) {        
        $this->render = "";
        $this->validation_rules = array();
        $this->validation_messages = array();
        $this->script_load = $this->initialScript($form_id);
        $this->script_additional = "";
        $this->include_styles = array();
        $this->include_scripts = array();
    }

    private function initialScript($form_id)
    {
        return "window.form_variables.form_{$form_id} = {
            selector: $('#view_form_{$form_id}')
        }";
    }

}
