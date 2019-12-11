/**
 * This is a Modal component
 * 
 * Kreatx 2018
 */

//component definition
var Modal = function(_props)
{
    let _self = this;
    Object.defineProperty(this, "title", 
    {
        get: function title() 
        {
            return _title;
        },
        set: function title(v) 
        {
            if(_title != v)
            {
                _title = v;
                if(_modalHeader.title){
                    _modalHeader.title.label = v;
                }
            }
        }
    });

    let _displayed = false;
    this.DOMMutation = function(e)
    {
        if(e.mutation.type == "attributes" && e.mutation.attributeName == "style"){
            let av = e.target.style.getPropertyValue('display');
            if(av.trim()!="" && av!="none" && !_displayed){
                _displayed = true;
                let evt = jQuery.Event("displayListUpdated");
                this.trigger(evt);
            }
        }
        //
    }
    let _defaultComponents = {
        "modalBody": _props.components && _props.components.forEach ? _props.components : null,
        "modalHeader": [
            {
                ctor: Heading,
                props: {
                    id: "title",
                    label: _props.title,
                    headingType: HeadingType.h5,
                }
            },
            {
                ctor: Container,
                props: {
                    type: ContainerType.BTN_GROUP,
                    components: [
                        {
                            ctor: Button,
                            props: {
                                id: 'dismissButton',
                                type: "button",
                                classes: ["close", "no-form-control"],
                                attr: {"data-dismiss":"modal", "aria-label":"Dismiss"},
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: 'fa',
                                        labelType: LabelType.i,
                                        classes: ["fas","fa-times"]
                                    }
                                }],
                                click: function(e){
                                    _self.trigger("dismiss");
                                }
                            }
                        },
                        {
                            ctor: Button,
                            props: {
                                id: 'acceptButton',
                                type: "button",
                                classes: ["close", "no-form-control"],
                                attr: {"data-dismiss":"modal", "aria-label":"Accept"},
                                components: [{
                                    ctor: Label,
                                    props: {
                                        id: 'fa',
                                        labelType: LabelType.i,
                                        classes: ["fas","fa-check"]
                                    }
                                }],
                                click: function(e){
                                    _self.trigger("accept");
                                }
                            }
                        }
                    ]
                }
            }
        ]
    };

    var _defaultParams = {
        size: ModalSize.LARGE,
        type: ContainerType.NONE,
        classes: ["modal", "fade", "modal-fullscreen"],
        attr: {"data-triggers":"displayListUpdated accept dismiss", tabindex:-1, role:"dialog"},
        components: _defaultComponents
    };
    _props = extend(false, false, _defaultParams, _props);
    if(_props.components && _props.components.forEach){
        _props.components = _defaultComponents;
    }
    
    var _title = _props.title;
    var _size = _props.size;
    
    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            _modalDialog = this.children[this.components[0].props.id];
            _modalContent = _modalDialog.children[_modalDialog.components[0].props.id];
            _modalHeader = _modalContent.children[_modalContent.components[0].props.id];
            _modalBody = _modalContent.children[_modalContent.components[1].props.id];
            _modalFooter = _modalContent.children[_modalContent.components[2].props.id];
        }
    };

    let _cmps, _modalDialog, _modalContent, _modalHeader, _modalBody, _modalFooter;
    var fnContainerDelayInit = function(){
        _cmps = 
        [
            {
                ctor: Container,
                props: {
                    type: ContainerType.NONE,
                    classes: ["modal-dialog", _size],
                    attr: {role:"document"},
                    id: "modalDialog",
                    components: [
                        {
                            ctor: Container,
                            props: {
                                type: ContainerType.NONE,
                                classes: ["modal-content"],
                                id: "modalContent",
                                components: [
                                    {
                                        ctor: Container,
                                        props: {
                                            id: "modalHeader",
                                            type: ContainerType.NONE,
                                            classes: ["modal-header"],
                                            components: _props.components.modalHeader
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            id: "modalBody",
                                            type: ContainerType.NONE,
                                            classes: ["modal-body"],
                                            components: _props.components.modalBody
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            id: "modalFooter",
                                            type: ContainerType.NONE,
                                            classes: ["modal-footer"],
                                            components: _props.components.modalFooter
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ];
    }
    
    fnContainerDelayInit();
    _props.components = _cmps;
    
    let r = Container.call(this, _props, true);
    var base = this.base;
    
    this.show = function () 
    {
        if(this.$el)
            this.$el.modal('show');
        return this;
    };
    
    this.hide = function () 
    {
        if(this.$el)
            this.$el.modal('hide');
        return this;
    };  
    return r;
};
Modal.prototype.ctor = 'Modal';