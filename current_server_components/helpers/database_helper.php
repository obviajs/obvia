<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of html_helper
 *
 */
/**
 * Class database_helper
 * 
 * Ne kete klase do kryhet te gjitha veprimet me databasen  te merret te dhnat per secilin rast.
 * <br/>Kemi element kompleks per te cilet kemi ndertuar funksione statike sepse cdo element komplex si psh: Autocomplete 
 * ka nje tabele te vecante ne database.
 */
class database_helper {

    static public function database() {
        $reg = registry::getInstance();
        $connections = json_decode(CONNECTIONS);
        return $reg->init('dbabstraction', $connections->flower, 'flower');
    }
    
    static public function database_flower_generated() {
        $reg = registry::getInstance();
        $connections = json_decode(CONNECTIONS);
        return $reg->init('dbabstraction', $connections->flower_generated, 'flower_generated');
    }

    /**
     * Funksioni form_data()
     *
     */
    static public function form_data($form_id, $id_process, $id_case) {
        $connections = json_decode(CONNECTIONS);
        $db = registry::getInstance()->init('dbabstraction', $connections->flower_generated, 'flower_generated');
        if($id_process != '' && $id_case != '')
        $sql =
            "select * from form_{$form_id}
			WHERE deleted = 0 AND id_process = {$id_process} and id_case = {$id_case};";

        else
            $sql =
                "select * from form_{$form_id}
			WHERE deleted = 0 limit 1";

        return $db->db->executeQueryObj($sql);
    }

    /**
    * Funksioni form_fields()
    * 
    * Selecton te gjith type, fields, emrin e formes dhe form_id.
    * <br/>Kthen egzekutimin e queryt ne database
    * 
    * @param int $form_id id e formes qe do te merren field ne database
    * @return array Kthen egzekutimin e query ne database.
    */
    static public function form_fields($form_id) {
        $sql = 
            "select form_field_type.*,
                form_field.*,
                form.form_name,
                form.form_id
            from form_field 
                inner join form_field_type on form_field_type.form_field_type_id = form_field.id_form_field_type
                inner join form on form.form_id = form_field.id_form
            where form_field.id_form = {$form_id} AND form_field.deleted = 0
            order by field_order";

        return database_helper::database()->db->executeQuery($sql);
    }

    /**
     * Funksioni file_extension()
     *
     * Selecton te gjith extensions te file_extension.
     * <br/>Kthen egzekutimin e queryt ne database
     *
     * @param int $file_ext_id id e file qe do te merren extensionet ne database
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function file_extension($file_ext_id) {
        $sql =
            "select *
            from file_extension 
            where file_extension_id= {$file_ext_id}";
        return database_helper::database()->db->executeQuery($sql);
    }

    /**
     * Funksioni form_field_file_extension()
     *
     * Selecton te gjith extensions te form_field.
     * <br/>Kthen egzekutimin e queryt ne database
     *
     * @param int $form_field_id id e field qe do te merren extensionet ne database
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function form_field_file_extension($form_field_id) {
        $sql =
            "select *
            from form_field_file_extension 
            where id_form_field = {$form_field_id}";
        return database_helper::database()->db->executeQuery($sql);
    }
	
    /**
    * Funksioni form_status_options()
    * 
    * Selecton te gjithe options qe duhet te kete per combobox-in e fazes
    * <br/>Kthen egzekutimin e queryt ne database
    * 
    * @param int $form_id id e formes qe do te merren field ne database
    * @return array Kthen ekzekutimin e query ne database.
    */
    static public function form_status_options($form_id) 
	{
        $sql = "SELECT fps.form_phase_status_id, ps.phase_status_name, ps.phase_status_id
				FROM form_phase_status fps INNER JOIN phase_status ps ON fps.id_phase_status = ps.phase_status_id
				WHERE fps.deleted = 0 AND fps.id_form = {$form_id}";

        return database_helper::database()->db->executeQueryObj($sql);
    }
	
    /**
    * Funksioni form_status_selected()
    * 
    * Selecton te statusin e fundit te formes
    * <br/>Kthen egzekutimin e queryt ne database
    * 
    * @param int $form_id id e formes qe do te merren field ne database
    * @return array Kthen ekzekutimin e query ne database.
    */
    static public function form_status_selected($form_id, $id_form_submit) 
	{
        $sql = "SELECT fps.*, ps.phase_status_name
				FROM form_phase_status_{$form_id} fps INNER JOIN phase_status ps ON fps.id_phase_status_{$form_id} = ps.phase_status_id
				WHERE fps.id_form = {$form_id} AND fps.id_form_submit = {$id_form_submit} AND fps.deleted = 0";

        return database_helper::database()->db->executeQueryObj($sql);
    }
	
    /**
    * Funksioni form_field_attribute_value()
    * 
    * Selecton te gjithe attributet-vlere(key-value) qe ka field i dhene si parameter.
    * <br/>Kthen egzekutimin e queryt ne database
    * 
    * @return array Kthen egzekutimin e query ne database.
    */
	static public function form_field_attribute_value($form_field_id)
	{
		$sql = "SELECT *
				FROM form_field_attribute_value
				WHERE id_form_field = {$form_field_id} AND deleted = 0";
		return database_helper::database()->db->executeQueryObj($sql);
    }
    
    /**
    * Funksioni form_field_attribute()
    * 
    * Selecton te gjithe attributet(key) qe mund te field.
    * Nevojitet per te bere lidhje me nje field tjeter ose per te shtuar nje attribut.
    * Ketu percaktohet se cfare do te behet konkretisht
    * <br/>Kthen egzekutimin e queryt ne database
    * 
    * @return array Kthen egzekutimin e query ne database.
    */
	static public function form_field_attribute()
	{
		$sql = "SELECT *
				FROM form_field_attribute";
		return database_helper::database()->db->executeQuery($sql);
    }
    
    /**
     * Funksioni form_field_types()
     * 
     * Kthen te gjitha id e typeve te fields-ve.
     * 
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function form_field_types($id_form_type) {
        $sql = "SELECT allow_all_field_types as flag FROM form_type WHERE form_type_id = {$id_form_type}";
        $result = database_helper::database()->db->executeQuery($sql);

        $sql =
            "select form_field_type_id as type_id,
                type_name
                from form_field_type fft
                join allowed_form_fields aff on aff.id_form_field_type = fft.form_field_type_id
                join form_type ft on ft.form_type_id = aff.id_form_type

                and ft.form_type_id = {$id_form_type}";

        if(count($result) > 0){
            $flag = $result[0]['flag'];
            if($flag == 1){
               $sql = "select form_field_type_id as type_id,
                type_name
                from form_field_type";

            }
        }


        return database_helper::database()->db->executeQuery($sql);
    }

    /**
     * Funksioni get_autocomplete_data()
     *      
     * @param int $autocomplete_id Merr si parameter id e autocomplete
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function get_autocomplete_data($autocomplete_id)
    {
        $sql =
            "select autocomplete_name
            from autocomplete
            where autocomplete_id = {$autocomplete_id}";
		$table_name = database_helper::database()->db->executeQuery($sql)[0];
		$table_name = $table_name["autocomplete_name"];
		
		$sql = "SELECT {$table_name}_id id, val text FROM {$table_name}";

        return database_helper::database_flower_generated()->db->executeQueryObj($sql);
    }

    static public function autocomplete_selectedValues($form_id, $form_submit_id, $selectedColumn)
    {
        $sql = "SELECT {$selectedColumn} selectedValue
				FROM form_{$form_id}
				WHERE form_{$form_id}_id = {$form_submit_id} AND deleted = 0";

		return database_helper::database_flower_generated()->db->executeQuery($sql)[0]["selectedValue"];
    }

    /**
     * Funksioni data_autocomplete()
     * 
     * Selekton nga tabela autocoplete: autocomplete_action, browse_action, load_action ne baze te id qe merr si parameter.
     * 
     * @param int $autocomplete_id Merr si parameter id e autocomplete
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_autocomplete($autocomplete_id) {
        $sql =
            "select autocomplete_action,
                browse_action, 
                load_action
            from category_dms
            where category_dms_id = $autocomplete_id";
        
        return database_helper::database()->db->executeQuery($sql)[0];
    }

     /**
     * Funksioni data_autocomplete_all()
     * 
     * Selekton nga tabela autocoplete: autocomplete_action, browse_action
     * 
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_autocomplete_all() {
        $sql =
            "SELECT
                autocomplete_id,
                autocomplete_name,
                dataField,
                labelField
                
            FROM
                autocomplete
            WHERE
                deleted = 0
            ORDER BY
                autocomplete_id;";
        
        return database_helper::database()->db->executeQuery($sql);
    }

     /**
     * Funksioni data_input_mask()
     * 
     * Selekton nga tabela input_mask
     * 
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_input_mask($id = null)
    {
        if($id == null || $id == '')
            $sql =
                "SELECT
                    input_mask_id,
                    input_mask_name,
                    dataField,
                    labelField    
                FROM
                    input_mask
                WHERE
                    deleted = 0";
        else{
            $sql =
                "SELECT
                    input_mask_id,
                    input_mask_name,
                    dataField,
                    labelField    
                FROM
                    input_mask
                WHERE
                    input_mask_id = $id
                AND    deleted = 0";
        }            
        
        return self::database()->db->executeQuery($sql);
    }


    /**
     * Funksioni data_combobox()
     * 
     * Selekton nga tabela category_dms: retrieve_action, newrecord_action, save_action
     * ne baze te id qe merr si parameter merr te dhenat nga kjo tabele
     * 
     * @param int $category_id Merr si parameter Id e kategorise
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_combobox($category_id) {
        $sql =
            "select retrieve_action,
                newrecord_action,
                save_action,
				control_blocked
            from category_dms
            where category_dms_id = $category_id";

        return database_helper::database()->db->executeQuery($sql)[0];
    }
	
	/**
     * Funksioni data_radiogroup()
     * 
     * Merr te dhenat e qe do kene options
     * ne baze te id qe merr si parameter merr te dhenat nga kjo tabele
     * 
     * @param int $radiogroup_id Merr si parameter Id e radiogrupit
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_radiogroup($radiogroup_id) 
	{
        $sql =
            "select radiogroup_name
            from radiogroup
            where radiogroup_id = {$radiogroup_id}";
		$table_name = database_helper::database()->db->executeQuery($sql)[0];
		$table_name = $table_name["radiogroup_name"];
		
		$sql = "SELECT {$table_name}_id id, val FROM {$table_name}";

        return database_helper::database()->db->executeQueryObj($sql);
    }

    /**
     * Funksioni data_checkboxgroup()
     *
     * Merr te dhenat e qe do kene options
     * ne baze te id qe merr si parameter merr te dhenat nga kjo tabele
     *
     * @param int $checkboxgroup_id Merr si parameter Id e checkboxgrupit
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_checkboxgroup($checkboxgroup_id)
    {
        $sql =
            "select checkboxgroup_name
            from checkboxgroup
            where checkboxgroup_id = {$checkboxgroup_id}";
        $table_name = database_helper::database()->db->executeQuery($sql)[0];
        $table_name = $table_name["checkboxgroup_name"];

        $sql = "SELECT {$table_name}_id id, val FROM {$table_name}";

        return database_helper::database()->db->executeQueryObj($sql);
    }
	
	/**
     * Funksioni radiogroup_selectedValue()
     * 
     * Merr te vleren e ruajtur per ate forme
     * 
     * @param int $form_id Merr si parameter Id e formes
     * @param int $selectedColumn Merr si parameter emrin e kolones mbi te cilen do te merren te dhenat.
     * @return array Kthen ekzekutimin e query ne database.
     */
    static public function radiogroup_selectedValue($form_id, $form_submit_id, $selectedColumn) 
	{
        $sql = "SELECT {$selectedColumn} selectedValue
				FROM form_{$form_id}
				WHERE form_{$form_id}_id = {$form_submit_id} AND deleted = 0";

		return database_helper::database_flower_generated()->db->executeQuery($sql)[0]["selectedValue"];
    }

    /**
     * Funksioni checkboxgroup_selectedValue()
     *
     * Merr te vleren e ruajtur per ate forme
     *
     * @param int $form_id Merr si parameter Id e formes
     * @param int $selectedColumn Merr si parameter emrin e kolones mbi te cilen do te merren te dhenat.
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function checkboxgroup_selectedValue($form_id, $form_submit_id, $selectedColumn)
    {
        $sql = "SELECT {$selectedColumn} selectedValue
				FROM form_{$form_id}
				WHERE form_{$form_id}_id = {$form_submit_id} AND deleted = 0";

        return database_helper::database_flower_generated()->db->executeQuery($sql)[0]["selectedValue"];
    }
    
    /**
     * Funksioni data_uploadCategory_all()
     * 
     * Get all aviable document categories
     *
     * @return array of document categories.
     */
    static public function data_uploadCategory_all() {
        $provider = new configureEfilemanagerCRUD();
        $categories = $provider->getDocumentCategories(-1, true);
        array_unshift($categories, [
            'id' => 0,
            'name' => 'Zgjidh nje kategori',
            'description' => ''
        ]);
        
        return $categories;
    }

    /**
     * Funksioni data_combobox_all()
     * 
     * Selekton nga tabela category_dms: retrieve_action, newrecord_action, save_action
     * ne baze te id qe merr si parameter merr te dhenat nga kjo tabele
     * 
     * @param int $category_id Merr si parameter Id e kategorise
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_combobox_all() {
        $sql =
            "select 
                category_dms_id as category_id,
                category_name as category,
                retrieve_action,
                newrecord_action,
                save_action,
                control_blocked
            from category_dms
            where deleted = 0 order by category_dms_id";

        $data = database_helper::database()->db->executeQuery($sql);
        return $data;
    }
	
	 /**
     * Funksioni data_radiogroup_all()
     * 
     * Selekton nga tabela radiogroup
	 *
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_radiogroup_all() {
        $sql =
            "SELECT			
                radiogroup_id,
                labelField as radiogroup
            FROM radiogroup
            WHERE deleted = 0 
			ORDER BY radiogroup_id";

        $data = database_helper::database()->db->executeQuery($sql);
        return $data;
    }

    /**
     * Funksioni data_checkboxgroup_all()
     *
     * Selekton nga tabela checkboxgroup
     *
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function data_checkboxgroup_all() {
        $sql =
            "SELECT			
                checkboxgroup_id,
                labelField as checkboxgroup
            FROM checkboxgroup
            WHERE deleted = 0 
			ORDER BY checkboxgroup_id";

        $data = database_helper::database()->db->executeQuery($sql);
        return $data;
    }
	
    /**
     * Funksioni form_javascripts()
     * 
     * Merr te gjitha file .js dhe rendit ne file php sipas rendit qe kan te percaktuar te kolona inclusion_order.
     * @param int $form_id merr id e formes qe ne duam te bejm load per te marre me pase te gjith filet .js
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function form_javascripts($form_id) {
        $sql =
            "SELECT distinct form_js_file.file_path
            FROM form_js_file
            WHERE form_js_file.id_form IS NULL 
            ORDER BY form_js_file.inclusion_order";
        return database_helper::database()->db->executeQuery($sql);
    }
	
	/**
     * Funksioni specified_form_javascripts()
     * 
     * Merr te gjitha file .js per ato forma te specifikuara tek parametri dhe rendit ne file php sipas rendit qe kan te percaktuar te kolona inclusion_order.
     * @param int $form_id merr id e formave qe ne duam te bejm load per te marre me pase te gjith filet .js
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function specified_form_javascripts($forms_id) {
        $sql =
            "SELECT distinct form_js_file.file_path
            FROM form_js_file
            WHERE form_js_file.id_form IN ({$forms_id})
            ORDER BY form_js_file.inclusion_order";
        return database_helper::database()->db->executeQuery($sql);
    }
    /**
     * Funksioni form_styles()
     * 
     * Merr te gjith filet css nga tabela form_css_file qe na duhen per formen qe do bejme load ne baze te id se percaktuar.
     * @param int $form_id id e forms qe ne do marrim file css.
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function form_styles($form_id)
    {
        $sql = "select distinct form_css_file.file_path
            from form_css_file
            -- where form_css_file.id_form = $form_id
            order by form_css_file.inclusion_order";
        
        return database_helper::database()->db->executeQuery($sql);
    }
    /**
     * Funksion  form_field_javascripts()
     * 
     * Selekton nga tabela form_field_js te gjithe filet .js qe duhen per element te formes.
     * <br/>Bazohet te id e type te elementit.
     * 
     * @param int $form_id
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function form_field_javascripts($form_id) {
        $sql = "SELECT DISTINCT form_field_js.file_path
				FROM form_field 
					INNER JOIN form_field_js on form_field_js.id_form_field_type = form_field.id_form_field_type
				WHERE form_field.id_form = {$form_id}
				ORDER BY form_field_js.inclusion_order";
        
        return database_helper::database()->db->executeQuery($sql);
    }
    /**
     * Funksion  form_field_styles()
     * 
     * Selekton nga tabela form_field_css te gjithe filet .css qe duhen per element te formes.
     * <br/>Bazohet te id e type te elementit.
     * 
     * @param int $form_id
     * @return array Kthen egzekutimin e query ne database.
     */
    static public function form_field_styles($form_id)
    {
        $sql = "SELECT DISTINCT form_field_css.file_path
				FROM form_field 
					INNER JOIN form_field_css on form_field_css.id_form_field_type = form_field.id_form_field_type
				WHERE form_field.id_form = {$form_id}
				ORDER BY form_field_css.inclusion_order";
					
        return database_helper::database()->db->executeQuery($sql);
    }

    public static function process_list($field_name, $form_submit_id, $form_id)
    {
        $form_autoc = "form_".$form_id."_autoc_".$field_name;
        $sql = "SELECT process_id as id, process_name as name FROM ".FLOWER_DB_NAME.".`process`
        where process_id in (select id_{$field_name} from ".FLOWER_DB_NAME.".$form_autoc where id_form = $form_id 
            and id_form_submit = $form_submit_id and deleted = 0);";

        return database_helper::database()->db->executeQuery($sql);
    }

     public static function process_list_popup()
     {

        $sql = "SELECT process_id as id, process_name as name FROM ".FLOWER_DB_NAME.".`process` WHERE deleted = 0;";
                    
        return database_helper::database()->db->executeQueryI($sql);
    }

    public static function process_list_filter($str)
    {
        $sql = "SELECT process_id as id, process_name as name FROM ".FLOWER_DB_NAME.".`process`
        WHERE process_name like '%$str%' AND deleted = 0 LIMIT 10;";
                    
        return database_helper::database()->db->executeQuery($sql);
    }

    public static function front_end_event_all($id_form)
    {
        $sql = "select fee.*, fep.* from ".FLOWER_DB_NAME.".frontendevent fee
                left join ".FLOWER_DB_NAME.".frontend_process fep 
                    on (fee.frontendevent_id = fep.id_frontendevent
                    and fep.id_form = {$id_form})";
        return database_helper::database()->db->executeQuery($sql);
    }

    public static function front_end_process($id)
    {
        $sql = "select * from ".FLOWER_DB_NAME.".frontend_process WHERE frontend_process_id = $id ";
        return database_helper::database()->db->executeQuery($sql);
    }

}
