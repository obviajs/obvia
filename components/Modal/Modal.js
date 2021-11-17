
/**
 * This is a Modal component
 * 
 * Kreatx 2018
 */
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { Heading, HeadingType } from "/obvia/components/Heading.js";
import { Button } from "/obvia/components/Button/Button.js";
import { Label, LabelType } from "/obvia/components/Label.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
var Modal = function (_props) {
    let _self = this;
    Object.defineProperty(this, "title", {
        get: function title() {
            return _title;
        },
        set: function title(v) {
            if (_title != v) {
                _title = v;
                if (_modalHeader.title) {
                    _modalHeader.title.label = v;
                }
            }
        }
    });

    let _displayed = false;
    this.DOMMutation = function (e) {
        if (e.mutation.type == "attributes" && e.mutation.attributeName == "style") {
            let av = e.target.style.getPropertyValue('display');
            if (av.trim() != "" && av != "none" && !_displayed) {
                _displayed = true;
                let evt = jQuery.Event("displayListUpdated");
                this.trigger(evt);

                let e = jQuery.Event("shown");
                this.trigger(e);
            } else if (_displayed && (av.trim() == "" || av == "none")) {
                _displayed = false;
                let e = jQuery.Event("hidden");
                this.trigger(e);
            }
        }
    };
    let _defaultComponents = {
        "modalBody": _props.components && _props.components.forEach ? _props.components : null,
        "modalHeader": [{
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
                type: "btn-group",
                id: "headerButtonsCnt",
                components: [
                    {
                        ctor: Button,
                        props: {
                            id: 'dismissButton',
                            type: "button",
                            classes: ["close", "no-form-control"],
                            attr: {
                                "data-dismiss": "modal",
                                "aria-label": "Dismiss"
                            },
                            components: [{
                                ctor: Label,
                                props: {
                                    id: 'fa',
                                    labelType: LabelType.i,
                                    classes: ["fas", "fa-times"]
                                }
                            }],
                            click: function (e) {
                                let evt = jQuery.Event('dismiss');
                                _self.trigger(evt);
                                if (!evt.isDefaultPrevented()) {
                                    _self.hide();
                                }
                            }
                        }
                    },
                    {
                        ctor: Button,
                        props: {
                            id: 'acceptButton',
                            type: "button",
                            classes: ["close", "no-form-control"],
                            attr: {
                                "data-dismiss": "modal",
                                "aria-label": "Accept"
                            },
                            components: [{
                                ctor: Label,
                                props: {
                                    id: 'fa',
                                    labelType: LabelType.i,
                                    classes: ["fas", "fa-check"]
                                }
                            }],
                            click: function (e)
                            {
                                let evt = jQuery.Event('accept');
                                _self.trigger(evt);
                            }
                        }
                    }
                ]
            }
        }]
    };
    
    let _clickHandler = function (e) {
        if (e.target.id === this.domID)
            this.hide();
    };

    let _defaultParams = {
        size: ModalSize.LARGE,
        type: "",
        classes: ["modal", "modal-fullscreen"],
        attr: {
            "data-triggers": "displayListUpdated accept dismiss shown hidden",
            tabindex: -1,
            role: "dialog"
        },
        css: {},
        components: _defaultComponents
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    if (_props.components && _props.components.forEach) {
        _props.components = _defaultComponents;
    }

    let _title = _props.title;
    let _size = _props.size;
    let _click = _props.click;

    _props.click = function () {
        if (typeof _click == 'function')
            _click.apply(this, arguments);

        let e = arguments[0];
        if (!e.isDefaultPrevented()) {
            _clickHandler.apply(this, arguments);
        }
    };

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _modalDialog = this.modalDialog;
            _modalContent = _modalDialog.modalContent;
            _modalHeader = _modalContent.modalHeader;
            _modalBody = _modalContent.modalBody;
            _modalFooter = _modalContent.modalFooter;
        }
    };
    let _cmps, _modalDialog, _modalContent, _modalHeader, _modalBody, _modalFooter, _backDrop;
    let fnContainerDelayInit = function () {
        Modal.all.push(_self);
        _props.css["z-index"] = 1040 + Modal.all.length;
        if (!_backDrop) {
            _backDrop = new Container({
                type: "",
                classes: ["modal-backdrop", "fade", "show"]
            });
        }
        _cmps = [{
            ctor: Container,
            props: {
                type: "",
                classes: ["modal-dialog", _size],
                attr: {
                    role: "document"
                },
                id: "modalDialog",
                components: [{
                    ctor: Container,
                    props: {
                        type: "",
                        classes: ["modal-content"],
                        id: "modalContent",
                        css: { resize: "both", overflow: "hidden" },
                        components: [{
                            ctor: Container,
                            props: {
                                id: "modalHeader",
                                type: "",
                                classes: ["modal-header"],
                                components: _props.components.modalHeader
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "modalBody",
                                type: "",
                                classes: ["modal-body"],
                                css: {
                                    "overflow-y": "auto",
                                    "max-height": "80vh"
                                },
                                components: _props.components.modalBody
                            }
                        },
                        {
                            ctor: Container,
                            props: {
                                id: "modalFooter",
                                type: "",
                                classes: ["modal-footer"],
                                components: _props.components.modalFooter
                            }
                        }
                        ]
                    }
                }]
            }
        }];
    };

    fnContainerDelayInit();
    _props.components = _cmps;
    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _init == 'function')
                _init.apply(this, arguments);
            this.appendTo = $(this.ownerDocument.body);
        }
    };
    let r = Container.call(this, _props);


    this.show = function () {
        if (this.$el) {
            //this.$el.modal('show');
            if (!this.attached) {
                this.appendTo.append(this.$el);
            }
            if (!_backDrop.attached) {
                _backDrop.render().then(function (cmpInstance) {
                    $(_self.ownerDocument.body).append(cmpInstance.$el);
                });
            }
            _backDrop.show();
            this.css.display = "block";
            //$(this.$el[0].ownerDocument.body).addClass('modal-open');
        }
        return this;
    };

    this.hide = function () {
        if (this.$el) {
            //this.$el.modal('hide');
            _backDrop.destruct(2);
            delete this.css["display"];
            //$(this.$el[0].ownerDocument.body).removeClass('modal-open');
        }
        return this;
    };
    let _destruct = this.destruct;
    this.destruct = function (mode = 1) {
        if (mode == 1) {
            Modal.all.splice(Modal.all.indexOf(this), 1);
        }
        for (let id in _children) {
            _children[id].destruct(mode);
        }
        _destruct(mode);
    };
    return r;
};
Modal.prototype.ctor = 'Modal';
Modal.all = new ArrayEx();
var ModalSize =
{
    "SMALL": "modal-sm",
    "LARGE": "modal-lg"
};
DependencyContainer.getInstance().register("Modal", Modal, DependencyContainer.simpleResolve);
export {
    Modal, ModalSize
};