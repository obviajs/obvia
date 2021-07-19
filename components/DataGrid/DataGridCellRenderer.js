/**
 * This is a DataGridCellRenderer Element, the default item renderer for a DataGrid
 * 
 * Kreatx 2018
 */

import { Label } from "/obvia/components/Label.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var DataGridCellRenderer = function(_props){
    //component data
    let r = Label.call(this, _props);
    return r;
};

//component prototype
DataGridCellRenderer.prototype.ctor = 'DataGridCellRenderer';
DependencyContainer.getInstance().register("DataGridCellRenderer", DataGridCellRenderer, DependencyContainer.simpleResolve);
export {
    DataGridCellRenderer
};