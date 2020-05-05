let dp = [{
        status: "TODO",
        tasks: [{
                task_name: "Meet a friend"
            },
            {
                task_name: "go out for dinner"
            }
        ],

    },
    {
        status: "Done",
        tasks: [{
                task_name: "Wash the car"
            },
            {
                task_name: "go out for walk"
            }
        ]
    },
    {
        status: "In Progress",
        tasks: [{
            task_name: "create Kanban component"
        }]
    },
    {
        status: "Later",
        tasks: [{
            task_name: "Play football"
        }]
    }
];

let myKanban = new Kanban({
    id: "kanban",
    status_name: "status",
    tasks_name: "tasks",
    task: "task_name",
    dataProvider: dp,
    components: [{
        ctor: Button,
        props: {
            id: "button",
            classes: ["btn", "btn-primary"],
            label: "Add"
        }
    }]
});


myKanban.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});