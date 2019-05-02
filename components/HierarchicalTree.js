/**
 * This is a Hierarchical Tree  Element
 *
 * Kreatx 2019
 */

//component definition
var HierarchicalTree = function (_props, overrided = false) {
//inner component data

    this.beforeAttach = function () {
        this.treeInstance = null;
    };

    this.afterAttach = function (e) {
        var config = {};
        var parentNodes = {
            id_node: "0"
        };

        if (_lazy) {
            config = {
                expandIcon: _expandIcon,
                collapseIcon: _collapseIcon,
                levels: 1,

                dataUrl: {
                    url: _dataProvider,
                    method: "POST",
                    data: parentNodes
                },
                lazyLoad: function (node, display) {
                    $.ajax({
                        url: _dataProvider,
                        cache: false,
                        dataType: "json",
                        method: "POST",
                        data: {
                            id_node: node.nodeId
                        },
                        success: function (data) {
                            display(data);
                        },
                        error: function (xhr, status, error) {
                            console.log("Error fetching tree nodes:");
                            console.log("Xhr: " + xhr + " Status: " + status + " Error: " + error)
                        }
                    });
                },
            }
        } else {
            config = {
                data: _dataProvider,
                expandIcon: _expandIcon,
                collapseIcon: _collapseIcon
            }
        }

        this.treeInstance = this.$el.treeview(config);
    };

    this.getSelectedNode = function (idOnly = true) {
        var node = this.$el.treeview("getSelected");
        return (node.length != 0) ? (idOnly ? node[0].nodeId : node[0]) : 0;
    };

    this.getNodeByKey = function (key) {
        return this.$el.treeview("findNodes", [key, "nodeId"]);
    };

    this.expandNode = function (node) {
        this.$el.treeview('expandNode', [node]);
    };

    this.template = function () {
        return "<div data-triggers='click' id='" + this.domID + "'>" + "</div>";
    };

    var _defaultParams = {
        lazy: false,
        dataProvider: null,
        afterAttach: this.afterAttach,
        expandIcon: 'fas fa-chevron-circle-right',
        collapseIcon: 'fas fa-chevron-circle-down',
        loadingIcon: 'fas fa-spinner'
    };
    _props = extend(false, false, _defaultParams, _props);

    var _lazy = _props.lazy;
    var _dataProvider = _props.dataProvider;
    var _expandIcon = _props.expandIcon;
    var _collapseIcon = _props.collapseIcon;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }

};

//component prototype
HierarchicalTree.prototype.ctor = 'HierarchicalTree';