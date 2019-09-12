var DataGridColumn = function(p)
{
    var _defaultParams = {
        field: "",
        fieldToFilter: "",   
        description: "",
        sortOrder: 0,
        sortDirection: "ASC",//DESC
        sortable: true,
        itemRenderer: {
            constructor: DataGridCellRenderer,
            props: {
                id: 'cell_',
                label: '{'+p.field+'}',
                href: false,
                target:null
            }
        },
        itemEditor: null,
        editable: false,
        oncellstyling: null,
        oncelleditfinished: null
    };
    var props = extend(false, false, [],[],["itemRenderer", "itemEditor"], _defaultParams, p);
    this.width = props["width"];
    this.calculatedWidth = undefined;
    this.field = props.field;
    this.fieldToFilter = props.fieldToFilter;   
	this.description = props.description;
	this.sortOrder = props.sortOrder;
    this.sortDirection = props.sortDirection;//DESC
    this.sortable = props.sortable;
    this.itemRenderer = props.itemRenderer;
    this.itemEditor = props.itemEditor;
    this.editable = props.editable;
    this.oncellstyling = props.oncellstyling;
    this.oncelleditfinished = props.oncelleditfinished;
}