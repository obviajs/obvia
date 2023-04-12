/**
 * This is a DataGridCellRenderer Element, the default item renderer for a DataGrid
 * 
 * 
 */

import { Label } from "/obvia/components/Label.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var DataGridCellRenderer = function (_props)
{
    //component data
    let r = Label.call(this, _props);
    return r;
};

//component prototype
DataGridCellRenderer.prototype.ctor = 'DataGridCellRenderer';
DependencyContainer.getInstance().register("DataGridCellRenderer", DataGridCellRenderer, DependencyContainer.simpleResolve);
export
{
    DataGridCellRenderer
};