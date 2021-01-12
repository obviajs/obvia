let Implementation = function(applet) {
    let app = applet.app;
    let data = applet.data;

    //searchForm and toDoList are taken from applet
    let searchForm;
    let toDoList;

    //id and title are parameters for the todo object
    let toDoId = 1;
    let toDoTitle;

    //todo is the object to be added
    let toDo;

    let imp = {
        BEGIN_DRAW: async function(e) {},

        END_DRAW: function(e) {

            searchForm = applet.view.find("textField");
            toDoList = applet.view.find("todolist");

            applet.addBehaviors(
                searchForm, {
                    keyup: {
                        ADD_TODO: {
                            filter: KeyboardUtils.test["ENTER"],
                        },
                    },
                },
                false
            );

            applet.addBehaviors(
                toDoList, {
                    "rowAdd": "PREPARE_COMPONENT"
                });
        },

        //this function displays the parameter given from the search form in the todo list

        ADD_TODO: function(e) {
            toDoTitle = e.target.value;
            if (toDoTitle.trim()) {
                toDo = {
                    id: toDoId,
                    title: toDoTitle,
                };
                console.log(toDo);
                toDoList.dataProvider.splice(toDoList.dataProvider.length, 0, toDo);
                toDoId++;
            }
            e.target.value = "";
        },

        //prepares the addbutton with the behavior
        PREPARE_COMPONENT: function(e, r, ra) {
            if (ra) {
                applet.addBehaviors(ra.currentRow.addbutton, {
                    click: {
                        CLICK_TODO: {
                            onPropagation: true,
                        },
                    },
                });
            }
        },

        //changes the box if the button is clicked
        CLICK_TODO: function(e) {
            console.log(e.target.textContent);
            if (e.target.textContent == "☐") {
                e.target.textContent = "☒";
            } else {
                e.target.textContent = "☐";
            }
        },
    };
    return imp;
};

Implementation.ctor = "Implementation";
export { Implementation };