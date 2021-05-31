/**
 * This is a HierarchialTree  Element
 *
 * Kreatx 2019
 */

import { Tree } from "/obvia/components/Tree/Tree.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var HierarchialTree = function (_props) {
    var _self = this;


    var _defaultParams = {
        dataProvider: new ArrayEx(),
        type: ContainerType.NONE,
        valueField: "key",
        labelField: "title",
        childrenField: "children",
        liClasses: [],
        classes: ["tree"],
        ulClasses: [],
        selectedClasses: [],
        expandIcon: '',
        collapseIcon: ''
    };

    _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    let r = Tree.call(this, _props);
    return r;
}
HierarchialTree.prototype.ctor = "HierarchialTree";
export {
    HierarchialTree
};