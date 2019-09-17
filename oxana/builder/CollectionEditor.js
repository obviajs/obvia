/**
 * This is a CollectionEditor Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var CollectionEditor = function (_props, overrided = false) {
    var _self = this;
    let _value, _memberType;

    this.initMembers = function(){
        let c = _field!=null && _field!=""?_instance[_field]:_instance;
        if(c==null || c.length==0){
            c = [(new window[_memberType]).props];
        }
    }

    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            
            this.$container = this.$el;
            if(_props.memberType){
                _memberType = _props.memberType;
            }
            if(_props.instance){
                _field = _props.field;
                _instance = _props.instance;
                this.initMembers();
                fnContainerDelayInit();
                this.components = _cmps;
                this.addComponents();
            }
            e.preventDefault();
        }
    }
    let _cmps;
    var fnContainerDelayInit = function(){
        _cmps = 
        [
            {
                ctor: Repeater,
                props:{
                    id:"repeater",
                    dataProvider: _field!=null && _field!=""?_instance[_field]:_instance,
                    rendering: {
                        direction: 'horizontal',
                        separator: true
                    },
                    components:[
                        {
                            ctor: ObjectEditor,
                            props:{
                                id: "objectEditor",
                                instance: "{currentItem}",
                                field: null
                            }
                        }
                    ]
                }
            }
        ];
    }

    var _defaultParams = {
        type: ContainerType.NONE,
        "components": [],
        memberType:""
    };
    _props = extend(false, false, _defaultParams, _props);
    Container.call(this, _props);
    
};
CollectionEditor.prototype.ctor = 'CollectionEditor';
