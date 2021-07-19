
import { Label } from "/obvia/components/Label.js";
import { Props } from "/obvia/components/base/Props.js";
import { TwoWayMap } from "/obvia/lib/TwoWayMap.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { Th } from "../Table/Th.js";
import { DataGridCellRenderer } from "./DataGridCellRenderer.js";

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
        sortable: false,
        itemRenderer: {
            ctor: DataGridCellRenderer,
            props: {
                id: 'cell_',
                label: _props && _props.field && _props.field != "" ? '{' + _props.field + '}' : ''
            }
        },
        headerRenderer: {
            ctor: Th,
            props: {
                id: 'header_',
                label: _props.description,
                components: [
                    {
                        "ctor": Label,
                        props: {
                            id: "sortSpan",
                            display: _props.sortable == true,
                            labelType: "span",
                            classes: ["fa", "fa-caret-" + DataGridColumn.sortDirFADic[_props.sortDirection ? _props.sortDirection.toLowerCase() : "asc"]]
                        }
                    }
                ]
            }
        },
        itemEditor: null,
        editable: false,
        visible: true
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //var _props = ObjectUtils.extend(false, false, _defaultParams, _props);
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
    this.headerRenderer = _props.headerRenderer;
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
DataGridColumn.sortDirFADic = {
    "asc": "up",
    "desc": "down"
};
DataGridColumn.twMap = new TwoWayMap({
    "asc": "desc"
});
export {
    DataGridColumn
};