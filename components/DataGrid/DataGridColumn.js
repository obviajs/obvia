var DataGridColumn = function()
{
    this.dataField = "";
    this.dataFieldToFilter = "";   
	this.headerText = "";
	this.sortOrder = 0;
    this.sortDirection = "ASC";//DESC
    this.sortable = true;
    this.itemRenderer = null;
    this.itemEditor = null;
    this.cellStyleFunction = null;
}