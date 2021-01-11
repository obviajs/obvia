Builder.initComponentLiterals = function () {
    Builder.components = {
        "Modal": {
            literal: {
                ctor: Modal,
                props: {
                    id: 'modal',
                    size: ModalSize.LARGE,
                    title: 'Motal Title',
                }
            }
        },
        "FormField": {
            literal: {
                ctor: FormField,
                props: {
                    id: 'formField',
                    label: 'Label',
                    placeholder: 'Placeholder',
                    name: 'formField',
                    size: FormFieldSize.SMALL,
                    //spacing:{colSpan:2},
                    component: {}
                }
            },
            label: "Form Field",
            icon: ".png"
        },
        "Label": {
            literal: {
                "ctor": Label,
                "props": {
                    id: 'label',
                    label: "",
                }
            },
            label: "Label",
            icon: ".png"
        },
        "JRLabel": {
            literal: {
                "ctor": JRLabel,
                "props": {
                    id: 'jrlabel',
                    label: "",
                }
            },
            label: "JRLabel",
            icon: ".png"
        },
        "JRBand": {
            literal: {
                ctor: JRBand,
                props: {
                    id: 'jrband',
                    type: ContainerType.ROW,
                    classes: ["default-component","band"]
                }
            },
            label: "JRBand",
            icon: ".png"
        },
        "JRTextInput": {
            literal: {
                ctor: JRTextInput,
                props: {
                    id: 'jrtextinput',
                }
            },
            set: null,
            get: null,
            valueField: null,
            label: "JRTextInput",
            icon: "horizontal-line.png"
        },
        "JRHRule": {
            literal: {
                "ctor": JRHRule,
                "props": {
                    id: 'jrhrule',
                    align: "center",
                    size: 5,
                    width: 1000,
                }
            },
            label: "JRHRule",
            icon: ".png"
        },
        "Heading": {
            literal: {
                "ctor": Heading,
                "props": {
                    id: 'heading',
                    label: 'Heading',
                    headingType: HeadingType.h1,
                    align: Align.left,
                    classes: [],
                    components: []
                }
            },
            label: "Heading",
            icon: ".png"
        },
        "Link": {
            literal: {
                "ctor": Link,
                "props": {
                    id: 'label',
                    label: "Click Me",
                    href: "#",
                    target: ""
                }
            },
            label: "Link",
            icon: ".png"
        },
        "HRule": {
            literal: {
                "ctor": HRule,
                "props": {
                    id: 'hrule',
                    align: "center",
                    size: 5,
                    width: 1000,
                }
            },
            label: "HRule",
            icon: ".png"
        },
        "Color": {
            literal: {
                "ctor": Color,
                "props": {
                    id: 'color',
                    width: 45
                }
            },
            label: "Color",
            icon: ".png"
        },
        "Button": {
            literal: {
                "ctor": Button,
                "props": {
                    id: 'button',
                    type: "button",
                    value: "",
                    label: "Click Me",
                    classes: ["btn"]
                }
            },
            label: "Button",
            icon: ".png"
        },
        "TextInput": {
            literal: {
                "ctor": TextInput,
                "props": {
                    id: 'textField'
                }
            },
            set: null,
            get: null,
            valueField: null,
            label: "Text Input",
            icon: "horizontal-line.png"
        },
        "TextArea": {
            literal: {
                "ctor": TextArea,
                "props": {
                    id: 'textarea',
                    value: ''
                }
            },
            label: "TextArea",
            icon: "horizontal-line.png"
        },
        "DateTime": {
            literal: {
                "ctor": DateTime,
                "props": {
                    id: 'datetime',
                    inputFormat: 'DD/MM/YYYY',
                    outputFormat: 'DD-MM-YYYY',
                    displayFormat: 'MM/DD/YYYY',
                    value: String(new Date().getDate()).padStart(2, '0') + '/' + String(new Date().getMonth() + 1).padStart(2, '0') + '/' + new Date().getFullYear()
                }
            },
            label: "DateTime",
            icon: ".png"
        },
        "DateTimeCb": {
            literal: {
                "ctor": DateTimeCb,
                props: {
                    id: 'dateTimeCb',
                    mode: DateTimeMode.DATE_TIME_SECOND,
                    versionStyle: '',
                    inputFormat: 'DD/MM/YYYY',
                    outputFormat: 'DD-MM-YYYY',
                    value: '06/06/2019',
                    classes: ["ml-0"]
                }
            },
            label: "DateTimeSel",
            icon: ".png"
        },
        "Image": {
            literal: {
                "ctor": Image,
                "props": {
                    id: 'image',
                    src: 'https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781451648539_9781451648539_hr.jpg',
                    alt: "Steve Jobs",
                    height: 100,
                    width: 100
                }
            },
            label: "Image",
            icon: ".png"
        },
        "JRImage": {
            literal: {
                "ctor": JRImage,
                "props": {
                    id: 'jrimage',
                    src: 'https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781451648539_9781451648539_hr.jpg',
                    alt: "Steve Jobs",
                    height: 100,
                    width: 100
                }
            },
            label: "JRImage",
            icon: ".png"
        },
        "Select": {
            literal: {
                "ctor": Select,
                "props": {
                    id: 'select',
                    labelField: "text",
                    valueField: "value",
                    value: "2"
                }
            },
            label: "Image",
            icon: ".png"
        },
        "DropDown": {
            literal: {
                "ctor": DropDown,
                "props": {
                    id: 'dropdown',
                    hrefField: "key",
                    labelField: "title",
                    label: "Click me",
                    dataProvider: new ArrayEx([{
                            key: "#",
                            title: "Folder 1"
                        },
                        {
                            key: "#",
                            title: "Folder 2"
                        },
                        {
                            key: "#",
                            title: "Folder 3"
                        }
                    ])
                }
            },
            label: "DropDown",
            icon: ".png"
        },
        "Amount": {
            literal: {
                "ctor": Amount,
                "props": {
                    id: 'amount',
                    currencyList: [{
                        "id": "1",
                        "text": "EUR"
                    }, {
                        "id": "2",
                        "text": "ALL"
                    }, {
                        "id": "3",
                        "text": "GBP"
                    }],
                    value: {
                        "amount": "132323",
                        "currency": "2"
                    }
                }
            },
            label: "Amount",
            icon: ".png"
        },
        "Tree": {
            literal: {
                "ctor": Tree,
                "props": {
                    id: 'tree',
                    valueField: "key",
                    labelField: "title",
                    childrenField: "children",
                    dataProvider: new ArrayEx([{
                            title: "Node 1",
                            key: "1"
                        },
                        {
                            title: "Folder 2",
                            key: "2",
                            children: new ArrayEx([{
                                    title: "Node 2.1",
                                    key: "3",
                                    myOwnAttr: "abc"
                                },
                                {
                                    title: "Node 2.2",
                                    key: "4"
                                }
                            ])
                        }
                    ]),
                    expandIcon: "fa-chevron-circle-right",
                    collapseIcon: "fa-chevron-circle-down",
                }
            },
            label: "Tree",
            icon: ".png"
        },
        "AutoCompleteEx": {
            literal: {
                "ctor": AutoCompleteEx,
                "props": {
                    id: 'AutoCompleteEx',
                    allowNewItem: false,
                    value: new ArrayEx([]),
                    dataProvider: new ArrayEx([]),
                    multiSelect: false,
                    matchType: StringMatchType.STARTS_WITH
                }
            },
            set: null,
            get: null,
            valueField: null,
            label: "AutoComplete",
            icon: ".png"
        },
        "AutoBrowse": {
            literal: {
                "ctor": AutoBrowse,
                "props": {
                    id: "AutoBrowse",
                    labelField: Builder.providerLabelField,
                    valueField: Builder.providerValueField,
                    dataProvider: Builder.sources,
                    classes: ["ml-0"],
                    fields: [{
                        "field": Builder.providerValueField,
                        "description": Builder.providerValueField,
                        "visible": false
                    }, {
                        "field": Builder.providerLabelField,
                        "description": Builder.providerLabelField
                    }]
                }
            },
            //valueField: "dataProvider",
            label: "AutoBrowse",
            icon: ".png"
        },
        "RadioGroup": {
            literal: {
                "ctor": RadioGroup,
                "props": {
                    id: 'radiogroup',
                    dataProvider: [{
                            "id": "1",
                            "text": "Option 1",
                            "enabled": true,
                            "buttonClass": []
                        },
                        {
                            "id": "2",
                            "text": "Option 2",
                            "enabled": true,
                            "buttonClass": []
                        },
                        {
                            "id": "3",
                            "text": "Option 3",
                            "enabled": false,
                            "buttonClass": []
                        }
                    ],
                    valueField: 'id',
                    labelField: 'text',
                    classesField: "buttonClass",
                    defaultClasses: ['btn btn-xs btn-default'],
                    selectedClasses: ['btn btn-xs btn-success'],
                    enabledField: "enabled",
                    checkedField: "checked",
                    value: [{
                        "id": "2",
                        "text": "Option 2",
                        "enabled": true
                    }]
                }
            },
            label: "RadioGroup",
            icon: ".png"
        },
        "CheckBox": {
            literal: {
                "ctor": CheckBox,
                "props": {
                    id: 'checkBoxField',
                    label: 'CheckBox Label',
                    value: "1",
                    checked: false
                }
            },
            label: "CheckBox",
            icon: ".png"
        },
        "Toggle": {
            literal: {
                "ctor": Toggle,
                "props": {
                    id: 'toggle',
                    value: true,
                    checked: false,
                    classes: {
                        "self": ["switch", "block"],
                        "span": ["slider"]
                    }
                }
            },
            set: null,
            get: null,
            valueField: "checked",
            label: "Toogle",
            icon: ".png"
        },
        "CheckBoxGroup": {
            literal: {
                "ctor": CheckBoxGroup,
                "props": {
                    id: 'checkBoxGroup',
                    dataProvider: [{
                            "id": "1",
                            "text": "Option 1",
                            "buttonClass": ['btn btn-xs btn-default'],
                            "enabled": true,
                            "checked": false
                        },
                        {
                            "id": "2",
                            "text": "Option 2",
                            "buttonClass": ['btn btn-xs btn-default'],
                            "enabled": true,
                            "checked": false
                        },
                        {
                            "id": "3",
                            "text": "Option 3",
                            "buttonClass": ['btn btn-xs btn-success'],
                            "enabled": true,
                            "checked": true
                        },
                        {
                            "id": "4",
                            "text": "Option 4",
                            "buttonClass": ['btn btn-xs btn-default'],
                            "enabled": true,
                            "checked": false
                        }
                    ],
                    valueField: "id",
                    labelField: "text",
                    classesField: "buttonClass",
                    defaultClasses: ['btn btn-xs btn-default'],
                    selectedClasses: ['btn btn-xs btn-success'],
                    enabledField: "enabled",
                    checkedField: "checked",
                    value: [{
                        "id": "3",
                        "text": "Option 3",
                        "buttonClass": ['btn btn-xs btn-success'],
                        "enabled": true
                    }]
                }
            },
            label: "CheckBoxGroup",
            icon: ".png"
        },
        "Form": {
            literal: {
                "ctor": Form,
                "props": {
                    id: 'form',
                    formName: 'My Form',
                    action: "",
                    components: [],
                    classes: ["default-cnt"]
                }
            },
            label: "Form",
            icon: ".png"
        },
        "Header": {
            literal: {
                ctor: Header,
                props: {
                    id: 'header'
                }
            },
            label: "Header",
            icon: ".png"
        },
        "Footer": {
            literal: {
                ctor: Footer,
                props: {
                    id: 'footer'
                }
            },
            label: "Footer",
            icon: ".png"
        },
        "SideNav": {
            literal: {
                ctor: SideNav,
                props: {
                    id: 'sideNav',
                    classes: ["sidenav"]
                }
            },
            label: "SideNav",
            icon: ".png"
        },
        "Container": {
            literal: {
                ctor: Container,
                props: {
                    id: 'container',
                    type: ContainerType.NONE,
                    classes: ["default-component", "default-cnt"]
                }
            },
            label: "Container",
            icon: ".png"
        },
        "JRContainer": {
            literal: {
                ctor: JRContainer,
                props: {
                    id: 'jrcontainer',
                    type: ContainerType.NONE,
                    classes: ["default-component", "default-cnt"]
                }
            },
            label: "JRContainer",
            icon: ".png"
        },
        "ViewStack": {
            literal: {
                ctor: ViewStack,
                props: {
                    id: 'viewStack',
                    classes: ["default-component", "default-cnt"]
                }
            },
            label: "ViewStack",
            icon: ".png"
        },
        "UploadEx": {
            literal: {
                ctor: UploadEx,
                props: {
                    id: 'upload',
                    multiple: true
                }
            },
            label: "UploadEx",
            icon: ".png"
        },
        "MultiUpload": {
            literal: {
                ctor: MultiUpload,
                props: {
                    id: 'multiUpload',
                }
            },
            label: "MultiUpload",
            icon: ".png"
        },
        "MapLocationPicker": {
            literal: {
                ctor: MapLocationPicker,
                props: {
                    id: 'map',
                    value: {
                        latitude: 41.1533,
                        longitude: 20.1683
                    },
                    zoomLevel: 7
                }
            },
            label: "MapLocationPicker",
            icon: ".png"
        },
        "Repeater": {
            literal: {
                ctor: Repeater,
                props: {
                    id: 'repeater',
                }
            },
            label: "Repeater",
            icon: ".png"
        },
        "RepeaterEx": {
            literal: {
                ctor: RepeaterEx,
                props: {
                    id: 'repeater',
                }
            },
            label: "RepeaterEx",
            icon: ".png"
        },
        "List": {
            literal: {
                ctor: List,
                props: {
                    id: 'list',
                    multiselect: true,
                    dataProvider: new ArrayEx([{
                            "id": "1",
                            "text": "Option 1",
                            "buttonClass": ["btn-default"]
                        },
                        {
                            "id": "2",
                            "text": "Option 2",
                            "buttonClass": ["btn-default"]
                        },
                        {
                            "id": "3",
                            "text": "Option 3",
                            "buttonClass": ["btn-default"]
                        },
                        {
                            "id": "4",
                            "text": "Option 4",
                            "buttonClass": ["btn-default"]
                        }
                    ]),
                    valueField: "id",
                    classesField: "buttonClass",
                    defaultClasses: ["btn-default"],
                    selectedClasses: ["btn-success"],
                    value: [{
                        "id": "1"
                    }],
                    components: [{
                        ctor: Button,
                        props: {
                            id: 'button',
                            type: "button",
                            value: "{id}",
                            label: "{text}",
                            classes: "{buttonClass}"
                        }
                    }]
                }
            },
            label: "List",
            icon: ".png"
        },
        "DataGrid": {
            literal: {
                ctor: DataGrid,
                props: {
                    id: 'dataGrid',
                    columns: new ArrayEx([])
                }
            },
            label: "DataGrid",
            icon: ".png"
        },
        "CalendarDay": {
            literal: {
                ctor: CalendarDay,
                props: {
                    id: 'calendarDay',
                }
            },
            label: "CalendarDay",
            icon: ".png"
        },
        "CalendarWeek": {
            literal: {
                ctor: CalendarWeek,
                props: {
                    id: 'calendarWeek',
                }
            },
            label: "CalendarWeek",
            icon: ".png"
        },
        "SpacingEditor": {
            literal: {
                "ctor": SpacingEditor,
                "props": {}
            },
            valueField: null,
            label: "SpacingEditor",
            icon: ".png"
        },
        "CollectionEditor": {
            literal: {
                "ctor": CollectionEditor,
                "props": {}
            },
            valueField: null,
            label: "CollectionEditor",
            icon: ".png"
        },
        "ObjectEditor": {
            literal: {
                "ctor": ObjectEditor,
                "props": {}
            },
            valueField: null,
            label: "ObjectEditor",
            icon: ".png"
        },
        "BrowserWindow": {
            literal: {
                ctor: BrowserWindow,
                props: {
                    id: "window"
                }
            },
            label: "BrowserWindow",
            icon: ".png"
        },
        "DataGridCellRenderer": {
            literal: {
                "ctor": DataGridCellRenderer,
                "props": {
                    id: 'label',
                    label: "Click Me"
                }
            },
            label: "DataGridCellRenderer",
            icon: ".png"
        },
        "CreditCard": {
            literal: {
                "ctor": CreditCard,
                "props": {
                    id: "creditCard"
                }
            }
        },
        "Wizard": {
            literal: {
                "ctor": Wizard,
                "props": {
                    id: "wizard",
                    stepPath: "attr.step",
                    detailsPath: "attr.details",
                    components: []
                }
            }
        }
    };
};