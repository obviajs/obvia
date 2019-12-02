var flowerCM = window.flowerCM || {};
//base Components
rjs.define("lib/NumberUtils.js", "NumberUtils");
rjs.define("./components/base/EnvType.js", "EnvType");
rjs.define("./components/base/Env.js", "Env");
rjs.define("lib/JTemplate.js", "JTemplate");
rjs.define("lib/DataStore.js", "DataStore");
rjs.define("lib/cache/Cache.js", "Cache");
rjs.define("lib/cache/CachedVariable.js", "CachedVariable");
rjs.define("components/Loader.js", "Loader");

rjs.define("lib/EventDispatcher.js", "EventDispatcher");
rjs.define("lib/ArrayUtils.js", "ArrayUtils");
rjs.define("lib/ArrayEx.js", "ArrayEx");
rjs.define("lib/ObjectUtils.js", "ObjectUtils");
rjs.define("lib/StringUtils.js", "StringUtils");
rjs.define("lib/DecoratorUtils.js", "DecoratorUtils");
rjs.define("lib/coroutine.js", "coroutine");
rjs.define("lib/BinUtils.js", "BinUtils");
rjs.define("lib/CSSUtils.js", "CSSUtils");
rjs.define("lib/my.js", "my");
rjs.define("lib/Tokenizer.js", "Tokenizer");
rjs.define("lib/binding/BindingUtils.js", "BindingUtils");
rjs.define("lib/binding/PropertyChangeEvent.js", "PropertyChangeEvent");
rjs.define("lib/binding/ChangeWatcher.js", "ChangeWatcher");
rjs.define("lib/rca/RemoteDataEvent.js", "RemoteDataEvent");
rjs.define("lib/rca/DataField.js", "DataField");
rjs.define("lib/rca/RemoteArray.js", "RemoteArray");
rjs.define("lib/rca/RemoteObject.js", "RemoteObject");
rjs.define("./components/base/Align.js", "Align");
rjs.define("./components/base/BrowserWindow.js", "BrowserWindow");
rjs.define("./components/Repeater/RepeaterEventArgs.js", "RepeaterEventArgs");
rjs.define("./components/base/BgStyle.js", "BgStyle");
rjs.define("./components/base/History/History.js", "History");
rjs.define("./components/base/History/HistoryStep.js", "HistoryStep");
rjs.define("./components/base/History/HistoryEventType.js", "HistoryEventType");
rjs.define("./components/base/Component.js", "Component");
rjs.define("./components/base/Spacing.js", "Spacing");
rjs.define("./oxana/builder/SpacingEditor.js", "SpacingEditor");
rjs.define("./oxana/AutoBrowse.js", "AutoBrowse");
rjs.define("./components/base/Attr.js", "Attr");
rjs.define("./components/base/Parent.js", "Parent");
rjs.define("./components/base/css/parent-default.css", "parent_default_css");
rjs.define("./components/base/css/collapse.css", "collapse_css");
rjs.define("./components/base/NavParent.js", "NavParent");
rjs.define("./components/base/ContainerType.js","ContainerType");
rjs.define("./components/base/ViewStack.js", "ViewStack");
rjs.define("./components/base/App.js", "App");
//TextInput
rjs.define("./lib/dependencies/scripts/jquery.inputmask.bundle.min.js", "InputMaskBundle");
rjs.define("./components/TextInput/TextInput.js", "TextInput");
rjs.define("./components/TextInput/TextInputType.js", "TextInputType");

//Form
rjs.define("lib/dependencies/scripts/bootstrap-bootbox.js", "BootBox");
rjs.define("./components/Form/Form.js", "Form");
rjs.define("./components/Form/FormEventType.js", "FormEventType");
rjs.define("./components/Form/FormField.js", "FormField");
rjs.define("./components/Form/FormFieldSize.js", "FormFieldSize");
rjs.define("./components/Form/Hidden.js", "Hidden");
//Button
rjs.define("./components/Button.js", "Button");
//Heading
rjs.define("./components/HeadingType.js", "HeadingType");
rjs.define("./components/Heading.js", "Heading");
//Label
rjs.define("./components/LabelType.js", "LabelType");
rjs.define("./components/Label.js", "Label"); 
//HRule
rjs.define("./components/HRule.js", "HRule");
// Color Picker
rjs.define("./components/Color.js", "Color");
//Container
rjs.define("./components/Container.js", "Container");
rjs.define("./components/Nav.js", "Nav");
rjs.define("./components/Header.js", "Header");
rjs.define("./components/Footer.js", "Footer");
//ScrollPane
rjs.define("./components/base/ScrollPane.js", "ScrollPane");
//SideNav
rjs.define("./components/SideNav/SideNavSide.js", "SideNavSide");
rjs.define("./components/SideNav/SideNav.js", "SideNav");
rjs.define("./components/SideNav/css/sidenav-default.css", "sidenav_default_css");
//Tab
rjs.define("./components/Tab/TabNavigator.js", "TabNavigator");
rjs.define("./components/Tab/Tab.js", "Tab");
//Link
rjs.define("./components/Link/LinkTarget.js", "LinkTarget");
rjs.define("./components/Link/Link.js", "Link");
//Repeater
rjs.define("./components/Repeater/Repeater.js", "Repeater");
rjs.define("./components/Repeater/RepeaterEx.js", "RepeaterEx");
rjs.define("./components/Repeater/css/repeater-default.css", "repeater_default_css");
//List
rjs.define("./components/List.js", "List");
//CheckBox
rjs.define("./components/CheckBox.js", "CheckBox");
rjs.define("./components/CheckBoxEx.js", "CheckBoxEx");
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
rjs.define("./components/DateTime/DateTime.js", "DateTime");
rjs.define("lib/dependencies/scripts/moment.js", "MomentJS");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/js/bootstrap-datepicker.min.js", "DatePickerScript");
rjs.define("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/css/bootstrap-datepicker.min.css", "DatePickerCSS");
//DateTimeCb
rjs.define("./components/DateTime/DateTimeMode.js", "DateTimeMode");
rjs.define("./components/DateTime/DateTimeCb.js", "DateTimeCb");
//Modal
rjs.define("./components/Modal/ModalSize.js", "ModalSize");
rjs.define("./components/Modal/Modal.js", "Modal");
//AutoComplete
rjs.define("./components/AutoComplete/AutoCompleteEx.js", "AutoCompleteEx");
rjs.define("./components/AutoComplete/AutoCompleteEx.css", "AutoCompleteExCSS");
rjs.define("./components/AutoComplete/TokenRenderer.js", "TokenRenderer");
rjs.define("./components/AutoComplete/SuggestionRenderer.js", "SuggestionRenderer");
 
//Map
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.js", "LeafletJS");
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.css", "LeafletCSS");
rjs.define("./components/Map/MapLocationPicker.js", "MapLocationPicker");
//Toggle
rjs.define("./components/Toggle/ToggleBgStyle.js", "ToggleBgStyle");
rjs.define("./components/Toggle/Toggle.js", "Toggle");
rjs.define("./components/Toggle/toggle-default.css", "toggle_default_css");
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
rjs.define("./components/DataGrid/DataGridCellRenderer.js", "DataGridCellRenderer");
rjs.define("./components/DataGrid/DataGridColumn.js", "DataGridColumn");
rjs.define("./components/DataGrid/DataGrid.js", "DataGrid");
 
rjs.define("./oxana/accounting/components/CurrencyExRate.js", "CurrencyExRate");
//Loader

//ProgressBar
rjs.define("./components/ProgressBar/ProgressBar.js", "ProgressBar");
rjs.define("./components/ProgressBar/ProgressBarStyle.js", "ProgressBarStyle");

//DropDown
rjs.define("./components/DropDown/DropDown.js", "DropDown");
rjs.define("./components/DropDown/ButtonSize.js", "ButtonSize");
rjs.define("./components/DropDown/DropMenuDirection.js", "DropMenuDirection");
rjs.define("./components/DropDown/DropSplitType.js", "DropSplitType");
//Calendar
rjs.define("./components/Calendar/Calendar.js", "Calendar");
rjs.define("./components/Calendar/css/calendar-default.css", "calendar_default_css");
//CalendarDay
rjs.define("./components/Calendar/CalendarDay.js", "CalendarDay");
rjs.define("./components/Calendar/css/calendarDay-default.css", "calendarDay_default_css");
rjs.define("./components/Calendar/CalendarConstants.js", "CalendarConstants");
//CalendarWeek
rjs.define("./components/Calendar/CalendarWeek.js", "CalendarWeek");
rjs.define("./components/Calendar/css/calendarWeek-default.css", "calendarWeek_default_css");

//TextInput
//rjs.define("./components/TextInput.js", "TextInput")

rjs.define("./oxana/builder/CollectionEditor.js", "CollectionEditor");
rjs.define("./oxana/builder/ObjectEditor.js", "ObjectEditor");
rjs.require([
        "NumberUtils",
        "JTemplate",
        "DataStore",
        "Cache",
        "CachedVariable",
        "Loader",
        "DOMContentLoaded",
        "EventDispatcher",
        "ArrayUtils",
        "ArrayEx",
        "ObjectUtils",
        "StringUtils",
        "DecoratorUtils",
        "coroutine",
        "BinUtils",
        "CSSUtils",
        "my",
        "Tokenizer",
        "BindingUtils",
        "PropertyChangeEvent",
        "ChangeWatcher",
        "DataField",
        "RemoteDataEvent",
        "RemoteObject", 
        "RemoteArray", 
        "Align",
        "BrowserWindow",
        "RepeaterEventArgs",
        "BgStyle",
        "HistoryStep",
        "History",
        "HistoryEventType",
        "Component",
        "Spacing",
        "SpacingEditor",
        "Form",
        "FormField",
        "FormFieldSize",
        "FormEventType",
        "CollectionEditor",
        "ObjectEditor",
        "AutoBrowse",
        "Attr",
        "Parent",
        "parent_default_css",
        "collapse_css",
        "ContainerType",
        "NavParent",
        "Container",
        "ScrollPane",
        "SideNav",
        "SideNavSide",
        "sidenav_default_css",
        "Nav",
        "Header",
        "Footer",
        "TabNavigator",
        "Tab",
        "ViewStack",
        "EnvType",
        "Env",
        "App",
        "Hidden",
        "BootBox",
        "Repeater",
        "RepeaterEx",
        "repeater_default_css",
        "List",
        "Amount",
        "HeadingType",
        "Heading",
        "LabelType",
        "Label",
        "LinkTarget",
        "Link",
        "InputMaskBundle",
        "TextInput",
        "TextInputType", 
        "TextArea",
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
        "CheckBoxEx",
        "CheckBoxGroup",
        "RadioButton",
        "RadioGroup",
        "DateTimeMode",
        "DateTimeCb",
        "TokenRenderer",
        "SuggestionRenderer",
        "AutoCompleteEx",
        "AutoCompleteExCSS",
        "ModalSize",
        "Modal",
        "LeafletJS",
        "LeafletCSS",
        "MapLocationPicker",
        "ToggleBgStyle",
        "Toggle",
        "toggle_default_css",
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
        "CurrencyExRate",
        "tree_default_css",
        "Li",
        "Tree",
        "DropDown",
        "ButtonSize",
        "DropMenuDirection",
        "DropSplitType",
        "Calendar",
        "calendar_default_css",
        "CalendarDay",
        "CalendarConstants",
        "calendarDay_default_css",
        "CalendarWeek",
        "calendarWeek_default_css",
        
    ], function () {
        window.main();
}, flowerCM);