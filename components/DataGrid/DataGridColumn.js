var DataGridColumn = function (_props) {
    let _defaultParams = {
        width: null,
        calculatedWidth: null,
        field: "",
        name: "",
        fieldToFilter: "",
        description: "",
        sortOrder: 0,
        sortDirection: "ASC",//DESC
        sortable: true,
        itemRenderer: {
            ctor: "DataGridCellRenderer",
            props: {
                id: 'cell_',
                label: _props && _props.field && _props.field != "" ? '{' + _props.field + '}' : '',
                href: false,
                target: null
            }
        },
        itemEditor: null,
        editable: false,
        visible: true
    };
    var _props = extend(false, false, _defaultParams, _props);
    this.width = _props.width;
    this.calculatedWidth = _props.calculatedWidth;
    this.field = _props.field;
    this.name = _props.name;
    this.fieldToFilter = _props.fieldToFilter;
    this.description = _props.description;
    this.sortOrder = _props.sortOrder;
    this.sortDirection = _props.sortDirection;//DESC
    this.sortable = _props.sortable;
    this.itemRenderer = _props.itemRenderer;
    this.itemEditor = _props.itemEditor;
    this.editable = _props.editable;
    this.visible = _props.visible;
    let _self = this;

    Object.defineProperty(this, "props", {
        get: function props() {            
            return new Props(_self, _props);
        },
        configurable: true
    });
    Props.call(this, this, _props);
};
DataGridColumn.prototype.ctor = 'DataGridColumn';