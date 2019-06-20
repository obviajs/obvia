/**
 * This is an MultiUpload Element
 *
 * Kreatx 2019
 */

var MultiUpload = function (_props, overrided = false) {
    var _self = this;
    var _cmp;
    var _dataProvider = new ArrayEx([{}, {}]);
    var _container = 
    {
        constructor: ViewStack,
        props: {
            selectedIndex: 1,
            components: [
                {
                    constructor: Container,
                    props: {
                        id: "mainContainer",
                        type: ContainerType.NONE,
                        //width:,
                        components:[]
                    }
                },
                {
                    constructor: Repeater,
                    props: {
                        id: 'listRepeater',
                        rendering: {
                            direction: "vertical",
                            separator: false
                        },
                        dataProvider: _dataProvider,
                        components: [
                            {
                                constructor: UploadEx,
                                props: {
                                    id: 'upload'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };

    this.template = function () { 
        _cmp = Component.fromLiteral(_container);
        this.$el = _cmp.$el;
        return null;
    };

    var _defaultParams = {
        multiple: false,
        showBtnRemove: false,
        dataProvider: [],
        valueField: "id",
        value: [],

    };

    var _multiple, _accept, _showBtnRemove;

    _props = extend(false, false, _defaultParams, _props);

    Component.call(this, _props);

    if(_props.multiple)
        this.multiple = _props.multiple;
    if(_props.accept)
        this.accept = _props.accept;  
    if(_props.showBtnRemove!=null)
        this.showBtnRemove = _props.showBtnRemove;
};

MultiUpload.prototype.ctor = 'MultiUpload';