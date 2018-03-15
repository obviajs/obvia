function getFormsFilledData(selector) {
    return selector.serialize();
}

//validate
var validateForms = function (selector) {
    var valid = true;
    selector.each(function () {

        if (!$(this).valid()) {
            valid = false;
        }
    });
    return valid;
}

var validationConfiguration = {
    ignore: ".upload_hidden_input",
    rules: {},
    invalidHandler: function (form, validator) {
        for (var i = 0; i < validator.errorList.length; i++) {
            if (!stopFocus) {
                //focus on hidden fields
                if (i == 0 && validator.errorList[i].element.type == 'hidden') {
                    var hiddenInput = validator.errorList[i].element;
                    //combobox
                    if ($(hiddenInput).attr('data-type') == 'combobox') {
                        var focusOn = $(hiddenInput).parent();
                        $(focusOn).addClass("error");
                        $(focusOn).attr('tabindex', '1');
                        $(focusOn).focus();
                        setTimeout(function () {
                            $(focusOn).removeClass("error")
                        }, 5000);
                        stopFocus = 1;
                        break;
                    }
                    //other
                    //find sibling div
                    var focusOn = $(hiddenInput).parent().children()[3];
                    console.log(focusOn);
                    $(focusOn).addClass("error");
                    $(focusOn).attr('tabindex', '1');
                    $(focusOn).focus();
                    setTimeout(function () {
                        $(focusOn).removeClass("error")
                    }, 5000);
                    stopFocus = 1;
                    break;
                }
                //normal fields
                validator.errorList[0].element.focus();
                stopFocus = 1;
            }

        }
    },
    errorPlacement: function (error, element) {
        return false;
    }
};

function selectedCategory(id) {
    var select = document.getElementById(id);
   
    return {
        value: select.options[select.selectedIndex].value,
        text: select.options[select.selectedIndex].text
    }
}

function getDocumentCategories(selectors, options, callback) {
    var html = "<select class='categories-select' id='" + selectors.selectId + "' data-forms='" + selectors.formsId + "'>";
    if (options.hasOwnProperty('selectStatus')) {
        if (options.selectStatus == 'disabled') {
            html = "<select class='categories-select' id='" + selectors.selectId + "' data-forms='" + selectors.formsId + "' disabled>";
        }
    }
    var url = "?configureEfilemanagerCRUD/getDocumentCategories";
    if (options.hasOwnProperty('documentId')) {
        url = "?configureEfilemanagerCRUD/getDocumentCategories/" + options.documentId;
    }
    $.getJSON(url, function (data, status) {
        data.forEach(function (item) {
            html += "<option value='" + item.id + "'>" + item.name + "</option>";
        });
        html += "</select>";

        selectors.documentCategories.html(html);
        $('.categories-select').select2();

        //forms load callback
        callback(selectedCategory(selectors.selectId).value);
    });
}

function spinner(selector, text, size, style) {
    if (style == undefined || style == '')
        style = 'margin: 20px; color:#2980b9';
    if (size == undefined || size == '')
        size = 'fa-5x';

    if (text != '' || text != undefined)
        selector.html('<center><i class="fa fa-spin fa-spinner ' + size + '" style="' + style + '" aria-hidden="true"></i>' + text + '</center>');
    else selector.html('<center><i class="fa fa-spin fa-spinner ' + size + '" style="' + style + '" aria-hidden="true"></i></center>');
}

function renderFilePreferencesView(selectors, options) {
    //get document categories
    getDocumentCategories(selectors, options, function (selected) {
        //load forms
        var url = "?configureEfilemanagerCRUD/generateFormsForDocumentCategory/" + selected;
        if (options.hasOwnProperty('documentId')) {
            url = "?configureEfilemanagerCRUD/generateFormsForDocumentCategory/" + selected + "/" + options.documentId;
            if (options.hasOwnProperty('version')) {
                url = "?configureEfilemanagerCRUD/generateFormsForDocumentCategory/" + selected + "/" + options.versionId + "/true";
            }
        }

        spinner(selectors.forms, '');
        $.get(url, function (data, status) {
            selectors.forms.html("");
            selectors.forms.append(data);

            //get rules
            $.getJSON("?configureEfilemanagerCRUD/getRules/" + selected, function (rules) {
                var rulesObj = {};
                JSON.parse(JSON.stringify(rules)).forEach(function (item) {
                    var arr = item.split(':');
                    //to be replaced
                    rulesObj[arr[0]] = { required: true };

                });
                validationConfiguration.rules = rulesObj;

                $('.formHtml').each(function () {
                    $(this).validate(validationConfiguration);
                });
            });

        });
    });
}

