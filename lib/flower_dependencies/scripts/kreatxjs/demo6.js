 $(function() {

    var transferEvent = function () {
        this.events = _.extend({}, Backbone.Events);
    };
    var trdEvent = new transferEvent();

    var undoStack=[];
    var redoStack=[];
    $('#undo').attr('disabled',true);
    $('#redo').attr('disabled',true);
    
    $('#undo').on('click', function() {
        if(undoStack.length==0) return;
        var upass=undoStack.pop();
        if (undoStack.length==0)
            $('#undo').attr('disabled',true);
        else $('#undo').attr('disabled',false);
        graph.resetCells(JSON.parse(JSON.stringify(upass.prev)));
        redoStack.push(upass);
        $('#redo').attr('disabled',false);
        if(upass.prev.length==upass.curr.length)
            trdEvent.events.trigger("destroy:view", [graph.getCell(currentModelID), 1]);
    });

    $('#redo').on('click', function() {
        if(redoStack.length==0) return;
        var rpass=redoStack.pop();
        if (redoStack.length==0)
            $('#redo').attr('disabled',true);
        else $('#redo').attr('disabled',false);
        graph.resetCells(JSON.parse(JSON.stringify(rpass.curr)));
        undoStack.push(rpass);
        $('#undo').attr('disabled',false);
        if(rpass.prev.length==rpass.curr.length)
            trdEvent.events.trigger("destroy:view", [graph.getCell(currentModelID), 1]);
    });

    var scaleX=1;
    $('#zoomin').on('click', function() { 
        scaleX+=0.1;
        paper.scale(scaleX, scaleX, 0, 0);
        prevX=prevX*scaleX;
        prevY=prevX*scaleX;
    });

    $('#zoomout').on('click', function() { 
        scaleX-=0.1;
        paper.scale(scaleX, scaleX, 0, 0);
        prevX=prevX*scaleX;
        prevY=prevX*scaleX;
    });

    var tog1=true;
    $('#collapseS').on('click', function() { 
        if (tog1)
            $('.stencil-container').animate({width: 'toggle'});
            //$('.stencil-container').css({'right': 241});
            
        tog1=false;
        $('.paper-container').css({'left': 0});
    });

    $('#expandS').on('click', function() { 
        if (!tog1)
            $('.stencil-container').animate({width: 'toggle'});
            //$('.stencil-container').css({'right': 0});
            
        tog1=true;
        $('.paper-container').css({'left': 241});
    });

    var tog2=false;
    $('#expandIE').on('click', function() { 
        if (tog2)
            $('.inspector-container').animate({width: 'toggle'});
            //$('.inspector-container').css({'left': 1127});
            
        tog2=false;
        $('.paper-container').css({'right': 241});
    });

    $('#collapseIE').on('click', function() { 
        if (!tog2)
            $('.inspector-container').animate({width: 'toggle'});
            //$('.inspector-container').css({'left': 1500});
            
        tog2=true;
        $('.paper-container').css({'right': 0});
    });

    $('#export').on('click', function() {
        window.open("data:text/json;charset=utf-8," + escape(JSON.stringify(graph.toJSON())));
        $(this).attr("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph.toJSON())));
    });
	
	$('#save').on('click', function() {
		$("#myid", top.document).val(JSON.stringify(graph.toJSON()));
    });
	
	

    var currentModelID=0;
    var copyModelID=0; 
    var copyCell;
    var previousEvent;
    var cursorX;
    var cursorY;
    var graph = new joint.dia.Graph;
    var stGraph = new joint.dia.Graph;
    var previousState;
    var currentState;

    var stencil = new joint.dia.Paper({
        el: $('#stencil'),
        width: 210,
        height: 800,
        model: stGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }

    });

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 2000,
        height: 800,
        model: graph,
        //snapLinks: true,
        linkPinning: false,
        interactive: { vertexAdd: false },
        
        defaultLink: new joint.dia.Link({
            attrs: {
                '.connection': { stroke: '#4c4ca6', 'stroke-width': 2 }, 
                '.marker-target': {fill: '#4c4ca6', stroke: '#4c4ca6', d: 'M 10 0 L 0 5 L 10 10 z' } 
            }
        }),

        validateMagnet: function(cellView, magnet) {
            var links = graph.getLinks();
            for (var i = 0; i < links.length; i++){
                if(( cellView.model.id  === links[i].get('source').id ) && 
                    (magnet.getAttribute('port') === links[i].get('source').port)) 
                    return false;
            };
            return (magnet.getAttribute('type') !== 'input');
        }, 
		
		validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
            //if (magnetS && magnetS.getAttribute('type') === 'input') return false;
			console.log(magnetS.getAttribute('type'));
            if (cellViewS === cellViewT) return false;
            return magnetT && magnetT.getAttribute('type') === 'input';
        },
    });

    var currentLink;
    paper.$el.on('contextmenu', _.bind(function(evt) { 
        evt.stopPropagation(); 
        evt.preventDefault();  
        var cellView = paper.findView(evt.target);
        if(cellView.model.isLink()) {
            currentLink=cellView.model;
            $('#menu').css({ 'top': prevY, 'left': prevX, 'position': 'absolute', 'border': '2px solid black' });    
            $('#menu').fadeIn(250, function () {
                paper.$el.on('click', function () { 
                    evt.stopPropagation(); 
                    evt.preventDefault();   
                    $('#menu').hide(250);  
                    paper.$el.off('click');           
                })
            });
        }
    },paper.$el));

    window.showStart = function() {
        var links = graph.getLinks();
        for (var i = 0; i < links.length; i++){
            var linkV1=links[i].get('source');
            var linkV2=links[i].get('target');
            paper.findViewByModel(linkV1).unhighlight();
            paper.findViewByModel(linkV2).unhighlight();
        };

        var linkStart=currentLink.get('source');
        paper.findViewByModel(linkStart).highlight();
    };
    
    window.showEnd = function() {
        var links = graph.getLinks();
        for (var i = 0; i < links.length; i++){
            var linkV1=links[i].get('source');
            var linkV2=links[i].get('target');
            paper.findViewByModel(linkV1).unhighlight();
            paper.findViewByModel(linkV2).unhighlight();
        };

        var linkEnd=currentLink.get('target');
        paper.findViewByModel(linkEnd).highlight();
    };

    var prevX;
    var prevY;
    paper.on('cell:pointerdown', function(cellView,evt,x,y) {  
        previousState=JSON.parse(JSON.stringify(graph.get('cells')));
        prevX=x;
        prevY=y;
        trdEvent.events.trigger('register:copy', cellView);
        trdEvent.events.trigger('register:cut', cellView);
    });

    var copyCounter=0;
    trdEvent.events.on('register:copy', function(msg) {
        function registerCopy(event) {
            document.addEventListener(event, function() {
                /*if(copyModelID!=msg.model.id)
                copyCounter++;*/
                copyModelID=msg.model.id;
                previousEvent='copy';
            });
        };
        registerCopy('copy');
    });


    trdEvent.events.on('register:cut', function(msg) {
        function registerCut(event) {

            document.addEventListener(event, function() {
                copyModelID=msg.model.id;
                previousEvent='cut';
                copyCounter=0;
            });
        };
        registerCut('cut');
    });

    var copyCounter=0;
    var comp;
    paper.on('blank:pointerdown', function(evt,x,y) {
        copyCounter++;
        cursorX = JSON.parse(JSON.stringify(x));
        cursorY = JSON.parse(JSON.stringify(y));
        trdEvent.events.trigger('register:paste');
    });

    function registerP(event) {
        document.addEventListener(event, function() {
            if (copyModelID!=0) {
                if (previousEvent=='cut') {
                    var temp=JSON.parse(JSON.stringify(graph.get('cells')));
                    var index = temp.map(function(el) { return el.id;}).indexOf(copyModelID);
                    copyCell=JSON.parse(JSON.stringify(temp.splice(index, 1)[0]));
                    copyCell['position']['x']=cursorX;
                    copyCell['position']['y']=cursorY;
                    temp.push(copyCell);
                    graph.resetCells(JSON.parse(JSON.stringify(temp)));
                    previousEvent='';
                    if (undoStack.length!=0)
                        previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                    currentState=JSON.parse(JSON.stringify(temp));   
                    undoStack.push({prev: previousState, curr: currentState});
                    $('#undo').attr('disabled',false);
                }
                if (previousEvent=='copy') {
                    var temp=JSON.parse(JSON.stringify(graph.get('cells')));
                    copyCell=JSON.parse(JSON.stringify(graph.getCell(copyModelID)));
                    copyCell['id']=copyCell['id'].concat(copyCounter);
                    copyCell['position']['x']=cursorX;
                    copyCell['position']['y']=cursorY;
                    temp.push(copyCell);
                    graph.resetCells(JSON.parse(JSON.stringify(temp)));

                    if (comp!=copyCounter) {
                        if (undoStack.length!=0)
                            previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                        currentState=JSON.parse(JSON.stringify(temp));   
                        undoStack.push({prev: previousState, curr: currentState});
                        $('#undo').attr('disabled',false);
                        comp=copyCounter;
                    };
                }
            };
        });
    };

    trdEvent.events.on('register:paste', function(msg) {       
        registerP('paste');
    });


    paper.on('cell:pointerup', function(cellView,evt,x,y) {
        redoStack=[];
        if (cellView.model.isLink()) {
            var tLink = cellView.model.get('target');
            if (tLink.id) {
                var index=graph.get('cells').indexOf(cellView.model);
                var temp=JSON.parse(JSON.stringify(graph.get('cells')));
                if (index==graph.get('cells').length-1) {
                    temp.splice(index, 1);
                    previousState=JSON.parse(JSON.stringify(temp));
                }
                else 
                    previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                currentState=JSON.parse(JSON.stringify(graph.get('cells')));   
                undoStack.push({prev: previousState, curr: currentState});
                $('#undo').attr('disabled',false);
            }
        } else if ((x!==prevX)||(y!==prevY)) {
            if (undoStack.length!=0)
                previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
            currentState=JSON.parse(JSON.stringify(graph.get('cells')));  
            undoStack.push({prev: previousState, curr: currentState});
            $('#undo').attr('disabled',false);
        };
    });

    joint.shapes.Block = {};

    joint.shapes.Block.Element = joint.shapes.devs.Model.extend({
        defaults: joint.util.deepSupplement({

            type: 'Block.Element',

            bName: '',
            bType: '',
            Input1: '',
            Input2: '',
            Operator: '',
            Output: '',

            size: { width: 70, height: 70 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                '.label': { text: '', 'ref-x': .5, 'ref-y': 0 },
                rect: { fill: '#66CC99'},
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.Start = joint.shapes.devs.Model.extend({
        defaults: joint.util.deepSupplement({

            type: 'Block.Start',

            bName: 'Start',
            bType: '',
            Input1: '',
            Input2: '',
            Operator: '',
            Output: '',

            size: { width: 70, height: 70 },
            inPorts: [],
            outPorts: ['out'],
            attrs: {
                '.label': { text: 'Start', 'ref-x': .5, 'ref-y': 0 },
                rect: { fill: '#0000FF'},
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.SetVariable = joint.shapes.devs.Model.extend({
        defaults: joint.util.deepSupplement({

            type: 'Block.SetVariable',

            bName: 'Set Variable',
            bType: '',
            Input1: '',
            Input2: '',
            Operator: '',
            Output: '',

            size: { width: 70, height: 70 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                '.label': { text: 'Set Variable', 'ref-x': .5, 'ref-y': 0 },
                rect: { fill: '#66CC99'},
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.OnAction = joint.shapes.devs.Model.extend({
        defaults: joint.util.deepSupplement({

            type: 'Block.OnAction',

            bName: 'On Action',
            bType: '',
            Input1: '',
            Input2: '',
            Operator: '',
            Output: '',

            size: { width: 70, height: 70 },
            inPorts: ['in'],
            outPorts: ['Ok', 'Action'],
            attrs: {
                '.label': { text: 'On Action', 'ref-x': .5, 'ref-y': 0 },
                rect: { fill: '#66CC99'},
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.Sleep = joint.shapes.devs.Model.extend({
        defaults: joint.util.deepSupplement({

            type: 'Block.Sleep',

            bName: 'Sleep',
            bType: '',
            Input1: '',
            Input2: '',
            Operator: '',
            Output: '',

            size: { width: 70, height: 70 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                '.label': { text: 'Sleep', 'ref-x': .5, 'ref-y': 0 },
                rect: { fill: '#00FFFF'},
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.If= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><path d="M100 0 l80 80 l-80 80 l-80 -80 Z" class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.If',

            bName: 'If',
            bType: '',
            Input1: '',
            Input2: '',
            Operator: '',
            Output: '',

            size: { width: 100, height: 100 },
            inPorts: ['in'],
            outPorts: ['true', 'false'],
            attrs: {
                '.label': { text: 'If', 'ref-x': .5, 'ref-y': 0 },
                '.body': { fill: '#00FFFF'},
                '.inPorts .port-body': { 'ref-x': 40, fill: '#FFFF00', magnet: 'passive', type: 'input'  },
                '.outPorts .port-body':{ 'ref-x': 0, fill: '#00FF00', type: 'output'  },
                '.inPorts .port-label': { 'ref-x': 40},
                '.outPorts .port-label': { 'ref-x': 0},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.ElementView = joint.shapes.devs.ModelView.extend({
        events: {
            "click": "inspectClicked",
            "change:position": "inspectClicked", 
        },

        inspectClicked: function (event) {
            if (this.model.prop('where')!='stencil')
                trdEvent.events.trigger("block:create", [this.model, 0]);
        },
    });

    joint.shapes.Block.StartView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SetVariableView=joint.shapes.Block.ElementView;
    joint.shapes.Block.OnActionView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SleepView=joint.shapes.Block.ElementView;
    joint.shapes.Block.IfView=joint.shapes.Block.ElementView;


    var m1 = joint.shapes.Block;
    function placeBlock(elm, posx, posy, color) {
        var cell = new elm({
            position: { x: posx, y: posy },
            attrs: {
                rect: { fill: color},
            },
        }); 
        return cell;
    };

    //temporary function
    function simple(elm, posx, posy, name, color) {
        var cell = new elm({

            bName: name,


            position: { x: posx, y: posy },
            attrs: {
                '.label': { text: name, 'ref-x': .5, 'ref-y': 0 },
                rect: { fill: color},
            }
        });
        return cell;
    };

    var v1= placeBlock(m1.Start,50,50).prop('where', 'paper');
    var v2= placeBlock(m1.SetVariable,200,50).prop('where', 'paper');
    var v3=placeBlock(m1.OnAction,250, 200).prop('where', 'paper');
    var v4=placeBlock(m1.If,50, 200).prop('where', 'paper');
    var v5=placeBlock(m1.Sleep,350, 50).prop('where', 'paper');
    var v6=simple(m1.Element,500, 50,'B1', '#FF0000').prop('where', 'paper');
    var v7=simple(m1.Element,500, 200,'B2', '#FF00FF').prop('where', 'paper');
	if (diagram_json) {
		graph.fromJSON(diagram_json);
	}
	else {
		graph.addCell(v1).addCell(v2).addCell(v3).addCell(v4).addCell(v5).addCell(v6).addCell(v7);
	}

    var s1= placeBlock(m1.Start,50,10).prop('where', 'stencil');
    var s2= placeBlock(m1.SetVariable,50,100).prop('where', 'stencil');
    var s3=placeBlock(m1.OnAction,50, 190).prop('where', 'stencil');
    var s4=placeBlock(m1.If,50, 280).prop('where', 'stencil');
    var s5=placeBlock(m1.Sleep,50, 400).prop('where', 'stencil');
    var s6=simple(m1.Element,50, 490,'B1', '#FF0000').prop('where', 'stencil');


    stGraph.addCell(s1).addCell(s2).addCell(s3).addCell(s4).addCell(s5).addCell(s6);

    var att = Backbone.Model.extend({
        Name: '',
        Value: '',
        CName: '',
    });
    var a1,a2,a3,a4,a5,a6=new att({});
    trdEvent.events.on("block:create", function(msg) {
        if (msg[1]===0) {
            if (currentModelID===msg[0].id) return;
        };
        if ((currentModelID!==msg[0].id)&&(currentModelID!==0)) {
            inspect.destroyAll();
        };
        currentModelID=msg[0].id;
        a1= new att({ Name: 'Name', Value: msg[0].get('bName'), CName: 'bName'});
        a2= new att({ Name: 'Type', Value: msg[0].get('bType'), CName: 'bType'});
        a3= new att({ Name: 'Input', Value: msg[0].get('Input1'), CName: 'Input1'});
        a4= new att({ Name: 'Input', Value: msg[0].get('Input2'), CName: 'Input2'});
        a5= new att({ Name: 'Operator', Value: msg[0].get('Operator'), CName: 'Operator'});
        a6= new att({ Name: 'Output', Value: msg[0].get('Output'), CName: 'Output'});
        attributes=new atts([a1,a2,a3,a4,a5,a6]);
        inspect = new inspectView({ collection: attributes });
        trdEvent.events.trigger("block:inspect", this.model);
    });

    trdEvent.events.on('update:JModel', function(msg) {
        graph.getCell(currentModelID).set(msg.get('CName'), msg.get('Value'));
        if (msg.get('CName')=='bName') 
            graph.getCell(currentModelID).attr('.label/text', msg.get('Value'));
        trdEvent.events.trigger("update:view", graph.getCell(currentModelID));
        if (undoStack.length!=0)
            previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
        currentState=JSON.parse(JSON.stringify(graph.get('cells')));  
        undoStack.push({prev: previousState, curr: currentState});
        $('#undo').attr('disabled',false);
    });

    trdEvent.events.on("destroy:view", function(msg) {
        inspect.destroyAll();
        trdEvent.events.trigger("block:create", msg);
    });

    var atts = Backbone.Collection.extend({
        model: att
    })


    var inspectView = Backbone.View.extend({

        type: 'Block.ElementInspectView',

        el: "#inspector",

        initialize: function () {
            trdEvent.events.on("block:inspect", this.render, this);
        },

        render: function () {
            _.each(this.collection.models, this.processAttribute ,this);
            return this;
        },

        processAttribute: function(m){
            var attView = new attributeView({ model: m });
            attView.render();
            this.$el.append(attView.el);
        },

        destroyAll: function() {
            var cmod;

            while (cmod = attributes.first()) {
                cmod.destroy();
                trdEvent.events.trigger("remove:view", cmod);
            }
        }, 
    });

    var attributeView = Backbone.View.extend({
        type: "attributeView", 
        template: _.template($("#aTemplate").html()),

        events: {
            'keypress input' : 'updateOnEnter', 
        },

        initialize: function () {
            trdEvent.events.on('remove:view', this.remove, this);
            trdEvent.events.on('update:view', this.render, this);
        },
        render: function () {

            var outputHtml = this.template(this.model.toJSON());
            this.$el.html(outputHtml);
            this.input = this.$('input');
            return this;
        },

        updateOnEnter: function(e){
            if(e.keyCode == 13){
                this.close();
            }
        },

        close: function(){
            if (this.input.val()) {
                this.model.set({ Value: this.input.val().trim()}); 
                trdEvent.events.trigger("update:JModel", this.model);
            }
        },
    });
})


