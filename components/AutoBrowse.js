/**
 * This is an AutoBrowse Element
 * 
 * Kreatx 2019
 */

//component definition
var AutoBrowse = function (_props) {
    let _self = this;
    let _dataProvider, _bindingDefaultContext, _valueField, _labelField, _value, _columns = [],
        _fields;

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            if (_dataProvider != v) {
                _dataProvider = v;
                _autocomplete.dataProvider = v;
                _dg.dataProvider = v;
            }

        },
        enumerable: true
    });

    Object.defineProperty(this, "valueField", {
        get: function valueField() {
            return _valueField;
        },
        set: function valueField(v) {
            _autocomplete.valueField = _valueField = v;
        },
        enumerable: true
    });

    Object.defineProperty(this, "labelField", {
        get: function labelField() {
            return _labelField;
        },
        set: function labelField(v) {
            _autocomplete.labelField = _labelField = v;
        },
        enumerable: true
    });

    Object.defineProperty(this, "value", {
        get: function value() {
            return _autocomplete.value;
        },
        set: function value(v) {
            _autocomplete.value = v;
        },
        enumerable: true
    });
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _autocomplete = this.autocomplete;
            _modal = this.children[this.components[2].props.id];
            _dg = _modal.modalDialog.modalContent.modalBody.dataGrid;
        }
    };
    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {

            this.autocomplete.width = this.$el.width() - this.workArea_53.$el.width();
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
    let _cmps, _autocomplete, _dg, _modal;
    var fnContainerDelayInit = function () {
        _cmps = [{
                "ctor": AutoCompleteEx,
                "props": {
                    id: 'autocomplete',
                    valueField: _valueField,
                    labelField: _labelField,
                    allowNewItem: _props.allowNewItem, //allow the user to add items that are not included in the specified dataProvider
                    dataProvider: _dataProvider,
                    bindingDefaultContext: _bindingDefaultContext,
                    value: _value,
                    multiSelect: false,
                    matchType: StringMatchType.STARTS_WITH
                }
            },
            {
                "ctor": "Container",
                "props": {
                    type: ContainerType.NONE,
                    "id": "workArea_53",
                    "components": [{
                        ctor: Button,
                        props: {
                            id: 'selectBtn',
                            type: "button",
                            components: [{
                                ctor: Label,
                                props: {
                                    id: 'fa',
                                    labelType: LabelType.i,
                                    classes: ["fas", "fa-folder-open"]
                                }
                            }],
                            click: _browse
                        }
                    }]
                }
            },
            {
                ctor: Modal,
                props: {
                    id: 'recordSelectModal',
                    size: ModalSize.LARGE,
                    title: 'Select an Item',
                    components: [{
                        ctor: DataGrid,
                        props: {
                            id: 'dataGrid',
                            allowNewItem: _props.allowNewItem, //allow the user to add items that are not included in the specified dataProvider
                            rowCount: 5, //visible rows count - virtual scrolling wil be applied on scroll
                            dataProvider: _dataProvider,
                            columns: _columns,
                            rowDblClick: _selectItem.bind(_self)
                        }
                    }],
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
    let _selectItem = function (e, odg, ra) {
        _autocomplete.value = ra.currentItem;
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
                sortInfo: {
                    sortOrder: 0,
                    sortDirection: "ASC"
                }
            });
        }
    };

    let _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        dataProvider: new ArrayEx(),
        fields: [],
        attr: {
            "data-triggers": "browse"
        },
        value: new ArrayEx([]),
        classes: ["d-inline-flex"],
        valueField: "",
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
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
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
AutoBrowse.prototype.ctor = 'AutoBrowse';