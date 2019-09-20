var RepeaterEx = function(_props)
{
    Object.defineProperty(this, "dataProvider", 
    {
        get: function dataProvider() 
        {
            return _repeater.dataProvider;
        },
        set: function dataProvider(v) 
        {
            if(_dpWatcher && _repeater.dataProvider){
                _dpWatcher.reset();
            } 
            _repeater.dataProvider = v;
            if(v){
                _dpWatcher = ChangeWatcher.getInstance(_repeater.dataProvider);
                _dpWatcher.watch(_repeater.dataProvider, "length", _dpLengthChanged);
            }
            
        },
        enumerable:true
    });
    var _dpLengthChanged = function(e)
    {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(e.newValue<=1){
            _removeButton.enabled = false;
        }else
            _removeButton.enabled = true;

    }
    let _repeater, _removeButton, _addButton, _dpWatcher;
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            this.$container = this.$el;
            fnContainerDelayInit();
            this.components = _cmps;
            this.addComponents();
            _repeater = this.children[this.components[0].props.id];
            if(_repeater.dataProvider){
                _dpWatcher = ChangeWatcher.getInstance(_repeater.dataProvider);
                _dpWatcher.watch(_repeater.dataProvider, "length", _dpLengthChanged);
            }
            _removeButton = this.children[this.components[1].props.id].children[this.components[1].props.components[0].props.id];
            _addButton = this.children[this.components[1].props.id].children[this.components[1].props.components[1].props.id];
            e.preventDefault();
        }
    }

    var fnContainerDelayInit = function(){
        _cmps = 
        [
            {
                ctor: Repeater,
                props: _props
            },
            {
                "ctor": "Container",
                "props": {
                    type: ContainerType.Container,
                    "id": "workArea",
                    "components": [
                        {
                            ctor: Button,
                            props: {
                                id: 'removeButton',
                                type: "button",
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: 'fa',
                                        labelType: LabelType.i,
                                        classes: ["fas","fa-minus-circle"]
                                    }
                                }],
                                click:_remove,
                                enabled: _props.dataProvider.length>1?true:false
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
                                        classes: ["fas","fa-plus-circle"]
                                    }
                                }],
                                click:_add
                            }
                        }
                    ]
                }
            }
        ]
    }
    var _remove = function(e){
        _props.dataProvider.splice(_props.dataProvider.length-1, 1);
    }

    var _add = function(e){
        _props.dataProvider.splice(_props.dataProvider.length, 0, buildDefaultObject(_props.dataProvider[0]));
    }

    var _defaultParams = {
        type: ContainerType.CONTAINER,
        rendering: {
			direction: 'vertical',
            separator: true,
            actions:{remove:true, add:true}
        },
        dataProvider:new ArrayEx([]),
        guidField:"guid"
    };
    _props = extend(false, false, _defaultParams, _props);
    var _dataProvider;
    var _rendering = _props.rendering;
    var _enabled = _props.enabled;
    var _container = _props.container;
    var _guidField = _props.guidField;
    this.components = _props.components;

    Container.call(this, _props, true, true);
};
Repeater.prototype.ctor = 'Repeater';