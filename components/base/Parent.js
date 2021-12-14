import { Component } from "/obvia/components/base/Component.js";
import { Props } from "/obvia/components/base/Props.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
var Parent = function (_props)
{
    let _$hadow = $("<div/>");
    let _comprenders = [];
    let _self = this;
    let _children = {}, _enabled;
    let _components = [];
    let _csorted = [];

    if (!this.hasOwnProperty("initProxy"))
    {
        this.initProxy = function ()
        {
            return new Proxy(this, {
                get: function (target, property, receiver)
                {
                    if (!(property in target))
                    {
                        if (target.children && target.children[property])
                            return target.children[property];
                    }
                    return Reflect.get(...arguments);
                },
                getOwnPropertyDescriptor(target, property)
                {
                    if (!(property in target))
                    {
                        if (target.children && target.children[property])
                            return { configurable: true, enumerable: true, get: Reflect.get };
                    }
                    return Reflect.getOwnPropertyDescriptor(...arguments);
                }
            });
        };
    }

    let _proxy = this.initProxy();

    Object.defineProperty(this, "proxy", {
        get: function proxy()
        {
            return _proxy;
        }
    });

    Object.defineProperty(this, "children", {
        get: function children()
        {
            return _children;
        },
        enumerable: true
    });

    Object.defineProperty(this, "numChildren", {
        get: function numChildren()
        {
            return _children ? Object.keys(_children).length : 0;
        },
        enumerable: true
    });

    Object.defineProperty(this, "components", {
        get: function components()
        {
            return _components;
        },
        set: function components(v)
        {
            // this.removeAllChildren();
            // this.addComponents(v);

            _props.components = _components = v;
        },
        enumerable: true,
        configurable: true
    });

    this.add = function (childOrLiteral, index)
    {
        if (childOrLiteral)
        {
            if (childOrLiteral.$el)
                this.addChild(childOrLiteral, index);
            else
                this.addComponent(childOrLiteral, index);
        }
    };

    this.addChild = function (child, index)
    {
        if (child && _children[child.id] != child)
        {
            index = index > -1 ? index : _csorted.length;
            if (index >= 0 && index <= _csorted.length)
            {
                index = index > -1 ? index : _csorted.length;
                // let component = {
                //     ctor: child.ctor,
                //     props: child.props
                // };
                _children[child.id] = child;
                _csorted.splice(index, 0, child.id);
                child.parent = _proxy;
                child.parentType = this.type;
                child.parentForm = _self.ctor == 'Form' ? _proxy : _proxy.parentForm;
                child.repeaterIndex = this.repeaterIndex;
                child.parentRepeater = this.parentRepeater;
                let rPromise = child.render();
                return rPromise.then(function (cmpInstance)
                {
                    //cmpInstance.applyMyBindings();
                    _self.$el.insertAt(cmpInstance.$el, index);
                    let event = jQuery.Event("childAdded");
                    event.child = child;
                    _self.trigger(event);
                    return rPromise;
                });
            }
        }
    };

    this.indexOfChild = function (child)
    {
        let ind = -1;
        if (child)
        {
            //check whether this is a child of this parent
            if (_children[child.id] == child)
            {
                ind = _csorted.indexOf(child.id);
            }
        }
        return ind;
    };

    this.childAtIndex = function (i)
    {
        if (i >= 0 && i < _csorted.length)
        {
            return _children[_csorted[i]];
        }
    };

    this.removeAllChildren = function (mode = 1)
    {
        for (let cid in this.children)
        {
            this.removeChild(this.children[cid], mode);
        }

    };

    this.removeChild = function (child, mode = 1)
    {
        if (child)
        {
            if (_children[child.id] == child)
            {
                let ind = _csorted.indexOf(child.id);
                if (ind > -1)
                {
                    _csorted.splice(ind, 1);
                }
                delete _children[child.id];
                child.destruct(mode);
                child.parent = null;
            } else
            {
                console.log("Failed to remove Component: " + child.id + ". It was not found in child list.");
            }
        }
    };

    this.removeChildAtIndex = function (index, mode = 1)
    {
        if (index >= 0 && index < _csorted.length)
        {
            this.removeChild(_children[_csorted[index]], mode);
        }
    };

    this.addComponent = async function (component, index)
    {
        index = index > -1 ? index : _csorted.length;
        let cr = await _addComponentInContainer(this.$container, component, index);

        await cr.promise.then(function (cmpInstance)
        {
            if (cmpInstance && !cmpInstance.attached)
            {
                //cmpInstance.applyMyBindings();
                if (cmpInstance.appendTo)
                {
                    cmpInstance.appendTo.append(cmpInstance.$el);
                } else
                    _self.$container.insertAt(cmpInstance.$el, index);
            } else
            {
                console.log("Component not found " + _csorted[i]);
            }
            _self.trigger('endDraw');
        });
        return cr.cmp;
    };

    Object.defineProperty(this, "sortChildren", {
        get: function sortChildren()
        {
            return _sortChildren;
        },
        enumerable: true
    });

    Object.defineProperty(this, "renders", {
        get: function renders()
        {
            return _comprenders;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(this, "csorted", {
        get: function csorted()
        {
            return _csorted;
        },
        enumerable: false,
        configurable: true
    });

    let _addComponentInContainer = async function (container, component, index)
    {
        if (container)
        {
            component.props.ownerDocument = _self.ownerDocument;
            let cmpLit = {};
            ObjectUtils.shallowCopy(component, cmpLit, ["props"]);
            cmpLit.props = {};
            ObjectUtils.shallowCopy(component.props, cmpLit.props, ["id"]);
            let id = component.props.id;
            if (component.props.id && _children[component.props.id])
            {
                cmpLit.props.id = component.props.id + '_' + Object.keys(_children).length;
            } else
                cmpLit.props.id = component.props.id;
            // if (cmpLit.props.bindingDefaultContext == null) {
            //     cmpLit.props.bindingDefaultContext = _self.bindingDefaultContext;
            // }
            if (_props.props && _props.props[id] && ObjectUtils.isObject(_props.props[id]))
            {
                let cprops = ObjectUtils.deepCopy(_props.props[id]);
                cmpLit.props = ObjectUtils.fromDefault(cmpLit.props, cprops);
            }
            cmpLit.props.repeaterIndex = _self.repeaterIndex;
            cmpLit.props.parentRepeater = _self.parentRepeater;
            let cmp = await Component.fromLiteral(cmpLit);
            //component.props.id = cmp.id;
            if (_children[cmp.id])
                throw new Error("Child id: " + cmp.id + " is already used in Parent with id: " + _self.id + ". Components ids should be unique within their parent.");
            else
                _children[cmp.id] = cmp;
            _csorted.splice(index, 0, cmp.id);
            cmp.parent = _proxy;
            cmp.parentType = _self.type;
            cmp.parentForm = _self.ctor == 'Form' ? _proxy : _proxy.parentForm;

            index = index > -1 ? index : _csorted.length;
            let cr = {
                "cmp": cmp,
                "promise": cmp.render()
            };
            _myw.propertyChanged(cmp.id, null, cmp);
            _comprenders.push(cr);
            return cr;
        }
    };
    let _init = this.init;
    this.init = function (e)
    {
        if (e.target.id == this.domID)
        {
            this.$container = this.$el;
            if (typeof _init == 'function')
                _init.apply(this, arguments);
        }
    };

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
        }
    };

    let _defaultParams = {
        components: [],
        sortChildren: false
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //ObjectUtils.shallowCopy(ObjectUtils.extend(false, false, _defaultParams, _props), _props);
    if (!_props.attr)
    {
        _props.attr = {};
    }
    let myDtEvts = ["childAdded"];

    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    this.$container = null;

    let _creationFinished = false;
    //let _afterAttach = _props.afterAttach;
    //_props.afterAttach = this.afterAttach;
    let _sortChildren = _props.sortChildren;
    // this.afterAttach = undefined;
    this.addComponents = async function (components)
    {
        _self.trigger('beginDraw');
        let arrInst = [];
        let cr = [];
        _comprenders = [];
        if (components && Array.isArray(components) && components.length > 0)
        {
            if (_sortChildren)
            {
                ArrayUtils.acSort(components, "props.index");
            }
            _components.splicea(_components.length, 0, components);
            for (let i = 0; i < components.length; i++)
            {
                if (ObjectUtils.isObject(components[i]))
                {
                    let cr = await _addComponentInContainer(_$hadow, components[i], _csorted.length + i);
                    await cr.promise;
                    arrInst.push(cr.cmp);
                }
            }
            cr = ArrayUtils.arrayFromKey(_comprenders, "promise");
            Promise.all(cr).then(function ()
            {
                _comprenders = [];
                for (let i = 0; i < _csorted.length; i++)
                {
                    let cmpInstance = _children[_csorted[i]];
                    if (cmpInstance && !cmpInstance.attached)
                    {
                        if (cmpInstance.appendTo)
                        {
                            cmpInstance.appendTo.insertAt(cmpInstance.$el, i);
                        } else
                            _$hadow.insertAt(cmpInstance.$el, i);
                    } else
                    {
                        console.log("Component not found " + _csorted[i]);
                    }
                }

                _$hadow.contents().appendTo(_self.$container);
                _self.trigger('endDraw');
            });
        } else
        {
            _self.trigger('endDraw');
        }
        return Promise.all(cr);
    };

    if (!this.hasOwnProperty("render"))
    {
        let _rPromise;
        this.render = function ()
        {
            if (_rPromise == null)
            {
                _rPromise = new Promise((resolve, reject) =>
                {
                    _self.on("endDraw", function (e)
                    {
                        if (e.target.id == _self.domID)
                        {
                            resolve(_proxy);
                        }
                    });
                    _components = [];
                    this.addComponents(_props.components);
                });
            }
            return _rPromise;
        };
    }

    Component.call(this, _props);

    let _myw = ChangeWatcher.getInstance(_self);

    Object.defineProperty(this, "enabled", {
        get: function enabled()
        {
            return _enabled;
        },
        set: function enabled(v)
        {
            if (_enabled != v)
            {
                _enabled = v;
                if (!v)
                    this.$el.attr('disabled', 'disabled');
                else
                    this.$el.removeAttr('disabled');
            }
        },
        configurable: true,
        enumerable: true
    });
    //let _destruct = this.destruct;
    // this.destruct = function (mode=1)
    // {
    //     for(let id in _children){
    //         _children[id].destruct(mode);
    //     }
    //     _destruct(mode);
    // }

    this.childrenEnable = function (v)
    {
        for (let childId in this.children)
        {
            this.children[childId].enabled = v;
            if (this.children[childId].childrenEnable)
                this.children[childId].childrenEnable(v);
        }
    };


    Object.defineProperty(this, "props", {
        get: function props()
        {
            return new Props(_self, _props);
        },
        configurable: true
    });
    return _proxy;
};
Parent.prototype.ctor = 'Parent';
export
{
    Parent
};