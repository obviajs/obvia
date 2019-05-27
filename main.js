var flowerCM = window.flowerCM || {};
rjs.init({debug:false});
//base Components
rjs.define("lib/EventDispatcher.js", "EventDispatcher");
rjs.define("lib/rca/RemoteCursorEvent.js", "RemoteCursorEvent");
rjs.define("lib/rca/RemoteObject.js", "RemoteObject");
rjs.define("./components/base/History/History.js", "History");
rjs.define("./components/base/History/HistoryStep.js", "HistoryStep");
rjs.define("./components/base/History/HistoryEventType.js", "HistoryEventType");
rjs.define("./components/base/Component.js", "Component");
rjs.define("./components/base/Spacing.js", "Spacing");
rjs.define("./components/base/Selectable.js", "Selectable");
rjs.define("./components/base/Parent.js", "Parent");
rjs.define("./components/base/NavParent.js", "NavParent");
rjs.define("./components/base/ContainerType.js","ContainerType");
rjs.define("./components/base/ViewStack.js", "ViewStack");
rjs.define("./components/base/EnvType.js", "EnvType");
rjs.define("./components/base/Env.js", "Env");
rjs.define("./components/base/App.js", "App");
//TextInput
rjs.define("./lib/dependencies/scripts/jquery.inputmask.bundle.min.js", "InputMaskBundle");
rjs.define("./components/TextInput.js", "TextInput");
//Form
rjs.define("lib/dependencies/scripts/bootstrap-bootbox.js", "BootBox");
rjs.define("./components/Form/Form.js", "Form");
rjs.define("./components/Form/FormEventType.js", "FormEventType");
rjs.define("./components/Form/FormField.js", "FormField");
rjs.define("./components/Form/FormFieldSize.js", "FormFieldSize");
rjs.define("./components/Form/Hidden.js", "Hidden");
//Button
rjs.define("./components/Button.js", "Button");
//Label
rjs.define("./components/Label.js", "Label");

//HRule
rjs.define("./components/HRule.js", "HRule");
// Color Picker
rjs.define("./components/Color.js", "Color");
//Container
rjs.define("./components/Container.js", "Container");
//Tab
rjs.define("./components/Tab/TabNavigator.js", "TabNavigator");
rjs.define("./components/Tab/Tab.js", "Tab");
//Link
rjs.define("./components/Link.js", "Link");
//Repeater
rjs.define("./components/Repeater.js", "Repeater");
//List
rjs.define("./components/List.js", "List");
//CheckBox
rjs.define("./components/CheckBox.js", "CheckBox")
//CheckBoxGroup
rjs.define("./components/CheckBoxGroup.js", "CheckBoxGroup");
//RadioButton
rjs.define("./components/RadioButton.js", "RadioButton");
//RadioGroup
rjs.define("./components/RadioGroup.js", "RadioGroup");
//HierarchicalTree
rjs.define("./components/HierarchicalTree.js", "HierarchicalTree");
//Amount
rjs.define("./components/Amount.js", "Amount");
//Image
rjs.define("./components/Image.js", "Image");
//TextArea
livespell___installPath = window.location.origin + "/resources/inner_resources/scripts/plugins/SpellCheck/";
rjs.define("lib/dependencies/scripts/plugins/SpellCheck/include.js", "SpellCheckJS");
rjs.define("./components/TextArea.js", "TextArea");
//TextEditor
rjs.define("./components/TextEditor.js", "TextEditor");
rjs.define("lib/dependencies/summernote/summernote.css", "SummerNoteCSS");
rjs.define("lib/dependencies/summernote/summernote.min.js", "SummerNoteScript");
//Select
rjs.define("./components/Select.js", "Select");
//DateTime
rjs.define("./components/DateTime.js", "DateTime");
rjs.define("lib/dependencies/scripts/moment.js", "MomentJS");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/js/bootstrap-datepicker.min.js", "DatePickerScript");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/css/bootstrap-datepicker.min.css", "DatePickerCSS");
//DateTimeCb
rjs.define("./components/DateTimeCb.js", "DateTimeCb");
//Modal
rjs.define("./components/Modal/ModalSize.js", "ModalSize");
rjs.define("./components/Modal/Modal.js", "Modal");
//AutoComplete
rjs.define("./components/AutoComplete/AutoCompleteEx.js", "AutoCompleteEx");
rjs.define("./components/AutoComplete/AutoCompleteEx.css", "AutoCompleteExCSS");
rjs.define("./components/AutoComplete/TokenRenderer.js", "TokenRenderer");
rjs.define("./components/AutoComplete/SuggestionRenderer.js", "SuggestionRenderer");

//ComboBox
rjs.define("lib/dependencies/styles/bootstrap.multiselect.css", "ComboCSS");
rjs.define("lib/dependencies/scripts/bootstrap.multiselect.js", "ComboScript");
rjs.define("./components/ComboBox.js", "ComboBox");
//Map
//rjs.define("https://maps.googleapis.com/maps/api/js?key=AIzaSyD04Q93F3BcHhGl483rfMC_MD1Y8y7K0lo", "GoogleMapScript");
//rjs.define("./components/Map.js", "GoogleMap");
//Toggle
rjs.define("lib/dependencies/styles/bootstrap-toggle.min.css", "ToggleCSS");
rjs.define("lib/dependencies/scripts/bootstrap-toggle.js", "ToggleScript");
rjs.define("./components/Toggle.js", "Toggle");
//TrippleSwitch
rjs.define("./components/TrippleSwitch.js", "TrippleSwitch");
//MultiSwitch
rjs.define("./components/MultiSwitch.js", "MultiSwitch");
//Upload
rjs.define("lib/dependencies/scripts/jquery.slimscroll.js", "SlimScroll");
rjs.define("lib/dependencies/styles/kx-upload.css", "KxUploadCSS");
rjs.define("lib/dependencies/scripts/resumable.js", "Resumable");
rjs.define("./components/Upload.js", "Upload");
rjs.define("./components/FormUpload.js", "FormUpload");
//DataGrid

rjs.define("./components//DataGrid/DataGridCellRenderer.js", "DataGridCellRenderer");
rjs.define("./components//DataGrid/DataGridColumn.js", "DataGridColumn");
rjs.define("./components//DataGrid/DataGrid.js", "DataGrid");

rjs.define("./oxana/accounting/components/CurrencyExRate.js", "CurrencyExRate");
//Loader

rjs.require([
        "DOMContentLoaded",
        "EventDispatcher",
        "RemoteCursorEvent",
        "HistoryStep",
        "History",
        "HistoryEventType",
        "RemoteObject", 
        "Component",
        "Spacing",
        "Selectable",
        "Parent",
        "ContainerType",
        "NavParent",
        "Container",
        "TabNavigator",
        "Tab",
        "ViewStack",
        "EnvType",
        "Env",
        "App",
        "Form",
        "FormField",
        "FormFieldSize",
        "FormEventType",
        "Hidden",
        "HierarchicalTree",
        "BootBox",
        "Repeater",
        "List",
        "Amount",
        "Label",
        "Link",
        "InputMaskBundle",
        "TextInput", 
        "TextArea",
        "SpellCheckJS",
        "Select",
        "SummerNoteCSS",
        "SummerNoteScript",
        "TextEditor",
        "DateTime",
        "MomentJS",
        "DatePickerScript",
        "DatePickerCSS",
        "CheckBox",
        "CheckBoxGroup",
        "RadioButton",
        "RadioGroup",
        "DateTimeCb",
        "TokenRenderer",
        "SuggestionRenderer",
        "AutoCompleteEx",
        "AutoCompleteExCSS",
        "ModalSize",
        "Modal",
        "ComboBox",
        "ComboScript",
        "ComboCSS",
        //"GoogleMapScript",
        //"GoogleMap",
        "ToggleCSS",
        "ToggleScript",
        "Toggle",
        "TrippleSwitch",
        "MultiSwitch",
        "Resumable",
        "KxUploadCSS",
        "Upload",
        "SlimScroll",
        "FormUpload",
        "DataGridCellRenderer",
        "DataGridColumn",
        "DataGrid",
        "FormUpload",
        "HRule",
        "Color",
        "Image",
        //
        "CurrencyExRate"
        //"TabExample",
        //"LabelExample"
        //"Button",
        //"ButtonExample"
        //"ImageExample"
        //"RepeaterExample"
        //"LinkExample"
        //"AutoCompleteExample"
        //"DataGridExample",
       // "FormFieldExample"
    ], function () {
        
        //rjs.define("./examples/Form/ffExample.js", "FormFieldExample");
        //rjs.define("./examples/Label/example.js", "LabelExample");
        // rjs.define("./examples/RadioButton/example.js", "RadioButtonExample");+
        //rjs.define("./examples/AutoComplete/example.js", "AutoComplete");


        //rjs.define("./examples/Container/example.js", "ContainerExample");
        //rjs.define("./examples/Tab/example.js", "TabExample");
        // 

        //rjs.define("./examples/DataGrid/example.js", "DataGridExample");
        
        //rjs.define("./examples/Image/example.js", "ImageExample");
        //rjs.define("./examples/Text/example.js", "Text");
        //rjs.define("./examples/Label/example.js", "Label");
        //rjs.define("./examples/HRule/example.js", "HRuleExample");
        //rjs.define("./examples/Color/example.js", "ColorExample");
        // rjs.define("./examples/CheckBox/example.js", "CheckBoxExample");
        // rjs.define("./examples/RadioButton/example.js", "RadioButtonExample");
        // rjs.define("./examples/CheckBoxGroup/example.js", "CheckBoxGroupExample");
        // rjs.define("./examples/RadioGroup/example.js", "RadioGroupExample");
        //rjs.define("./examples/Toggle/example.js", "ToggleExample");
        
        //rjs.define("./oxana/accounting/invoice.js", "Invoice");
        rjs.define("./oxana/layoutBuilder.js", "layoutBuilder");
        //js.define("./oxana/magnetLayout.js", "magnetLayout");
        
        
        // rjs.define("./examples/Upload/example.js", "UploadExample");
        // rjs.define("./examples/Form/example.js", "FormExample");
        // rjs.define("./examples/Form/ajaxExample.js", "FormExample");
        // rjs.define("./examples/HierarchicalTree/example.js", "HierarchicalTreeExample");
        // rjs.define("./examples/Form/example.js", "FormExample");
        // rjs.define("./examples/Form/ajaxExample.js", "FormExample");
        
        //rjs.define("./examples/ComboBox/example.js", "ComboBoxExample");
        //rjs.define("./examples/List/example.js", "ListExample");
        //rjs.define("./examples/Button/example.js", "ButtonExample");
        //rjs.define("./examples/Repeater/example.js", "RepeaterExample");
        //rjs.define("./examples/Link/example.js", "LinkExample");
        //rjs.define("./examples/Modal/example.js", "ModalExample");
        //rjs.define("./examples/AutoComplete/example.js", "AutoCompleteExample");
        //rjs.define("./examples/DataGrid/example.js", "DataGridExample");

}, flowerCM);