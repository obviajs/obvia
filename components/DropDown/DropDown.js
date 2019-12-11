/**
 * This is a DropDown  Element
 *
 * Kreatx 2019
 */

//component definition
var DropDown = function (_props, overrided = false)
{
    let _self = this;
    let _creationFinished;
    let _dataProvider, _btnDD, _componentRepeater;
    
    Object.defineProperty(this, "dataProvider",
        {
            get: function dataProvider() 
            {
                return _dataProvider;
            },
            set: function dataProvider(v) 
            {
                if (_dataProvider != v)
                {
                    _dataProvider = v;
                }
            }
        });
    
    Object.defineProperty(this, "selectedItem", {
        get: function selectedItem()
        {
    
            return _selectedItem;
        },
        set: function selectedItem(v)
        {
            if (_selectedItem != v)
            {
                _selectedItem = v;
                this.trigger("change");
            }
        }
    });
    if (!this.hasOwnProperty("label"))
    {
        Object.defineProperty(this, "label",
            {
                get: function label() 
                {
                    return _btnDD.label;
                },
                set: function label(v) 
                {
                    _btnDD.label = v;
                }
            });
    }
    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        { 
            _btnDD = this.button;
            _componentRepeater = this.repeater;
            _componentRepeater.attr["aria-labelledby"] = _btnDD.domID;
        }
    }
    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        { 
         
        }
    }
    this.afterAttach = function (e)
    {
        if (typeof _afterAttach == 'function')
            _afterAttach.apply(this, arguments);
        _creationFinished = true;
    }

    let _defaultParams = {
        id: 'dropdown',
        dataProvider: new ArrayEx([]),
        hrefField: "href",
        labelField: "label",
        keyField:"",
        value: null,
        classes:[DropMenuDirection.DROPDOWN],
        label:"",
        size:ButtonSize.SMALL,
        type:ContainerType.NONE,
        split:DropSplitType.SPLIT,  
        guidField:"guid"
    };

    let _clickHandler = function (e, ra) 
    {
        _btnDD.label = this.label;
        let linkObj={};
        linkObj[_guidField] = ra.currentItem[_guidField];
        _self.selectedItem = getMatching(_dataProvider, _guidField, linkObj[_guidField]).objects[0];
        _componentRepeater.$el.removeClass("show");
        e.stopPropagation();
    };

    _props = extend(false, false,_defaultParams, _props);
    if (!_props.attr) { 
        _props.attr = {};
    }
    _props.attr["data-triggers"] = "change";
    
    _dataProvider = _props.dataProvider;
    let _hrefField = _props.hrefField;
    let _labelField = _props.labelField;
    let _value = _props.value;
    let _change = _props.change;
    let _label = _props.label;
    let _size = _props.size;
    let _split = _props.split;
    let _selectedItem = _props.selectedItem;
    let _guidField = _props.guidField;


    let _componentButton = {
        ctor: Button,
        props:{
            id: "button",
            classes:[_size,_split,"btn", "btn-secondary","dropdown-toggle"],
            attr: { 
                "data-toggle":'dropdown',
                "aria-haspopup":"true",
                "aria-expanded":"false"
            }
        }
    }

    let _componentLink = {
        ctor:Link,
        props: {
            id:"link",
            "href":'{'+_hrefField+'}',
            "label":'{'+_labelField+'}',
            classes:['dropdown-item'],
            "click": _clickHandler,
        }
    };
    
    let _componentRepeaterLit = {
        ctor: Repeater,
        props:{
            id: "repeater",
            type: ContainerType.NONE,
            classes: ["dropdown-menu"],
            components: [_componentLink],
            dataProvider: _dataProvider
        }
    }
    _props.components = [_componentButton, _componentRepeaterLit];

    Container.call(this, _props);
}
DropDown.prototype.ctor = 'DropDown' ;
