var flowerCM = window.flowerCM || {};
//base Components
rjs.define("lib/Poolable.js", "Poolable");
rjs.define("lib/EventDispatcher.js", "EventDispatcher");
rjs.define("lib/Timer.js", "Timer");
rjs.define("lib/NumberUtils.js", "NumberUtils");
rjs.define("./components/base/EnvType.js", "EnvType");
rjs.define("./components/base/Env.js", "Env");
rjs.define("lib/JTemplate.js", "JTemplate");
rjs.define("lib/DataStore.js", "DataStore");
rjs.define("lib/cache/Cache.js", "Cache");
rjs.define("lib/cache/CachedVariable.js", "CachedVariable");
rjs.define("components/Loader.js", "Loader");
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
rjs.define("lib/binding/BindingsManager.js", "BindingsManager");
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
rjs.define("./components/base/AutoObject.js", "AutoObject");
rjs.define("lib/TwoWayMap.js", "TwoWayMap");
rjs.define("./components/AutoBrowse.js", "AutoBrowse");
rjs.define("./components/DataBrowse.js", "DataBrowse");
rjs.define("./components/base/Attr.js", "Attr");
rjs.define("./components/base/Css.js", "Css");
rjs.define("./components/base/Props.js", "Props");
rjs.define("./components/base/Parent.js", "Parent");

rjs.define("./components/base/NavParent.js", "NavParent");
rjs.define("./components/base/ContainerType.js", "ContainerType");
rjs.define("./components/base/ViewStack.js", "ViewStack");
rjs.define("./components/base/App.js", "App");
rjs.define("./components/base/Applet.js", "Applet");
//TextInput
rjs.define("./lib/dependencies/scripts/jquery.inputmask.bundle.min.js", "InputMaskBundle");
rjs.define("./components/TextInput/TextInput.js", "TextInput");
rjs.define("./components/TextInput/TextInputType.js", "TextInputType");

//Form
rjs.define("./components/Form/Form.js", "Form");
rjs.define("./components/Form/FormEventType.js", "FormEventType");
rjs.define("./components/Form/FormField.js", "FormField");
rjs.define("./components/Form/FormFieldSize.js", "FormFieldSize");
rjs.define("./components/Form/Hidden.js", "Hidden");
//Button
rjs.define("./components/Button/Button.js", "Button");
rjs.define("./components/Button/ButtonType.js", "ButtonType");
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
rjs.define("./components/ObjectCmp.js", "ObjectCmp");
rjs.define("./components/Filter/Filter.js", "Filter");
rjs.define("./components/Filter/Filter.css", "Filter_css");
rjs.define("./components/Nav.js", "Nav");
rjs.define("./components/Header.js", "Header");
rjs.define("./components/Footer.js", "Footer");
rjs.define("./components/Section.js", "Section");
//ScrollPane
rjs.define("./components/base/ScrollPane.js", "ScrollPane");
//SideNav
rjs.define("./components/SideNav/SideNavSide.js", "SideNavSide");
rjs.define("./components/SideNav/SideNav.js", "SideNav");
//Tab
rjs.define("./components/Tab/TabNavigator.js", "TabNavigator");
rjs.define("./components/Tab/Tab.js", "Tab");
//Link
rjs.define("./components/Link/LinkTarget.js", "LinkTarget");
rjs.define("./components/Link/Link.js", "Link");
//Repeater
rjs.define("./components/Repeater/Repeater.js", "Repeater");
rjs.define("./components/Repeater/RepeaterEx.js", "RepeaterEx");
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
rjs.define("lib/dependencies/summernote/summernote.min.js", "SummerNoteScript");
//Select
rjs.define("./components/Select/Option.js", "Option");
rjs.define("./components/Select/Select.js", "Select");
//Tree
rjs.define("./components/Tree/Li.js", "Li");
rjs.define("./components/Tree/Tree.js", "Tree");
//HierarchicalTree
rjs.define("./components/HierarchialTree/HierarchialTree.js", "HierarchialTree");
//CreditCard
rjs.define('./components/CreditCard/CreditCard.js', "CreditCard");
//DateTime
rjs.define("./components/DateTime/DateTime.js", "DateTime");

rjs.define("./components/DateTime/DateTimeFormat.js", "DateTimeFormat");
rjs.define("lib/dependencies/scripts/moment.js", "MomentJS");
//DateTimeCb
rjs.define("./components/DateTime/DateTimeMode.js", "DateTimeMode");
rjs.define("./components/DateTime/DateTimeCb.js", "DateTimeCb");
//Modal
rjs.define("./components/Modal/ModalSize.js", "ModalSize");
rjs.define("./components/Modal/Modal.js", "Modal");
//AutoComplete
rjs.define("./components/AutoComplete/AutoCompleteEx.js", "AutoCompleteEx");

rjs.define("./components/AutoComplete/TokenRenderer.js", "TokenRenderer");
rjs.define("./components/AutoComplete/SuggestionRenderer.js", "SuggestionRenderer");

//Map
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.js", "LeafletJS");
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.css", "LeafletCSS");
rjs.define("./components/Map/MapLocationPicker.js", "MapLocationPicker");
rjs.define("./components/Map/LeafletMap.js", "LeafletMap");
//Toggle
rjs.define("./components/Toggle/ToggleBgStyle.js", "ToggleBgStyle");
rjs.define("./components/Toggle/Toggle.js", "Toggle");
//MultiSwitch
rjs.define("./components/MultiSwitch.js", "MultiSwitch");
//Upload
rjs.define("lib/dependencies/scripts/jquery.slimscroll.js", "SlimScroll");

rjs.define("./components/Form/Upload.js", "Upload");
rjs.define("./components/UploadEx.js", "UploadEx");
rjs.define("./components/MultiUpload.js", "MultiUpload");
//Table
rjs.define("./components/Table/Table.js", "Table");
rjs.define("./components/Table/TBody.js", "TBody");
rjs.define("./components/Table/THead.js", "THead");
rjs.define("./components/Table/TFoot.js", "TFoot");
rjs.define("./components/Table/TCell.js", "TCell");
rjs.define("./components/Table/Tr.js", "Tr");
rjs.define("./components/Table/Th.js", "Th");
rjs.define("./components/Table/Td.js", "Td");
//DataGrid
rjs.define("./components/DataGrid/DataGridCellRenderer.js", "DataGridCellRenderer");
rjs.define("./components/DataGrid/DataGridColumn.js", "DataGridColumn");
rjs.define("./components/DataGrid/DataGrid.js", "DataGrid");

rjs.define("./components/CurrencyExRate/CurrencyExRate.js", "CurrencyExRate");
//Loader

//ProgressBar
rjs.define("./components/ProgressBar/ProgressBar.js", "ProgressBar");
rjs.define("./components/ProgressBar/ProgressBarStyle.js", "ProgressBarStyle");

//DropDown
rjs.define("./components/DropDown/DropDown.js", "DropDown");
rjs.define("./components/DropEdit/DropEdit.js", "DropEdit");
rjs.define("./components/DropDown/ButtonSize.js", "ButtonSize");
rjs.define("./components/DropDown/DropMenuDirection.js", "DropMenuDirection");
rjs.define("./components/DropDown/DropSplitType.js", "DropSplitType");
//Calendar
rjs.define("./components/Calendar/CalendarBase.js", "CalendarBase");
rjs.define("./components/Calendar/Calendar.js", "Calendar");
//CalendarDay
rjs.define("./components/Calendar/CalendarDay.js", "CalendarDay");
rjs.define("./components/Calendar/CalendarConstants.js", "CalendarConstants");
//CalendarWeek
rjs.define("./components/Calendar/CalendarWeek.js", "CalendarWeek");
rjs.define("./components/Calendar/CalendarMonth.js", "CalendarMonth");
rjs.define("./components/wizard/Wizard.js", "Wizard");
rjs.define("lib/KeyboardUtils.js", "KeyboardUtils");

rjs.define("./components/Calendar/css/calendarMonth-default.css", "calendarMonth_default_css");
rjs.define("./components/Calendar/css/calendarWeek-default.css", "calendarWeek_default_css");
rjs.define("./components/Calendar/css/calendarDay-default.css", "calendarDay_default_css");
rjs.define("./components/Calendar/css/calendar-default.css", "calendar_default_css");
rjs.define('./components/CreditCard/css/creditCard-default.css', 'creditCard-default_css');
rjs.define("./components/Repeater/css/repeater-default.css", "repeater_default_css");
rjs.define("./components/DataGrid/css/datagrid-default.css", "datagrid_default_css");
rjs.define("./components/Toggle/toggle-default.css", "toggle_default_css");
rjs.define("./components/DateTime/css/dateTime_default.css", "DateTime_Default_css");
rjs.define("./components/AutoComplete/AutoCompleteEx.css", "AutoCompleteExCSS");
rjs.define("lib/dependencies/summernote/summernote.css", "SummerNoteCSS");
rjs.define("./components/base/css/parent-default.css", "parent_default_css");
rjs.define("./components/base/css/collapse.css", "collapse_css");
rjs.define("./components/HierarchialTree/css/HierarchialTree-default.css", "HierarchialTree_css");
rjs.define("./components/SideNav/css/sidenav-default.css", "sidenav_default_css");

rjs.define("./components/Validation/ValidationManager.js", "ValidationManager");
rjs.define("./components/Validation/Validator.js", "Validator");
rjs.define("./components/Validation/RangeValidator.js", "RangeValidator");
rjs.define("./components/Validation/RequiredFieldValidator.js", "RequiredFieldValidator");
rjs.define("./components/Validation/RegularExpressionValidator.js", "RegularExpressionValidator");
rjs.define("./components/Validation/CustomValidator.js", "CustomValidator");
//rjs.define("./components/Wizard/css/wizard-default.css", "wizard_default_css");
rjs.define("./components/DropEdit/css/DropEdit.css", "DropEdit_css");
rjs.define("./components/Tree/css/tree-default.css", "tree_default_css");
rjs.define("./components/SideNav/css/sideNav.css", "sideNav_css");

rjs.define("./components/Kanban/Kanban.js", "Kanban");
rjs.define("./components/Kanban/css/kanban_default.css", "kanban_default_css");

rjs.define("lib/yaml.js", "yaml");
rjs.define("./lib/ApiClientGen/ApiClient.js", "ApiClient");
rjs.define("./lib/ApiClientGen/ApiClientGen.js", "ApiClientGen");
rjs.define("./lib/ApiClientGen/OAMethod.js", "OAMethod");

let dependencies = [
    ["EventDispatcher"],
    [
        "Poolable",
        "Timer",
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
        "BindingsManager",
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
        "Form",
        "FormField",
        "FormFieldSize",
        "FormEventType",
        "AutoBrowse",
        "DataBrowse",
        "Attr",
        "Css",
        "Props",
        "Parent",
        "ContainerType",
        "NavParent",
        "Container",
        "ObjectCmp",
        "Filter",
        "Filter_css",
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
        "Repeater",
        "RepeaterEx",
        "List",
        "Amount",
        "Button",
        "ButtonType",
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
        "LeafletMap",
        "ToggleBgStyle",
        "Toggle",
        "MultiSwitch",
        "Upload",
        "SlimScroll",
        "UploadEx",
        "Table",
        "TBody",
        "THead",
        "TFoot",
        "TCell",
        "Tr",
        "Th",
        "Td",
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
        "DropEdit",
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
        "DropEdit_css",
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
        //"wizard_default_css",
        "tree_default_css",
        "sideNav_css",
        "Kanban",
        "kanban_default_css",
        "yaml",
        "ApiClient",
        "ApiClientGen",
        "OAMethod"
    ]
];
rjs.grequire(dependencies).then(() => {
    window.main();
});