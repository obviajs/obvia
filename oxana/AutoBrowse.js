/**
 * This is an AutoBrowse Definition Element
 * 
 * Kreatx 2019
 */

//component definition
var AutoBrowse = function (_props, overrided = false) {
    var _self = this;
    let _dataProvider, _valueField, _labelField, _value, _columns = [], _fields;

    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dataProvider != v)
            {
                _dataProvider = v;
            }
        },
        enumerable:true
    });

    Object.defineProperty(this, "value", 
    {
        get: function value() 
        {
            return _autocomplete.value;
        },
        set: function value(v) 
        {
            _autocomplete.value = v;
        },
        enumerable:true
    });

    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            for(let i=0;i<_fields.length;i++)
            {
                _columns.push({
                    width:400,
                    field: _fields[i].field,
                    description: _fields[i].description,
                    visible: _fields[i].visible?_fields[i].visible:true,
                    sortable: true,
                    sortInfo: {sortOrder:0, sortDirection:"ASC"}
                });
            };
            if(_props.dataProvider){
                this.dataProvider = _props.dataProvider;
            }
            this.$container = this.$el;
            fnContainerDelayInit();
            this.components = _cmps;
            this.addComponents();
            _autocomplete = this.children[this.components[0].props.id].children[this.components[0].props.components[0].props.id];
            _modal = this.children[this.components[2].props.id];
            _dg = _modal.modalDialog.modalContent.modalBody.dataGrid;
            if(_props.value){
                this.value = _props.value;
            }
            e.preventDefault();
        }
    }
    let _cmps, _autocomplete, _dg, _modal;
    var fnContainerDelayInit = function(){
        _cmps = 
        [
            {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea",
                    "components": [
                        {
                            "ctor": AutoCompleteEx,
                            "props":{
                                id: 'autocomplete',
                                valueField: _valueField,
                                labelField: _labelField,
                                allowNewItem: false, //allow the user to add items that are not included in the specified dataProvider
                                dataProvider: _dataProvider,
                                value: _value,
                                multiSelect: false,
                                matchType:StringMatchType.STARTS_WITH
                            }
                        }
                    ]
                }
            },
            {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea_53",
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
                    id: 'recordSelectModal',
                    size: ModalSize.LARGE,
                    title: 'Select an Item',
                    components: [
                            {
                                ctor:DataGrid,
                                props:{
                                id: 'dataGrid',
                                allowNewItem: true, //allow the user to add items that are not included in the specified dataProvider
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

    var _drawGrid = function(e){
        _dg.updateDisplayList();
    }

    var _browse = function(e){
        let evt = jQuery.Event("browse");
        _self.trigger(evt);
        if (!evt.isDefaultPrevented()) {
            _modal.show();
        }
    }
    var _selectItem = function(e, odg, ra){
        _autocomplete.value = ra.currentItem;
        _modal.hide();
    }
    var _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        dataProvider: new ArrayEx(),
        fields:[],
        attr:{"data-triggers":"browse"},   
        value:new ArrayEx([]),
        classes:["wrap"]                           
    };

    _props = extend(false, false, _defaultParams, _props);
    _valueField = _props.valueField;
    _labelField = _props.labelField;
    _value = _props.value;
    _fields = _props.fields;
    Container.call(this, _props);
};
AutoBrowse.prototype.ctor = 'AutoBrowse';