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
            },
            {
                task_name: "go to work"
            },
            {
                task_name: "go to work"
            }
        ]
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

});

function addPanel() {
    myKanban.addPanel('Now');
}

let button = {
    ctor: Button,
    props: {
        id: "add_button",
        label: "Add",
        classes: ["btn", "btn-primary"]
    }
};

//myKanban.addComponent(button);


myKanban.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});