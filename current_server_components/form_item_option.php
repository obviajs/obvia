<?php

/**
 * Class form_item_option
 * 
 * Ne kete klase listohen te gjitha propertit per option per nje elemente.
 * 
 * @var string $FieldName Mban emrin e fushes.
 * @var boolean $HasColumnSpan true nese ka column span 
 * @var int $ColumnSpan 0 nese ska column span 
 * @var boolean $HasRowSpan true nese ka row span 
 * @var int $RowSpan 0 nese ska row span 
 * @var boolean $Required true Nese eshte e detyrueshme si fushe te plotsohet
 * @var string $Label Pershkrimi i fushes
 * @var boolean Tooltip Mesazh ndihmes se cfare permban kjo fushe.
 * @var boolean $HasRetrieveAction false  fushe per type combobox
 * @var string $RetrieveAction null  fushe per type combobox
 * @var boolean $HasNewRecordAction false  fushe per type combobox
 * @var string $NewRecordAction null  fushe per type combobox
 * @var boolean $HasSaveAction false  fushe per type combobox
 * @var string $SaveAction null  fushe per type combobox
 * @var boolean $HasAutocompleteAction false  fushe per type autocomplete
 * @var string $AutocompleteAction null  fushe per type autocomplete
 * @var boolean $HasBrowseAction false  fushe per type autocomplete
 * @var string $BrowseAction null  fushe per type autocomplete
 * @var boolean $HasLoadAction false  fushe per type autocomplete
 * @var string $LoadAction null  fushe per type autocomplete
 * @var int $repeatedFormId 0 id e formes qe do perseritet
 */
class form_item_option {
    public $FieldName = "";
    public $HasColumnSpan = true;
    public $ColumnSpan = 2;
    public $HasRowSpan = true;
    public $RowSpan = 0;
    public $Required = true;
    public $Label = "";
    public $Tooltip = "";
    public $Visible = 1;
    public $BlockProcess = 0;
    public $IsIndex = 0;
    
    public $HasRetrieveAction = false;
    public $RetrieveAction = null;
    
    public $HasNewRecordAction = false;
    public $NewRecordAction = null;
    
    public $HasSaveAction = false;
    public $SaveAction = null;  

    public $HasComboCategoryList = false;
    public $ComboCategoryList = null;
    public $IdComboCategory = 0; 
    
    public $HasAutocompleteAction = false;
    public $AutocompleteAction = null;
    
    public $HasBrowseAction = false;
    public $BrowseAction = null;

    public $HasAvailableTypes = false;
    public $AvailableTypes = null;
    public $IdAvailableType = 0;

    public $HasMultipleSelection = false;
    public $MultipleSelection = 1;

    //checkbox
    public $HasCheckedLabel = false;
    public $CheckedLabel = "";
    public $HasUncheckedLabel = false;
    public $UncheckedLabel = "";
    
    public $HasLoadAction = false;
    public $LoadAction = null;
	
    public $HasControlBlocked = false;
    public $ControlBlocked = null;
	
	public $FormFieldAttribute = array();
	
	public $FormFieldAttributeDictinary = array();
	
	//radiogorup
	public $HasRadioGroupList = false;
    public $RadioGroupList = null;
    public $IdComboRadioGroup = 0;
	
	//number input
	public $IsNumberInput = false;
	public $MaxNumberInput = null;
	public $MinNumberInput = null;

    //form_repeater
    public $HasRepeatedFormId = false;
    public $repeatedFormId = 0;

    // upload
    public $HasMultipleDocs = false;
    public $MultipleDocs = false;
    public $UploadDoc = false;
    public $UploadXls = false;
    public $UploadPdf = false;
    public $UploadImage = false;
    public $HasUploadCategoryList = false;
    public $UploadCategoryList = null;
    public $IdUploadCategory = 0;

    //checkboxgroup
    public $HasCheckBoxGroupList = false;
    public $CheckBoxGroupList = null;
    public $IdComboCheckBoxGroup = 0;

    //text input mask
    public $HasInputMask = false;
    public $InputMaskList = null;
    public $IdInputMask = 0;
}
