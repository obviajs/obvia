/**
 * This is a Container Element
 * 
 * 
 */
import { Parent } from "/obvia/components/base/Parent.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { extractText } from "/obvia/lib/my.js";

var Container = function (_props)
{
    let _self = this,
        _textAlign;

    if (!this.hasOwnProperty("label"))
    {
        Object.defineProperty(this, "label", {
            get: function label()
            {
                return _label;
            },
            set: function label(v)
            {
                if (_label != v)
                {
                    _label = v;
                    if (this.$el)
                    {
                        //convert html entities
                        v = extractText(v);
                        let last = this.$el.children().last();
                        if (last && last.length > 0)
                            if (last[0].nextSibling)
                                last[0].nextSibling.textContent = v;
                            else
                                if (_textAlign == "left")
                                    this.$el.prependText(v);
                                else
                                    this.$el.appendText(v);
                        else
                            //this.$el.appendText(v);
                            this.$el.text(v);
                    }
                }
            },
            configurable: true
        });
    }
    if (!this.hasOwnProperty("width"))
    {
        Object.defineProperty(this, "width", {
            get: function width()
            {
                return _width;
            },
            set: function width(v)
            {
                if (_width != v)
                {
                    _width = v;
                    if (this.$el)
                    {
                        if (v == null)
                        {
                            this.$el[0].style.width = '';
                        } else
                        {
                            let s = (
                                StringUtils.isString(_width) &&
                                (
                                    _width.indexOf("vw") > -1 ||
                                    _width.indexOf("em") > -1 ||
                                    _width.indexOf("%") > -1
                                )
                            );
                            this.$el[0].style.width = v + (s ? "" : "px");
                        }
                    }
                }
            },
            enumerable: true
        });
    }
    if (!this.hasOwnProperty("minWidth"))
    {
        Object.defineProperty(this, "minWidth", {
            get: function minWidth()
            {
                return _minWidth;
            },
            set: function minWidth(v)
            {
                if (_minWidth != v)
                {
                    _minWidth = v;
                    if (this.$el)
                    {
                        if (v == null)
                        {
                            this.$el[0].style.minWidth = '';
                        } else
                        {
                            let s = (
                                StringUtils.isString(_minWidth) &&
                                (
                                    _minWidth.indexOf("vw") > -1 ||
                                    _minWidth.indexOf("em") > -1 ||
                                    _minWidth.indexOf("%") > -1
                                )
                            );
                            this.$el[0].style.minWidth = v + (s ? "" : "px");
                        }
                    }
                }
            },
            enumerable: true
        });
    }
    if (!this.hasOwnProperty("minHeight"))
    {
        Object.defineProperty(this, "minHeight", {
            get: function minHeight()
            {
                return _minHeight;
            },
            set: function minHeight(v)
            {
                if (_minHeight != v)
                {
                    _minHeight = v;
                    if (this.$el)
                    {
                        if (v == null)
                        {
                            this.$el[0].style.minHeight = '';
                        } else
                        {
                            let s = (
                                StringUtils.isString(_minHeight) &&
                                (
                                    _minHeight.indexOf("vh") > -1 ||
                                    _minHeight.indexOf("em") > -1 ||
                                    _minHeight.indexOf("%") > -1
                                )
                            );
                            this.$el[0].style.minHeight = v + (s ? "" : "px");
                        }
                    }
                }
            },
            enumerable: true
        });
    }
    if (!this.hasOwnProperty("height"))
    {
        Object.defineProperty(this, "height", {
            get: function height()
            {
                return _height;
            },
            set: function height(v)
            {
                if (_height != v)
                {
                    _height = v;
                    if (this.$el)
                    {
                        if (v == null)
                        {
                            this.$el[0].style.height = '';
                        } else
                        {
                            let s = (
                                StringUtils.isString(_height) &&
                                (
                                    _height.indexOf("vh") > -1 ||
                                    _height.indexOf("em") > -1 ||
                                    _height.indexOf("%") > -1
                                )
                            );
                            this.$el[0].style.height = v + (s ? "" : "px");
                        }
                    }
                }
            },
            configurable: true,
            enumerable: true
        });
    }
    if (!this.hasOwnProperty("top"))
    {
        Object.defineProperty(this, "top", {
            get: function top()
            {
                return _top;
            },
            set: function top(v)
            {
                if (_top != v)
                {
                    _top = v;
                    if (this.$el)
                    {
                        if (v == null)
                        {
                            this.$el[0].style.top = '';
                        } else
                        {
                            let s = (
                                StringUtils.isString(_top) &&
                                (
                                    _top.indexOf("vh") > -1 ||
                                    _top.indexOf("em") > -1 ||
                                    _top.indexOf("%") > -1
                                )
                            );
                            this.$el[0].style.top = v + (s ? "" : "px");
                        }
                    }
                }
            },
            configurable: true,
            enumerable: true
        });
    }
    if (!this.hasOwnProperty("marginTop"))
    {
        Object.defineProperty(this, "marginTop", {
            get: function marginTop()
            {
                return _marginTop;
            },
            set: function marginTop(v)
            {
                if (_marginTop != v)
                {
                    _marginTop = v;
                    if (this.$el)
                    {
                        if (v == null)
                        {
                            this.$el[0].style.marginTop = '';
                        } else
                        {
                            let s = (
                                StringUtils.isString(_marginTop) &&
                                (
                                    _marginTop.indexOf("vh") > -1 ||
                                    _marginTop.indexOf("em") > -1 ||
                                    _marginTop.indexOf("%") > -1
                                )
                            );
                            this.$el[0].style.marginTop = v + (s ? "" : "px");
                        }
                    }
                }
            },
            configurable: true,
            enumerable: true
        });
    }
    if (!this.hasOwnProperty("marginLeft"))
    {
        Object.defineProperty(this, "marginLeft", {
            get: function marginLeft()
            {
                return _marginLeft;
            },
            set: function marginLeft(v)
            {
                if (_marginLeft != v)
                {
                    _marginLeft = v;
                    if (this.$el)
                    {
                        if (v == null)
                        {
                            this.$el[0].style.marginLeft = '';
                        } else
                        {
                            let s = (
                                StringUtils.isString(_marginLeft) &&
                                (
                                    _marginLeft.indexOf("vh") > -1 ||
                                    _marginLeft.indexOf("em") > -1 ||
                                    _marginLeft.indexOf("%") > -1
                                )
                            );
                            this.$el[0].style.marginLeft = v + (s ? "" : "px");
                        }
                    }
                }
            },
            configurable: true,
            enumerable: true
        });
    }

    Object.defineProperty(this, "contenteditable", {
        get: function contenteditable()
        {
            return _contenteditable;
        },
        set: function contenteditable(v)
        {
            if (_contenteditable != v)
            {
                _contenteditable = v;
                if (this.$el)
                {
                    this.$el[0].contentEditable = v;
                }
            }
        }
    });

    Object.defineProperty(this, "role", {
        get: function role()
        {
            return _role;
        },
        set: function role(v)
        {
            if (_role != v)
            {
                _role = v;
                if (this.$el)
                {
                    if (_role)
                    {                        
                        this.$el[0].role = _role;
                    } else
                    {
                       this.$el[0].removeAttribute('role');                       
                    }
                }
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "type", {
        get: function type()
        {
            return _type;
        },
        set: function type(v)
        {
            if (_type != v)
            {
                if (this.$el)
                {
                    this.$el[0].classList.remove(_type);
                    this.$el[0].classList.add(v);
                    _type = v;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    //is template overrided ?
    this.template = this.template || function ()
    {
        return '<div id="' + this.domID + '" data-triggers="input"></div>';
    };

    let _init = this.init;
    this.init = function (e)
    {
        if (e.target.id == this.domID)
        {
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
            if (_props.width)
                this.width = _props.width;
            if (_props.height)
                this.height = _props.height;
            if (_props.top)
                this.top = _props.top;
            if (_props.marginTop)
                this.marginTop = _props.marginTop;
            if (_props.marginLeft)
                this.marginLeft = _props.marginLeft;
            if (_props.contenteditable)
            {
                this.contenteditable = _props.contenteditable;
            }
        }
    };
    let _afterAttach = this.afterAttach;
    this.afterAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            /*if(!_width)
                _width = this.$el.width();
            if(!_height)     
                _height = this.$el.height();
                */
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            if (!e.isDefaultPrevented())
            {
                if (_label == null && _props.label)
                    this.label = _props.label;
                if (_textAlign == null && _props.textAlign)
                    _textAlign = _props.textAlign;
            }
            //e.preventDefault();
        }
    };

    let _defaultParams = {
        type: "container",
        components: [],
        spacing: {},
        width: undefined,
        minWidth: undefined,
        height: undefined,
        minHeight: undefined,
        role: undefined,
        textAlign: "left",
        contenteditable: false
    };
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    ObjectUtils.fromDefault(_defaultParams, _props);
    let _width, _minWidth;
    let _height, _minHeight, _top, _marginTop, _marginLeft;
    let _type, _role, _contenteditable;
    //let _afterAttach = _props.afterAttach;
    //_props.afterAttach = this.afterAttach;
    let _label;

    let r = Parent.call(this, _props);

    if (_props.minWidth)
        this.minWidth = _props.minWidth;
    if (_props.minHeight)
        this.minHeight = _props.minHeight;
    if (_props.role)
        this.role = _props.role;

    if (_props.type && _props.type != "")
        this.type = _props.type;

    return r;
};
Container.prototype.ctor = 'Container';
var ContainerType =
{
    "CONTAINER": "container",
    "CONTAINER_FLUID": "container-fluid",
    "ROW": "row",
    "FORM_ROW": "form-row",
    "COLUMN": "col",
    "NONE": "", //just sugar ;)
    "BTN_GROUP": "btn-group",
    "BTN_TOOLBAR": "btn-toolbar",
    "INPUT_GROUP": "input-group",
    "INPUT_GROUP_PREPEND": "input-group-prepend",
    "INPUT_GROUP_TEXT": "input-group-text"
};
DependencyContainer.getInstance().register("Container", Container, DependencyContainer.simpleResolve);
export
{
    Container, ContainerType
};