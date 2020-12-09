/**
 * This is a HierarchialTree  Element
 *
 * Kreatx 2019
 */

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

    _props = extend(false, false, _defaultParams, _props);
    let r = Tree.call(this, _props);
    return r;
}
HierarchialTree.prototype.ctor = "HierarchialTree";