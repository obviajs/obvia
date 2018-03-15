function initializeFields() {
    $("[name=\"autocomplete_select[]\"]").select2({
        multiple: true,
        minimumInputLength: 3,
        placeholder: 'Kerko',
        ajax: { }
    });  
    
    $("[name=\"combobox[]\"]").multiselect({
        enableFiltering: true,
        maxHeight: 250,
        templates: {
            divider: "<div class=\"divider\" data-role=\"divider\"></div>"
        }
    });
}

var divAttributesID = 1;
var fieldAttributesOptionHtml = "";

function getOptionMenu(itemsAll, item, saveCallback) {

    var $panel = $("<div></div>")
        .addClass("panel")
        .addClass("panel-default")
        .addClass("form-option-panel")
        .attr("data-field-option", item.FieldId);
	
    var $body = $("<div></div>")
        .addClass("panel-body");
		
    // label
    $body.append(
        $("<div></div>")
            .addClass("form-group")
            .css("margin-bottom", "0")
            .append($("<label></label>").text("Label"))
            .append(
                $("<input>")
                    .attr("type", "text")
                    .attr("data-option", "label")
                    .addClass("form-control")
                    .addClass("input-sm")
                    .val(item.Options.Label)
            )
    );
	
    
    // Tooltip
    $body.append(
        $("<div></div>")
            .addClass("form-group")
            .css("margin-bottom", "0")
            .append($("<label></label>").text("Tooltip"))
            .append(
                $("<input>")
                    .attr("type", "text")
                    .attr("data-option", "tooltip")
                    .addClass("form-control")
                    .addClass("input-sm")
                    .val(item.Options.Tooltip)
            )
    );

    // field name
    $body.append(
        $("<div></div>")
            .addClass("form-group")
            .css("margin-bottom", "0")
            .append($("<label></label>").text("Field name"))
            .append(
                $("<input>")
                    .attr("type", "text")
                    .attr("data-option", "field-name")
                    .addClass("form-control")
                    .addClass("input-sm")
                    .val(item.Options.FieldName)
            )
    );
	
    // is required
    $body.append(
        $("<div></div>")
            .css({"margin-bottom": "0", "margin-top": "3px"})
            .append(
                $("<input>")
                    .attr("type", "checkbox")
                    .attr("data-option", "required")
					.attr("checked", Boolean(parseInt(item.Options.Required)))
            ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Required")
            )
    );

	//Visible, Invisible
	$body.append(
        $("<div></div>")
            .addClass("form-group")
            .css("margin-bottom", "0")
			.append(
                $("<input>")
					.attr("onChange", "visibleCheckboxChange(this);")
                    .attr("type", "checkbox")
                    .attr("data-option", "visible")
					.attr("checked", Boolean(parseInt(item.Options.Visible)))
            ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Visible")
            )
    );
	
	//Block process
	$body.append(
        $("<div></div>")
            .addClass("form-group")
            .css("margin-bottom", "0")
			.append(
                $("<input>")
                    .attr("type", "checkbox")
                    .attr("data-option", "blockProcess")
					.attr("checked", Boolean(parseInt(item.Options.BlockProcess)))
            ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Block Process")
            )
    );

    if(!item.Options.HasMultipleDocs && !item.Options.HasRepeatedFormId && item.FieldId !== "10" && item.FieldId !== "21" && item.FieldId !== "24" && item.FieldId !== "25" ){
        // Is Index Column checkbox
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append(
                    $("<input>")
                        .attr("type", "checkbox")
                        .attr("data-option", "index")
                        .attr("checked", Boolean(parseInt(item.Options.IsIndex)))
                ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Index Column")
            )
        );
    }

    if(item.Options.HasMultipleDocs){

        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append(
                    $("<input>")
                        .attr("type", "checkbox")
                        .attr("data-option", "multi-docs")
                        .attr("checked", Boolean(parseInt(item.Options.MultipleDocs)))
                ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Multiple Docs")
            )
        );

        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append(
                    $("<input>")
                        .attr("type", "checkbox")
                        .attr("data-option", "upload-docs")
                        .attr("checked", Boolean(parseInt(item.Options.UploadDoc)))
                ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Upload Docs")
            )
        );

        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append(
                    $("<input>")
                        .attr("type", "checkbox")
                        .attr("data-option", "upload-xls")
                        .attr("checked", Boolean(parseInt(item.Options.UploadXls)))
                ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Upload XLS")
            )
        );

        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append(
                    $("<input>")
                        .attr("type", "checkbox")
                        .attr("data-option", "upload-pdf")
                        .attr("checked", Boolean(parseInt(item.Options.UploadPdf)))
                ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Upload PDF")
            )
        );

        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append(
                    $("<input>")
                        .attr("type", "checkbox")
                        .attr("data-option", "upload-img")
                        .attr("checked", Boolean(parseInt(item.Options.UploadImage)))
                ).append(
                $("<label></label>")
                    .css({"padding-top": "2px", "padding-left": "2px" })
                    .text(" Upload Image")
            )
        );

    }
	
	//Control for Blocking process
	if (item.Options.HasControlBlocked) 
	{
		$body.append(
			$("<div></div>")
				.addClass("form-group")
				.css("margin-bottom", "0")
				.append(
					$("<input>")
						.attr("type", "checkbox")
						.attr("data-option", "control-blocked")
						.attr("checked", Boolean(parseInt(item.Options.ControlBlocked)))
				).append(
					$("<label></label>")
						.css({"padding-top": "2px", "padding-left": "2px" })
						.text(" Control Blocked")
				)
		);
	}
	
    // column Span
    if (item.Options.HasColumnSpan) {
		//console.log(item);
		//console.log(item.Options);
		if(item.FieldId == 22)
			var min = 6;
		else
			var min = 1
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Column span"))
                .append(
                    $("<input>")
                        .attr("type", "number")
                        .attr("data-option", "column-span")
                        .attr("min", min)
                        .attr("max", "12")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.ColumnSpan)
                )        
        );
    }

    // row span
    if (item.Options.HasRowSpan) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Row span"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "row-span")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.RowSpan)
                )
        );
    }

    // retreive action
    if (item.Options.HasRetrieveAction) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Retrieve action"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "retrieve-action")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.RetrieveAction)
                )
        );
    }
    
    // new record action
    if (item.Options.HasNewRecordAction) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("New record action"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "new-record-action")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.NewRecordAction)
                )
        );
    }    
    
    // save action
    if (item.Options.HasSaveAction) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Save action"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "save-action")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.SaveAction)
                )
        );
    }    

    //combobox types a.k.a category
    if(item.Options.HasComboCategoryList){
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Tipi i combobox"))
                .append(createComboCategory(item))
                .append(
                    $("<i><a href=\"#\">Menaxho</a></i>")
                    .attr("id", "modify_combo_category")
                    .attr("type", "button")
                    .attr("onclick", "manageComboCategory()")
                )             
        );
        //shtojme nje forme modale per menaxhimin e combo, kur jemi tek elementi i combobox
        getcomboCategoryModal($body);
    }

    //upload category
    if (item.Options.HasUploadCategoryList) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Kategoria e dokumentit"))
                .append(createUploadCategory(item))
                .append(
                    $("<i><a href=\"#\">Menaxho</a></i>")
                        .attr("id", "modify_upload_category")
                        .attr("type", "button")
                        .attr("onclick", "window.open('?configureEfilemanagerCRUD')")
                )
        );
    }

    //form_repeater
    if(item.Options.HasRepeatedFormId)
    {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Repeated Form Id"))
                .append(
                    $("<input>")
                        .attr("type", "number")
                        .attr("data-option", "repeated_form_id")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.repeatedFormId)
                )
                .append(
                    $("<i><a href=\"#\">Shiko Formen</a></i>")
                        .attr("id", "view_repeated_form")
                        .attr("type", "button")
                        .attr("onclick", "viewRepeatedForm()")
                )
        );


    }

    //radiogroup
	if(item.Options.HasRadioGroupList)
	{
		$body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Tipi i Radio Group"))
                .append(createComboRadioGroup(item))
                .append(
                    $("<i><a href=\"#\">Menaxho</a></i>")
                    .attr("id", "modify_combo_category")
                    .attr("type", "button")
                    .attr("onclick", "manageComboCategory()")
                )             
        );
        //shtojme nje forme modale per menaxhimin e combo, kur jemi tek elementi i combobox
        getcomboRadioGroupModal($body);
		
	}

    //checkboxgroup
    if(item.Options.HasCheckBoxGroupList)
    {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Tipi i CheckBox Group"))
                .append(createComboCheckBoxGroup(item))
                .append(
                    $("<i><a href=\"#\">Menaxho</a></i>")
                        .attr("id", "modify_combo_category")
                        .attr("type", "button")
                        .attr("onclick", "manageComboCategory()")
                )
        );

        getcomboCheckBoxGroupModal($body);

    }

    //InputMask
    if (item.Options.HasInputMask) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Maska per Input:"))
                .append(createInputMaskSelect(item))
                .append(
                    $("<i><a href=\"#\">Menaxho</a></i>")
                    .attr("id", "manage_input_mask")
                    .attr("type", "button")
                    .attr("onclick", "manageInputMaskModal()")
                )
        );

        getInputMaskModal($body);

    }

	//date or datetime
	if(item.Options.is_datetimeType)
	{
		var checkedDate = "";
		var checkedDateTime = "";
		//console.log(item.Options.is_datetime);
		if(item.Options.is_datetime == false || item.Options.is_datetime == undefined )
		{
			checkedDate = "checked";
			checkedDateTime = "";
			//console.log("eshte date");
		}
		else if(item.Options.is_datetime == true)
		{
			checkedDate = "";
			checkedDateTime = "checked";
			//console.log("eshte datetime");
		}
		$body.append(
			$("<label></label>").text("Tipi"),
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append(
                    "<input type='radio' name='date_radio' data-option='date_radio' value='date' "+checkedDate+"/> Date "
                )
                .append(
					"<input type='radio' name='date_radio' data-option='date_radio' value='datetime' "+checkedDateTime+"/> Datetime"
                )
        );
	}

    // autocomplete action
    if (item.Options.HasAutocompleteAction) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Autocomplete action"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "autocomplete-action")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.AutocompleteAction)
                )
        );

        //shtojme nje forme modale per menaxhimin e combo, kur jemi tek elementi i combobox
       // getcomboRadioGroupModal($body);

    }

    // browse action
    if (item.Options.HasBrowseAction) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Browse action"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "browse-action")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.BrowseAction)
                )
        );
    }

    // browse action
    if (item.Options.HasLoadAction) {
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Load action"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "load-action")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.LoadAction)
                )
        );
    }

    // A list of autocomplete types to choose from
    if(item.Options.HasAvailableTypes){
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Tipi i autocomplete"))
                .append(createComboAvailableTypes(item))
        );
        getAutoCompleteCategoryModal($body);
    }

    // Autocomplete allows multiple selection or not
    if(item.Options.HasMultipleSelection){

        $body.append(
            $("<div><div/>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                //.append($("<label></label>").text("Zgjedhje e shumefishte"))
                .append($("<input>")
                    .attr("type", "checkbox")
                    .attr("data-option", "multi-selection")
                    .addClass("form-controll")
                    .attr("checked", Boolean(parseInt(item.Options.MultipleSelection)))
                )
                .append(
                    $("<label></label>")
                        .css({"padding-top": "2px", "padding-left": "2px" })
                        .text("Multiple Selection")
                    )
                .append(
                    $("<i><a href=\"#\">Menaxho</a></i>")
                        .attr("id", "modify_combo_category")
                        .attr("type", "button")
                        .attr("onclick", "manageComboCategory()")
                )
        );

        //shtojme nje forme modale per menaxhimin e combo, kur jemi tek elementi i combobox

    }

    //checkbox checked label
    if(item.Options.HasCheckedLabel){
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Etiketa zgjedhur"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "checked-label")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.CheckedLabel)
                )
        );
    }

    //checkbox checked label
    if(item.Options.HasUnCheckedLabel){
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
                .append($("<label></label>").text("Etiketa pa zgjedhur"))
                .append(
                    $("<input>")
                        .attr("type", "text")
                        .attr("data-option", "unchecked-label")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.UnCheckedLabel)
                )
        );
    }

	//number Input
	if(item.Options.IsNumberInput){
        $body.append(
            $("<div></div>")
                .addClass("form-group")
                .css("margin-bottom", "0")
				.append($("<label></label>").text("Minimumi i lejuar"))
                .append(
                    $("<input>")
                        .attr("type", "number")
                        .attr("data-option", "minimum-input")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.MinNumberInput)
                )
                .append($("<label></label>").text("Maximumi i lejuar"))
                .append(
                    $("<input>")
                        .attr("type", "number")
                        .attr("data-option", "maximum-input")
                        .addClass("form-control")
                        .addClass("input-sm")
                        .val(item.Options.MaxNumberInput)
                )
        );
    }


	$body.append(
        $("<div></div>")
            .addClass("form-group")
            .append($("<hr/>"))
    );

	//Attributes
	addOptionToComboBox(item, "default")
	$body.append(
		$("<div></div>")
			.addClass("form-group")
			.attr("id", "divAttributes")
			.css("margin-bottom", "0")
			.append($("<label></label>").text("Attributes"))
			.append(createCombobox(item))
			/*.append($("<div></div>")
				.attr("id", "divAttributesRow_" + divAttributesID)
				.attr("data-option", "attribute")
				.append(
					$("<select>")
						.addClass("form-control attribute-text")
						.attr("id", "combobox_" + divAttributesID)
						.attr("data-option", "attribute-combobox")
						.append(fieldAttributesOptionHtml)
				)
				.append(
					$("<input>")
						.attr("type", "text")
						.attr("data-option", "attribute-value")
						.addClass("form-control")
						.addClass("input-sm")
						.addClass("attribute-text")
						.val(item.Options.FormFieldAttributeDictinary.value)
				)
				.append(
					$("<i>").attr("type", "button")
						.addClass("glyphicon glyphicon-plus attribute-button")
						.attr("onclick", 'addAttribute("divAttributes", event)')
						.attr("id", "addButton_" + divAttributesID)
				)
				.append(
					$("<i>").attr("type", "button")
						.addClass("glyphicon glyphicon-remove attribute-button")
						.attr("onclick", 'removeAttributes("divAttributesRow_' + divAttributesID + '")')
						.attr("id", "removeButton_" + divAttributesID)
						.hide()
				)
			)*/
	);

    $body.append(
        $("<div></div>")
            .addClass("form-group")
            .addClass("validation-result")
            .css("margin-bottom", "0")
            .hide()
    );

    // buttons
    $body.append(
        $("<div></div>").addClass("form-group")
            .css({"margin-bottom": "0", "margin-top": "10px" })
            .append(
                $("<input>").attr("type", "button")
                    .addClass("form-control")
                    .addClass("input-sm")
                    .val("Save")
                    .click(function() {
                        $body.find(".validation-result")
                            .children().remove()
                            .slideUp();
                        setOptions($body, item);
                        errors = validate(item, itemsAll);
                        if (errors.length === 0) {
                            applyOptions($panel.closest("[data-field-index]"), item);
                            var index = parseInt($panel.closest("[data-field-index]").attr("[data-field-index]"));
                            saveCallback(item, index);
                            $panel.remove();
                        } else {
                            $.each(errors, function (i) {
                                $body.find(".validation-result").append(
                                    $("<div>").text(errors[i])
                                );
                            });
                            $body.find(".validation-result").slideDown();
                        }
                    })
            ).append(
                $("<input>").attr("type", "button")
                    .addClass("form-control")
                    .addClass("input-sm")
                    .val("Cancel")
                    .click(function() {

						//restore visible or invisible css
						restoreCss(this, item);
                        $panel.remove();
                    })
            )
    );

    $panel.append($body);

    return $panel;
}

//restore css of form_field to its default( visible, invisible)
function restoreCss(event, item)
{
	var currentElement = event;

	for(var index = 0; index < 10; index++)
	{
		if($(currentElement.parentElement).is('#form_container'))
		{
			if(Boolean(parseInt(item.Options.Visible)) && $(currentElement).hasClass('invisibleElement'))
				$(currentElement).removeClass('invisibleElement');
			else if(!Boolean(parseInt(item.Options.Visible)))
				$(currentElement).addClass('invisibleElement')
		}
		currentElement = currentElement.parentElement;
	}
}

function addAttribute(divName, event)
{
	//console.log(divAttributesID);
	var divAppend = $("#" + divName);

	if(divAppend[0].childElementCount > 10)
		return;

	eventButton = event.target.id;

	//hide add button
	$("#" + eventButton).hide();

	//show remove button
	$("#removeButton_" + divAttributesID).show();

	//increase count
	divAttributesID++;

	//console.log(fieldAttributesOptionHtml);
	//add html on click
	divAppend.append(
		$("<div></div>")
			.attr("id", "divAttributesRow_" + divAttributesID)
			.attr("data-option", "attribute")
			.append(
				$("<label></label>")
				.attr("data-option","attribute-label")
				.hide()
			)
			.append(
					$("<select>")
						.addClass("form-control attribute-text")
						.attr("id", "combobox_" + divAttributesID)
						.attr("data-option", "attribute-combobox")
						.append(fieldAttributesOptionHtml)
				)
			.append(
				$("<input>")
					.attr("type", "text")
					.attr("data-option", "attribute-value")
					.addClass("form-control")
					.addClass("input-sm")
					.addClass("attribute-text")
			)
			.append(
				$("<i>").attr("type", "button")
					.addClass("glyphicon glyphicon-plus attribute-button")
					.attr("onclick", 'addAttribute("divAttributes", event)')
					.attr("id", "addButton_" + divAttributesID)
			)
			.append(
				$("<i>").attr("type", "button")
					.addClass("glyphicon glyphicon-remove attribute-button")
					.attr("onclick", 'removeAttributes("divAttributesRow_' + divAttributesID + '")')
					.attr("id", "removeButton_" + divAttributesID)
					.hide()
			)
		);
}

function removeAttributes(divName)
{
	$("#"+divName).remove();
}

function applyOptions(element, item) {
	//console.log("element");
	//console.log(element);
    if(item.Options.HasColumnSpan)
	{
		for (var i = 0; i < 13; i++)
			element.removeClass("col-lg-" + i);
		//console.log("fieldId");
		//console.log(item.FieldId);
		//console.log("ColumnSpan");
		//console.log(item.Options.ColumnSpan);
		if(item.FieldId == 22 && item.Options.ColumnSpan <6) //if day_month_year_hour_min && columnspan <6 then set col-lg-6
		{
			element.addClass("col-lg-6");
			item.Options.ColumnSpan = 6;
			bootbox.alert("Ky tip nuk mund te kete Column Span me te vogel se 6")
		}
		else
			element.addClass("col-lg-" + item.Options.ColumnSpan);
    }

    for (var i = 0; i < 6; i++)
        element.removeClass("rowspan" + i);
    element.addClass("rowspan" + item.Options.RowSpan);

    element.find("label").first().text(item.Options.Label);
    element.find("input").first().removeClass("rowspan" + i);
    element.find("input").first().addClass("rowspan" + item.Options.RowSpan);
    element.attr("data-field-name", item.Options.FieldName);
    element.attr("data-field-Id", item.FieldId);
}

function viewRepeatedForm()
{
    var form_id = $('[data-option="repeated_form_id"]').val();
    if(form_id != '' || form_id != 0)
        window.open(
            "?forms/view/"+form_id,
            '_blank'
        );
}

function addOptionToComboBox(item, selectedValue)
{
	fieldAttributesOptionHtml = "";
    for(var index = 0; index < item.Options.FormFieldAttribute.length; index++)
	{
		if(item.Options.FormFieldAttribute[index].form_field_attribute_id == selectedValue)
			fieldAttributesOptionHtml += '<option value="' + item.Options.FormFieldAttribute[index].form_field_attribute_id + '" selected="selected">' + item.Options.FormFieldAttribute[index].form_field_attribute_name + '</option>';
		else
			fieldAttributesOptionHtml += '<option value="' + item.Options.FormFieldAttribute[index].form_field_attribute_id + '">' + item.Options.FormFieldAttribute[index].form_field_attribute_name + '</option>';
	}
	return fieldAttributesOptionHtml;
}

function createComboAvailableTypes(item)
{
    var type_id = "autoc_type_" + item.FieldId; //just in case...
    var options = "<select id =" + type_id + " class=\"form-control\" data-option=\"available-types\">";


    if(!item.Options.AvailableTypes || item.Options.AvailableTypes.length <= 0)
        return options += "</select>"; // no categories configured

    var id = parseInt(item.Options.IdAvailableType);
    var type_selected = (id === 0)
        ? item.Options.AvailableTypes[0].category_id
        : item.Options.IdAvailableType;

    for(var i = 0; i < item.Options.AvailableTypes.length; i++)
    {
        var type = item.Options.AvailableTypes[i];

        if(type_selected == type.autocomplete_id){
            options +='<option value=' + type.autocomplete_id + ' selected="selected">'+ type.autocomplete_name + '</option>';
        }
        else
        {
            options +='<option value='+ type.autocomplete_id + '>'+ type.autocomplete_name + '</option>';
        }
    }

    options +="</select>";
    return options;
}

function createComboCategory(item)
{
    var type_id = "combo_type_" + item.FieldId; //just in case...
    var options = "<select id =" + type_id + " class=\"form-control\"  data-option=\"combo-category\">";

    if(!item.Options.ComboCategoryList || item.Options.ComboCategoryList.length <= 0)
        return options += "</select>"; // no categories configured

    var id = parseInt(item.Options.IdComboCategory);
    var type_selected = (id === 0)
        ? item.Options.ComboCategoryList[0].category_id
        : item.Options.IdComboCategory;

    for(var i = 0; i < item.Options.ComboCategoryList.length; i++)
    {
        var type = item.Options.ComboCategoryList[i];
        if(type_selected == type.category_id){
            options +='<option value='
                    + type.category_id + ' selected="selected">'
                    + type.category + '</option>';
        }
        else{
            options +='<option value='
                    + type.category_id + '>'
                    + type.category + '</option>';
        }
    }
    options +="</select>";
    return options;
}

function createUploadCategory(item) {
    var type_id = "upload_type_" + item.FieldId; 
    var options = "<select id =" + type_id + " class=\"form-control\"  data-option=\"upload-category\">";

    if (!item.Options.UploadCategoryList || item.Options.UploadCategoryList.length <= 0)
        return options += "</select>"; // no categories configured

    var id = parseInt(item.Options.IdUploadCategory);
    var type_selected = (id === 0)
        ? id
        : item.Options.IdUploadCategory;

    for (var i = 0; i < item.Options.UploadCategoryList.length; i++) {
        var type = item.Options.UploadCategoryList[i];
        if (type_selected == type.id) {
            options += '<option value='
                + type.id + ' selected="selected">'
                + type.name + '</option>';
        }
        else {
            options += '<option value='
                + type.id + '>'
                + type.name + '</option>';
        }
    }
    options += "</select>";
    return options;
}

function createComboRadioGroup(item)
{
    var type_id = "radiogroup_type_" + item.FieldId; //just in case...
    var options = "<select id =" + type_id + " class=\"form-control\" data-option=\"combo-radiogroup\">";

    if(!item.Options.RadioGroupList || item.Options.RadioGroupList.length <= 0)
        return options += "</select>"; // no categories configured

    var id = parseInt(item.Options.IdComboRadioGroup);
    var type_selected = (id === 0)
        ? item.Options.RadioGroupList[0].category_id
        : item.Options.IdComboRadioGroup;

    for(var i = 0; i < item.Options.RadioGroupList.length; i++)
    {
        var type = item.Options.RadioGroupList[i];
        if(type_selected == type.radiogroup_id){
            options +='<option value='
                    + type.radiogroup_id + ' selected="selected">'
                    + type.radiogroup + '</option>';
        }
        else{
            options +='<option value='
                    + type.radiogroup_id + '>'
                    + type.radiogroup + '</option>';
        }
    }
    options +="</select>";
    return options;
}

function createComboCheckBoxGroup(item)
{
    var type_id = "checkboxgroup_type_" + item.FieldId; //just in case...
    var options = "<select id =" + type_id + " class=\"form-control\" data-option=\"combo-checkboxgroup\">";

    if(!item.Options.CheckBoxGroupList || item.Options.CheckBoxGroupList.length <= 0)
        return options += "</select>"; // no categories configured

    var id = parseInt(item.Options.IdComboCheckBoxGroup);
    var type_selected = (id === 0)
        ? item.Options.CheckBoxGroupList[0].category_id
        : item.Options.IdComboCheckBoxGroup;

    for(var i = 0; i < item.Options.CheckBoxGroupList.length; i++)
    {
        var type = item.Options.CheckBoxGroupList[i];
        if(type_selected == type.checkboxgroup_id){
            options +='<option value='
                + type.checkboxgroup_id + ' selected="selected">'
                + type.checkboxgroup + '</option>';
        }
        else{
            options +='<option value='
                + type.checkboxgroup_id + '>'
                + type.checkboxgroup + '</option>';
        }
    }
    options +="</select>";
    return options;
}

function createInputMaskSelect(item) {
    var type_id = "inputmask_type_" + item.FieldId; 
    var options = "<select id =" + type_id + " class=\"form-control\" data-option=\"combo-inputmask\">";

    if (!item.Options.InputMaskList || item.Options.InputMaskList.length <= 0)
        return options += "</select>"; // no items configured

    var id = parseInt(item.Options.IdInputMask);
    var type_selected = (id === 0)
        ? item.Options.InputMaskList[0].mask_id
        : item.Options.IdInputMask;

    for (var i = 0; i < item.Options.InputMaskList.length; i++) {
        var type = item.Options.InputMaskList[i];
        if (type_selected == type.mask_id) {
            options += '<option value='
                + type.mask_id + ' selected="selected">'
                + type.mask + '</option>';
        }
        else {
            options += '<option value='
                + type.mask_id + '>'
                + type.mask + '</option>';
        }
    }
    options += "</select>";
    return options;
}

function createCombobox(item)
{
	divAttributesID = 1;
	var comboboxHtml = "";
	var invisible = " style=\"display:none\" ";
	var formFieldAttrDict = item.Options.FormFieldAttributeDictinary;
	//console.log(formFieldAttrDict);
	if(formFieldAttrDict.length == 0)
	{
		comboboxHtml += "<div id=\"divAttributesRow_" + divAttributesID + "\" data-option=\"attribute\">";
		comboboxHtml += "<label data-option=\"attribute-label\" " + invisible + " ></label>";
		comboboxHtml += "<select id=\"combobox_" + divAttributesID + "\" class=\"form-control attribute-text\" data-option=\"attribute-combobox\">";
		comboboxHtml += addOptionToComboBox(item, "default");
		comboboxHtml += "</select>";
		comboboxHtml += "<input class=\"form-control input-sm attribute-text\" type=\"text\" data-option=\"attribute-value\"></input>";
		comboboxHtml += "<i id=\"addButton_" + divAttributesID + "\" class=\"glyphicon glyphicon-plus attribute-button\" type=\"button\" onclick='addAttribute(\"divAttributes\", event)'></i>";
		comboboxHtml += "<i id=\"removeButton_" + divAttributesID + "\" class=\"glyphicon glyphicon-remove attribute-button\" type=\"button\" onclick='removeAttributes(\"divAttributesRow_" + divAttributesID + "\")' " + invisible + "></i>";
	}

	for(var i = 0; i < formFieldAttrDict.length; i++)
	{
		comboboxHtml += "<div id=\"divAttributesRow_" + divAttributesID + "\" data-option=\"attribute\">";
		comboboxHtml += "<label data-option=\"attribute-label\" " + invisible + " > " + formFieldAttrDict[i].form_field_attribute_value_id + " </label>";
		comboboxHtml += "<select id=\"combobox_" + divAttributesID + "\" class=\"form-control attribute-text\" data-option=\"attribute-combobox\">";
		comboboxHtml += addOptionToComboBox(item, formFieldAttrDict[i].id_form_field_attribute);
		comboboxHtml += "</select>";
		comboboxHtml += "<input class=\"form-control input-sm attribute-text\" type=\"text\" data-option=\"attribute-value\" value=\"" + formFieldAttrDict[i].form_field_value + "\"></input>";

		//add button (show or hide)
		if(i == formFieldAttrDict.length - 1)
			comboboxHtml += "<i id=\"addButton_" + divAttributesID + "\" class=\"glyphicon glyphicon-plus attribute-button\" type=\"button\" onclick='addAttribute(\"divAttributes\", event)'></i>";
		else
			comboboxHtml += "<i id=\"addButton_" + divAttributesID + "\" class=\"glyphicon glyphicon-plus attribute-button\" type=\"button\" onclick='addAttribute(\"divAttributes\", event)' " + invisible + "></i>";

		//remove button (show or hide)
		if(i == formFieldAttrDict.length - 1)
			comboboxHtml += "<i id=\"removeButton_" + divAttributesID + "\" class=\"glyphicon glyphicon-remove attribute-button\" type=\"button\" onclick='removeAttributes(\"divAttributesRow_" + divAttributesID + "\")' " + invisible + "></i>";
		else
			comboboxHtml += "<i id=\"removeButton_" + divAttributesID + "\" class=\"glyphicon glyphicon-remove attribute-button\" type=\"button\" onclick='removeAttributes(\"divAttributesRow_" + divAttributesID + "\")'></i>";

		comboboxHtml += "</div>";

		if(i != formFieldAttrDict.length - 1)
			divAttributesID++;
	}
	return comboboxHtml;
}

function setOptions(element, item)
{
    item.Options.Tooltip = element.find("[data-option=\"tooltip\"]").val();
    item.Options.Label = element.find("[data-option=\"label\"]").val();
    item.Options.FieldName = element.find("[data-option=\"field-name\"]").val();
    item.Options.Required = element.find("[data-option=\"required\"]").is(":checked") ? 1 : 0;
    item.Options.Visible = element.find("[data-option=\"visible\"]").is(":checked") ? 1 : 0;
    item.Options.BlockProcess = element.find("[data-option=\"blockProcess\"]").is(":checked") ? 1 : 0;
    item.Options.ControlBlocked = element.find("[data-option=\"control-blocked\"]").is(":checked") ? 1 : 0;
    // Eshte ose jo fushe index ne tabele
    item.Options.IsIndex = element.find("[data-option=\"index\"]").is(":checked") ? 1 : 0;

	//get key value of attributes
	var attribute_element = element.find("[data-option=\"attribute\"]");
	var attribute_element_array = [];
	for(var index = 1; index <= divAttributesID; index++)
	{
		var attribute_combo = {};
		attribute_combo.form_field_attribute_value_id = element.find("[id=\"divAttributesRow_"+index+"\"]").find("[data-option=\"attribute-label\"]").text();
		attribute_combo.id_form_field_attribute = element.find("[id=\"divAttributesRow_"+index+"\"]").find("[data-option=\"attribute-combobox\"]").find('option:selected').val();
		attribute_combo.form_field_value = element.find("[id=\"divAttributesRow_"+index+"\"]").find("[data-option=\"attribute-value\"]").val();
		if(typeof attribute_combo.id_form_field_attribute !== 'undefined')
			attribute_element_array.push(attribute_combo);
		//console.log(attribute_element_array);
	}
	item.Options.FormFieldAttributeDictinary = attribute_element_array;

    if (item.Options.is_datetimeType)
	{
		var selectedVal = "";
		var selected = $("input[type='radio'][name='date_radio']:checked");
		if (selected.length > 0)
			selectedVal = selected.val();
		if(selectedVal == "datetime")
			item.Options.is_datetime = true;
		else
			item.Options.is_datetime = false;
	}

    if (item.Options.HasColumnSpan)
        item.Options.ColumnSpan = element.find("[data-option=\"column-span\"]").val();

    if (item.Options.HasRowSpan)
        item.Options.RowSpan = element.find("[data-option=\"row-span\"]").val();

    if (item.Options.HasRetrieveAction)
        item.Options.RetrieveAction = element.find("[data-option=\"retrieve-action\"]").val();

    if (item.Options.HasNewRecordAction)
        item.Options.NewRecordAction = element.find("[data-option=\"new-record-action\"]").val();

    if (item.Options.HasSaveAction)
        item.Options.SaveAction = element.find("[data-option=\"save-action\"]").val();

    if (item.Options.HasComboCategoryList)
        item.Options.IdComboCategory = element.find("[data-option=\"combo-category\"]").find('option:selected').val();

    if (item.Options.HasUploadCategoryList)
        item.Options.IdUploadCategory = element.find("[data-option=\"upload-category\"]").find('option:selected').val();
   
    //autocomplete
    if (item.Options.HasAvailableTypes)
        item.Options.IdAvailableType = element.find("[data-option=\"available-types\"]").find('option:selected').val();

    if (item.Options.HasRadioGroupList)
        item.Options.IdComboRadioGroup = element.find("[data-option=\"combo-radiogroup\"]").find('option:selected').val();

    if (item.Options.HasCheckBoxGroupList)
        item.Options.IdComboCheckBoxGroup = element.find("[data-option=\"combo-checkboxgroup\"]").find('option:selected').val();

    if (item.Options.HasAutocompleteAction)
        item.Options.AutocompleteAction = element.find("[data-option=\"autocomplete-action\"]").val();

    if (item.Options.HasBrowseAction)
        item.Options.BrowseAction = element.find("[data-option=\"browse-action\"]").val();

    if (item.Options.HasLoadAction)
        item.Options.LoadAction = element.find("[data-option=\"load-action\"]").val();

	//number input
	if(item.Options.IsNumberInput)
	{
		item.Options.MinNumberInput = element.find("[data-option=\"minimum-input\"]").val();
		item.Options.MaxNumberInput = element.find("[data-option=\"maximum-input\"]").val();
	}

    //form repeat
    if (item.Options.HasRepeatedFormId)
    {
        item.Options.repeatedFormId = element.find("[data-option=\"repeated_form_id\"]").val();
    }


    //autocomplete multi selection
    if (item.Options.HasMultipleSelection){
        item.Options.MultipleSelection = element.find("[data-option=\"multi-selection\"]").is(":checked") ? 1 : 0;
    }

    //checkbox checked label
    if(item.Options.HasCheckedLabel){
         item.Options.CheckedLabel = element.find("[data-option=\"checked-label\"]").val();
    }

    //checkbox unchecked label
    if(item.Options.HasUnCheckedLabel){
         item.Options.UnCheckedLabel = element.find("[data-option=\"unchecked-label\"]").val();
    }

    //autocomplete multi selection
    if (item.Options.HasMultipleDocs){
        item.Options.MultipleDocs = element.find("[data-option=\"multi-docs\"]").is(":checked") ? 1 : 0;
        item.Options.UploadDoc = element.find("[data-option=\"upload-docs\"]").is(":checked") ? 1 : 0;
        item.Options.UploadXls = element.find("[data-option=\"upload-xls\"]").is(":checked") ? 1 : 0;
        item.Options.UploadPdf = element.find("[data-option=\"upload-pdf\"]").is(":checked") ? 1 : 0;
        item.Options.UploadImage = element.find("[data-option=\"upload-img\"]").is(":checked") ? 1 : 0;
    }

    //input mask
    if (item.Options.HasInputMask) {
        item.Options.IdInputMask = element.find("[data-option=\"combo-inputmask\"]").find('option:selected').val();
    }
}

function validate(item, itemsAll) {
    var errors = [];
    if (item.Options.Tooltip === null || item.Options.Tooltip.length === 0)
        errors.push("The tooltip can not be empty.");

    if (item.Options.Label === null || item.Options.Label.length === 0)
        errors.push("The label can not be empty.");

    if (item.Options.FieldName === null || item.Options.FieldName.length === 0)
        errors.push("The field name can not be empty.");

    if (item.Options.HasColumnSpan) {
        if (item.Options.ColumnSpan === null || item.Options.ColumnSpan.toString().length === 0)
            errors.push("The column span should have a value.");
        else {
            var colSpan = parseInt(item.Options.ColumnSpan.toString());
            if (colSpan > 12 && colspan < 1)
                errors.push("The column span should be between 1 and 12.");
        }
    }

    if (item.Options.HasRowSpan) {
        if (item.Options.RowSpan === null || item.Options.RowSpan.toString().length === 0)
            errors.push("The row span should have a value.");
        else {
            var rowSpan = parseInt(item.Options.RowSpan.toString());
            if (rowSpan > 5 && rowSpan < 0)
                errors.push("The row span should be between 0 and 5.");
        }
    }

    if (item.Options.HasRetrieveAction)
        if (item.Options.RetrieveAction === null || item.Options.RetrieveAction.length === 0)
            errors.push("Retrieve action can not be empty.");

    if (item.Options.HasNewRecordAction)
        if (item.Options.NewRecordAction === null || item.Options.NewRecordAction.length === 0)
            errors.push("New record action can not be empty.");

    if (item.Options.HasSaveAction)
        if (item.Options.SaveAction === null || item.Options.SaveAction.length === 0)
            errors.push("Save action can not be empty.");

    if (item.Options.HasAutocompleteAction)
        if (item.Options.AutocompleteAction === null || item.Options.AutocompleteAction.length === 0)
            errors.push("Autocomplete action can not be empty.");

    if (item.Options.HasBrowseAction)
        if (item.Options.BrowseAction === null || item.Options.BrowseAction.length === 0)
            errors.push("Browse action can not be empty.");

    if (item.Options.HasLoadAction)
        if (item.Options.LoadAction === null || item.Options.LoadAction.length === 0)
            errors.push("Load action can not be empty.");

    if (item.Options.HasRepeatedFormId)
        if (item.Options.repeatedFormId === null || item.Options.repeatedFormId.length === 0)
            errors.push("Repeated Form Id can not be empty.");

    for (var i = 0;i<itemsAll.length;i++){
        if(item.Options.FieldName == itemsAll[i].Options.FieldName && item != itemsAll[i]){
            errors.push("This field name is already used.");
            break;
        }
    }

    return errors;
}

function manageComboCategory()
{
    // do shfaqim listen e kategorive ne nje forme
    $("#combo_category").fadeIn();
}

function manageInputMaskModal() {
    $("#input_mask").fadeIn();
}

/*
@param: $body - object reference
*/
function getcomboCategoryModal($body)
{
    // do shfaqim listen e kategorive ne nje forme
    var cCModal= [];
    $.ajax({
        url: "?comboCategoryCRUD/all_category",
        type: "GET",
            success: function (data) {
                //console.log(data.toString());
               $body.append(data);
            },
            error: function () {
                alert("Ndodhi nje gabim!")
            },
            complete: function () {
            }
    });
}

/*
 @param: $body - object reference
 */
function getAutoCompleteCategoryModal($body)
{
    // do shfaqim listen e kategorive ne nje forme
    var cCModal= [];
    $.ajax({
        url: "?autocompleteCategoryCRUD/all_category",
        type: "GET",
        success: function (data) {
            //console.log(data.toString());
            $body.append(data);
        },
        error: function () {
            alert("Ndodhi nje gabim!")
        },
        complete: function () {
        }
    });
}

/*
@param: $body - object reference
*/
function getcomboRadioGroupModal($body)
{
    // do shfaqim listen e kategorive ne nje forme
    var cCModal= [];
    $.ajax({
        url: "?radioGroupCRUD/all_category",
        type: "GET",
            success: function (data) {
                //console.log(data.toString());
               $body.append(data);
            },
            error: function () {
                alert("Ndodhi nje gabim!")
            },
            complete: function () {
            }
    });
}

function getcomboCheckBoxGroupModal($body)
{
    // do shfaqim listen e kategorive ne nje forme
    var cCModal= [];
    $.ajax({
        url: "?checkboxGroupCRUD/all_category",
        type: "GET",
        success: function (data) {
            //console.log(data.toString());
            $body.append(data);
        },
        error: function () {
            alert("Ndodhi nje gabim!")
        },
        complete: function () {
        }
    });
}

function getInputMaskModal($body) {
     $.ajax({
         url: "?inputMaskCRUD/getModal",
         type: "GET",
         success: function (data) {
             $body.append(data);
         },
         error: function () {
             alert("Ndodhi nje gabim!")
         },
         complete: function () {}
     });
}

/*
function getAutocompleteModal($body)
{
    // do shfaqim listen e kategorive ne nje forme
    var cCModal= [];
    $.ajax({
        url: "?autocompleteCategoryCRUD/all_category",
        type: "GET",
        success: function (data) {
            //console.log(data.toString());
            $body.append(data);
        },
        error: function () {
            alert("Ndodhi nje gabim!")
        },
        complete: function () {
        }
    });
}*/
