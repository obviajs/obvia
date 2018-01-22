 $(function() {
console.log('fff');
    var transferEvent = function () {
        this.events = _.extend({}, Backbone.Events);
    };
    var trdEvent = new transferEvent();

    var undoStack=[];
    var redoStack=[];
    var cacheVariables=[];
    var cache=[];
    var cacheValues=[];
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
    $('#expandS').hide();
    $('#collapseS').on('click', function() { 
        if (tog1)
            $('.stencil-container').animate({width: 'toggle'});
        $('#collapseS').hide();
        $('#expandS').show();
        tog1=false;
        $('.paper-container').css({'left': 0});
    });

    $('#expandS').on('click', function() { 
        if (!tog1)
            $('.stencil-container').animate({width: 'toggle'});
        $('#collapseS').show();
        $('#expandS').hide();
            
        tog1=true;
        $('.paper-container').css({'left': 241});
    });

    var tog2=false;
    $('#expandIE').hide();
    $('#expandIE').on('click', function() { 
        if (tog2)
            $('.inspector-container').animate({width: 'toggle'});
        $('#collapseIE').show();
        $('#expandIE').hide();
            
        tog2=false;
        $('.paper-container').css({'right': 241});
    });

    $('#collapseIE').on('click', function() { 
        if (!tog2)
            $('.inspector-container').animate({width: 'toggle'});
        $('#collapseIE').hide();
        $('#expandIE').show();
            
        tog2=true;
        $('.paper-container').css({'right': 0});
    });

    $('h3').click( function(event) { 
        $(event.target).next().animate({height: 'toggle'}, 'fast');
    });

    var nodeListType=[];
    $('#export').on('click', function() {
        //window.open("data:text/json;charset=utf-8," + escape(JSON.stringify(graph.toJSON())));
        //$(this).attr("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph.toJSON())));
        var oGraph=graph.toJSON();
        var nodes=processGraph(oGraph,'node');
        var adjacencyList=processGraph(oGraph,'adjList');

        setOrdinal(graph,nodes,adjacencyList);
        checkClosure(graph,nodes,adjacencyList);
        //var xml=generateXML(graph,nodes,adjacencyList);
        //console.log(xml);
        //var xmlText = new XMLSerializer().serializeToString(xml);
        //console.log(xmlText);
        var bpel=generateBPEL(graph,nodes,adjacencyList);
        console.log(bpel);
        var bpelText = new XMLSerializer().serializeToString(bpel);
        console.log(bpelText);
    });

    function checkClosure(g,n,aL) {
        $.each(n, function(ind,val) {
            var links=g.getLinks();
            var ports=[];
            for (var i = 0; i < links.length; i++){
                if (links[i].get('source').id==val)
                    ports.push(links[i].get('source').port);
            }
            var keys=Object.keys(g.getCell(val).get('pout'));
            for(var a in g.getCell(val).get('pout')) {
                if (ports.indexOf(a)==-1) {
                    if (g.getCell(val).get('pout')[a]=='open') 
                        throw 'Process has not been closed';
                }
            }
        });
    }

    function setOrdinal(g,n,aL) {
        var ordinal=1;
        var level;
        var indx = g.getElements().map(function(a) {return a.get('type');}).indexOf("Block.Start");
        var BFS=[];
        //var visited=[];
        BFS.push('/');
        BFS.push(g.getElements()[indx].get('id'));
        BFS.push(aL[g.getElements()[indx].get('id')]);
        
        while (BFS.length>0) {
            var c=BFS.shift();
            //visited.push(c);
            if (g.getCell(c)) {
                if (g.getCell(c).prop('ordinal')=='') {
                    g.getCell(c).prop('ordinal',ordinal);
                    ordinal++;
                }
                if (g.getCell(c).prop('level')=='') {
                    g.getCell(c).prop('level',level);

                    BFS.push('/');
                    BFS.push(c);
                    for (var j=0; j<aL[c].length; j++) {
                        if (BFS.indexOf(aL[c][j])==-1)
                            BFS.push(aL[c][j]);
                    }
                }
            }
            else {
                var k=BFS.shift();
                level=Number(g.getCell(k).prop('level'))+1;
            }
        }
    };

    function generateXML(g,n,aL) {
        var XML=document.implementation.createDocument(null,'process',null);
        var root=XML.firstChild;
        var currentRoot=root;
        var curID= addStart(root);
        if (curID)
            var content= buildTree(root, curID);
        else return XML;

        function addStart(r) {
            var start=document.createElement('Start');
            start.setAttribute('ordinal', 0);
            start.setAttribute('level', 0);
            r.appendChild(start);
            var el;
            for(var i=0; i<g.getElements().length; i++) {
                if (g.getElements()[i].get('type')=='Block.Start') {
                    el=i;break;
                }
            }
            createNode(g.getElements()[el], start);
            var currentID=g.getElements()[el].get('id');
            return aL[currentID][0];
        }

        function createNode(node,tag) {
            var nameTag= document.createElement('Name');
            var name=document.createTextNode(node.get('Name'));
            nameTag.appendChild(name);
            tag.appendChild(nameTag);
            var vars= document.createElement('variables');
            for(var a in node.get('battrs')) {
                if(a!='Name') {
                    if (node.get('battrs')[a]) {
                        var v= document.createElement(a);
                        var vVal=document.createTextNode(node.get('battrs')[a]);
                        if (cacheVariables.map(function(o){return o.attValue;}).indexOf(node.get('battrs')[a])!=-1)
                            v.setAttribute('type', 'variable');
                        else v.setAttribute('type', 'value');
                        v.appendChild(vVal);
                        vars.appendChild(v);
                    }
                }
            }
            tag.appendChild(vars);
        }

        function buildTree(r,cID) {
            var nextID=aL[cID];
            var txt=g.getCell(cID).get('type').replace(/Block./i,"");
            var next=document.createElement(txt);
            next.setAttribute('ordinal', g.getCell(cID).get('ordinal'));
            next.setAttribute('level', g.getCell(cID).get('level'));
            r.appendChild(next);
            createNode(g.getCell(cID), next);

            if (nextID.length==0) {
                var keys=Object.keys(g.getCell(cID).get('pout'));
                if (keys.length==1) {
                    if (g.getCell(cID).get('pout').out=='open') {
                        console.log('Process has not been closed');
                    }
                }
                else {
                    for(var a in g.getCell(cID).get('pout')) {
                        if (g.getCell(cID).get('pout').a=='open') 
                            console.log('Process has not been closed');

                        var cond=document.createElement('condition');
                        cond.setAttribute('value', a);
                        next.appendChild(cond);
                    }
                }
                return;
            }
            else {
                var keys=Object.keys(g.getCell(cID).get('pout'));
                if (keys.length>nextID.length) {
                    var holdPorts = []; 
                    for(var j=0; j<nextID.length; j++) {
                        var links = graph.getLinks();
                        for (var i = 0; i < links.length; i++){
                            if ((links[i].get('source').id==cID)&&(links[i].get('target').id==nextID[j]))
                                holdPorts.push(links[i].get('source').port);
                        }
                    } 
                    for(var k in g.getCell(cID).get('pout')) {
                        if (holdPorts.indexOf(k)!=-1) {
                            var cond=document.createElement('condition');
                            cond.setAttribute('value', k);
                            next.appendChild(cond);
                            var currentID=nextID[holdPorts.indexOf(k)];
                            if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                                var GOTO=document.createElement('GOTO');
                                GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                                cond.appendChild(GOTO);
                            }
                            else buildTree(cond,currentID);
                        }
                        else {
                            if (g.getCell(cID).get('pout').k=='open') 
                                console.log('Process has not been closed');
                                
                            var cond=document.createElement('condition');
                            cond.setAttribute('value', k);
                            next.appendChild(cond);
                        }
                    }   
                }
                else {
                    if (nextID.length==1) {
                        var currentID=nextID[0];
                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            r.appendChild(GOTO);
                        }
                        else buildTree(r,currentID);
                        return;
                    }
                    for(var k=0; k<nextID.length; k++) {
                        var links = graph.getLinks();
                        var p;
                        for (var i = 0; i < links.length; i++){
                            if ((links[i].get('source').id==cID)&&(links[i].get('target').id==nextID[k]))
                                p=links[i].get('source').port;
                        }
                        var cond=document.createElement('condition');
                        cond.setAttribute('value', p);
                        next.appendChild(cond);
                        var currentID=nextID[k];
                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            cond.appendChild(GOTO);
                        }
                        else buildTree(cond,currentID);
                    }
                }
            }
        }
        return XML;
    };

    function generateBPEL(g,n,aL) {
        var BPEL = (new DOMParser()).parseFromString('<process></process>', 'text/xml');
        var root=BPEL.firstChild;
        var currentRoot=root;
        var curID= addStart2(root);
        if (curID)
            var content=   buildTree2(root, curID);
        else return BPEL;

        function addStart2(r) {
            var start=document.createElement('Start');
            start.setAttribute('ordinal', 0);
            start.setAttribute('level', 0);
            r.appendChild(start);
            var el;
            for(var i=0; i<g.getElements().length; i++) {
                if (g.getElements()[i].get('type')=='Block.Start') {
                    el=i;break;
                }
            }
            createNode2(g.getElements()[el], start);
            var currentID=g.getElements()[el].get('id');
            return aL[currentID][0];
        }

        function createNode2(node,tag) {
            function createAssign(f,t) {
                if (node.get('battrs')[t]) {
                    var from = document.createElement('from');
                    var to = document.createElement('to');
                    from.setAttribute('variable',f);
                    to.setAttribute('variable',node.get('battrs')[t].substring(1,node.get('battrs')[t].length));
                    var assign = document.createElement('assign');
                    var copy = document.createElement('copy');
                    copy.appendChild(from);
                    copy.appendChild(to);
                    tag.appendChild(assign).appendChild(copy);
                }
            }

            if (tag.nodeName=='adddate') {
                var from = document.createElement('from');
                var to = document.createElement('to');
                from.setAttribute('variable',node.get('battrs')['New_Date'].substring(1,node.get('battrs')[t].length));
                to.setAttribute('variable','dt');
                var assign = document.createElement('assign');
                var copy = document.createElement('copy');
                copy.appendChild(from);
                copy.appendChild(to);
                tag.appendChild(assign).appendChild(copy);
                createAssign("year","Year");createAssign("month","Month");createAssign("date","Date");
                createAssign("hour","Hour");createAssign("minute","Minute");createAssign("second","Second");

                tag.setAttribute('dateTime', node.get('battrs')['Date_Time']);
                tag.setAttribute('formatTime', node.get('battrs')['Date_Format']);
                tag.setAttribute('interval', node.get('battrs')['Interval']);
                tag.setAttribute('newDateTime', node.get('battrs')['New_Date'].substring(1,node.get('battrs')['New_Date'].length));
            }
            else if (tag.nodeName=='getdatedifference') {
                createAssign("interval","Interval");

                tag.setAttribute('formatTime', node.get('battrs')['Date_Format']);
                tag.setAttribute('firstDate', node.get('battrs')['First_date']);
                tag.setAttribute('secondDate', node.get('battrs')['Second_date']);
                tag.setAttribute('intervalFormat', node.get('battrs')['Interval_Format']);
            }
            else if (tag.nodeName=='gettime') {
                createAssign("dateTime","Date_Time");
                createAssign("year","Year");createAssign("month","Month");createAssign("date","Date");
                createAssign("hour","Hour");createAssign("minutes","Minute");createAssign("seconds","Second");
                
                tag.setAttribute('formatTime', node.get('battrs')['Date_Format']);
                tag.setAttribute('timeZone', node.get('battrs')['Timezone']);
            }
            else if (tag.nodeName=='onevent') {
                var filters=document.createElement('filters');
                var id_form=document.createElement('id_form');
                id_form.setAttribute('v',node.get('battrs')[0][node.get('battrs')[0].length-1]);
            }
            else if (tag.nodeName=='sendxmlparseresponse') {
                var payload=document.createElement('payload');
                var cd=BPEL.createCDATASection("{$INSTANCE_UUID}");
                tag.appendChild(payload).appendChild(cd);
                for(var a in node.get('battrs')) {
                    if(a!='Name') {
                        if (node.get('battrs')[a]) 
                            tag.setAttribute(a, node.get('battrs')[a]);
                    }
                }
            }
            else {
                for(var a in node.get('battrs')) {
                    if(a!='Name') {
                        if (node.get('battrs')[a]) 
                            tag.setAttribute(a, node.get('battrs')[a]);
                    }
                }
            }
        }

        function buildTree2(r,cID) {
            var nextID=aL[cID];
            var txt=g.getCell(cID).get('type').replace(/Block./i,"");
            console.log(txt);
            if ((txt[0]=='O')&&(txt[1]=='n')) {
                var next=document.createElement('onevent');
                next.setAttribute('type', txt);
            }
            else if (txt=='SetVariable') { 
                var node=g.getCell(cID);
                if (node.get('battrs')['Input1']) {
                    var from = document.createElement('from');
                    var to = document.createElement('to');
                    to.setAttribute('variable',node.get('battrs')['Output'].substring(1,node.get('battrs')['Output'].length));
                    var txt=node.get('battrs')['Input1']+node.get('battrs')['Operator']+node.get('battrs')['Input2'];
                    var cd=BPEL.createCDATASection(txt);
                    from.appendChild(cd);
                    
                    var next = document.createElement('assign');  
                    var copy = document.createElement('copy');
                    copy.appendChild(from);
                    copy.appendChild(to);
                    r.appendChild(next).appendChild(copy);
                }
                else {
                    var from = document.createElement('from');
                    var to = document.createElement('to');
                    to.setAttribute('variable',node.get('battrs')['Output'].substring(1,node.get('battrs')['Output'].length));
                    if (node.get('battrs')['Input2'][0]=="$")
                        from.setAttribute('variable',node.get('battrs')['Input2'].substring(1,node.get('battrs')['Input2'].length));
                    else {
                        var txt=node.get('battrs')['Input2'];
                        var cd=BPEL.createCDATASection(txt);
                        from.appendChild(cd);
                    }
                    var next = document.createElement('assign');
                    var copy = document.createElement('copy');
                    copy.appendChild(from);
                    copy.appendChild(to);
                    r.appendChild(next).appendChild(copy);
                }    
            }
            else if (txt=='MultiSetVariable') {
                var next = document.createElement('sequence');
                r.appendChild(next);
                var node=g.getCell(cID);
                for(var a=1; a<4; a++) {
                    if (node.get('battrs')["Input"+a]) {
                        var from = document.createElement('from');
                        var to = document.createElement('to');
                        to.setAttribute('variable',node.get('battrs')["Input"+a].substring(1, node.get('battrs')["Input"+a].length));
                        if (node.get('battrs')["Value"+a][0]=="$")
                            from.setAttribute('variable',node.get('battrs')["Value"+a].substring(1,node.get('battrs')["Value"+a].length));
                        else {
                            var txt=node.get('battrs')["Value"+a];
                            var cd=BPEL.createCDATASection(txt);
                            from.appendChild(cd);
                        }
                        var assign = document.createElement('assign');
                        var copy = document.createElement('copy');
                        copy.appendChild(from);
                        copy.appendChild(to);
                        next.appendChild(assign).appendChild(copy);
                    }
                }
            }
            else var next=document.createElement(txt);

            next.setAttribute('ordinal', g.getCell(cID).get('ordinal'));
            next.setAttribute('level', g.getCell(cID).get('level'));
            r.appendChild(next);
            if ((txt!='SetVariable')||(txt!='MultiSetVariable'))
                createNode2(g.getCell(cID), next);

            var keys=Object.keys(g.getCell(cID).get('pout'));
            if (keys.length==1) {
                if (nextID.length==0) return;
                var currentID=nextID[0];
                if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                    var GOTO=document.createElement('GOTO');
                    GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                    r.appendChild(GOTO);
                }
                else buildTree2(r,currentID);
            }
            else if (keys.length==2) {
                if (nextID.length==0) return;

                var ports=[];
                var links=g.getLinks();
                for (var i = 0;i < links.length; i++){
                    if (links[i].get('target').id==nextID[0]) {
                        ports.push(links[i].get('source').port);
                        ports.push(0);
                    }
                    if (nextID[1]) {
                        if (links[i].get('target').id==nextID[1]) {
                            ports.push(links[i].get('source').port);
                            ports.push(1);
                        }
                    }
                }

                if (next.nodeName=='onevent') {
                    if (ports.indexOf('Ok')!=-1) {
                        var currentID=nextID[ports[ports.indexOf('Ok')+1]];
                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            r.appendChild(GOTO);
                        }
                        else buildTree2(r,currentID);
                    } 
                    if (ports[0].match(/ed/i)) {
                        var temp=0;
                    }
                    if (ports[2].match(/ed/i)) {
                        var temp=2;
                    }
                    if ((temp==0)||(temp==2)) {
                        var currentID=nextID[ports[temp+1]];
                        var seq=document.createElement('sequence');
                        next.appendChild(seq);

                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            seq.appendChild(GOTO);
                        }
                        else buildTree2(seq,currentID);
                    } 
                }
                else if (next.nodeName=='findstring') {
                    var cond=document.createElement('condtion');
                    var found=document.createTextNode('found');
                    cond.appendChild(found);
                    next.appendChild(cond);

                    if (ports.indexOf('Found')!=-1) {
                        var currentID=nextID[ports[ports.indexOf('Found')+1]];
                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            next.appendChild(GOTO);
                        }
                        else buildTree2(next,currentID);
                    } 
                    if (ports.indexOf('Not_Found')!=-1) {
                        var seq=document.createElement('sequence');
                        var els=document.createElement('else');
                        els.appendChild(seq);
                        next.appendChild(els);
                        var currentID=nextID[ports[ports.indexOf('Not_Found')+1]];
                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            els.appendChild(GOTO);
                        }
                        else buildTree2(els,currentID);
                    }
                }
                else {
                    var cond=document.createElement('condtion');
                    var found=document.createTextNode(g.getCell(cID).get('battrs')['Input1']+g.getCell(cID).get('battrs')['Operator']+g.getCell(cID).get('battrs')['Input2']);
                    cond.appendChild(found);
                    next.appendChild(cond);

                    if (ports.indexOf('_true')!=-1) {
                        var currentID=nextID[ports[ports.indexOf('_true')+1]];
                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            next.appendChild(GOTO);
                        }
                        else buildTree2(next,currentID);
                    } 
                    if (ports.indexOf('_false')!=-1) {
                        var seq=document.createElement('sequence');
                        var els=document.createElement('else');
                        els.appendChild(seq);
                        next.appendChild(els);
                        var currentID=nextID[ports[ports.indexOf('_false')+1]];
                        if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                            var GOTO=document.createElement('GOTO');
                            GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                            seq.appendChild(GOTO);
                        }
                        else buildTree2(seq,currentID);
                    }
                }
                ports=[];  
            }
            else {
                if (nextID.length==0) return;

                var ports=[];
                var links=g.getLinks();
                for (var i = 0;i < links.length; i++){
                    if (links[i].get('target').id==nextID[0]) {
                        ports.push(links[i].get('source').port);
                        ports.push(0);
                    }
                    if (nextID[1]) {
                        if (links[i].get('target').id==nextID[1]) {
                            ports.push(links[i].get('source').port);
                            ports.push(1);
                        }
                    }

                    if (nextID[2]) {
                        if (links[i].get('target').id==nextID[2]) {
                            ports.push(links[i].get('source').port);
                            ports.push(2);
                        }
                    }
                }

                var cond=document.createElement('condtion');
                var found=document.createTextNode('Case_1');
                cond.appendChild(found);
                next.appendChild(cond);

                if (ports.indexOf('Case_1')!=-1) {
                    var currentID=nextID[ports[ports.indexOf('Case_1')+1]];
                    if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                        var GOTO=document.createElement('GOTO');
                        GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                        next.appendChild(GOTO);
                    }
                    else buildTree2(next,currentID);
                } 
                if (ports.indexOf('Case_2')!=-1) {
                    var seq=document.createElement('sequence');
                    var elsif=document.createElement('elseif');
                    elsif.appendChild(seq);
                    next.appendChild(elsif);
                    var currentID=nextID[ports[ports.indexOf('Case_2')+1]];
                    if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                        var GOTO=document.createElement('GOTO');
                        GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                        seq.appendChild(GOTO);
                    }
                    else buildTree2(seq,currentID);
                }
                if (ports.indexOf('Case_3')!=-1) {
                    var seq=document.createElement('sequence');
                    var els=document.createElement('else');
                    els.appendChild(seq);
                    next.appendChild(els);
                    var currentID=nextID[ports[ports.indexOf('Case_3')+1]];
                    if (g.getCell(cID).get('level')>g.getCell(currentID).get('level')) {
                        var GOTO=document.createElement('GOTO');
                        GOTO.setAttribute('ordinal', g.getCell(currentID).get('ordinal'));
                        seq.appendChild(GOTO);
                    }
                    else buildTree2(seq,currentID);
                }
            }
        }
        return BPEL;
    };

/*    function splitSCC(sCC, b) {
        var w=[];
        var s=[];
        for (var i=0; i<sCC.length; i++) {
            if (sCC[i].length==1)
                w.push(sCC[i]);
            else s.push(sCC[i]);
        }
        if (b)
            return s;
        else return w;
    };*/
	
    function processGraph(g,NorA) {
        var nodeListID=[];
        var linkListID=[];
        var linkListO=[];
        for(var i=0; i<g['cells'].length; i++) {
            if (g['cells'][i]['type']!='link') {
                var nodeT=g['cells'][i]['type'];
                nodeListType.push(nodeT);
                var nodeID=g['cells'][i]['id'];
                nodeListID.push(nodeID);
            }
            else {
                var linkO=g['cells'][i];
                linkListO.push(linkO);
                var linkID=g['cells'][i]['id'];
                linkListID.push(linkID);
            }
        }
        if (NorA=='node')
            return nodeListID;
        if (NorA=='adjList') {
            var adjList=[];
            for (var j=0; j<nodeListID.length; j++) 
                adjList[nodeListID[j]]=[];

            for (var k=0; k<linkListID.length; k++) 
                adjList[linkListO[k]['source']['id']][adjList[linkListO[k]['source']['id']].length]=linkListO[k]['target']['id'];

            return adjList;
        }
    };


/*    function tarjan(n,a) {
        var vertIndex=0;
        var vertStack=[];
        var allV=[];
        var SC=[];
        
        for (var i=0; i<n.length; i++)  
            strongConnect(n[i]);

        function strongConnect(v) {
            var currentV={vertex:v, indx:vertIndex, lowlink:vertIndex};
            allV.push(currentV);
            vertIndex++;
            vertStack.push(v);

            for(var j=0; j<a[currentV.vertex].length; j++) {
                var vertexDef = allV.map(function(el) { return el.vertex;}).indexOf(a[currentV.vertex][j]);
                if (vertexDef==-1) {
                    strongConnect(a[currentV.vertex][j]);
                    var vDef = allV.map(function(el) { return el.vertex;}).indexOf(a[currentV.vertex][j]);
                    currentV.lowlink=Math.min(currentV.lowlink,allV[vDef].lowlink);
                }
                else 
                    currentV.lowlink=Math.min(currentV.lowlink,allV[vertexDef].indx);
            }
            if(currentV.lowlink==currentV.indx) {
                var currentSC=[];
                var temp;
                do {
                    temp=vertStack.pop();
                    currentSC.push(temp);
                }
                while(temp!=currentV.vertex);
                SC.push(currentSC); 
            }
        }
        return SC;
    };*/

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
    var vGraph = new joint.dia.Graph;
    var sGraph = new joint.dia.Graph;
    var cGraph = new joint.dia.Graph;
    var dGraph = new joint.dia.Graph;
    var fGraph = new joint.dia.Graph;
    var xGraph = new joint.dia.Graph;
    var eGraph = new joint.dia.Graph;
    var previousState;
    var currentState;

    var stencil = new joint.dia.Paper({
        el: $('#stencil'),
        width: 210,
        height: 100,
        model: stGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var vars = new joint.dia.Paper({
        el: $('#vars'),
        width: 210,
        height: 200,
        model: vGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var conds = new joint.dia.Paper({
        el: $('#conditionals'),
        width: 210,
        height: 100,
        model: cGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var strings = new joint.dia.Paper({
        el: $('#strings'),
        width: 210,
        height: 200,
        model: sGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var datetime = new joint.dia.Paper({
        el: $('#datetime'),
        width: 210,
        height: 300,
        model: dGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var forms = new joint.dia.Paper({
        el: $('#forms'),
        width: 210,
        height: 100,
        model: fGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var xmls = new joint.dia.Paper({
        el: $('#xmls'),
        width: 210,
        height: 100,
        model: xGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var xev = new joint.dia.Paper({
        el: $('#xevents'),
        width: 210,
        height: 200,
        model: eGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });


    var dropCounter=0;
    var dropModelID;
    stencil.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id;
        if (c.model.get('type')=='Block.Start') {
            if (graph.get('cells').map(function(el) {if (el.get('type')=='Block.Start') return 1; else return 0;}).indexOf(1)!=-1) {
                dropModelID=0;
                return;
            }
        }
        var holdURL='url('+stGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
    });

    vars.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id; 
        var holdURL='url('+vGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
    });

    conds.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id; 
        var holdURL='url('+cGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
    });

    forms.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id; 
        var holdURL='url('+fGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
    });

    xmls.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id; 
        var holdURL='url('+xGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
    });

    strings.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id; 
        var holdURL='url('+sGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
    });

    datetime.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id; 
        var holdURL='url('+dGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
    });

    xev.on('cell:pointerdown', function(c, evt, x, y) {
        dropModelID=c.model.id; 
        var holdURL='url('+eGraph.getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
        $('.stencil-scroller').css({'cursor': holdURL});
        $('.paper-scroller').css({'cursor': holdURL});
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
                '.connection': { stroke: '#4c4ca6', 'stroke-width': 1 }, 
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
            return (magnet.getAttribute('type') === 'output');
        }, 
		
		validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
            //if (magnetS && magnetS.getAttribute('type') === 'input') return false;
            if (cellViewS === cellViewT) return false;
            return magnetT && magnetT.getAttribute('type') === 'input';
        },
    });

    var currentLink;
    var currentBlock;
    paper.$el.on('contextmenu', _.bind(function(evt) { 
        evt.stopPropagation(); 
        evt.preventDefault();  
        var cellView = paper.findView(evt.target);
        if(cellView.model.isLink()) {
            currentLink=cellView.model;
            $('#menu').css({ 'top': evt.offsetY, 'left': evt.offsetX, 'position': 'absolute', 'border': '2px solid black' });    
            $('#menu').fadeIn(250, function () {
                paper.$el.on('click', function () { 
                    evt.stopPropagation(); 
                    evt.preventDefault();   
                    $('#menu').hide(250);  
                    paper.$el.off('click');           
                })
            });
        }
        else if (cellView) {
            currentBlock=cellView.model;
            $('#bmenu').css({ 'top': evt.offsetY, 'left': evt.offsetX, 'position': 'absolute', 'border': '2px solid black' });    
            $('#bmenu').fadeIn(250, function () {
                paper.$el.on('click', function () { 
                    evt.stopPropagation(); 
                    evt.preventDefault();   
                    $('#bmenu').hide(250);  
                    paper.$el.off('click');           
                })
            });
        }
    },paper.$el));

    window.saveBlock = function() {
        var holdB=JSON.stringify(currentBlock.toJSON());
        console.log(holdB);
    };

    window.showStart = function() {
        var links = graph.getLinks();
        for (var i = 0; i < links.length; i++){
            var linkV1=links[i].get('source');
            var linkV2=links[i].get('target');
            paper.findViewByModel(linkV1).unhighlight();
            paper.findViewByModel(linkV2).unhighlight();
        };

        var linkStart=currentLink.get('source');
        var holdx=graph.getCell(linkStart.id).get('position').x;
        var holdy=graph.getCell(linkStart.id).get('position').y;

        $('.paper-scroller').animate({scrollTop: holdy-$('.paper-scroller').offset().top});
        $('.paper-scroller').animate({scrollLeft: holdx-$('.paper-scroller').offset().left});
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
        var holdx=graph.getCell(linkEnd.id).get('position').x;
        var holdy=graph.getCell(linkEnd.id).get('position').y;

        $('.paper-scroller').animate({scrollTop: holdy-$('.paper-scroller').offset().top});
        $('.paper-scroller').animate({scrollLeft: holdx-$('.paper-scroller').offset().left});
        paper.findViewByModel(linkEnd).highlight();  
    };

    var prevX;
    var prevY;
    var currentView;
    paper.on('cell:pointerdown', function(cellView,evt,x,y) {  
        previousState=JSON.parse(JSON.stringify(graph.get('cells')));
        prevX=x;
        prevY=y;
        currentView=cellView;
        trdEvent.events.trigger('register:copy', cellView);
        trdEvent.events.trigger('register:cut', cellView);
        trdEvent.events.trigger('keydown');

    });

    trdEvent.events.on('keydown', function() {
        function registerKD(event) {
            document.addEventListener(event, function(e) {
                if ((e.keyCode || e.which) == 46) {
                    var temp=JSON.parse(JSON.stringify(graph.get('cells')));
                    var index = temp.map(function(el) { return el.id;}).indexOf(currentView.model.id);
                    if (index!=-1) {
                        temp.splice(index, 1);
                        var links = graph.getLinks();
                        for (var i = 0; i < links.length; i++){
                            if (currentView.model.id==links[i].get('source').id) {   
                                var j = temp.map(function(el) { return el.id;}).indexOf(links[i].id);
                                if (j!=-1)
                                    temp.splice(j, 1);
                            }
                        }
                        for (var i = 0; i < links.length; i++){
                            if (currentView.model.id==links[i].get('target').id) {   
                                var j = temp.map(function(el) { return el.id;}).indexOf(links[i].id);
                                if (j!=-1)
                                    temp.splice(j, 1);
                            }
                        }
                        graph.resetCells(JSON.parse(JSON.stringify(temp)));
                        if (undoStack.length!=0)
                            previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                        currentState=JSON.parse(JSON.stringify(temp));   
                        undoStack.push({prev: previousState, curr: currentState});
                        $('#undo').attr('disabled',false);
                    }
                }
            });
        };
        registerKD('keydown');
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
        try {
            var cells = graph.get('cells').models;
            for (var a in cells)
                paper.findViewByModel(cells[a]).unhighlight();
        }
        catch(e) {
            console.log(e);
        }
        if(dropModelID) {
            dropCounter++;
            var temp=JSON.parse(JSON.stringify(graph.get('cells')));
            var temp1=JSON.parse(JSON.stringify(temp));
            if (stGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(stGraph.getCell(dropModelID)));
            else if (vGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(vGraph.getCell(dropModelID)));
            else if (cGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(cGraph.getCell(dropModelID)));
            else if (sGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(sGraph.getCell(dropModelID)));
            else if (dGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(dGraph.getCell(dropModelID)));
            else if (xGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(xGraph.getCell(dropModelID)));
            else if (fGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(fGraph.getCell(dropModelID)));
            else var dropCell=JSON.parse(JSON.stringify(eGraph.getCell(dropModelID)));
            dropCell['id']=dropCell['id'].concat(dropCounter);
            dropCell['position']['x']=x;
            dropCell['position']['y']=y;
            dropCell['ordinal']='';
            dropCell['level']='';
            dropCell['where']='paper';
            temp.push(dropCell);
            graph.resetCells(JSON.parse(JSON.stringify(temp)));
            dropModelID=0;
            $('.stencil-scroller').css({"cursor": "move"});
            $('.paper-scroller').css({"cursor": "move"});
            if (undoStack.length!=0)
                previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
            else previousState=JSON.parse(JSON.stringify(temp1));
            currentState=JSON.parse(JSON.stringify(temp));   
            undoStack.push({prev: previousState, curr: currentState});
            $('#undo').attr('disabled',false);
        }
        else {
            copyCounter++;
            cursorX = JSON.parse(JSON.stringify(x));
            cursorY = JSON.parse(JSON.stringify(y));
            trdEvent.events.trigger('register:paste');
        }
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
                    if (graph.getCell(copyModelID).get('type')=='Block.Start')
                        return;

                    var temp=JSON.parse(JSON.stringify(graph.get('cells')));
                    copyCell=JSON.parse(JSON.stringify(graph.getCell(copyModelID)));
                    copyCell['id']=copyCell['id'].concat(copyCounter);
                    copyCell['position']['x']=cursorX;
                    copyCell['position']['y']=cursorY;
                    copyCell['ordinal']='';
                    copyCell['level']='';
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
        try {
            var cells = graph.get('cells').models;
            for (var a in cells)
                paper.findViewByModel(cells[a]).unhighlight();
            if (!cellView.model.isLink())
                paper.findViewByModel(cellView.model).highlight();
        }
        catch(e) {
            console.log(e);
        }

        redoStack=[];
        if (cellView.model.isLink()) {
            try {
                var tLink = cellView.model.get('target').id; 
            }
            catch  (e)  {}
            if (tLink) {
                var sLink = cellView.model.get('source').port;
                var index=graph.get('cells').indexOf(cellView.model);
                var temp=JSON.parse(JSON.stringify(graph.get('cells')));
                if (index==graph.get('cells').length-1) {
                    $('#'+sLink).prop('disabled',true);
                    temp.splice(index, 1);
                    previousState=JSON.parse(JSON.stringify(temp));
                }
                else {
                    $('#'+sLink).prop('disabled',false);
                    previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                }
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

            ordinal: '',
            level: '',

            battrs: {
                Name: '',
                Input1: '',
                Input2: '',
                Operator: '',
                Output: '',
            },

            pout: {
                out: 'open'
            },

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

        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.Start',

            ordinal: 0,
            level: 0,

            Name: 'Start',
            battrs: {
                Name: 'Start',
                Output1: '',
                Output2: '',
                Output3: '',
                Output4: '',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: [],
            outPorts: ['out'],
            attrs: {                    
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/start.png' },
                '.label': { text: 'Start', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.CustomBlock = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.CustomBlock',

            ordinal: '',
            level: '',

            battrs: {
                Name: 'Custom Block',
                Input1: '',
                Input2: '',
                Operator: '',
                Output: '',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
             attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/custom_block.png' },
                '.label': { text: 'Custom Block', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.SelectCase = joint.shapes.devs.Model.extend({

        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.SelectCase',
            ordinal: '',
            level: '',

            Name: 'Select Case',
            battrs: {
                Name: 'Select Case',
                Check: '',
                Case1: '',
                Case2: '',
                Case3: '',
            },

            pout: {
                Case_1: 'open',
                Case_2: 'open',
                Case_3: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['Case_1', 'Case_2', 'Case_3'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/select_case.png' },
                '.label': { text: 'Select Case', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.SetVariable = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.SetVariable',
            ordinal: '',
            level: '',

            Name: 'Set Variable',
            battrs: {
                Name: 'Set Variable',
                Input1: '',
                Input2: '',
                Operator: '',
                Output: '',
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/Set_Variable.png' },
                '.label': { text: 'Set Variable', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.MultiSetVariable = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.MultiSetVariable',
            ordinal: '',
            level: '',

            Name: 'Multi Set Variable',
            battrs: {
                Name: 'Multi Set Variable',
                Input1: '',
                Value1: '',
                Input2: '',
                Value2: '',
                Input3: '',
                Value3: '',
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/Multi_Set_Variable.png' },
                '.label': { text: 'Multi Set Variable', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.GetVariableLength = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.GetVariableLength',
            ordinal: '',
            level: '',

            Name: 'Get Variable Length',
            battrs: {
                Name: 'Get Variable Length',
                Variable: '',
                Length: '',
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/get_variable_length.png' },
                '.label': { text: 'Get Variable Length', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.GetTime = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.GetTime',
            ordinal: '',
            level: '',

            Name: 'Get Time',
            battrs: {
                Name: 'Get Time',
                Date_Format:'',
                Timezone:'',
                Date_Time: '',
                Year: '',
                Month: '',
                Date: '',
                Hour: '',
                Minute: '',
                Second: '',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/get_time.png' },
                '.label': { text: 'Get Time', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.AddDate = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.AddDate',
            ordinal: '',
            level: '',

            Name: 'Add Date',
            battrs: {
                Name: 'Add Date',
                Date_Format:'',
                Date_Time: '',
                Year:'',
                Month:'',
                Date:'',
                Hour:'',
                Minute:'',
                Second:'',
                Interval: '',
                New_Date: '',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/add_date.png' },
                '.label': { text: 'Add Date', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.GetDateDifference = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.GetDateDifference',
            ordinal: '',
            level: '',

            Name: 'Get Date Difference',
            battrs: {
                Name: 'Get Date Difference',
                Date_Format:'',
                First_date: '',
                Second_date: '',
                Interval_Format: '',
                Interval: '',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/get_date_diff.png' },
                '.label': { text: 'Get Date Difference', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

 joint.shapes.Block.CancelTimer = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.CancelTimer',
            ordinal: '',
            level: '',

            Name: 'Cancel Timer',
            battrs: {
                Name: 'Cancel Timer',
                Timer: ''
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/cancel_timer.png' },
                '.label': { text: 'Cancel Timer', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.OnTimer= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.OnTimer',
            ordinal: '',
            level: '',

            Name: 'On Timer',
            battrs: {
                Name: 'On Timer',
                Timer: '', 
            },

            pout: {
                Ok: 'open',
                Expired: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['Ok', 'Expired'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/on_timer.png' },
                '.label': { text: 'On Timer', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });



    joint.shapes.Block.Sleep = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.Sleep',
            ordinal: '',
            level: '',

            Name: 'Sleep',
            battrs: {
                Name: 'Sleep',
                Hour: '',
                Min: '',
                Sec: '',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/sleep_icon.png' },
                '.label': { text: 'Sleep', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.If= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.If',
            ordinal: '',
            level: '',

            Name: 'If',
            battrs: {
                Name: 'If',
                Input1: '',
                Input2: '',
                Operator: '',  
            },

            pout: {
                _true: 'open',
                _false: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['_true', '_false'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/if_clause.png' },
                '.label': { text: 'If', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.FindString= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.FindString',
            ordinal: '',
            level: '',

            Name: 'Find String',
            battrs: {
                Name: 'Find String',
                Text_string: '',
                String_to_find: '',
                Start_position_in_string: '',
                Returned_position: ''  
            },

            pout: {
                Found: 'open',
                Not_Found: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['Found', 'Not_Found'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/find_string.png' },
                '.label': { text: 'Find String', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.SplitString= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.SplitString',
            ordinal: '',
            level: '',

            Name: 'Split String',
            battrs: {
                Name: 'Split String',
                Split_Value: '',
                Split_Side: '',
                Split_length: '',
                Left_part: '',
                Right_part: ''  
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/split_string.png' },
                '.label': { text: 'Split String', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.Concatenate= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.Concatenate',
            ordinal: '',
            level: '',

            Name: 'Concatenate',
            battrs: {
                Name: 'Concatenate',
                Input1: '',
                Input2: '',
                Input3: '',
                Input4: '',
                Output: ''  
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/concatenate_icons.png' },
                '.label': { text: 'Concatenate', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.Replace= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.Replace',
            ordinal: '',
            level: '',

            Name: 'Replace',
            battrs: {
                Name: 'Replace',
                Original_Text: '',
                Text_to_find: '',
                Replace_with: '',
                Number_of_replacements: '',
                Output: ''  
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/replace_icons.png' },
                '.label': { text: 'Replace', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.OnFormSubmit= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.OnFormSubmit',
            ordinal: '',
            level: '',

            Name: 'On Form Submit',
            battrs: {
                Name: 'On Form Submit',
                Form: '', 
            },

            pout: {
                Ok: 'open',
                Submitted: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['Ok', 'Submitted'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/on_form_submit.png' },
                '.label': { text: 'On Form Submit', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.ShowForms= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.ShowForms',
            ordinal: '',
            level: '',

            Name: 'Show Forms',
            battrs: {
                Name: 'Show Forms',
                Form1: '',
                Form2: '',
                Form3: '',
                Form4: '', 
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/show_forms.png' },
                '.label': { text: 'Show Forms', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.SendXMLParseResponse= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.SendXMLParseResponse',
            ordinal: '',
            level: '',

            Name: 'Send XML, Parse Response',
            battrs: {
                Name: 'Send XML, Parse Response',
                URL: '',
                Body: '',
                Method: '',
                Xpath1: '',
                Xpath2: '', 
                Error_Code: '',
                Repsonse_Body: '',
                XpathOut1: '',
                XpathOut2: '',  
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/Send_XML_Parse_Response.png' },
                '.label': { text: 'Send XML, Parse Response', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.ParseXML= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.ParseXML',
            ordinal: '',
            level: '',

            Name: 'Parse XML',
            battrs: {
                Name: 'Parse XML',
                XML: '',
                Xpath1: '',
                Xpath2: '', 
                Error_Code: '',
                XpathOut1: '',
                XpathOut2: '',  
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/parse_xml.png' },
                '.label': { text: 'Parse XML', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.CreateCalendarEvent= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.CreateCalendarEvent',
            ordinal: '',
            level: '',

            Name: 'Create Calendar Event',
            battrs: {
                Name: 'Create Calendar Event',
                Event_Name: '',
                Date: '',
                Time: '', 
                Creator_Name: '',
                Event_Description: '', 
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/Create_calendar_event.png' },
                '.label': { text: 'Create Calendar Event', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.CreateNotification= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.CreateNotification',
            ordinal: '',
            level: '',

            Name: 'Create Notification',
            battrs: {
                Name: 'Create Notification',
                Notification_Name:'',
                Display: '', 
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/create_notifications.png' },
                '.label': { text: 'Create Notification', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.SendEmail= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.SendEmail',
            ordinal: '',
            level: '',

            Name: 'Send eMail',
            battrs: {
                Name: 'Send eMail',
                Subject:'',
                Included_People:'',
                To:'',
                From:'',
                Text:'', 
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': '/resources/inner_resources/styles/kreatxcss/icons/send_email.png' },
                '.label': { text: 'Send eMail', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.ElementView = joint.shapes.devs.ModelView.extend({
        events: {
            "click": "inspectClicked",
            "change:position": "inspectClicked",    
        },

        inspectClicked: function (event) {
            if (this.model.prop('where')!='stencil') {

                trdEvent.events.trigger("block:create", [this.model, 0]);
                $('#inspector').find('br').remove();
                $('#inspector').append('<span class="port-span">Close process</span></br>');
                var keys=Object.keys(this.model.get('pout'));
                for (var i=0; i<keys.length; i++) {
                    var j=i+1;
                    $('#inspector').append("<span class='port-span'>Port "+j+": </span><input class='port-input' onchange='updatePort("+keys[i]+")' type='checkbox' id="+keys[i]+'></br>');
                    if (this.model.get('pout')[keys[i]]=='closed') 
                        $('#'+keys[i]).prop('checked',true);
                }

                var links = graph.getLinks();
                for (var i = 0; i < links.length; i++){
                    var linkV1=links[i].get('source');
                    if (linkV1.id==this.model.id) 
                        $('#'+linkV1.port).prop('disabled',true);
                }

                var p=this.model.get('pout');
                var m=this.model;
                updatePort = function(e) {
                    if(e.checked) {
                        p[e.id]='closed';
                        m.attr('[port='+e.id+']/fill', 'red');
                        m.attr('[port='+e.id+']/type', 'empty');
                        if (undoStack.length!=0)
                            previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                        currentState=JSON.parse(JSON.stringify(graph.get('cells')));  
                        undoStack.push({prev: previousState, curr: currentState});
                        $('#undo').attr('disabled',false);
                    }
                    else {
                        p[e.id]='open';
                        m.attr('[port='+e.id+']/fill', '#00FF00');
                        m.attr('[port='+e.id+']/type', 'output');
                        if (undoStack.length!=0)
                            previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                        currentState=JSON.parse(JSON.stringify(graph.get('cells')));  
                        undoStack.push({prev: previousState, curr: currentState});
                        $('#undo').attr('disabled',false);
                    }
                };
                
            }
        },
    });

    joint.shapes.Block.StartView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SelectCaseView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SetVariableView=joint.shapes.Block.ElementView;
    joint.shapes.Block.MultiSetVariableView=joint.shapes.Block.ElementView;
    joint.shapes.Block.GetVariableLengthView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SleepView=joint.shapes.Block.ElementView;
    joint.shapes.Block.IfView=joint.shapes.Block.ElementView;
    joint.shapes.Block.GetTimeView=joint.shapes.Block.ElementView;
    joint.shapes.Block.FindStringView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SplitStringView=joint.shapes.Block.ElementView;
    joint.shapes.Block.AddDateView=joint.shapes.Block.ElementView;
    joint.shapes.Block.GetDateDifferenceView=joint.shapes.Block.ElementView;
    joint.shapes.Block.CancelTimerView=joint.shapes.Block.ElementView;
    joint.shapes.Block.OnTimerView=joint.shapes.Block.ElementView;
    joint.shapes.Block.ConcatenateView=joint.shapes.Block.ElementView;
    joint.shapes.Block.ReplaceView=joint.shapes.Block.ElementView;
    joint.shapes.Block.OnFormSubmitView=joint.shapes.Block.ElementView;
    joint.shapes.Block.ShowFormsView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SendXMLParseResponseView=joint.shapes.Block.ElementView;
    joint.shapes.Block.ParseXMLView=joint.shapes.Block.ElementView;
    joint.shapes.Block.CustomBlockView=joint.shapes.Block.ElementView;
    joint.shapes.Block.CreateCalendarEventView=joint.shapes.Block.ElementView;
    joint.shapes.Block.CreateNotificationView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SendEmailView=joint.shapes.Block.ElementView;


    var m1 = joint.shapes.Block;
    function placeBlock(elm, posx, posy) {
        var cell = new elm({
            position: { x: posx, y: posy },
        }); 
        return cell;
    };

	
	
	if (diagram_json) 
		graph.fromJSON(diagram_json);


	

    var s1= placeBlock(m1.Start,20,20).prop('where', 'stencil');
    var s21= placeBlock(m1.CustomBlock,140,20).prop('where', 'stencil');
    stGraph.addCell(s1).addCell(s21);

    var s2= placeBlock(m1.SetVariable,20,20).prop('where', 'stencil');
    var s11=placeBlock(m1.MultiSetVariable,140, 20).prop('where', 'stencil');
    var s16=placeBlock(m1.GetVariableLength,80, 120).prop('where', 'stencil');
    vGraph.addCell(s2).addCell(s11).addCell(s16);
    
    var s8=placeBlock(m1.FindString,20, 20).prop('where', 'stencil');
    var s12=placeBlock(m1.SplitString,140, 20).prop('where', 'stencil');
    var s14=placeBlock(m1.Concatenate,20, 120).prop('where', 'stencil');
    var s15=placeBlock(m1.Replace,140, 120).prop('where', 'stencil');
    sGraph.addCell(s8).addCell(s12).addCell(s14).addCell(s15);

    var s4=placeBlock(m1.If,20, 20).prop('where', 'stencil');
    var s6=placeBlock(m1.SelectCase,140, 20).prop('where', 'stencil');
    cGraph.addCell(s4).addCell(s6);

    var s7=placeBlock(m1.GetTime,20, 20).prop('where', 'stencil');
    var s9=placeBlock(m1.AddDate,20, 120).prop('where', 'stencil');
    var s10=placeBlock(m1.GetDateDifference,140, 120).prop('where', 'stencil');
    var s5=placeBlock(m1.Sleep,140, 20).prop('where', 'stencil');
    var s13=placeBlock(m1.CancelTimer,140, 220).prop('where', 'stencil');
    var s3=placeBlock(m1.OnTimer,20, 220).prop('where', 'stencil');
    dGraph.addCell(s7).addCell(s9).addCell(s10).addCell(s5).addCell(s13).addCell(s3);

    var s17=placeBlock(m1.OnFormSubmit,20, 20).prop('where', 'stencil');
    var s18=placeBlock(m1.ShowForms,140, 20).prop('where', 'stencil');
    fGraph.addCell(s17).addCell(s18);

    var s19=placeBlock(m1.SendXMLParseResponse,20, 20).prop('where', 'stencil');
    var s20=placeBlock(m1.ParseXML,140, 20).prop('where', 'stencil');
    xGraph.addCell(s19).addCell(s20);

    var s22=placeBlock(m1.CreateCalendarEvent,20, 20).prop('where', 'stencil');
    var s23=placeBlock(m1.CreateNotification,140, 20).prop('where', 'stencil');
    var s24=placeBlock(m1.SendEmail,80, 120).prop('where', 'stencil');
    eGraph.addCell(s22).addCell(s23).addCell(s24);
    
    

    var att = Backbone.Model.extend({
        Name: '',
        Value: '',
        CName: '',
    });
    
    trdEvent.events.on("block:create", function(msg) {
        var a=[];
        if (msg[1]===0) {
            if (currentModelID===msg[0].id) {
                $('#inspector').find('.port-span').remove();
                $('#inspector').find('.port-input').remove();
                return;
            }
        };
        if ((currentModelID!==msg[0].id)&&(currentModelID!==0)) {
            $('#inspector').find('span').remove();
            $('#inspector').find('input').remove();
            inspect.destroyAll();
        };
        currentModelID=msg[0].id;
        var keys=Object.keys(msg[0].get('battrs'));
        for (var i=0; i<keys.length; i++)
            a.push(new att({ Name: keys[i], Value: msg[0].get('battrs')[keys[i]], CName: keys[i]}));

        attributes=new atts(a);
        inspect = new inspectView({ collection: attributes });
        trdEvent.events.trigger("block:inspect", this.model);
    });

    trdEvent.events.on('update:JModel', function(msg) {
        graph.getCell(currentModelID).get('battrs')[msg.get('CName')]=msg.get('Value');   
        updateCache(currentModelID, msg.get('CName'), msg.get('Value'));

        function updateCache(CMID, name, val) {
            if (cacheVariables.length==0) {
                if ((val[0]=='$')&&(val.length!=1)) {
                    var tempCache={ 
                        cellID:currentModelID, 
                        attName:msg.get('CName'),
                        attValue:msg.get('Value')
                    };
                    cacheVariables.push(tempCache);
                    return;
                }
            }
            var a = cacheVariables.map(function(el) { 
                    if ((el.cellID==CMID)&&(el.attName==name))
                        return 1;
                    else return 0;
            }).indexOf(1);
            if (a==-1) {
                if ((val[0]=='$')&&(val.length!=1)) {
                    var tempCache={ 
                        cellID:currentModelID, 
                        attName:msg.get('CName'),
                        attValue:msg.get('Value')
                        };
                    cacheVariables.push(tempCache);
                    return;
                }
            }  
            else if (val.length>0) {
                cacheVariables[a].attValue=val;
                return;
            }
            else {
                cacheVariables.splice(a, 1);
            }
            return;
        }
         
        if (msg.get('CName')=='Name') 
            graph.getCell(currentModelID).attr('.label/text', msg.get('Value'));
        trdEvent.events.trigger("update:view", graph.getCell(currentModelID));
        if (undoStack.length!=0)
            previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
        currentState=JSON.parse(JSON.stringify(graph.get('cells')));  
        undoStack.push({prev: previousState, curr: currentState});
        $('#undo').attr('disabled',false);
    });

    trdEvent.events.on("destroy:view", function(msg) {
        $('#inspector').find('span').remove();
        $('#inspector').find('br').remove();
        $('#inspector').find('input').remove();
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
            this.$('input').typeahead({source: cache, scrollHeight:cache.length});
            if (this.$('input').val()[0]=='$') {
                
                this.input = this.$('input').tagsinput({maxTags: 1, typeahead: {source: cache}, freeInput: true});
                if (cache.indexOf(this.$('input').val())==-1)
                    cache.push(this.$('input').val());
            }
            this.input = this.$('input');
            return this;
        },

        updateOnEnter: function(e){
            if(e.keyCode == 13){
                this.close();
            }
        },

        close: function(){
            //if (this.input.val()) {
                this.model.set({ Value: this.input.val().trim()}); 
                trdEvent.events.trigger("update:JModel", this.model);
            //}
        },
    });
})


