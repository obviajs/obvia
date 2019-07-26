
//Template literal for global App style
const appStyle = `
.ew-resize {cursor: ew-resize !important;}
.ns-resize {cursor: ns-resize !important;}
`;
var oxana = new App({
    style:appStyle
}); 

var _DOMMutationHandler = function (e) {
    //Google translate will add font/font/text nodes to the translated label
    if(e.mutation.addedNodes.length>0 && e.mutation.addedNodes[0].childNodes.length>0 && e.mutation.addedNodes[0].childNodes[0].childNodes.length>0){
        this.label = e.mutation.addedNodes[0].childNodes[0].childNodes[0].data;
    }
};

var zeroCool = {
        constructor: Container,
        props: {
            id: 'zeroCool',
            type: ContainerType.NONE,
            components:[
                {
                    constructor: BrowserWindow,
                    props: {
                        id:"testWindow",
                        //afterAttach:function(){},
                        components:[
                            {
                                constructor: Container,
                                props: {
                                    id: '',
                                    type: ContainerType.ROW,
                                    height: 800,
                                    components:[
                                        {
                                            constructor: Container,
                                            props: {
                                                id: '',
                                                type: ContainerType.COLUMN,
                                                spacing: {colSpan:3},
                                                classes:["border"],
                                                components:[
                                                    {
                                                        constructor: Container,
                                                        props: {
                                                            spacing: {h:100},
                                                            components:[
                                                                {
                                                                    constructor: Container,
                                                                    props: {
                                                                        id: '',
                                                                        type: ContainerType.ROW,
                                                                        spacing: {h:10},
                                                                        components:[
                                                                            {
                                                                                constructor: Container,
                                                                                props: {
                                                                                    type: ContainerType.COLUMN,
                                                                                    spacing: {colSpan:12, h:100},
                                                                                    id: 'toolBar',
                                                                                    classes:["border"],
                                                                                    components:[
                                                                                        {
                                                                                            constructor: Button,
                                                                                            props: {
                                                                                                id: 'splitHorizontal',
                                                                                                type: "button",
                                                                                                components: [{
                                                                                                    constructor: Label,
                                                                                                    props: {
                                                                                                        id: 'fa',
                                                                                                        labelType: LabelType.i,
                                                                                                        classes: ["fas","fa-columns","fa-rotate-270"]
                                                                                                    }
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            constructor: Button,
                                                                                            props: {
                                                                                                id: 'splitVertical',
                                                                                                type: "button",
                                                                                                components: [{
                                                                                                    constructor: Label,
                                                                                                    props: {
                                                                                                        id: 'fa',
                                                                                                        labelType: LabelType.i,
                                                                                                        classes: ["fas","fa-columns"]
                                                                                                    }
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            constructor: Button,
                                                                                            props: {
                                                                                                id: 'saveLayout',
                                                                                                type: "button",
                                                                                                components: [{
                                                                                                    constructor: Label,
                                                                                                    props: {
                                                                                                        id: 'fa',
                                                                                                        labelType: LabelType.i,
                                                                                                        classes: ["fas","fa-save"]
                                                                                                    }
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            constructor: Button,
                                                                                            props: {
                                                                                                id: 'selectBtn',
                                                                                                type: "button",
                                                                                                components: [{
                                                                                                    constructor: Label,
                                                                                                    props: {
                                                                                                        id: 'fa',
                                                                                                        labelType: LabelType.i,
                                                                                                        classes: ["fas","fa-folder-open"]
                                                                                                    }
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            constructor: Modal,
                                                                                            props: {
                                                                                                id: 'fileSelectModal',
                                                                                                size: ModalSize.LARGE,
                                                                                                title: 'Select File',
                                                                                                components: [
                                                                                                    {
                                                                                                        constructor: UploadEx,
                                                                                                        props: {
                                                                                                            id: "browseFile",
                                                                                                            multiple: false,
                                                                                                            showProgress: false
                                                                                                        }
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                },
                                                                {
                                                                    constructor: Container,
                                                                    props: {
                                                                        id: '',
                                                                        type: ContainerType.ROW,
                                                                        spacing: {h:90},
                                                                        components:[
                                                                            {
                                                                                constructor: Container,
                                                                                props: {
                                                                                    type: ContainerType.COLUMN,
                                                                                    spacing: {colSpan:12, h:100},
                                                                                    id: 'historySteps',
                                                                                    classes:["border"],
                                                                                    components:[
                                                                                        {
                                                                                            constructor: List,
                                                                                            props: {
                                                                                                id: 'listHistorySteps',
                                                                                                direction: 'vertical',
                                                                                                multiselect: false,
                                                                                                dataProvider: oxana.history.steps,
                                                                                                valueField: "id",
                                                                                                classesField: "listItemClass",
                                                                                                defaultClasses: [],
                                                                                                selectedClasses: ["active-node"],   
                                                                                                component: {
                                                                                                    constructor: Label,
                                                                                                    props: {
                                                                                                        id: 'labelHistoryStep',
                                                                                                        value: "{id}",
                                                                                                        label: "{description}",
                                                                                                        classes: "{?listItemClass}",
                                                                                                        DOMMutation: _DOMMutationHandler,
                                                                                                        click: function(e){e.preventDefault();}
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]    
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    constructor: Container,
                    props: {
                        id: '',
                        type: ContainerType.ROW,
                        height: 800,
                        components:[
                            {
                                constructor: Container,
                                props: {
                                    type: ContainerType.COLUMN,
                                    spacing: {colSpan:12},    
                                    id: "snowCrash",
                                    components:[
                                        {
                                            constructor: Container,
                                            props: {
                                                spacing: {h:100},
                                                type: ContainerType.NONE,
                                                components:[
                                                    {
                                                        constructor: Container,
                                                        props: {
                                                            id: '',
                                                            type: ContainerType.ROW,
                                                            spacing: {h:100},
                                                            components:[
                                                                {
                                                                    constructor: Container,
                                                                    props: {
                                                                        type: ContainerType.COLUMN,
                                                                        spacing: {colSpan:12, h:100},
                                                                        id: 'workArea',
                                                                        classes:["border"]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }                        
                }
            ]
        }
    };

oxana.components = [
        {
            constructor: ViewStack,
            props: {
                components: [zeroCool]
            }
        }        
    ];

var waBehaviors = {
    "click": "BECOME_ACTIVE",
    "mouseover": "WA_HOVER",
    "mouseout": "WA_HOVER",
    "mousemove": {
        "IS_WA_RESIZE_NS": isMouseMoveNS
    },
    "resize": "WA_RESIZE",
    "contextmenu": "WA_REMOVE"
};



oxana.behaviors["splitHorizontal"] = {};
oxana.behaviors["splitHorizontal"]["click"] = "SPLIT_HOR";

oxana.behaviors["splitVertical"] = {};
oxana.behaviors["splitVertical"]["click"] = "SPLIT_VERT";

oxana.behaviors["saveLayout"] = {};
oxana.behaviors["saveLayout"]["click"] = "SAVE_LAYOUT";

oxana.behaviors["selectBtn"] = {};
oxana.behaviors["selectBtn"]["click"] = "FILE_SELECT_MODAL";

oxana.behaviors["browseFile"] = {};
oxana.behaviors["browseFile"]["change"] = "FILE_SELECTED";

oxana.behaviors["listHistorySteps"] = {};
oxana.behaviors["listHistorySteps"]["change"] = "HISTORY_STEP_DETAILS";

oxana.behaviors["workArea"] = waBehaviors;

oxana.behaviors[oxana.rootID]["keydown"] = {
    "WA_UNDO":isKeyCombUndo,
    "WA_REDO":isKeyCombRedo,
};

oxana.behaviorimplementations["HISTORY_STEP_DETAILS"] = function(e){
    console.log("called HISTORY_STEP_DETAILS.");
};
oxana.behaviorimplementations["FILE_SELECT_MODAL"] = function(e){
    console.log("called FILE_SELECT_MODAL.");
    Component.instances["fileSelectModal"].show();
};
oxana.behaviorimplementations["FILE_SELECTED"] = function(e){
    console.log("called FILE_SELECTED.");
    if(Component.instances["browseFile"].value.length>0){
        readFile(Component.instances["browseFile"].value[0]).then(function(resp){
            Component.instances["fileSelectModal"].hide();
            var evt = new jQuery.Event("loadLayout");
            evt.content = resp.content;
            oxana.root.trigger(evt);
        })
        .catch(function(resp){
            alert(resp.description);
        });
    }
};
oxana.behaviors[oxana.rootID]["loadLayout"] = "LOAD_LAYOUT";
oxana.behaviorimplementations["LOAD_LAYOUT"] = function(e){
    var _cmp = JSON.parse(e.content);
    Component.instances["workArea"].removeAllChildren(0);
    if(_cmp.props.id == "workArea"){
        for(var i=0;i<_cmp.props.components.length;i++){
            var inst = Component.instances["workArea"].addComponent(_cmp.props.components[i]);
            addBehaviors(inst, waBehaviors);
        }
    }else{
        var inst = Component.instances["workArea"].addComponent(_cmp);
        addBehaviors(inst, waBehaviors);
    }
    
};
function addBehaviors(cmp, behaviors)
{
    oxana.behaviors[cmp.id] = behaviors;
    for(var cid in cmp.children){
        addBehaviors(cmp.children[cid], behaviors);
    }
}
oxana.behaviorimplementations["HISTORY_STEP_ADDED"] = function(e){
    console.log("called HISTORY_STEP_ADDED.", e.current);
    Component.instances["listHistorySteps"].value = e.current;

};
oxana.behaviorimplementations["HISTORY_UNDONE"] = function(e){
    console.log("called HISTORY_UNDONE.");
    Component.instances["listHistorySteps"].value = e.previous;

};

oxana.behaviorimplementations["HISTORY_REDONE"] = function(e){
    console.log("called HISTORY_REDONE.");
    Component.instances["listHistorySteps"].value = e.redone;
};

oxana.behaviorimplementations["SPLIT_HOR"] = {
    //description: "Split selected container horizontally",
    description: "Ndaje horizontalisht",
    do:function(e) {
        var retFromRedoMaybe = arguments[arguments.length-1];
        if(retFromRedoMaybe.container){
            activeContainer = retFromRedoMaybe.container;
            console.log("called SPLIT_HOR from History(REDO).");
        }
        console.log("Split Selected Container Horizontally");
        var ret = {track:false};
        var newRow = {
                constructor: Container,
                props: {
                    id: '',
                    type: ContainerType.ROW,
                    spacing: {h:100, m:"auto"},
                    components:[
                        {
                            constructor: Container,
                            props: {
                                type: ContainerType.COLUMN,
                                spacing: {colSpan:12, h:100}, 
                                id: 'workArea',
                                classes:["border"]
                            }
                        }
                    ]
                }
            };
        var newRow2;
        if(activeContainer.components.length==0)
        {
            newRow2 = extend(true, newRow);
        }
        var newRowInstance;
        if(retFromRedoMaybe.child){
            newRowInstance = retFromRedoMaybe.child;
            activeContainer.addChild(newRowInstance);
        }else
            newRowInstance = activeContainer.addComponent(newRow);
        var newWorkArea = newRowInstance.children[newRowInstance.components[0].props.id];
        oxana.behaviors[newWorkArea.id] = waBehaviors;
    // oxana.behaviors[newWorkArea.id]["mousemove"]["WA_RESIZE_EW"] = isMouseMoveEW;
        //{filter: isMouseMoveEw, otherProperties...}

        if(activeContainer.components.length==1)
        {
            var newRowInstance2;
            if(retFromRedoMaybe.child2){
                newRowInstance2 = retFromRedoMaybe.child2;
                activeContainer.addChild(newRowInstance2);
            }else
                newRowInstance2 = activeContainer.addComponent(newRow2);
                
            var newWorkArea2 = newRowInstance2.children[newRowInstance2.components[0].props.id];
            oxana.behaviors[newWorkArea2.id] = waBehaviors;
            ret.child2 = newRowInstance2;
        }

        ret.child = newRowInstance;
        ret.parent = activeContainer;
        ret.container = activeContainer;
        ret.track = true;
        childrenAutoHeight(activeContainer);
        return ret;
    },
    undo:function(){
        console.log("Undo SPLIT_HOR ", arguments);
        /**
         *  Params that we get here:
         *  p.event original parameters of the event that caused this behavior
         *  p.filterReturn optional: return value of filter function
         *  p.behaviorReturn return value of the behavior implementation function
         * */
        /** 
         * what if every component generates its undo action for every action called on its instance
        */
        /**
         * ret.container = container;
                    ret.child = this.parent; */
        var ret = arguments[arguments.length-1];
        ret.parent.removeChild(ret.child, 0);
        if(ret.child2){
            ret.parent.removeChild(ret.child2, 0);
        }
        childrenAutoHeight(ret.parent);
    }
};

oxana.behaviorimplementations["SPLIT_VERT"] = {
    description: "Split selected container vertically",
    do:function(e) {
        var retFromRedoMaybe = arguments[arguments.length-1];
        if(retFromRedoMaybe.container){
            activeContainer = retFromRedoMaybe.container;
            console.log("called SPLIT_VERT from History(REDO).");
        }
        console.log("Split Selected Container Vertically");
        var ret = {track:false};
        var newCell = {
            constructor: Container,
            props: {
                type: ContainerType.COLUMN,
                spacing: {colSpan:12, h:100}, 
                id: 'workArea',
                classes:["border"]
            }
        };
        var row_len = activeContainer.components.length;
        var toAdd = newCell;
        var parent;
        var children_len = 2;
        
        if(row_len == 0)
        {
            var newCell2 = extend(true, newCell);
            
            //.spacing.colSpan count children and distribute 12 units of space to them. the last child gets the reminder
            toAdd = {
                constructor: Container,
                props: {
                    id: '',
                    type: ContainerType.ROW,
                    spacing: {h:100, m:"auto"},
                    components:[newCell, newCell2]
                }
            };
            parent =  activeContainer;
        }else
        {
            parent =  activeContainer.children[activeContainer.components[0].props.id];
            children_len = parent.components.length;
        } 
        if(children_len<12)
        {    
            var newInstance;
            if(retFromRedoMaybe.child){
                newInstance = retFromRedoMaybe.child;
                activeContainer.addChild(newInstance);
            }else
                newInstance = parent.addComponent(toAdd);
            var row =  activeContainer.children[activeContainer.components[0].props.id];
            children_len = row.components.length;

            var colSpan = Math.floor(12/children_len);  
            var delta = 12 - colSpan*children_len;
            var i = 0;    
            for(var childID in row.children){
                ++i;
                if(i==children_len-1)
                    row.children[childID].spacing.colSpan = colSpan+delta;
                else
                    row.children[childID].spacing.colSpan = colSpan;
                var workArea = row.children[childID];    
                //var workArea = cell.children[cell.components[0].props.id];
                oxana.behaviors[workArea.id] = waBehaviors;
            } 
            ret.parent = parent;
            ret.child = newInstance;
            ret.container = activeContainer;
            ret.track = true;
        }else
        {
            alert("You may have up to 12 columns for each row.");
        }
        return ret;
    },
    undo:function(){
        console.log("Undo SPLIT_VERT ", arguments);
        /**
         *  Params that we get here:
         *  p.event original parameters of the event that caused this behavior
         *  p.filterReturn optional: return value of filter function
         *  p.behaviorReturn return value of the behavior implementation function
         * */
        /** 
         * what if every component generates its undo action for every action called on its instance
        */
        /**
         * ret.container = container;
                    ret.child = this.parent; */
        var ret = arguments[arguments.length-1];
        ret.parent.removeChild(ret.child, 0);
        childrenAutoWidth(ret.parent);
    }
};

var activeContainer;
oxana.behaviorimplementations["BECOME_ACTIVE"] = {
    do:function(e) {
            console.log("Container Became active");
            //this will holde the instance of the component who manifested this behavior (the manifestor)
            if(activeContainer && activeContainer!=this && activeContainer.classes.indexOf("active-node")>-1){
                activeContainer.toggle = false;
                var classes = activeContainer.classes.slice(0);
                classes.toggle("active-node");
                activeContainer.classes = classes;
            }
            this.toggle = false;
            var classes = this.classes.slice(0);
            classes.pushUnique("active-node");
            this.classes = classes;
            activeContainer = this;
        },
        stopPropagation:true
    };

oxana.behaviorimplementations["WA_HOVER"] = {
    do:function(e) {
            console.log("Container hovered "+this.id);
            //this will holde the instance of the component who manifested this behavior (the manifestor)
            this.toggle = false;
            var classes = this.classes.slice(0);
            classes.toggle("hovered");
            this.classes = classes;
        },
        stopPropagation:true
    };

oxana.behaviorimplementations["IS_WA_RESIZE_NS"] = {
    do:function(e) {
        console.log("Container Resize NS");
      
    },
    stopPropagation:true
};
oxana.behaviorimplementations["WA_RESIZE"] = {
    do:function(e) {
        var retFromRedoMaybe = arguments[arguments.length-1];
        if(retFromRedoMaybe.container){
            console.log("called WA_RESIZE from History(REDO).");
        }else
             console.log("WA_RESIZE");
        var ret = {track:false};
       
        var manifestor = this, dy = e.dy, dx=e.dx;
        containerResize(manifestor, dx, dy);
        ret.description = "Container resize"+(dx?" dx:"+dx:"")+(dy?" dy:"+dy:""); 
        ret.track = true;
        return ret;
    },
    undo:function(e){
        console.log("Undo WA_RESIZE ", arguments);
        var manifestor = this, dy = e.dy, dx=e.dx;
        containerResize(manifestor, -1*dx, -1*dy);
    },
    stopPropagation:true
};
oxana.behaviorimplementations["WA_REMOVE"] = {
    description:"Container Removed",
    do:function(e) {
        var retFromRedoMaybe = arguments[arguments.length-1];
        if(retFromRedoMaybe.container){
            console.log("called WA_REMOVE from History(REDO).");
        }
        var ret = {track:false};
        console.log("Container REMOVE ", arguments);
        var c = true;
        if(this.components.length>0){
            c = confirm("Container has children, still want to remove ?");
        }
        if(c){
            if(this.parent.parent.components.length==1)
            {
                if(this.parent.components.length>2){
                    var row = this.parent;
                    row.removeChild(this);
                    childrenAutoWidth(row);
                    ret.track = true;
                    ret.container = row;
                    ret.child = this;
                    ret.removeType = "COLUMN"; 
                }else{

                }
                console.log("column ", this.parent.components.length);
                //this.parent.components
            }else{
                if(this.parent.parent.components.length>2){
                    var container = this.parent.parent;
                    container.removeChild(this.parent, 0);
                    childrenAutoHeight(container);
                    ret.track = true;
                    ret.container = container;
                    ret.child = this.parent;
                    ret.removeType = "ROW"; 
                }else{

                }
                console.log("row ", this.parent.parent.components.length);
            }
            
        }
        e.preventDefault();
        return ret;
    },
    undo:function(){
        console.log("Undo WA_REMOVE ", arguments);
        /**
         *  Params that we get here:
         *  p.event original parameters of the event that caused this behavior
         *  p.filterReturn optional: return value of filter function
         *  p.behaviorReturn return value of the behavior implementation function
         * */
        /** 
         * what if every component generates its undo action for every action called on its instance
        */
         /**
          * ret.container = container;
                    ret.child = this.parent; */
        var ret = arguments[arguments.length-1];
        ret.container.addChild(ret.child);
        if(ret.removeType=="COLUMN"){
            childrenAutoWidth(ret.container);
        }else{
            childrenAutoHeight(ret.container);
        }
    },
    stopPropagation:true
};

oxana.behaviorimplementations["SAVE_LAYOUT"] = {
    do:function(e) {
        var workArea = Component.instances["workArea"];
        var jsonLayout = JSON.stringify(workArea.literal, null, "\t");
        download("snowCrash.json.txt", jsonLayout); 
    },
    stopPropagation:true
};

oxana.behaviorimplementations["WA_UNDO"] = {
    do:function(e) {
        console.log("UNDO");
        oxana.history.undo();
    },
    stopPropagation:false
};
oxana.behaviorimplementations["WA_REDO"] = {
    do:function(e) {
        console.log("REDO");
        oxana.history.redo();
    },
    stopPropagation:false
};

oxana.behaviorimplementations["APP_LOADED"] = new ArrayEx(oxana.behaviorimplementations["APP_LOADED"], function(e) {
    Component.instances["testWindow"].show();
});

oxana.registerBehaviors();
oxana.init();


//filter to determine if mousemove is an "WA_RESIZE_NS" behavior
var debouncedDragNS;
var d0;
function isMouseMoveNS(e){
    if(((e.which && e.which==1) || (e.buttons && e.buttons==1)) && (this.parent.parent.components.length>=2 || this.parent.components.length>=2))
    {
        var manifestor = this;
        var classes = manifestor.classes.slice(0);
        classes = classes.difference(["ns-resize", "ew-resize"]);
            
        if(d0 && !debouncedDragNS)
        {    
            if(Math.abs(d0.y-e.pageY) > Math.abs(d0.x-e.pageX)) 
            {
                classes.pushUnique("ns-resize");
            }else
            {
                classes.pushUnique("ew-resize");
            }
            manifestor.classes = classes;
        }
        d0 = { x: e.pageX, y: e.pageY };
        
        if(!debouncedDragNS){
            var p0 = { x: e.pageX, y: e.pageY };
            console.log("prior of debounced");
            console.log(p0);
            debouncedDragNS = debounce(function(evt){
                console.log("debounced");
                var p1 = { x: evt.pageX, y: evt.pageY};
                console.log(p0);
                console.log(p1);
                var dy = p1.y - p0.y;
                var dx = p1.x - p0.x;
                var evt = new jQuery.Event("resize");
                if(dy!=0 && manifestor.parent.parent.components.length>=2){
                    dy = -dy;
                    evt.dy = dy;
                }
                if(dx!=0 && manifestor.parent.components.length>=2){
                    dx = -dx;
                    evt.dx = dx;
                }
                if(dx !=0 || dy!=0)
                    manifestor.trigger(evt);
                console.log("Vertical drag of :", dy, manifestor.$el.height());
                
                debouncedDragNS = null;

                var classes = manifestor.classes.slice(0);
                classes = classes.difference(["ns-resize", "ew-resize"]);
                //classes.splice(i, 1);
                manifestor.classes = classes;
            }, 500);
        }
        debouncedDragNS(e);
        return true;
        //{qualifies, extraArgs}
        // extraArgs array with additional arguments to be passed to the behavior implementation/do
    }else
    {
       // var i = this.classes.indexOf("ns-resize")
       // if(i>0){
            var classes = this.classes.slice(0);
            classes = classes.difference(["ns-resize", "ew-resize"]);
            //classes.splice(i, 1);
            this.classes = classes;
        //}

    }
}

//behavior can cause another behavior (throws custom event, so we may avoid filter functions...)

function isKeyCombUndo(e){
    if ((e.keyCode == 90 || e.keyCode == 122) && ((Env.getInstance().current == EnvType.MAC && e.metaKey && !e.shiftKey) || e.ctrlKey)) {
        console.log("KeyCombination CTR+Z Here");
        e.preventDefault();
        e.stopPropagation();
        return true;
    }
}

function isKeyCombRedo(e){
    if (((e.keyCode == 89 || e.keyCode == 121) && e.ctrlKey) || ((Env.getInstance().current == EnvType.MAC && e.metaKey && e.shiftKey) && (e.keyCode == 90 || e.keyCode == 122))) {
        console.log("KeyCombination CTR+Y Here");
        e.preventDefault();
        e.stopPropagation();
        return true;
    }
}

//utility functions
function childrenAutoWidth(container){
    var children_len = container.components.length;
    var colSpan = Math.floor(12/children_len);  
    var delta = 12 - colSpan*children_len;
    var i = 0;    
    for(var childID in container.children){
        ++i;
        if(i==children_len-1)
            container.children[childID].spacing.colSpan = colSpan+delta;
        else
            container.children[childID].spacing.colSpan = colSpan;
    }
}
function childrenAutoHeight(container){
    var children_len = container.components.length;
    var height = Math.floor(100/children_len);  
    var delta = 100 - height*children_len;
    var i = 0;
    for(var childID in container.children){
        ++i;
        if(i==children_len-1)
            container.children[childID].spacing.h = height+delta;
        else
            container.children[childID].spacing.h = height;
    } 
}

function containerResize(container, dx, dy){
    if(dy && !isNaN(dy) && dy!=0 && container.parent.parent.components.length>=2){
        var mpi = indexOfObject(container.parent.parent.components, "props.id",  container.parent.id);
        if(mpi==container.parent.parent.components.length-1)
        {
            dy = -dy;
            --mpi;
        }
        else
            ++mpi; 
        
        var ha = container.parent.parent.$el.height();
        var s = dy/Math.abs(dy);
        var ha_rel = Math.floor(Math.abs(dy*100/ha))*s;
        container.parent.spacing.h = container.parent.spacing.h - ha_rel;
        
        var sibling_id = container.parent.parent.components[mpi].props.id;
        container.parent.parent.children[sibling_id].spacing.h += ha_rel;
    }
    if(dx && !isNaN(dx) && dx!=0 && container.parent.components.length>=2){
        var mpi = indexOfObject(container.parent.components, "props.id",  container.id);
        if(mpi==container.parent.components.length-1)
        {
            dx = -dx;
            --mpi;
        }
        else
            ++mpi; 

        var wa = container.parent.$el.width();
        var s = dx/Math.abs(dx);
        var wa_rel = Math.floor(Math.abs(dx*12/wa)) * s;
        container.spacing.colSpan = container.spacing.colSpan - wa_rel;
        
        var sibling_id = container.parent.components[mpi].props.id;
        container.parent.children[sibling_id].spacing.colSpan += wa_rel;
    }
}