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
        liClasses: ["tree-li"],
        liClassesField: 'liClasses',
        classes: ["tree"],
        labelClasses: ["tree-li-a"],
        ulClasses: ["tree-ul"],
        ulClassesField: 'ulClasses',
        selectedClasses: ["li-none"],
        selectedClassesField: 'classes',
        expandIcon: '',
        collapseIcon: ''
    };

    _props = extend(false, false, _defaultParams, _props);
    let _dataProvider = _props.dataProvider;
    let _selectedClassesField = _props.selectedClassesField;
    let _childrenField = _props.childrenField;
    let _liClasses = _props.liClasses;
    let _ulClasses = _props.ulClasses;
    let _ulClassesField = _props.ulClassesField;
    let _liClassesField = _props.liClassesField;

    let _assignClasses = function (dp) {
        for (let i = 0; i < dp.length; i++) {
            if (!dp[i][_liClassesField]) {
                if (dp[i][_childrenField] && dp[i][_childrenField].length > 0) {
                    dp[i][_ulClassesField] = _ulClasses;
                    _assignClasses(dp[i][_childrenField]);
                } else {
                    dp[i][_liClassesField] = _liClasses;
                }
            }
        }
    }
    _assignClasses(_dataProvider);
    let r = Tree.call(this, _props);
    return r;
}
HierarchialTree.prototype.ctor = "HierarchialTree";