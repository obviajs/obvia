var flowerCM = window.flowerCM || {};
//TextInput
rjs.define("./js/components/Text.js", "TextInput");
rjs.define("./lib/dependencies/scripts/jquery.inputmask.bundle.min.js", "InputMaskBundle");
//Form
rjs.define("./js/components/Form.js", "Form");
//Button
rjs.define("./js/components/Button.js", "Button");
//Label
rjs.define("./js/components/Label.js", "Label");
//Repeater
rjs.define("./js/components/Repeater.js", "Repeater");
//List
rjs.define("./js/components/List.js", "List");
//CheckBox
rjs.define("./js/components/CheckBox.js", "CheckBox")
//CheckBoxGroup
rjs.define("./js/components/CheckBoxGroup.js", "CheckBoxGroup");
//RadioButton
rjs.define("./js/components/RadioButton.js", "RadioButton");
//RadioGroup
rjs.define("./js/components/RadioGroup.js", "RadioGroup");
//Amount
rjs.define("./js/components/Amount.js", "Amount");
//TextArea
rjs.define("./js/components/TextArea.js", "TextArea");
//TextEditor
rjs.define("./js/components/TextEditor.js", "TextEditor");
rjs.define("lib/dependencies/summernote/summernote.css", "SummerNoteCSS");
rjs.define("lib/dependencies/summernote/summernote.min.js", "SummerNoteScript");
//Select
rjs.define("./js/components/Select.js", "Select");
//DateTime
rjs.define("./js/components/DateTime.js", "DateTime");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/js/bootstrap-datepicker.min.js", "DatePickerScript");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/css/bootstrap-datepicker.min.css", "DatePickerCSS");
//DateTimeCb
rjs.define("./js/components/DateTimeCb.js", "DateTimeCb");
//Modal
rjs.define("./js/components/Modal.js", "Modal");
//AutoComplete
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js", "Select2Script");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css", "Select2CSS");
rjs.define("./js/components/AutoComplete.js", "AutoComplete");
//ComboBox
rjs.define("lib/dependencies/styles/bootstrap.multiselect.css", "ComboCSS");
rjs.define("lib/dependencies/scripts/bootstrap.multiselect.js", "ComboScript");
rjs.define("./js/components/ComboBox.js", "ComboBox");
//Map
rjs.define("https://maps.googleapis.com/maps/api/js?key=AIzaSyD04Q93F3BcHhGl483rfMC_MD1Y8y7K0lo", "GoogleMapScript");
rjs.define("./js/components/Map.js", "GoogleMap");
//Toggle
rjs.define("lib/dependencies/styles/bootstrap-toggle.min.css", "ToggleCSS");
rjs.define("lib/dependencies/scripts/bootstrap-toggle.js", "ToggleScript");
rjs.define("./js/components/Toggle.js", "Toggle");
//TrippleSwitch
rjs.define("./js/components/TrippleSwitch.js", "TrippleSwitch");
//MultiSwitch
rjs.define("./js/components/MultiSwitch.js", "MultiSwitch");
//Upload
rjs.define("lib/dependencies/scripts/jquery.slimscroll.js", "SlimScroll");
rjs.define("lib/dependencies/styles/kx-upload.css", "KxUploadCSS");
rjs.define("lib/dependencies/scripts/resumable.js", "Resumable");
rjs.define("./js/components/Upload.js", "Upload");
rjs.define("./js/components/FormUpload.js", "FormUpload");

//Loader
var loader = new Loader({ id: 'loader' });
$('#root').append(loader.render());
loader.show();

rjs.require([
    "DOMContentLoaded",
    "Form",
    "Repeater",
    "List",
    "Amount",
    "Label",
    "TextInput", 
    "InputMaskBundle",
    "TextArea",
    "Select",
    "TextEditor",
    "DateTime",
    "DatePickerScript",
    "DatePickerCSS",
    "CheckBox",
    "CheckBoxGroup",
    "RadioButton",
    "RadioGroup",
    "DateTimeCb",
    "AutoComplete",
    "Select2Script",
    "Select2CSS",
    "Modal",
    "ComboBox",
    "ComboScript",
    "ComboCSS",
    "GoogleMapScript",
    "GoogleMap",
    "ToggleCSS",
    "ToggleScript",
    "Toggle",
    "TrippleSwitch",
    "MultiSwitch",
    "Resumable",
    "KxUploadCSS",
    "Upload",
    "SlimScroll",
    "FormUpload"
], function () {

    // rjs.define("./examples/CheckBox/example.js", "CheckBoxExample");
    // rjs.define("./examples/RadioButton/example.js", "RadioButtonExample");
    // rjs.define("./examples/CheckBoxGroup/example.js", "CheckBoxGroupExample");
    // rjs.define("./examples/RadioGroup/example.js", "RadioGroupExample");
    // rjs.define("./examples/Upload/example.js", "UploadExample");
    // rjs.define("./examples/Form/example.js", "FormExample");
    rjs.define("./examples/Form/ajaxExample.js", "FormExample");

}, flowerCM);