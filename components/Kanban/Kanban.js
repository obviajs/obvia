/**
 * This is a Kanban Component
 * 
 * Kreatx 2020
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var Kanban = function (_props) {
    let _self = this;
    let _dataProvider, _groupField, _descriptionField, _task, _panelRepeater, _bodyRepeater, _listItems, _items, _repeater;

    let _defaultParams = {
        groupField: " ",
        descriptionField: " ",
        task: " "
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            _panelRepeater = this.container_fluid.sortable.repeater;
            _listItems = _panelRepeater.list_items;
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {

        }
    };



    let _cmps;
    let fnContainerDelayInit = function () {

        _repeater = [{
            ctor: Repeater,
            props: {
                id: 'repeater',
                dataProvider: _dataProvider,
                rendering: {
                    direction: 'horizontal',
                    wrap: false
                },
                classes: ["panel", "panel-primary", "kanban-col", "col-sm-3", "col-md-4", "col-xl-12"],
                components: [{
                    ctor: Container,
                    props: {
                        id: "list_items",
                        classes: ["card bg-light", "list-items"], //list-items
                        components: [{
                                ctor: Container,
                                props: {
                                    id: "card_body",
                                    type: ContainerType.NONE,
                                    classes: ["card-body"],
                                    components: [{
                                            ctor: Heading,
                                            props: {
                                                id: "header_label",
                                                classes: ["card-title", "text-uppercase", "text-truncate", "py-2", "panel-heading"], //panel-heading
                                                type: HeadingType.h2,
                                                align: 'center',
                                                label: `{${_groupField}}`
                                            }
                                        },
                                        {
                                            ctor: Container,
                                            props: {
                                                id: "tasks_container",
                                                classes: ["panel-body"], //panel-body
                                                type: ContainerType.NONE,
                                                dragover: function (e, ra) {
                                                    e.preventDefault();
                                                },
                                                dragenter: function (e, ra) {
                                                    e.preventDefault();
                                                    //e.target.classList.add('drop');
                                                },
                                                drop: _drop,
                                            
                                                components: [{
                                                    ctor: Repeater,
                                                    props: {
                                                        id: "repeater_body",
                                                        dataProvider: `{${_descriptionField }}`,
                                                        rendering: {
                                                            direction: 'vertical',
                                                            wrap: false
                                                        },
                                                        classes: ["kanban-centered", 'card', 'draggable', 'shadow-sm'],
                                                        components: [{
                                                            ctor: Container,
                                                            props: {
                                                                id: "items",
                                                                classes: ['kanban-entry', 'grab'], //kanban-entry', 'grab
                                                                draggable: true,
                                                                type: ContainerType.NONE,
                                                                dragstart: dragStart,
                                                                dragend: dragEnd,
                                                                label: `{${_task}}`
                                                            }
                                                        }]
                                                    }
                                                }]
                                            }
                                        }
                                    ]
                                }
                            },


                        ]
                    }
                }]
            }
        }];

        _cmps = [{
            ctor: Container,
            props: {
                id: "container_fluid",
                classes: ["container-fluid", "pt-3"],
                type: ContainerType.NONE,
                components: [{
                    ctor: Container,
                    props: {
                        id: "sortable",
                        type: ContainerType.ROW,
                        classes: ["row", "flex-row", "flex-sm-nowrap", "py-3"],
                        components: _repeater
                    }
                }]
            }
        }];
    };

    let draggedItem = null;
    let dragStart = function (e, ra) {
        draggedItem = e.target;
        e.originalEvent.dataTransfer.setData('text/html', draggedItem);
        draggedItem.classList.add('dragging');
        setTimeout(function () {
            draggedItem.style.opacity = '0.5';
        }, 0);
    };

    let dragEnd = function (e, ra) {
        draggedItem.classList.remove('dragging');
        setTimeout(function () {
            draggedItem.style.opacity = '1';
            draggedItem = null;
        }, 0);
    };

    let _drop = function (e, ra) {
        e.preventDefault();
        let el = e.currentTarget.firstChild;
        let offset = getBoundingClientOffset(e.target, e.clientX, e.clientY);
        let childCount = e.target.childElementCount - e.currentTarget.childElementCount;

        if(childCount == 0){
            el.appendChild(draggedItem);
        }else if(childCount < 0){
            if(offset.y < 0){
                el.insertBefore(draggedItem, e.target);
            }else {
                if (e.target.nextSibling) {
                    el.insertBefore(draggedItem, e.target.nextSibling);
                } else {
                    el.appendChild(draggedItem);
                }
            }
        }else {
            el.appendChild(draggedItem);
        }
        
        draggedItem.style.display = 'block';
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _dataProvider = _props.dataProvider;
    _groupField = _props.groupField;
    _descriptionField = _props.descriptionField;
    _task = _props.task;
    fnContainerDelayInit();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
};

Kanban.prototype.ctor = 'Kanban';