/**
 * This is an BrowseData Element
 * 
 * Kreatx 2020
 */

//component definition
var BrowseData = function (_props) {
    let _self = this;
    let _dataProvider,  _columns = [], _fields;

    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if (_dataProvider != v)
            {
                _dataProvider = v;
               _dg.dataProvider = v;
            }
            
        },
        enumerable:true
        });
    
        Object.defineProperty(this, "value", 
        {
            get: function value() 
            {
                return  _textInput.value;
            },
            set: function value(v) 
            {
                _textInput.value = v;
            },
            enumerable:true
            });
      Object.defineProperty(this, "placeholder", 
        {
            get: function placeholder() 
            {
                return  _textInput.placeholder;
            },
            set: function placeholder(v) 
            {
                _textInput.placeholder = v;
            },
            enumerable:true
        });
 
     this.endDraw = function (e) {
         if (e.target.id == this.domID) {
            _textInput = this.textField;
             _modal = this.children[this.components[2].props.id];
             _dg = _modal.modalDialog.modalContent.modalBody.dataGrid;
        }
    };
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
          //is followed the same approach to solve the width case as AutoBrowse but it's not the exact issue
           this.textField.offsetWidth = this.$el.width() - this.workArea_66.$el.width();
        }
    };
    this.beforeAttach = function (e) {
      if (e.target.id == this.domID) {
            if (_props.value) {
                this.value = _props.value;
            }
            e.preventDefault();
        }
    };
    let _cmps,  _dg, _modal;
    var fnContainerDelayInit = function(){
        _cmps = 
        [
           {
                "ctor": "TextInput",
                "props": {
                    value: "",
                    type: "text",
                    autocomplete: "off",
                    components: [],
                    sortChildren: false,
                    id: "textField",
                    index: 0,
                    spacing: {},
                    css: {},
                    visible: true,
                    enabled: true,
                    classes: [],
                    placeholder: "Placeholder"
                }
            },
            {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea_66",
                    "components": [
                        {
                            ctor: Button,
                            props: {
                                id: 'selectBtn',
                                type: "button",
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: 'fa',
                                        labelType: LabelType.i,
                                        classes: ["fas","fa-folder-open"]
                                    }
                                }],
                                click: _browse
                            }
                        }
                    ]
                }
            },
            {
                ctor: Modal,
                props: {
                    id: 'recordSelectModalBrowseData',
                    size: ModalSize.LARGE,
                    title: 'Select an Item',
                    components: [
                            {
                                ctor:DataGrid,
                                props:{
                                id: 'dataGrid',
                                allowNewItem: _props.allowNewItem, //allow the user to add items that are not included in the specified dataProvider
                                rowCount:5, //visible rows count - virtual scrolling wil be applied on scroll
                                dataProvider: _dataProvider,
                                columns: _columns,
                                rowDblClick: _selectItem.bind(_self)
                            }
                        }
                    ],
                    displayListUpdated: _drawGrid
                }
            }
        ];
    };

    var _drawGrid = function (e) {
        _dg.updateDisplayList();
    };

    let _browse = function (e) {
        let evt = jQuery.Event("browse");
        _self.trigger(evt);
        if (!evt.isDefaultPrevented()) {
            _modal.show();
        }
    };
    let _selectItem = function (e, ra) {
        console.log(e, "this is the event");
        _textInput.value = ra.currentItem
       _modal.hide();
    };
    let _initColumns = function () {
        for (let i = 0; i < _fields.length; i++) {
            _columns.push({
                width: 400,
                field: _fields[i].field,
                description: _fields[i].description,
                visible: _fields[i].visible ? _fields[i].visible : true,
                sortable: true,
                sortInfo: { sortOrder: 0, sortDirection: "ASC" }
            });
        }
    };

    let _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        dataProvider: new ArrayEx(),
        fields:[],
        attr:{"data-triggers":"browse"},   
        value:new ArrayEx([]),
        classes:["d-inline-flex"],
        allowNewItem: false
    };

    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) { 
        _props.attr = {};
    }
    if (!_props.classes) { 
        _props.classes = ["d-flex"];
    } else
        _props.classes.pushUnique("d-flex");

    let myDtEvts = ["browse"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {   
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    
    if (_props.dataProvider && !getBindingExp(_props.dataProvider)) {
        _dataProvider = _props.dataProvider;
    }
    if (_props.bindingDefaultContext) { 
        _bindingDefaultContext = _props.bindingDefaultContext;
    }
    _valueField = _props.valueField;
    _labelField = _props.labelField;
    _value = _props.value;
    _fields = _props.fields;
    _initColumns();
    fnContainerDelayInit();
    _props.components = _cmps;
    
    Container.call(this, _props, true);
};
BrowseData.prototype.ctor = 'BrowseData';