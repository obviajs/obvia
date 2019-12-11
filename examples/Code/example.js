/*
var myCode = new Code({
    id: "myCode",
    width: 700,
    height: 300                          
});
var myMergeView = new CodeMerge({
    id: "myMergeView",
    width: 700,
    height: 300,
    value: "function a(){}",
    orig: "function b(){}"   
});
$('#root').append(myCode.render());
$('#root').append(myMergeView.render());
*/
let cnt = new Container({
    id: "mainContainer",    
    type: ContainerType.NONE,                          
    components:[
    {
        ctor: Nav,
        props: {
            id: "mainNav",
            height:40,
            classes: ["d-flex"],
            components:[
                {
                    ctor: Container,
                    props: {
                        type: ContainerType.NONE,  
                        width: 250,
                        components:[
                            {
                                ctor: Label,
                                props:{
                                    id: "mySideNavToggle",
                                    label: "Code"
                                }
                            }
                        ]
                    }
                },
                {
                    ctor: Container,
                    props: {
                        type: ContainerType.NONE,  
                        components:[
                            {
                                ctor: Link,
                                props:{
                                    classes: ["fas", "fa-bars"],
                                    click: _mySideNavToggleClick
                                }
                            }
                        ]
                    }
                },
                {
                    ctor: Link,
                    props: {
                        id: "deployBtn",
                        label: "Deploy",
                        spacing: {mr:1},
                        components: [{
                            ctor: Label,
                            props: {
                                id: 'fa',
                                labelType: LabelType.i,
                                classes: ["fas","fa-rocket"]
                            }
                        }]
                    }
                },
                {
                    ctor: Link,
                    props: {
                        id: "versionsBtn",
                        label: "Versions",
                        spacing: {mr:1},
                        components: [{
                            ctor: Label,
                            props: {
                                id: 'fa',
                                labelType: LabelType.i,
                                classes: ["fas","fa-list-ol"]
                            }
                        }]
                    }
                },
                {
                    ctor: Link,
                    props: {
                        id: "uploadBtn",
                        label: "Save",
                        spacing: {mr:1},
                        components: [{
                            ctor: Label,
                            props: {
                                id: 'fa',
                                labelType: LabelType.i,
                                classes: ["fas","fa-cloud-upload-alt"]
                            }
                        }]
                    }
                },
                {
                    ctor: Link,
                    props: {
                        id: "removeBtn",
                        label: "Delete",
                        spacing: {mr:1},
                        components: [{
                            ctor: Label,
                            props: {
                                id: 'fa',
                                labelType: LabelType.i,
                                classes: ["fas","fa-trash"]
                            }
                        }]
                    }
                }     
            ]
        }
    },
    {
        ctor: Container,
        props: {
            type: ContainerType.NONE,                        
            id: "ideContainer",
            width: '100%',
            height: '100%',   
            classes: ["d-flex", "flex-shrink-0"],
            components:[
                {
                    ctor: SideNav,
                    props: {
                        id: "mySideNav",
                        width: 250,
                        classes: ["sidenav"],
                        components: [
                            {
                                ctor: Tree, 
                                props: {
                                    id: 'componentModelTree',
                                    valueField: "key",
                                    labelField: "title",
                                    childrenField: "children",
                                    dataProvider:new ArrayEx([]),
                                    expandIcon: "fa-chevron-circle-right",
                                    collapseIcon: "fa-chevron-circle-down",
                                    click : componentModelTree_click
                                }
                            },
                            {
                                ctor: Container,
                                props: {
                                    id: "todosCnt",
                                    components: [
                                        {
                                            ctor: Link,
                                            props: {
                                                id: "todosCollapse",
                                                attr: {"data-toggle" :"collapse"},
                                                label: "TODOs",
                                                classes: ["collapse_icon"],
                                                components: [
                                                    {
                                                        ctor: Label,
                                                        props: {
                                                            //,classes: ["fas", "fa-angle-down"]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            ctor: Repeater,
                                            props: {
                                                id: "todosRepeater",
                                                rendering: {
                                                    direction: 'vertical'
                                                },
                                                components:[
                                                    {
                                                        ctor: Link,
                                                        props:{
                                                            id:"todoItem",
                                                            label: "{comment}",
                                                            href: "#",
                                                            target: "",
                                                            "click": todoItemClick
                                                        }
                                                    }
                                                ],
                                                dataProvider: new ArrayEx([]),
                                                classes: ["collapse"],
                                                afterAttach: _bindCollapsible
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    ctor: Code,
                    props: {
                        id: "myCode",
                        type: ContainerType.NONE,
                        height: '100vh',  
                        changes: changesMade,
                        creationComplete: _focusEditor
                    }
                },
            ]
        }
    },
    {
        ctor: Footer,
        props: {
            id: "footer",
            height:30,
            classes: ["d-flex"],
            components:[]
        }
    }  
]});
cnt.renderPromise().then(function($el){
    $('#root').append($el);
});
function _mySideNavToggleClick(){
    cnt.ideContainer.mySideNav.toggleVisibility();
}
function _focusEditor(){
    cnt.ideContainer.myCode.cmInst.focus();
}
    
function _bindCollapsible(){
    cnt.ideContainer.mySideNav.todosCnt.todosCollapse.href = "#"+ this.domID;
}
function changesMade(e){
    //e.changes;
    _debouncedHandler(e.cmInst);
    
}

let _debouncedHandler = debounce(function(cmInst){
    let todos = new ArrayEx([]);
    let len = cmInst.lineCount();
    for(let i=0;i<len;i++){
        let lnTokens = cmInst.getLineTokens(i); 
        let lenInner = lnTokens.length;
        for(let j=0;j<lenInner;j++){
            if(lnTokens[j].type == "comment"){
                
                let abvr = (lnTokens[j].string.substr(0, 6)).toUpperCase();
                let commentType;
                switch(abvr){
                    case "//TODO": commentType = 1; break;
                    case "//NOTE": commentType = 2; break;
                    case "//ATTN": commentType = 3; break;
                    default: continue;
                }
                let comment = lnTokens[j].string.substr(7, lnTokens[j].string.length);
                todos.push({"line": i, "commentType": commentType, "comment":comment});
            }
        }
        cnt.ideContainer.mySideNav.todosCnt.todosRepeater.dataProvider = todos;
        console.log(todos);
    }                                  
}, 500); 

function todoItemClick(e, ra)
{
    cnt.ideContainer.myCode.cmInst.focus();
    cnt.ideContainer.myCode.cmInst.scrollIntoView({line:ra.currentItem.line, ch:0}, 200);
    cnt.ideContainer.myCode.cmInst.setCursor({line: ra.currentItem.line, ch: 0});
}

function componentModelTree_click(e, ra)
{
    
}