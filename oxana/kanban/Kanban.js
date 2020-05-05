/**
 * This is a Kanban Component
 * 
 * Kreatx 2020
 */

//component definition
let Kanban = function (_props, overrided = false) {
    let _self = this;
    let _dataProvider, _status_name, _tasks_name, _task, _panelRepeater, _bodyRepeater, _listItems, _items;
    let _actions = new ArrayEx();

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider() {
            return _dataProvider;
        },
        set: function dataProvider(v) {
            if (_dataProvider !== v) {
                _dataProvider = v;
            }
            if (_dataProvider && _dataProvider.forEach) {
                _dataProvider.map(function (item) {
                    for (let i = 0; i < item[_tasks_name].length; i++) {
                        _actions.push(item[_tasks_name][i]);
                    }
                });
            }
        },
        enumerable: true
    });


    let _defaultParams = {
        dataProvider: new ArrayEx([]),
        status_name: " ",
        tasks_name: " ",
        task: " "
    };

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.dataProvider) {
                this.dataProvider = _props.dataProvider;
                _panelRepeater = this.container_fluid.sortable.repeater;
                //_bodyRepeater = _panelRepeater.repeater_body;
                _listItems = _panelRepeater.list_items;
            }
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            // let kanbanCol = $('.list-items');
            // kanbanCol.css('max-height', (window.innerHeight - 100) + 'px');
            // var kanbanColCount = parseInt(kanbanCol.length);
            // $('.container-fluid').css('min-width', (kanbanColCount * 350) + 'px');
        }
    };



    let _cmps;
    let fnContainerDelayInit = function () {
        _cmps = [{
            ctor: Container,
            props: {
                id: "container_fluid",
                classes: ["container-fluid"],
                type: ContainerType.NONE,
                classes: ['container-fluid'],
                components: [{
                    ctor: Container,
                    props: {
                        id: "sortable",
                        type: ContainerType.ROW,
                        classes: ["row", "sortable"],
                        components: [{
                            ctor: Repeater,
                            props: {
                                id: 'repeater',
                                dataProvider: _dataProvider,
                                rendering: {
                                    direction: 'horizontal',
                                },
                                components: [{
                                    ctor: Container,
                                    props: {
                                        id: "list_items",
                                        classes: ["list-items"],
                                        dragover: function (e, ra) {
                                            dragover(e, ra);
                                        },
                                        dragenter: function (e, ra) {
                                            e.preventDefault();
                                        },
                                        drop: function (e, ra) {
                                            drop(e, ra);
                                        },
                                        components: [{
                                                ctor: Heading,
                                                props: {
                                                    id: "header_label",
                                                    classes: ["heading"],
                                                    type: HeadingType.h2,
                                                    label: `{${_status_name}}`
                                                }
                                            },
                                            {
                                                ctor: Repeater,
                                                props: {
                                                    id: "repeater_body",
                                                    dataProvider: `{${_tasks_name}}`,
                                                    rendering: {
                                                        direction: 'vertical',
                                                        wrap: false
                                                    },
                                                    components: [{
                                                        ctor: Container,
                                                        props: {
                                                            id: "lists",
                                                            classes: ["list"],
                                                            components: [{
                                                                ctor: Container,
                                                                props: {
                                                                    id: "items",
                                                                    classes: ['items'],
                                                                    draggable: true,
                                                                    dragstart: function (e, ra) {

                                                                        dragStart(e, ra);
                                                                    },
                                                                    dragend: function (e, ra) {
                                                                        dragEnd(e, ra);
                                                                    },
                                                                    components: [{
                                                                        ctor: Label,
                                                                        props: {
                                                                            id: "action",
                                                                            type: LabelType.label,
                                                                            label: `{${_task}}`
                                                                        }
                                                                    }]
                                                                }
                                                            }]
                                                        }
                                                    }]

                                                }
                                            }
                                        ]
                                    }
                                }]
                            }
                        }]
                    }
                }]
            }
        }];
    };

    //TODO: Implement adding panel and tasks dynamically
    let draggedItem = null;
    let dragStart = function (e, ra) {
        draggedItem = e.target.parentElement.parentElement;
        draggedItem.classList.add('dragging');
        setTimeout(function () {
            draggedItem.style.display = 'none';
        }, 0);
    };

    let dragEnd = function (e, ra) {
        draggedItem = e.target.parentElement.parentElement;
        draggedItem.classList.remove('dragging');
        setTimeout(function () {
            draggedItem.style.display = 'block';
            draggedItem = null;
        }, 0);
    };

    let dragover = function (e, ra) {
        e.preventDefault();
        let item = e.target.parentElement;
        console.log("item", e.target);
        console.log(item);
        if (item) {
            let afterElement = draggableSort(e.clientY);
            console.log(afterElement, "after");
            if (afterElement == null) {
                item.$el[0].appendChild(draggedItem);
            } else {
                console.log("after element", afterElement);
                console.log("draggedItem", draggedItem);
                item.insertBefore(draggedItem, afterElement);
            }
        }
    };

    let drop = function (e, ra) {
        //console.log(e.target.parentElement.parentElement.parentElement.parentElement);
        // e.target.parentElement.parentElement.parentElement.parentElement.appendChild(draggedItem);
        draggedItem.style.display = 'block';
    };

    let draggableSort = function (y) {
        let listItem = $('.items:not(.dragging)');
        let draggableElements = [...listItem];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return {
                    offset: offset,
                    element: child
                };
            } else {
                return closest;
            }
        }, {
            offset: Number.NEGATIVE_INFINITY
        }).element;
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