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
    type: ContainerType.NONE,                        
    id: "ideContainer",
    width: '100%',
    height: '100%',   
    classes: ["d-flex"],
    components:[
        {
            ctor: SideNav,
            props: {
                id: "mySideNav",
                width: 250,
                classes: ["sidenav"],
                components: [
                    {
                        ctor: Repeater,
                        props: {
                            id: "todos",
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
                            dataProvider: new ArrayEx([])
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
                width: '100%',
                height: '100vh',  
                changes: changesMade
            }
        },
    ]
});

$('#root').append(cnt.render());
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
        cnt.mySideNav.todos.dataProvider = todos;
        console.log(todos);
    }                                  
}, 500); 

function todoItemClick(e, ra)
{
    cnt.myCode.cmInst.focus();
    cnt.myCode.cmInst.scrollIntoView({line:ra.currentItem.line, ch:0}, 200);
    cnt.myCode.cmInst.setCursor({line: ra.currentItem.line, ch: 0});
}