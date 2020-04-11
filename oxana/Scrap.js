var Scrap = function () {
    this.visit = function (n, parent) {
        var lit, nid = $(n).attr('id');
        nid = nid ? nid : $(n).prop("tagName").toLowerCase();
        var cls = (new ArrayEx($(n).prop("classList"))).toArray();
        var attrs = $(n).attributes();
        var cmp = [];
        var ch_nodes = $(n).children();
        for (var i = 0; i < ch_nodes.length; i++) {
            var cLit = this.visit(ch_nodes[i]);
            var cid = $(ch_nodes[i]).attr('id');
            cid = cid ? cid : $(ch_nodes[i]).prop("tagName").toLowerCase();
            var chcls = (new ArrayEx($(ch_nodes[i]).prop("classList"))).toArray();
            if (
                ["form"].indexOf($(n).prop("tagName").toLowerCase()) > -1 && ["input"].indexOf($(ch_nodes[i]).prop("tagName").toLowerCase()) > -1 && ["button", "hidden"].indexOf($(ch_nodes[i]).attr("type").toLowerCase()) < 0 &&
                chcls.indexOf("form-control") > -1
            ) {
                cLit = {
                    ctor: "FormField",
                    props: {
                        id: 'ff_' + cid,
                        label: 'Example  Input',
                        placeholder: $(ch_nodes[i]).attr('placeholder'),
                        name: $(ch_nodes[i]).attr('name'),
                        size: FormFieldSize.SMALL,
                        spacing: {
                            colSpan: 2
                        },
                        component: cLit
                    }
                };
            }
            cmp.push(cLit);
        };

        if (["div"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Container",
                props: {
                    "id": nid,
                    classes: cls,
                    components: cmp,
                    type: ContainerType.NONE,
                }
            };
            var txt = $(n).mytext();
            if (txt.trim().length > 0) {
                lit.props.label = txt;
                let last = $(n).children().last();
                if (last && last.length > 0)
                    if (last[0].nextSibling && last[0].nextSibling.textContent.trim().length > 0)
                        lit.props.textAlign = "right";
                    else
                        lit.props.textAlign = "left";
            }
        } else if (["header"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Header",
                props: {
                    "id": nid,
                    classes: cls,
                    components: cmp,
                    type: ContainerType.NONE,
                }
            };
            var txt = $(n).mytext();
            if (txt.trim().length > 0) {
                lit.props.label = txt;
            }

        } else if (["section"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Section",
                props: {
                    "id": nid,
                    classes: cls,
                    components: cmp,
                    type: ContainerType.NONE,
                }
            };
            var txt = $(n).mytext();
            if (txt.trim().length > 0) {
                lit.props.label = txt;
            }

        } else if (["footer"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Footer",
                props: {
                    "id": nid,
                    classes: cls,
                    components: cmp,
                    type: ContainerType.NONE,
                }
            };
            var txt = $(n).mytext();
            if (txt.trim().length > 0) {
                lit.props.label = txt;
            }

        } else if (["textarea"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "TextArea",
                props: {
                    "id": nid,
                    classes: cls
                }
            };
            var txt = $(n).mytext();
            if (txt.trim().length > 0) {
                lit.props.value = txt;
            }

        } else if (["ul"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Tree",
                props: {
                    id: nid,
                    valueField: "key",
                    labelField: "title",
                    childrenField: "children",
                    componentsField: "components",
                    dataProvider: cmp,
                    classes: cls,
                    classesField: "classes"
                }
            };
            var txt = $(n).mytext();
            if (txt.trim().length > 0) {
                lit.props.label = txt;
            }
            Scrap.liInc = 0;
        } else if (["li"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {};
            var title;
            if ($(n).children().length > 0)
                title = $(n).last().text();
            else
                title = $(n).text();
            lit.title = title;
            lit.key = ++Scrap.liInc;
            lit.components = cmp;
            lit.classes = cls;
        } else if (["button"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Button",
                props: {
                    id: nid,
                    type: "button",
                    value: $(n).attr('value'),
                    label: $(n).mytext(),
                    classes: cls,
                    components: cmp
                }
            };
        } else if (["img"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Image",
                props: {
                    id: nid,
                    src: $(n).attr('src'),
                    alt: $(n).attr('alt'),
                    classes: cls
                }

            };

            if ($(n).attr('width')) {
                lit.width = $(n).attr('width');
            }

            if ($(n).attr('height')) {
                lit.height = $(n).attr('height');
            }

        } else if (["i", "b", "u", "span", "label", "p", "sup", "small", "strong"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Label",
                props: {
                    id: nid,
                    label: $(n).mytext(),
                    labelType: $(n).prop("tagName").toLowerCase(),
                    classes: cls,
                    components: cmp
                }
            };
        } else if (["a"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Link",
                props: {
                    id: nid,
                    href: $(n).attr('href'),
                    label: $(n).mytext(),
                    target: $(n).attr('target'),
                    classes: cls,
                    components: cmp
                }
            };
        } else if (["input"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            var _sLit;
            switch ($(n).attr("type").toLowerCase()) {
                case "button":
                case "reset":
                case "submit":
                    _sLit = {
                        ctor: "Button",
                        props: {
                            label: $(n).mytext(),
                            type: $(n).attr("type").toLowerCase(),
                            value: $(n).attr("value"),
                            components: cmp
                        }
                    };
                    break;
                case "hidden":
                    _sLit = {
                        ctor: "Hidden",
                        props: {
                            value: $(n).attr("value"),
                            name: $(n).attr("name")
                        }
                    };
                    break;
                case "email":
                case "text":
                case "password":
                    _sLit = {
                        ctor: "TextInput",
                        props: {
                            value: $(n).attr("value"),
                            type: $(n).attr("type").toLowerCase(),
                        }
                    };
                    if ($(n).attr("placeholder")) {
                        _sLit.props.placeholder = $(n).attr("placeholder")
                    }
                    break;
                case "file":
                    break;
                case "checkbox":
                    _sLit = {
                        ctor: "CheckBox",
                        props: {
                            value: $(n).attr("value"),
                            label: 'CheckBox Label',
                            checked: $(n).attr("checked") == "checked",
                        }
                    };
                    break;
                case "radio":
                    _sLit = {
                        ctor: "RadioButton",
                        props: {
                            value: $(n).attr("value"),
                            label: 'CheckBox Label',
                            checked: $(n).attr("checked") == "checked",
                        }
                    };
                    break;
            }
            lit = {
                props: {
                    id: nid,
                    classes: cls,
                }
            };
            lit = extend(false, false, _sLit, lit);
        } else if (["form"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Form",
                props: {
                    id: nid,
                    classes: cls,
                    components: cmp
                }
            };
        } else if (["hr"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "HRule",
                props: {
                    id: nid,
                    classes: cls
                }
            };
            if ($(n).attr('width')) {
                lit.width = $(n).attr('width');
            }
            if ($(n).attr('align')) {
                lit.align = $(n).attr('align');
            }
        } else if (["br"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            lit = {
                ctor: "Container",
                props: {
                    id: nid,
                    classes: [...cls, "clearfix"]
                }
            };
            if ($(n).attr('width')) {
                lit.width = $(n).attr('width');
            }
            if ($(n).attr('align')) {
                lit.align = $(n).attr('align');
            }
        } else if (["h1", "h2", "h3", "h4", "h5", "h6"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {
            var a = $(n).attr("align");
            a = a ? Align[a.toLowerCase()] : undefined;
                lit = {
                    ctor: "Heading",
                    props: {
                        id: nid,
                        label: $(n).mytext(),
                        headingType: HeadingType[$(n).prop("tagName").toLowerCase()],
                        align: a,
                        classes: cls,
                        components: cmp
                    }
                };
        } else console.log($(n).prop("tagName"));
        if (lit.props)
            if (!Object.isEmpty(attrs))
                lit.props.attr = attrs;
            else
        if (!Object.isEmpty(attrs))
            lit.attr = attrs;
        return lit;
    }
}
Scrap.liInc = 0;