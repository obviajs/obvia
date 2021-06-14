/**
 * This is a DataGridCellRenderer Element, the default item renderer for a DataGrid
 * 
 * Kreatx 2018
 */

import { Label } from "/flowerui/components/Label.js";
import { DependencyContainer } from "/flowerui/lib/DependencyContainer.js";
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