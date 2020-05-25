/**
 * This is a Kanban Component
 * 
 * Kreatx 2020
 */

//component definition
let Kanban = function (_props, overrided = false) {
    let _self = this;
    let _dataProvider, _status_name, _tasks_name, _task, _panelRepeater, _bodyRepeater, _listItems, _items, _repeater;
    //let _actions = new ArrayEx();

    // Object.defineProperty(this, "dataProvider", {
    //     get: function dataProvider() {
    //         return _dataProvider;
    //     },
    //     set: function dataProvider(v) {
    //         if (_dataProvider !== v) {
    //             _dataProvider = v;
    //         }
    //         if (_dataProvider && _dataProvider.forEach) {
    //             _dataProvider.map(function (item) {
    //                 for (let i = 0; i < item[_tasks_name].length; i++) {
    //                     _actions.push(item[_tasks_name][i]);
    //                 }
    //             });
    //         }
    //     },
    //     enumerable: true
    // });


    let _defaultParams = {
        dataProvider: new ArrayEx([]),
        status_name: " ",
        tasks_name: " ",
        task: " "
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            //this.dataProvider = _props.dataProvider;
            _panelRepeater = this.container_fluid.sortable.repeater;
            //_bodyRepeater = _panelRepeater.repeater_body;
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
                classes: ["panel", "panel-primary", "kanban-col"],
                components: [{
                    ctor: Container,
                    props: {
                        id: "list_items",
                        classes: ["list-items"],
                        components: [{
                                ctor: Heading,
                                props: {
                                    id: "header_label",
                                    classes: ["panel-heading"],
                                    type: HeadingType.h2,
                                    align: 'center',
                                    label: `{${_status_name}}`
                                }
                            },
                            {
                                ctor: Container,
                                props: {
                                    id: "tasks_container",
                                    classes: ["panel-body"],
                                    type: ContainerType.NONE,
                                    dragover: function (e, ra) {
                                        e.preventDefault();
                                    },
                                    dragleave: function (e, ra) {
                                        //
                                    },
                                    dragenter: function (e, ra) {
                                        e.preventDefault();
                                    },
                                    drop: function (e, ra) {
                                        drop(e, ra);
                                    },
                                    components: [{
                                        ctor: Repeater,
                                        props: {
                                            id: "repeater_body",
                                            dataProvider: `{${_tasks_name}}`,
                                            rendering: {
                                                direction: 'vertical',
                                                wrap: false
                                            },
                                            classes: ["kanban-centered"],
                                            components: [{
                                                ctor: Container,
                                                props: {
                                                    id: "items",
                                                    classes: ['kanban-entry', 'grab'],
                                                    draggable: true,
                                                    dragstart: function (e, ra) {
                                                        dragStart(e, ra);
                                                    },
                                                    dragend: function (e, ra) {
                                                        dragEnd(e, ra);
                                                    },
                                                    label: `{${_task}}`
                                                    // components: [{
                                                    //     ctor: Label,
                                                    //     props: {
                                                    //         id: "action",
                                                    //         classes: ["kanban-entry-inner", "kanban-label"],
                                                    //         type: LabelType.h3,
                                                    //         label: `{${_task}}`
                                                    //     }
                                                    // }]
                                                }
                                            }]
                                        }
                                    }]
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
                classes: ["container-fluid"],
                type: ContainerType.NONE,
                components: [{
                    ctor: Container,
                    props: {
                        id: "sortable",
                        type: ContainerType.ROW,
                        classes: ["row"],
                        components: _repeater
                    }
                }]
            }
        }];
    };

    this.addPanel = function (task_name, index) {
        let i = index !== undefined ? index : _panelRepeater.currentIndex;
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

    let drop = function (e, ra) {
        e.preventDefault();
        let el;
        let offset = getBoundingClientOffset(e.target, e.clientY);
        let childCount = e.target.childElementCount;
        if (childCount > 0) {
            el = e.target;
        } else {
            el = e.target.parentElement;
        }
        //let index = Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode);
        if (offset < 0) {
            el.insertBefore(draggedItem, e.target);
        } else {
            if (e.target.nextSibling) {
                el.insertBefore(draggedItem, e.target.nextSibling);
            } else {
                el.appendChild(draggedItem);
            }
        }
        draggedItem.style.display = 'block';
    };

    let getBoundingClientOffset = function (target, y) {
        let box = target.getBoundingClientRect();
        return y - box.top - box.height / 2;
    };

    _props = extend(false, false, _defaultParams, _props);
    _dataProvider = _props.dataProvider;
    _status_name = _props.status_name;
    _tasks_name = _props.tasks_name;
    _task = _props.task;
    fnContainerDelayInit();
    _props.components = _cmps;
    let r = Container.call(this, _props);
    return r;
};

Kanban.prototype.ctor = 'Kanban';