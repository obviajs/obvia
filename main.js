var flowerCM = window.flowerCM || {};
//TextInput
rjs.define("./js/components/Text.js", "TextInput");
rjs.define("./lib/flower_dependencies/scripts/jquery.inputmask.bundle.min.js", "InputMaskBundle");
//Form
rjs.define("./js/components/Form.js", "Form");
//Button
rjs.define("./js/components/Button.js", "Button");
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
rjs.define("lib/flower_dependencies/summernote/summernote.css", "SummerNoteCSS");
rjs.define("lib/flower_dependencies/summernote/summernote.min.js", "SummerNoteScript");

//Select
rjs.define("./js/components/Select.js", "Select");
//DateTime
rjs.define("./js/components/DateTime.js", "DateTime");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/js/bootstrap-datepicker.min.js", "DatePickerScript");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/css/bootstrap-datepicker.min.css", "DatePickerCSS");
//DateTimeCb
rjs.define("./js/components/DateTimeCb.js", "DateTimeCb");

rjs.require([
    "DOMContentLoaded",
    "Form",
    "Repeater",
    "List",
    "Amount",
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
    "RadioGroup"
], function () {

    rjs.define("./examples/CheckBox/example.js", "CheckBoxExample");
    rjs.define("./examples/RadioButton/example.js", "RadioButtonExample");
    rjs.define("./examples/CheckBoxGroup/example.js", "CheckBoxGroupExample");
    rjs.define("./examples/RadioGroup/example.js", "RadioGroupExample");
    // rjs.define("./examples/Form/example.js", "FormExample");
    // rjs.require([
    //     "CheckBoxExample",
    //     "RadioButtonExample",
    //     "CheckBoxGroupExample",
    //     "RadioGroupExample",
    //     "FormExample",
    // ], function () {
    // console.log(flowerCM);
    // }, flowerCM);
}, flowerCM);