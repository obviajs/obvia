var flowerCM = window.flowerCM || {};
//base Components
rjs.define("lib/EventDispatcher.js", "EventDispatcher");
rjs.define("lib/NumberUtils.js", "NumberUtils");
rjs.define("./components_rb/base/EnvType.js", "EnvType");
rjs.define("./components_rb/base/Env.js", "Env");
rjs.define("lib/JTemplate.js", "JTemplate");
rjs.define("lib/DataStore.js", "DataStore");
rjs.define("lib/cache/Cache.js", "Cache");
rjs.define("lib/cache/CachedVariable.js", "CachedVariable");
rjs.define("components_rb/Loader.js", "Loader");
rjs.define("lib/ArrayUtils.js", "ArrayUtils");
rjs.define("lib/ArrayEx.js", "ArrayEx");
rjs.define("lib/ObjectUtils.js", "ObjectUtils");
rjs.define("lib/StringUtils.js", "StringUtils");
rjs.define("lib/DecoratorUtils.js", "DecoratorUtils");
rjs.define("lib/coroutine.js", "coroutine");
rjs.define("lib/BinUtils.js", "BinUtils");
rjs.define("lib/CSSUtils.js", "CSSUtils");
rjs.define("lib/BrowserUtils.js", "BrowserUtils");
rjs.define("lib/BrowserManager.js", "BrowserManager");
rjs.define("lib/my.js", "my");
rjs.define("lib/Tokenizer.js", "Tokenizer");
rjs.define("lib/binding/BindingUtils.js", "BindingUtils");
rjs.define("lib/binding/PropertyChangeEvent.js", "PropertyChangeEvent");
rjs.define("lib/binding/ChangeWatcher.js", "ChangeWatcher");
rjs.define("lib/rca/RemoteDataEvent.js", "RemoteDataEvent");
rjs.define("lib/rca/DataField.js", "DataField");
rjs.define("lib/rca/RemoteArray.js", "RemoteArray");
rjs.define("lib/rca/RemoteObject.js", "RemoteObject");
rjs.define("./components_rb/base/Align.js", "Align");
rjs.define("./components_rb/base/BrowserWindow.js", "BrowserWindow");
rjs.define("./components_rb/Repeater/RepeaterEventArgs.js", "RepeaterEventArgs");
rjs.define("./components_rb/base/BgStyle.js", "BgStyle");
rjs.define("./components_rb/base/History/History.js", "History");
rjs.define("./components_rb/base/History/HistoryStep.js", "HistoryStep");
rjs.define("./components_rb/base/History/HistoryEventType.js", "HistoryEventType");
rjs.define("./components_rb/base/JRComponent.js", "JRComponent");
rjs.define("./components/base/Component.js", "Component");
rjs.define("./components_rb/base/Spacing.js", "Spacing");
rjs.define("./components_rb/base/AutoObject.js", "AutoObject");
rjs.define("lib/TwoWayMap.js", "TwoWayMap");
rjs.define("./oxana/builder/SpacingEditor.js", "SpacingEditor");
rjs.define("./oxana/AutoBrowse.js", "AutoBrowse");
rjs.define("./components_rb/base/Attr.js", "Attr");
rjs.define("./components_rb/base/Css.js", "Css");
rjs.define("./components_rb/base/Parent.js", "Parent");
rjs.define("./components_rb/base/Props.js", "Props");

rjs.define("./components_rb/base/NavParent.js", "NavParent");
rjs.define("./components_rb/base/ContainerType.js", "ContainerType");
rjs.define("./components_rb/base/ViewStack.js", "ViewStack");
rjs.define("./components_rb/base/App.js", "App");
rjs.define("./components_rb/base/Applet.js", "Applet");
//TextInput
rjs.define("./lib/dependencies/scripts/jquery.inputmask.bundle.min.js", "InputMaskBundle");
rjs.define("./components_rb/TextInput/TextInput.js", "TextInput");
rjs.define("./components_rb/TextInput/TextInputType.js", "TextInputType");

//Form
rjs.define("lib/dependencies/scripts/bootstrap-bootbox.js", "BootBox");
rjs.define("./components_rb/Form/Form.js", "Form");
rjs.define("./components_rb/Form/FormEventType.js", "FormEventType");
rjs.define("./components_rb/Form/FormField.js", "FormField");
rjs.define("./components_rb/Form/FormFieldSize.js", "FormFieldSize");
rjs.define("./components_rb/Form/Hidden.js", "Hidden");
//Button
rjs.define("./components_rb/Button/Button.js", "Button");
rjs.define("./components_rb/Button/ButtonType.js", "ButtonType");
//Report Props
rjs.define("./components_rb/StretchType.js", "StretchType");
rjs.define("./components_rb/PositionType.js", "PositionType");
rjs.define("./components_rb/TextRotation.js", "TextRotation");
rjs.define("./components_rb/FontStyle.js", "FontStyle");
//Heading
rjs.define("./components_rb/HeadingType.js", "HeadingType");
rjs.define("./components_rb/Heading.js", "Heading");
//Label
rjs.define("./components_rb/LabelType.js", "LabelType");
rjs.define("./components_rb/Label.js", "Label");
rjs.define("./components_rb/JRLabel.js", "JRLabel");
//HRule
rjs.define("./components_rb/HRule.js", "HRule");
// Color Picker
rjs.define("./components_rb/Color.js", "Color");
//Container
rjs.define("./components_rb/Container.js", "Container");
rjs.define("./components_rb/Nav.js", "Nav");
rjs.define("./components_rb/Header.js", "Header");
rjs.define("./components_rb/Footer.js", "Footer");
rjs.define("./components_rb/Section.js", "Section");
//ScrollPane
rjs.define("./components_rb/base/ScrollPane.js", "ScrollPane");
//SideNav
rjs.define("./components_rb/SideNav/SideNavSide.js", "SideNavSide");
rjs.define("./components_rb/SideNav/SideNav.js", "SideNav");
//Tab
rjs.define("./components_rb/Tab/TabNavigator.js", "TabNavigator");
rjs.define("./components_rb/Tab/Tab.js", "Tab");
//Link
rjs.define("./components_rb/Link/LinkTarget.js", "LinkTarget");
rjs.define("./components_rb/Link/Link.js", "Link");
//Repeater
rjs.define("./components_rb/Repeater/Repeater.js", "Repeater");
rjs.define("./components_rb/Repeater/RepeaterEx.js", "RepeaterEx");
//List
rjs.define("./components_rb/List.js", "List");
//CheckBox
rjs.define("./components_rb/CheckBox.js", "CheckBox");
rjs.define("./components_rb/CheckBoxEx.js", "CheckBoxEx");
//CheckBoxGroup
rjs.define("./components_rb/CheckBoxGroup.js", "CheckBoxGroup");
//RadioButton
rjs.define("./components_rb/RadioButton.js", "RadioButton");
//RadioGroup
rjs.define("./components_rb/RadioGroup.js", "RadioGroup");
//Amount
rjs.define("./components_rb/Amount.js", "Amount");
//Image
rjs.define("./components_rb/Image.js", "Image");
//TextArea
rjs.define("./components_rb/TextArea.js", "TextArea");
//TextEditor
rjs.define("./components_rb/TextEditor.js", "TextEditor");
rjs.define("lib/dependencies/summernote/summernote.min.js", "SummerNoteScript");
//Select
rjs.define("./components_rb/Select/Option.js", "Option");
rjs.define("./components_rb/Select/Select.js", "Select");
//Tree
rjs.define("./components_rb/Tree/Li.js", "Li");
rjs.define("./components_rb/Tree/Tree.js", "Tree");
//HierarchicalTree
rjs.define("./oxana/HierarchialTree/HierarchialTree.js", "HierarchialTree");
//CreditCard
rjs.define('./oxana/CreditCard/CreditCard.js', "CreditCard");
//DateTime
rjs.define("./components_rb/DateTime/DateTime.js", "DateTime");

rjs.define("./components_rb/DateTime/DateTimeFormat.js", "DateTimeFormat");
rjs.define("lib/dependencies/scripts/moment.js", "MomentJS");
//DateTimeCb
rjs.define("./components_rb/DateTime/DateTimeMode.js", "DateTimeMode");
rjs.define("./components_rb/DateTime/DateTimeCb.js", "DateTimeCb");
//Modal
rjs.define("./components_rb/Modal/ModalSize.js", "ModalSize");
rjs.define("./components_rb/Modal/Modal.js", "Modal");
//AutoComplete
rjs.define("./components_rb/AutoComplete/AutoCompleteEx.js", "AutoCompleteEx");

rjs.define("./components_rb/AutoComplete/TokenRenderer.js", "TokenRenderer");
rjs.define("./components_rb/AutoComplete/SuggestionRenderer.js", "SuggestionRenderer");

//Map
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.js", "LeafletJS");
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.css", "LeafletCSS");
rjs.define("./components_rb/Map/MapLocationPicker.js", "MapLocationPicker");
//Toggle
rjs.define("./components_rb/Toggle/ToggleBgStyle.js", "ToggleBgStyle");
rjs.define("./components_rb/Toggle/Toggle.js", "Toggle");
//MultiSwitch
rjs.define("./components_rb/MultiSwitch.js", "MultiSwitch");
//Upload
rjs.define("lib/dependencies/scripts/jquery.slimscroll.js", "SlimScroll");

rjs.define("./components_rb/Form/Upload.js", "Upload");
rjs.define("./components_rb/UploadEx.js", "UploadEx");
rjs.define("./components_rb/MultiUpload.js", "MultiUpload");

//DataGrid
rjs.define("./components_rb/DataGrid/DataGridCellRenderer.js", "DataGridCellRenderer");
rjs.define("./components_rb/DataGrid/DataGridColumn.js", "DataGridColumn");
rjs.define("./components_rb/DataGrid/DataGrid.js", "DataGrid");

rjs.define("./oxana/accounting/components/CurrencyExRate.js", "CurrencyExRate");
//Loader

//ProgressBar
rjs.define("./components_rb/ProgressBar/ProgressBar.js", "ProgressBar");
rjs.define("./components_rb/ProgressBar/ProgressBarStyle.js", "ProgressBarStyle");

//DropDown
rjs.define("./components_rb/DropDown/DropDown.js", "DropDown");
rjs.define("./components_rb/DropDown/ButtonSize.js", "ButtonSize");
rjs.define("./components_rb/DropDown/DropMenuDirection.js", "DropMenuDirection");
rjs.define("./components_rb/DropDown/DropSplitType.js", "DropSplitType");
//Calendar
rjs.define("./components_rb/Calendar/CalendarBase.js", "CalendarBase");
rjs.define("./components_rb/Calendar/Calendar.js", "Calendar");
//CalendarDay
rjs.define("./components_rb/Calendar/CalendarDay.js", "CalendarDay");
rjs.define("./components_rb/Calendar/CalendarConstants.js", "CalendarConstants");
//CalendarWeek
rjs.define("./components_rb/Calendar/CalendarWeek.js", "CalendarWeek");
rjs.define("./components_rb/Calendar/CalendarMonth.js", "CalendarMonth");
rjs.define("./oxana/Wizard/Wizard.js", "Wizard");
rjs.define("lib/KeyboardUtils.js", "KeyboardUtils");

rjs.define("./components_rb/Calendar/css/calendarMonth-default.css", "calendarMonth_default_css");
rjs.define("./components_rb/Calendar/css/calendarWeek-default.css", "calendarWeek_default_css");
rjs.define("./components_rb/Calendar/css/calendarDay-default.css", "calendarDay_default_css");
rjs.define("./components_rb/Calendar/css/calendar-default.css", "calendar_default_css");
rjs.define('oxana/CreditCard/css/creditCard-default.css', 'creditCard-default_css');
rjs.define("./components_rb/Repeater/css/repeater-default.css", "repeater_default_css");
rjs.define("./components_rb/DataGrid/css/datagrid-default.css", "datagrid_default_css");
rjs.define("./components_rb/Toggle/toggle-default.css", "toggle_default_css");
rjs.define("./components_rb/DateTime/css/dateTime_default.css", "DateTime_Default_css");
rjs.define("./components_rb/AutoComplete/AutoCompleteEx.css", "AutoCompleteExCSS");
rjs.define("lib/dependencies/summernote/summernote.css", "SummerNoteCSS");
rjs.define("./components_rb/base/css/parent-default.css", "parent_default_css");
rjs.define("./components_rb/base/css/collapse.css", "collapse_css");
rjs.define("./oxana/HierarchialTree/css/HierarchialTree-default.css", "HierarchialTree_css");
rjs.define("./components_rb/SideNav/css/sidenav-default.css", "sidenav_default_css");

rjs.define("./components_rb/Validation/ValidationManager.js", "ValidationManager");
rjs.define("./components_rb/Validation/Validator.js", "Validator");
rjs.define("./components_rb/Validation/RangeValidator.js", "RangeValidator");
rjs.define("./components_rb/Validation/RequiredFieldValidator.js", "RequiredFieldValidator");
rjs.define("./components_rb/Validation/RegularExpressionValidator.js", "RegularExpressionValidator");
rjs.define("./components_rb/Validation/CustomValidator.js", "CustomValidator");
rjs.define("./oxana/Wizard/css/wizard-default.css", "wizard_default_css");
rjs.define("./components_rb/Tree/css/tree-default.css", "tree_default_css");
rjs.define("./components_rb/SideNav/css/sideNav.css", "sideNav_css");
rjs.define("./oxana/builder/css/builder.css", "Builder_Css");
rjs.define("./oxana/report_builder/css/builder.css", "Report_Builder_Css");
rjs.require(["EventDispatcher"]).then(function () {
    rjs.require([
        "AutoObject",
        "TwoWayMap",
        "NumberUtils",
        "JTemplate",
        "DataStore",
        "Cache",
        "CachedVariable",
        "Loader",
        "DOMContentLoaded",
        "ArrayUtils",
        "ArrayEx",
        "ObjectUtils",
        "StringUtils",
        "DecoratorUtils",
        "coroutine",
        "BinUtils",
        "CSSUtils",
        "BrowserUtils",
        "BrowserManager",
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
        "JRComponent",
        "Spacing",
        "SpacingEditor",
        "Form",
        "FormField",
        "FormFieldSize",
        "FormEventType",
        "AutoBrowse",
        "Attr",
        "Css",
        "Parent",
        "Props",
        "ContainerType",
        "NavParent",
        "Container",
        "ScrollPane",
        "SideNav",
        "SideNavSide",
        "Nav",
        "Header",
        "Footer",
        "Section",
        "TabNavigator",
        "Tab",
        "ViewStack",
        "EnvType",
        "Env",
        "App",
        "Applet",
        "Hidden",
        "BootBox",
        "Repeater",
        "RepeaterEx",
        "List",
        "Amount",
        "Button",
        "ButtonType",
        "StretchType",
        "PositionType",
        "TextRotation",
        "FontStyle",
        "HeadingType",
        "Heading",
        "LabelType",
        "Label",
        "JRLabel",
        "LinkTarget",
        "Link",
        "InputMaskBundle",
        "TextInput",
        "TextInputType",
        "TextArea",
        "Option",
        "Select",
        "SummerNoteScript",
        "TextEditor",
        "DateTime",
        "DateTimeFormat",
        "MomentJS",
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
        "ModalSize",
        "Modal",
        "LeafletJS",
        "LeafletCSS",
        "MapLocationPicker",
        "ToggleBgStyle",
        "Toggle",
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
        "Li",
        "Tree",
        "HierarchialTree",
        "CreditCard",
        "DropDown",
        "ButtonSize",
        "DropMenuDirection",
        "DropSplitType",
        "CalendarBase",
        "Calendar",
        "CalendarDay",
        "CalendarConstants",
        "CalendarWeek",
        "CalendarMonth",
        "Wizard",
        "KeyboardUtils",
        "ValidationManager",
        "Validator",
        "RangeValidator",
        "RequiredFieldValidator",
        "RegularExpressionValidator",
        "CustomValidator",
        "calendarMonth_default_css",
        "calendarWeek_default_css",
        "calendarDay_default_css",
        "calendar_default_css",
        "creditCard-default_css",
        "repeater_default_css",
        "datagrid_default_css",
        "toggle_default_css",
        "AutoCompleteExCSS",
        "DateTime_Default_css",
        "SummerNoteCSS",        
        "collapse_css",
        "parent_default_css",
        "HierarchialTree_css",
        "sidenav_default_css",
        
        "wizard_default_css",
        "tree_default_css",
        "sideNav_css",
        "Builder_Css",
    ], function () {
        window.main();
    }, flowerCM);
});
