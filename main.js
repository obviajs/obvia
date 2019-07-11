var flowerCM = window.flowerCM || {};
rjs.init({debug:false});
//base Components
rjs.define("lib/EventDispatcher.js", "EventDispatcher");
rjs.define("lib/ArrayUtils.js", "ArrayUtils");
rjs.define("lib/ObjectUtils.js", "ObjectUtils");
rjs.define("lib/StringUtils.js", "StringUtils");
rjs.define("lib/DecoratorUtils.js", "DecoratorUtils");
rjs.define("lib/BinUtils.js", "BinUtils");
rjs.define("lib/my.js", "my");
rjs.define("lib/Tokenizer.js", "Tokenizer");
rjs.define("lib/binding/BindingUtils.js", "BindingUtils");
rjs.define("lib/binding/PropertyChangeEvent.js", "PropertyChangeEvent");
rjs.define("lib/binding/ChangeWatcher.js", "ChangeWatcher");
rjs.define("lib/rca/RemoteCursorEvent.js", "RemoteCursorEvent");
rjs.define("lib/rca/RemoteObject.js", "RemoteObject");
rjs.define("./components/base/BgStyle.js", "BgStyle");
rjs.define("./components/base/History/History.js", "History");
rjs.define("./components/base/History/HistoryStep.js", "HistoryStep");
rjs.define("./components/base/History/HistoryEventType.js", "HistoryEventType");
rjs.define("./components/base/Component.js", "Component");
rjs.define("./components/base/Spacing.js", "Spacing");
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
rjs.define("./components/LabelType.js", "LabelType");
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
rjs.define("./components/Select/Option.js", "Option");
rjs.define("./components/Select/Select.js", "Select");
//Tree
rjs.define("./components/Tree/css/tree-default.css", "tree_default_css");
rjs.define("./components/Tree/Li.js", "Li");
rjs.define("./components/Tree/Tree.js", "Tree");
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

rjs.define("./components/Form/Upload.js", "Upload");
rjs.define("./components/UploadEx.js", "UploadEx");
rjs.define("./components/MultiUpload.js", "MultiUpload");

//DataGrid
rjs.define("./components//DataGrid/DataGridCellRenderer.js", "DataGridCellRenderer");
rjs.define("./components//DataGrid/DataGridColumn.js", "DataGridColumn");
rjs.define("./components//DataGrid/DataGrid.js", "DataGrid");
 
rjs.define("./oxana/accounting/components/CurrencyExRate.js", "CurrencyExRate");
//Loader

//ProgressBar
rjs.define("./components/ProgressBar/ProgressBar.js", "ProgressBar");
rjs.define("./components/ProgressBar/ProgressBarStyle.js", "ProgressBarStyle");

rjs.require([
        "DOMContentLoaded",
        "EventDispatcher",
        "ArrayUtils",
        "ObjectUtils",
        "StringUtils",
        "DecoratorUtils",
        "my",
        "Tokenizer",
        "BindingUtils",
        "PropertyChangeEvent",
        "ChangeWatcher",
        "RemoteCursorEvent",
        "BgStyle",
        "HistoryStep",
        "History",
        "HistoryEventType",
        "RemoteObject", 
        "Component",
        "Spacing",
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
        "BootBox",
        "Repeater",
        "List",
        "Amount",
        "LabelType",
        "Label",
        "Link",
        "InputMaskBundle",
        "TextInput", 
        "TextArea",
        "SpellCheckJS",
        "Option",
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
        //"GoogleMapScript",
        //"GoogleMap",
        "ToggleCSS",
        "ToggleScript",
        "Toggle",
        "TrippleSwitch",
        "MultiSwitch",
        "Upload",
        "SlimScroll",
        "UploadEx",
        "DataGridCellRenderer",
        "DataGridColumn",
        "DataGrid",
        "HRule",
        "Color",
        "Image",
        "ProgressBarStyle",
        "ProgressBar",
        //
        "CurrencyExRate",
        "tree_default_css",
        "Li",
        "Tree"
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
         
        rjs.define("./examples/Form/ffExample.js", "FormFieldExample");
        //rjs.define("./examples/Label/example.js", "LabelExample");
        // rjs.define("./examples/RadioButton/example.js", "RadioButtonExample");
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
         // rjs.define("./examples/Generic/example.js","GenericExample");
        //rjs.define("./oxana/accounting/invoice.js", "Invoice");
       //rjs.define("./oxana/layoutBuilder.js", "layoutBuilder");

       //rjs.define("./examples/Select/example.js", "SelectExample");
       //rjs.define("./examples/Tree/example.js", "TreeExample");
       // rjs.define("./oxana/magnetLayout.js", "magnetLayout");
      
       //rjs.define("./examples/Upload/singleUploadExample.js", "singleUploadExample");
      //rjs.define("./examples/ProgressBar/example.js", "example");

       //rjs.define("./examples/Upload/example.js", "UploadExample");
      //  rjs.define("./examples/Form/example.js", "FormExample");
      //   rjs.define("./examples/Form/ajaxExample.js", "FormExample");
        // rjs.define("./examples/Form/ajaxExample.js", "FormExample");
        //rjs.define("./examples/Form/myexample.js","FormExample");
        //rjs.define("./examples/List/example.js", "ListExample");
        //rjs.define("./examples/Button/example.js", "ButtonExample");
        //rjs.define("./examples/Repeater/example.js", "RepeaterExample");
        //rjs.define("./examples/Link/example.js", "LinkExample");
        //rjs.define("./examples/Modal/example.js", "ModalExample");
        //rjs.define("./examples/AutoComplete/example.js", "AutoCompleteExample");
    //   rjs.define("./examples/DataGrid/example.js", "DataGridExample");
 
}, flowerCM);