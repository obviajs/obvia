import { Container } from "/obvia/components/Container.js";
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { Button } from "/obvia/components/Button/Button.js";
import { Label, LabelType } from "/obvia/components/Label.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var RepeaterEx = function (_props) {
    let _self = this;
    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _repeater.dataProvider;
        },
        set: function dataProvider(v) {
            if (_dpWatcher && _repeater.dataProvider) {
                _dpWatcher.reset();
            }
            _repeater.dataProvider = v;
            if (v) {
                _dpWatcher = ChangeWatcher.getInstance(_repeater.dataProvider);
                _dpWatcher.watch(_repeater.dataProvider, "length", _dpLengthChanged);
            }

        },
        enumerable: true
    });
    let _dpLengthChanged = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.newValue <= 1) {
            _removeButton.enabled = false;
        } else
            _removeButton.enabled = true;

    };
    let _repeater, _removeButton, _addButton, _dpWatcher;
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _repeater = this.children[this.components[0].props.id];
            if (_repeater.dataProvider) {
                _dpWatcher = ChangeWatcher.getInstance(_repeater.dataProvider);
                _dpWatcher.watch(_repeater.dataProvider, "length", _dpLengthChanged);
            }
            _removeButton = this.children[this.components[1].props.id].children[this.components[1].props.components[0].props.id];
            _addButton = this.children[this.components[1].props.id].children[this.components[1].props.components[1].props.id];
        }
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            e.preventDefault();
        }
    };

    let fnContainerDelayInit = function () {
        return [{
                ctor: Repeater,
                props: _propsRepeater
            },
            {
                "ctor": "Container",
                "props": {
                    type: "",
                    "id": "buttonContainer",
                    "components": [{
                            ctor: Button,
                            props: {
                                id: 'removeButton',
                                type: "button",
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: 'fa',
                                        labelType: LabelType.i,
                                        classes: ["fas", "fa-minus-circle"]
                                    }
                                }],
                                click: _remove,
                                enabled: _props.dataProvider.length > 1 ? true : false
                            }
                        },
                        {
                            ctor: Button,
                            props: {
                                id: 'addButton',
                                type: "button",
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: 'fa',
                                        labelType: LabelType.i,
                                        classes: ["fas", "fa-plus-circle"]
                                    }
                                }],
                                click: _add
                            }
                        }
                    ]
                }
            }
        ];
    };
    let _remove = function (e) {
        _props.dataProvider.splice(_props.dataProvider.length - 1, 1);
    };

    let _add = function (e) {
        _self.addRow();
    };

    this.addRow = function () {
        _props.dataProvider.splice(_props.dataProvider.length, 0, _props.dataProvider.length > 0 ? buildDefaultObject(_props.dataProvider[0]) : {});
    };

    let _defaultParams = {
        type: "",
        rendering: {
            direction: 'vertical',
            separator: true,
            actions: {
                remove: true,
                add: true
            }
        },
        dataProvider: new ArrayEx([]),
        guidField: "guid"
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);

    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["rowAdd", "rowEdit", "beforeRowAdd", "rowDelete", "beforeRowDelete", "dataProviderUpdate"];
    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    let _dataProvider;
    let _rendering = _props.rendering;
    let _enabled = _props.enabled;
    let _guidField = _props.guidField;
    let _components = _props.components ? _props.components.slice(0) : new ArrayEx();
    let _propsRepeater = {
        "dataProvider": _props.dataProvider,
        "rendering": _props.rendering,
        "id": "internalRepeater",
        "components": _components
    };
    //avoid circular reference, by shallow copying, and later adding components to _props
    _propsRepeater.minHeight = 40;    
    _props.components = fnContainerDelayInit();;

    let r = Container.call(this, _props);
    return r;
};
RepeaterEx.prototype.ctor = 'RepeaterEx';
DependencyContainer.getInstance().register("RepeaterEx", RepeaterEx, DependencyContainer.simpleResolve);
export {
    RepeaterEx
};