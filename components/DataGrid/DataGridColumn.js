var DataGridColumn = function(_props)
{
    var _defaultParams = {
        width:null,
        calculatedWidth:null,
        field: "",
        fieldToFilter: "",   
        description: "",
        sortOrder: 0,
        sortDirection: "ASC",//DESC
        sortable: true,
        itemRenderer: {
            ctor: "DataGridCellRenderer",
            props: {
                id: 'cell_',
                label: _props && _props.field && _props.field!=""?'{'+_props.field+'}':'',
                href: false,
                target:null
            }
        },
        itemEditor: null,
        editable: false,
        oncellstyling: null,
        oncelleditfinished: null
    };
    var _props = extend(false, false, _defaultParams, _props);
    this.width = _props.width;
    this.calculatedWidth = _props.calculatedWidth;
    this.field = _props.field;
    this.fieldToFilter = _props.fieldToFilter;   
	this.description = _props.description;
	this.sortOrder = _props.sortOrder;
    this.sortDirection = _props.sortDirection;//DESC
    this.sortable = _props.sortable;
    this.itemRenderer = _props.itemRenderer;
    this.itemEditor = _props.itemEditor;
    this.editable = _props.editable;
    this.oncellstyling = _props.oncellstyling;
    this.oncelleditfinished = _props.oncelleditfinished;

    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props){
                if(this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop) && (typeof _props[prop] != 'function') && (prop != "ownerDocument"))
                    obj[prop] = this[prop];
            }
            return obj;
        },
        configurable: true
    });  
}