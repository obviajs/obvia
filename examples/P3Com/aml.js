var flowerCM = window.flowerCM || {};
//base Components
rjs.define("/flowerui/lib/Poolable.js", "Poolable");
rjs.define("/flowerui/lib/EventDispatcher.js", "EventDispatcher");
rjs.define("/flowerui/lib/Literal.js", "Literal");
rjs.define("/flowerui/lib/Timer.js", "Timer");
rjs.define("/flowerui/lib/NumberUtils.js", "NumberUtils");
rjs.define("/flowerui/components/base/EnvType.js", "EnvType");
rjs.define("/flowerui/components/base/Env.js", "Env");
rjs.define("/flowerui/lib/JTemplate.js", "JTemplate");
rjs.define("/flowerui/lib/DataStore.js", "DataStore");
rjs.define("/flowerui/lib/cache/Cache.js", "Cache");
rjs.define("/flowerui/lib/cache/CachedVariable.js", "CachedVariable");
rjs.define("/flowerui/components/Loader.js", "Loader");
rjs.define("/flowerui/lib/ArrayUtils.js", "ArrayUtils");
rjs.define("/flowerui/lib/ArrayEx.js", "ArrayEx");
rjs.define("/flowerui/lib/ObjectUtils.js", "ObjectUtils");
rjs.define("/flowerui/lib/StringUtils.js", "StringUtils");
rjs.define("/flowerui/lib/DecoratorUtils.js", "DecoratorUtils");
rjs.define("/flowerui/lib/coroutine.js", "coroutine");
rjs.define("/flowerui/lib/BinUtils.js", "BinUtils");
rjs.define("/flowerui/lib/CSSUtils.js", "CSSUtils");
rjs.define("/flowerui/lib/BrowserUtils.js", "BrowserUtils");
rjs.define("/flowerui/lib/BrowserManager.js", "BrowserManager");
rjs.define("/flowerui/lib/my.js", "my");
rjs.define("/flowerui/lib/Tokenizer.js", "Tokenizer");
rjs.define("/flowerui/lib/binding/BindingsManager.js", "BindingsManager");
rjs.define("/flowerui/lib/binding/PropertyChangeEvent.js", "PropertyChangeEvent");
rjs.define("/flowerui/lib/binding/ChangeWatcher.js", "ChangeWatcher");
rjs.define("/flowerui/lib/rca/RemoteDataEvent.js", "RemoteDataEvent");
rjs.define("/flowerui/lib/rca/DataField.js", "DataField");
rjs.define("/flowerui/lib/rca/RemoteArray.js", "RemoteArray");
rjs.define("/flowerui/lib/rca/RemoteObject.js", "RemoteObject");
rjs.define("/flowerui/components/base/Align.js", "Align");
rjs.define("/flowerui/components/base/BrowserWindow.js", "BrowserWindow");
rjs.define("/flowerui/components/Repeater/RepeaterEventArgs.js", "RepeaterEventArgs");
rjs.define("/flowerui/components/base/BgStyle.js", "BgStyle");
rjs.define("/flowerui/components/base/History/History.js", "History");
rjs.define("/flowerui/components/base/History/HistoryStep.js", "HistoryStep");
rjs.define("/flowerui/components/base/History/HistoryEventType.js", "HistoryEventType");
rjs.define("/flowerui/components/base/Component.js", "Component");
rjs.define("/flowerui/components/base/Spacing.js", "Spacing");
rjs.define("/flowerui/components/base/AutoObject.js", "AutoObject");
rjs.define("/flowerui/lib/TwoWayMap.js", "TwoWayMap");
rjs.define("/flowerui/components/AutoBrowse.js", "AutoBrowse");
rjs.define("/flowerui/components/DataBrowse.js", "DataBrowse");
rjs.define("/flowerui/components/base/Attr.js", "Attr");
rjs.define("/flowerui/components/base/Css.js", "Css");
rjs.define("/flowerui/components/base/Props.js", "Props");
rjs.define("/flowerui/components/base/Parent.js", "Parent");

rjs.define("/flowerui/components/base/NavParent.js", "NavParent");
rjs.define("/flowerui/components/base/ContainerType.js", "ContainerType");
rjs.define("/flowerui/components/base/ViewStack.js", "ViewStack");
rjs.define("/flowerui/components/base/App.js", "App");
rjs.define("/flowerui/components/base/Applet.js", "Applet");
//TextInput
rjs.define("/flowerui/lib/dependencies/scripts/jquery.inputmask.bundle.min.js", "InputMaskBundle");
rjs.define("/flowerui/components/TextInput/TextInput.js", "TextInput");
rjs.define("/flowerui/components/TextInput/TextInputType.js", "TextInputType");

//Form
rjs.define("/flowerui/components/Form/Form.js", "Form");
rjs.define("/flowerui/components/Form/FormEventType.js", "FormEventType");
rjs.define("/flowerui/components/Form/FormField.js", "FormField");
rjs.define("/flowerui/components/Form/FormFieldSize.js", "FormFieldSize");
rjs.define("/flowerui/components/Form/Hidden.js", "Hidden");
//Button
rjs.define("/flowerui/components/Button/Button.js", "Button");
rjs.define("/flowerui/components/Button/ButtonType.js", "ButtonType");
//Heading
rjs.define("/flowerui/components/HeadingType.js", "HeadingType");
rjs.define("/flowerui/components/Heading.js", "Heading");
//Label
rjs.define("/flowerui/components/LabelType.js", "LabelType");
rjs.define("/flowerui/components/Label.js", "Label");
//HRule
rjs.define("/flowerui/components/HRule.js", "HRule");
// Color Picker
rjs.define("/flowerui/components/Color.js", "Color");
//Container
rjs.define("/flowerui/components/Container.js", "Container");
rjs.define("/flowerui/components/Nav.js", "Nav");
rjs.define("/flowerui/components/Header.js", "Header");
rjs.define("/flowerui/components/Footer.js", "Footer");
rjs.define("/flowerui/components/Section.js", "Section");
//ScrollPane
rjs.define("/flowerui/components/base/ScrollPane.js", "ScrollPane");
//SideNav
rjs.define("/flowerui/components/SideNav/SideNavSide.js", "SideNavSide");
rjs.define("/flowerui/components/SideNav/SideNav.js", "SideNav");
//Tab
rjs.define("/flowerui/components/Tab/TabNavigator.js", "TabNavigator");
rjs.define("/flowerui/components/Tab/Tab.js", "Tab");
//Link
rjs.define("/flowerui/components/Link/LinkTarget.js", "LinkTarget");
rjs.define("/flowerui/components/Link/Link.js", "Link");
//Repeater
rjs.define("/flowerui/components/Repeater/Repeater.js", "Repeater");
rjs.define("/flowerui/components/Repeater/RepeaterEx.js", "RepeaterEx");
//List
rjs.define("/flowerui/components/List.js", "List");
//CheckBox
rjs.define("/flowerui/components/CheckBox.js", "CheckBox");
rjs.define("/flowerui/components/CheckBoxEx.js", "CheckBoxEx");
//CheckBoxGroup
rjs.define("/flowerui/components/CheckBoxGroup.js", "CheckBoxGroup");
//RadioButton
rjs.define("/flowerui/components/RadioButton.js", "RadioButton");
//RadioGroup
rjs.define("/flowerui/components/RadioGroup.js", "RadioGroup");
//Amount
rjs.define("/flowerui/components/Amount.js", "Amount");
//Image
rjs.define("/flowerui/components/Image.js", "Image");
//TextArea
rjs.define("/flowerui/components/TextArea.js", "TextArea");
//TextEditor
rjs.define("/flowerui/components/TextEditor.js", "TextEditor");
rjs.define("/flowerui/lib/dependencies/summernote/summernote.min.js", "SummerNoteScript");
//Select
rjs.define("/flowerui/components/Select/Option.js", "Option");
rjs.define("/flowerui/components/Select/Select.js", "Select");
//Tree
rjs.define("/flowerui/components/Tree/Li.js", "Li");
rjs.define("/flowerui/components/Tree/Tree.js", "Tree");
//HierarchicalTree
rjs.define("/flowerui/components/HierarchialTree/HierarchialTree.js", "HierarchialTree");
//CreditCard
rjs.define('/flowerui/components/CreditCard/CreditCard.js', "CreditCard");
//DateTime
rjs.define("/flowerui/components/DateTime/DateTime.js", "DateTime");

rjs.define("/flowerui/components/DateTime/DateTimeFormat.js", "DateTimeFormat");
rjs.define("/flowerui/lib/dependencies/scripts/moment.js", "MomentJS");
//DateTimeCb
rjs.define("/flowerui/components/DateTime/DateTimeMode.js", "DateTimeMode");
rjs.define("/flowerui/components/DateTime/DateTimeCb.js", "DateTimeCb");
//Modal
rjs.define("/flowerui/components/Modal/ModalSize.js", "ModalSize");
rjs.define("/flowerui/components/Modal/Modal.js", "Modal");
//AutoComplete
rjs.define("/flowerui/components/AutoComplete/AutoCompleteEx.js", "AutoCompleteEx");

rjs.define("/flowerui/components/AutoComplete/TokenRenderer.js", "TokenRenderer");
rjs.define("/flowerui/components/AutoComplete/SuggestionRenderer.js", "SuggestionRenderer");

//Map
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.js", "LeafletJS");
rjs.define("https://unpkg.com/leaflet@1.5.1/dist/leaflet.css", "LeafletCSS");
rjs.define("/flowerui/components/Map/MapLocationPicker.js", "MapLocationPicker");
//Toggle
rjs.define("/flowerui/components/Toggle/ToggleBgStyle.js", "ToggleBgStyle");
rjs.define("/flowerui/components/Toggle/Toggle.js", "Toggle");
//MultiSwitch
rjs.define("/flowerui/components/MultiSwitch.js", "MultiSwitch");
//Upload
rjs.define("/flowerui/lib/dependencies/jquery.slimscroll.js", "SlimScroll");

rjs.define("/flowerui/components/Form/Upload.js", "Upload");
rjs.define("/flowerui/components/UploadEx.js", "UploadEx");
rjs.define("/flowerui/components/MultiUpload.js", "MultiUpload");
//Table
rjs.define("/flowerui/components/Table/Table.js", "Table");
rjs.define("/flowerui/components/Table/TBody.js", "TBody");
rjs.define("/flowerui/components/Table/THead.js", "THead");
rjs.define("/flowerui/components/Table/TFoot.js", "TFoot");
rjs.define("/flowerui/components/Table/TCell.js", "TCell");
rjs.define("/flowerui/components/Table/Tr.js", "Tr");
rjs.define("/flowerui/components/Table/Th.js", "Th");
rjs.define("/flowerui/components/Table/Td.js", "Td");
//DataGrid
rjs.define("/flowerui/components/DataGrid/DataGridCellRenderer.js", "DataGridCellRenderer");
rjs.define("/flowerui/components/DataGrid/DataGridColumn.js", "DataGridColumn");
rjs.define("/flowerui/components/DataGrid/DataGrid.js", "DataGrid");

rjs.define("/flowerui/components/CurrencyExRate/CurrencyExRate.js", "CurrencyExRate");
//Loader

//ProgressBar
rjs.define("/flowerui/components/ProgressBar/ProgressBar.js", "ProgressBar");
rjs.define("/flowerui/components/ProgressBar/ProgressBarStyle.js", "ProgressBarStyle");

//DropDown
rjs.define("/flowerui/components/DropDown/DropDown.js", "DropDown");
rjs.define("/flowerui/components/DropEdit/DropEdit.js", "DropEdit");
rjs.define("/flowerui/components/DropDown/ButtonSize.js", "ButtonSize");
rjs.define("/flowerui/components/DropDown/DropMenuDirection.js", "DropMenuDirection");
rjs.define("/flowerui/components/DropDown/DropSplitType.js", "DropSplitType");
//Calendar
rjs.define("/flowerui/components/Calendar/CalendarBase.js", "CalendarBase");
rjs.define("/flowerui/components/Calendar/Calendar.js", "Calendar");
//CalendarDay
rjs.define("/flowerui/components/Calendar/CalendarDay.js", "CalendarDay");
rjs.define("/flowerui/components/Calendar/CalendarConstants.js", "CalendarConstants");
//CalendarWeek
rjs.define("/flowerui/components/Calendar/CalendarWeek.js", "CalendarWeek");
rjs.define("/flowerui/components/Calendar/CalendarMonth.js", "CalendarMonth");
rjs.define("/flowerui/components/wizard/Wizard.js", "Wizard");
rjs.define("/flowerui/lib/KeyboardUtils.js", "KeyboardUtils");

rjs.define("/flowerui/components/Calendar/css/calendarMonth-default.css", "calendarMonth_default_css");
rjs.define("/flowerui/components/Calendar/css/calendarWeek-default.css", "calendarWeek_default_css");
rjs.define("/flowerui/components/Calendar/css/calendarDay-default.css", "calendarDay_default_css");
rjs.define("/flowerui/components/Calendar/css/calendar-default.css", "calendar_default_css");
rjs.define('/flowerui/components/CreditCard/css/creditCard-default.css', 'creditCard-default_css');
rjs.define("/flowerui/components/Repeater/css/repeater-default.css", "repeater_default_css");
rjs.define("/flowerui/components/DataGrid/css/datagrid-default.css", "datagrid_default_css");
rjs.define("/flowerui/components/Toggle/toggle-default.css", "toggle_default_css");
rjs.define("/flowerui/components/DateTime/css/dateTime_default.css", "DateTime_Default_css");
rjs.define("/flowerui/components/AutoComplete/AutoCompleteEx.css", "AutoCompleteExCSS");
rjs.define("/flowerui/lib/dependencies/summernote/summernote.css", "SummerNoteCSS");
rjs.define("/flowerui/components/base/css/parent-default.css", "parent_default_css");
rjs.define("/flowerui/components/base/css/collapse.css", "collapse_css");
rjs.define("/flowerui/components/HierarchialTree/css/HierarchialTree-default.css", "HierarchialTree_css");
rjs.define("/flowerui/components/SideNav/css/sidenav-default.css", "sidenav_default_css");

rjs.define("/flowerui/components/Validation/ValidationManager.js", "ValidationManager");
rjs.define("/flowerui/components/Validation/Validator.js", "Validator");
rjs.define("/flowerui/components/Validation/RangeValidator.js", "RangeValidator");
rjs.define("/flowerui/components/Validation/RequiredFieldValidator.js", "RequiredFieldValidator");
rjs.define("/flowerui/components/Validation/RegularExpressionValidator.js", "RegularExpressionValidator");
rjs.define("/flowerui/components/Validation/CustomValidator.js", "CustomValidator");
//rjs.define("/flowerui/components/Wizard/css/wizard-default.css", "wizard_default_css");
rjs.define("/flowerui/components/DropEdit/css/DropEdit.css", "DropEdit_css");
rjs.define("/flowerui/components/Tree/css/tree-default.css", "tree_default_css");
rjs.define("/flowerui/components/SideNav/css/sideNav.css", "sideNav_css");

rjs.define("/flowerui/components/kanban/Kanban.js", "Kanban");
rjs.define("/flowerui/components/kanban/css/kanban_default.css", "kanban_default_css");

rjs.define("/flowerui/lib/yaml.js", "yaml");
rjs.define("/flowerui/lib/ApiClientGen/ApiClient.js", "ApiClient");
rjs.define("/flowerui/lib/ApiClientGen/ApiClientGen.js", "ApiClientGen");
rjs.define("/flowerui/lib/ApiClientGen/OAMethod.js", "OAMethod");

rjs.define("/flowerui/lib/LAN/ip_discovery.js", "ip_discovery");
rjs.define("/flowerui/lib/P3Com/Command.js", "Command");
rjs.define("/flowerui/lib/P3Com/CommandType.js", "CommandType");
rjs.define("/flowerui/lib/P3Com/Host.js", "Host");
rjs.define("/flowerui/lib/P3Com/P3Com.js", "P3Com");
rjs.define("/flowerui/lib/P3Com/P3ComEventType.js", "P3ComEventType");
rjs.define("/flowerui/lib/P3Com/P3ComManager.js", "P3ComManager");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/FiscalPrinterEventType.js", "FiscalPrinterEventType");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/FiscalPrinter.js", "FiscalPrinter");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/FiscalPrinterConfig.js", "FiscalPrinterConfig");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/FiscalPrinterProperties.js", "FiscalPrinterProperties");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/FiscalPrinterType.js", "FiscalPrinterType");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/PromoProperties.js", "PromoProperties");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/Invoice.js", "Invoice");
rjs.define("/flowerui/lib/P3Com/FiscalPrinter/InvoiceItem.js", "InvoiceItem");

rjs.define("/flowerui/lib/LocalizationManager.js", "LocalizationManager");
let dependencies = [
    ["EventDispatcher", "Literal",
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
        "OAMethod",
        "LocalizationManager"]
    ],
    [
        "ip_discovery", "Command", "CommandType", "Host", "P3Com", "P3ComEventType", "P3ComManager",
        "FiscalPrinterEventType", "FiscalPrinter", "FiscalPrinterConfig", "FiscalPrinterProperties",
        "FiscalPrinterType", "PromoProperties", "Invoice", "InvoiceItem"
    ]
];
rjs.grequire(dependencies).then(() => {
    window.main();
});