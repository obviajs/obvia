/**
 * This is a CollectionEditor Definition Element
 * 
 * Kreatx 2018
 */

import {Container} from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var CollectionEditor = function (_props) {
    let _self = this;
    let _instance, _field, _memberType, _repeater, _itemLabel;

    Object.defineProperty(this, "dataProvider",
    {
        get: function dataProvider() {
            return _field != null && _field != "" ? _instance[_field] : _instance;
        },
        enumerable:true
    });

    this.initMembers = function () {
        let c = _field != null && _field != "" ? _instance[_field] : _instance;
        if (c == null || c.length == 0) {
            let obj = (new window[_memberType]());
            //let defaultObj = obj.props;
            //defaultObj.ctor = obj.ctor;
            c.splicea(0, 0, [obj]);
        }
    };
    this.beginDraw = function (e) {
        
    };
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _repeater = this.repeater;
        }
    };
    let _rowAdd = function (e, r, ra) {
        if (e.target.id == this.children.internalRepeater.domID) {
            console.log("rowAdd", e);
            for (let p in ra.currentRow) {
                ra.currentRow[p].scrollTo();
                break;
            }
            for (let i = 0; i < this.children.internalRepeater.itemLabel.length; i++) {
                this.children.internalRepeater.itemLabel[i].attr["data-toggle"] = "collapse";
                this.children.internalRepeater.itemLabel[i].attr["data-target"] = "#" + this.children.internalRepeater.objectEditor[i].domID;
            }
            this.children.internalRepeater.focusComponent(ra.currentIndex, 0);
        }
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            e.preventDefault();
        }
    };
    let _cmps;
    let fnContainerDelayInit = function () {
        _cmps =
            [
                {
                    ctor: RepeaterEx,
                    props: {
                        id: "repeater",
                        dataProvider: _field != null && _field != "" ? _instance[_field] : _instance,
                        rendering: {
                            direction: 'vertical',
                            separator: true
                        },
                        rowAdd: _rowAdd,
                        components: [
                            {
                                ctor: Label,
                                props: {
                                    id: "itemLabel",
                                    label: "Edit Item",
                                    attr: {"data-toggle" : "collapse"}
                                }
                            },
                            {
                                ctor: ObjectEditor,
                                props: {
                                    id: "objectEditor",
                                    width: "100%",
                                    instance: "{currentItem}",
                                    field: null,
                                    classes: ["collapse"]
                                }
                            }
                        ]
                    }
                }
            ];
    };

    let _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        memberType:""
    };
    
    if (_props.memberType)
    {
        _memberType = _props.memberType;
    }
    if(_props.instance){
        _field = _props.field;
        _instance = _props.instance;
        this.initMembers();
    }
    fnContainerDelayInit();
    _props.components = _cmps;
    _props = extend(false, false, _defaultParams, _props);
    let r = Container.call(this, _props);
    return r;
};
CollectionEditor.prototype.ctor = 'CollectionEditor';
export {
    CollectionEditor  
};
