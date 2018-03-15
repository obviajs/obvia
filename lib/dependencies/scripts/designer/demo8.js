$(function() { 

    var transferEvent = function () {
        this.events = _.extend({}, Backbone.Events);
    };
    var trdEvent = new transferEvent();

    var undoStack=[];
    var redoStack=[];
    var cacheVariables=[];
    var cache=[];
    var cacheValues=[];
    var iconsPath = "resources/inner_resources/scripts/designer/icons/";
    $('#undo').attr('disabled',true);
    $('#undo').tooltip('hide');
    $('#redo').attr('disabled',true);
    $('#redo').tooltip('hide');
    
    $('#undo').on('click', function() {
        if(undoStack.length==0) return;
        var upass=undoStack.pop();
        if (undoStack.length==0) {
            $('#undo').attr('disabled',true);
            $('#undo').tooltip('hide');
        }
        else $('#undo').attr('disabled',false);
        graph.resetCells(JSON.parse(JSON.stringify(upass.prev)));
        redoStack.push(upass);
        $('#redo').attr('disabled',false);
        if(upass.prev.length==upass.curr.length) {
            trdEvent.events.trigger("destroy:view", [graph.getCell(currentModelID), 1]);
        }
    });

    $('#redo').on('click', function() {
        if(redoStack.length==0) return;
        var rpass=redoStack.pop();
        if (redoStack.length==0) {
            $('#redo').attr('disabled',true);
            $('#redo').tooltip('hide');
        }
        else $('#redo').attr('disabled',false);
        graph.resetCells(JSON.parse(JSON.stringify(rpass.curr)));
        undoStack.push(rpass);
        $('#undo').attr('disabled',false);
        if(rpass.prev.length==rpass.curr.length)
            trdEvent.events.trigger("destroy:view", [graph.getCell(currentModelID), 1]);
    });

    $('#grid').on('input change', function() {
        $(this).next().text(this.value);
        paper.options.gridSize = this.value;
        paper.$el.css('background-image', 'url("' + getGridBackgroundImage(this.value) + '")');
    });

    function getGridBackgroundImage(gridX) {
        var canvas = $('<canvas/>', { width: gridX, height: gridX });

        canvas[0].width = gridX;
        canvas[0].height = gridX;

        var context = canvas[0].getContext('2d');
        context.beginPath();
        context.rect(1, 1, 1, 1);
        context.fillStyle ='#AAAAAA';
        context.fill();

        return canvas[0].toDataURL('image/png');
    }

    function getEventWorkFlowXml(){
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
        var bpelText = new XMLSerializer().serializeToString(bpel);
        return bpelText;
    }

    function graphToJSON() {
        return JSON.stringify(graph.toJSON());
    }

    function graphFromJSON(jsonString) {
        graph.fromJSON(JSON.parse(jsonString));
    }

    var scaleX=1;
    $('#zoomin').on('click', function() { 
        scaleX+=0.1;
        paper.scale(scaleX, scaleX, 0, 0);
        prevX=prevX*scaleX;
        prevY=prevY*scaleX;
        paper.options.height=paper.options.height*scaleX/(scaleX-0.1);
        paper.options.width=paper.options.width*scaleX/(scaleX-0.1);
        $('#paper').css({'height': paper.options.height});
        $('#paper').css({'width': paper.options.width});
        $('#paper').children().last().css({'height': paper.options.height});
        $('#paper').children().last().css({'width': paper.options.width});
        updateCurrentView();
    });

    $('#zoomout').on('click', function() { 
        scaleX-=0.1;
        paper.scale(scaleX, scaleX, 0, 0);
        prevX=prevX*scaleX;
        prevY=prevY*scaleX;
        paper.options.height=paper.options.height*scaleX/(scaleX+0.1);
        paper.options.width=paper.options.width*scaleX/(scaleX+0.1);
        $('.paper').css({'height': paper.options.height});
        $('.paper').css({'width': paper.options.width});
        $('#paper').children().last().css({'height': paper.options.height});
        $('#paper').children().last().css({'width': paper.options.width});
        updateCurrentView();
    });

    var topX;
    var topY;
    $('#reverseZTF').attr('disabled',true);
    $('#reverseZTF').tooltip('hide');

    
    $('#zoomToFit').on('click', function() {
        if ($('.inspector-container').offset().left>0)
            var fixedX=$('.inspector-container').offset().left-$('.paper-container').offset().left;
        else  var fixedX=$(window).width()-$('.paper-container').offset().left;
        var fixedY=$(window).height()-$('.paper-container').offset().top-30;
        if (graph.get('cells').models[0]) 
        {
            var temp=graph.get('cells').models[0];
            topX=temp.getBBox().x; 
            var bottomX=temp.getBBox().x+temp.getBBox().width;
            topY=temp.getBBox().y;
            var bottomY=temp.getBBox().y+temp.getBBox().height;
            graph.get('cells').models.forEach(function(c) {
                if (!c.isLink()) {
                    if (c.getBBox().x<topX)
                        topX=c.getBBox().x;
                    if (c.getBBox().y<topY)
                        topY=c.getBBox().y;
                    if (c.getBBox().x+c.getBBox().width>bottomX)
                        bottomX=c.getBBox().x+c.getBBox().width;
                    if (c.getBBox().y+c.getBBox().height>bottomY)
                        bottomY=c.getBBox().y+c.getBBox().height;
                }
            });
            
            if ((fixedX/(bottomX-topX)<1)&&(fixedY/(bottomY-topY)<1)) 
                scaleX=Math.max(fixedX/(bottomX-topX),fixedY/(bottomY-topY));
            else 
                scaleX=Math.min(fixedX/(bottomX-topX),fixedY/(bottomY-topY))-0.1;
            
            paper.scale(scaleX, scaleX, 0, 0);
            paper.options.height=paper.options.height*scaleX;
            paper.options.width=paper.options.width*scaleX;
            $('.paper').css({'height': paper.options.height});
            $('.paper').css({'width': paper.options.width});
            $('#paper').children().last().attr({'height': paper.options.height});
            $('#paper').children().last().attr({'width': paper.options.width});
            $('.paper-scroller').animate({
                scrollTop: (topY-$('.paper-container').offset().top+35)*scaleX,
                scrollLeft: (topX-5)*scaleX
            });


            $('#reverseZTF').attr('disabled',false);
        }
        updateCurrentView();
    });

    $('#reverseZTF').on('click', function() {
        paper.scale(1, 1, 0, 0);
        paper.options.height=paper.options.height/scaleX;
        paper.options.width=paper.options.width/scaleX;
        $('.paper').css({'height': paper.options.height});
        $('.paper').css({'width': paper.options.width});
        $('#paper').children().last().attr({'height': paper.options.height});
        $('#paper').children().last().attr({'width': paper.options.width});
        $('.paper-scroller').animate({
            scrollTop: (topY-$('.paper-container').offset().top+35)/scaleX,
            scrollLeft: (topX-5)/scaleX
        });
        scaleX=1;
        $('#reverseZTF').attr('disabled',true);
        $('#reverseZTF').tooltip('hide');
        updateCurrentView();
    });

    $('#fullscreen').on('click',function() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen)   
                document.documentElement.requestFullScreen();  
            else if (document.documentElement.mozRequestFullScreen)  
                document.documentElement.mozRequestFullScreen();  
            else if (document.documentElement.webkitRequestFullScreen)   
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
        } 
        else {  
            if (document.cancelFullScreen) 
                document.cancelFullScreen();  
            else if (document.mozCancelFullScreen)  
                document.mozCancelFullScreen();  
            else if (document.webkitCancelFullScreen)   
                document.webkitCancelFullScreen();   
        }  
    });

    var tog1=true;
    $('#expandS').hide();
    $('#collapseS').on('click', function() { 
/*        if (tog1)
            $('.stencil-container').animate({width: 'toggle'});*/
        $('#collapseS').hide();
        $('#expandS').show();
        tog1=false;
        $('.paper-container').css({'left': 0});
        $('.paper-container').css({'z-index': 1});
    });

    $('#expandS').on('click', function() { 
/*        if (!tog1)
            $('.stencil-container').animate({width: 'toggle'});*/
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
        if ($(event.target).parent().hasClass('closed'))
            $(event.target).parent().removeClass('closed');
        else $(event.target).parent().addClass('closed');
    });

    var nodeListType=[];
    $('#export').on('click', function() {
        //window.open("data:text/json;charset=utf-8," + escape(JSON.stringify(graph.toJSON())));
        //$(this).attr("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph.toJSON())));
        //window.open('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAHUlEQVQYV2NkYGAwBuKzQIwXMBJSAJMfVUidcAQAnUQBC6jEGBUAAAAASUVORK5CYII=');return;
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
                    
                    if (node.get('battrs')[t][0]=='$') {
                        /*var flip=1;
                        for(var someOtherCell in cacheVariables) {
                            if (someOtherCell.attValue==node.get('battrs')[t]) {
                                if (node.get('level')>g.getCell(someOtherCell.cellID).get('level'))
                                    flip=0;
                            }
                        }
                        if (flip)
                    	   to.setAttribute('variable',node.get('battrs')[t].substring(1,node.get('battrs')[t].length));
                        else 
                           to.setAttribute('variable',node.get('battrs')[t]); */
                        to.setAttribute('variable',node.get('battrs')[t].substring(1,node.get('battrs')[t].length));
                        from.setAttribute('variable',f);
                    }
                    else {
                    	var cd=BPEL.createCDATASection(node.get('battrs')[t]);
                    	from.appendChild(cd);
                    	to.setAttribute('variable',f);
                    }
                    var assign = document.createElement('assign');
                    var copy = document.createElement('copy');
                    copy.appendChild(from);
                    copy.appendChild(to);
                    tag.appendChild(assign).appendChild(copy);
                }
            }

            if ((tag.nodeName=='adddate')||(tag.nodeName=='subtractdate')) {
                var from = document.createElement('from');
                var to = document.createElement('to');
                from.setAttribute('variable',node.get('battrs')['New_Date'].substring(1,node.get('battrs')['New_Date'].length));
                to.setAttribute('variable','dt');
                var assign = document.createElement('assign');
                var copy = document.createElement('copy');
                copy.appendChild(from);
                copy.appendChild(to);
                tag.appendChild(assign).appendChild(copy);
                createAssign("__year","Year");createAssign("__month","Month");createAssign("__date","Date");
                createAssign("__hour","Hour");createAssign("__minute","Minute");createAssign("__second","Second");

                tag.setAttribute('dateTime', node.get('battrs')['Date_Time']);
                tag.setAttribute('formatTime', node.get('battrs')['Date_Format']);
                tag.setAttribute('interval', node.get('battrs')['Interval']);
                tag.setAttribute('newDateTime', node.get('battrs')['New_Date'].substring(1,node.get('battrs')['New_Date'].length));
                tag.setAttribute('timeLanguage', node.get('battrs')['Time_Language']);
            }
            else if (tag.nodeName=='getdatedifference') {
                createAssign("__interval","Interval");

                tag.setAttribute('formatTime', node.get('battrs')['Date_Format']);
                tag.setAttribute('firstDate', node.get('battrs')['First_date']);
                tag.setAttribute('secondDate', node.get('battrs')['Second_date']);
                tag.setAttribute('intervalFormat', node.get('battrs')['Interval_Format']);
            }
            else if (tag.nodeName=='gettime') {
                createAssign("__dateTime","Date_Time");
                createAssign("__year","Year");createAssign("__month","Month");createAssign("__date","Date");
                createAssign("__hour","Hour");createAssign("__minutes","Minute");createAssign("__seconds","Second");
                createAssign("__day","Weekday");createAssign("__monthName","Month_Name");
                
                tag.setAttribute('formatTime', node.get('battrs')['Date_Format']);
                tag.setAttribute('timeZone', node.get('battrs')['Timezone']);
                tag.setAttribute('timeLanguage', node.get('battrs')['Time_Language']);
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
            else if (tag.nodeName=='concatenate') {
            	createAssign("__input1","Input1");createAssign("__input2","Input2");createAssign("__input3","Input3");createAssign("__input4","Input4");
            	createAssign("concatenatedWord","Output");	
            }
            else if (tag.nodeName=='splitstring') {
            	createAssign("__stringValue","String_to_split");
            	createAssign("__delimiter","Delimiter");

            	tag.setAttribute('splitValue', node.get('battrs')['Split_Value']);
                tag.setAttribute('limit', node.get('battrs')['Limit']);
                tag.setAttribute('side', node.get('battrs')['Side']);
            }
            else if (tag.nodeName=='findstring') {
            	createAssign("__findStringValue","Text_string");
            	createAssign("__stringToFind","String_to_find");

            	tag.setAttribute('startPosition', node.get('battrs')['Start_position_in_string']);
                tag.setAttribute('firstPositionFound', node.get('battrs')['First_position_found']);
                tag.setAttribute('lastPositionFound', node.get('battrs')['Last_position_found']);
            }
            else if (tag.nodeName=='findtext') {
                createAssign("__findTextValue","Text_string");
                createAssign("__stringToFind","String_to_find");
                createAssign("__delimiter","Delimiter");

                tag.setAttribute('positionFound', node.get('battrs')['Position_found']);
            }
            else if (tag.nodeName=='substring') {
                createAssign("__stringValue","Original_String");

                tag.setAttribute('side', node.get('battrs')['Side']);
                tag.setAttribute('length', node.get('battrs')['Length']);
                tag.setAttribute('startIndex', node.get('battrs')['Start_position_in_string']);
                tag.setAttribute('subStringValue', node.get('battrs')['Substring']);
            }
            else if (tag.nodeName=='replace') {
            	createAssign("__originalText","Original_Text");
            	createAssign("__textToFind","Text_to_find");
            	createAssign("__replacementText","Replace_with");

            	tag.setAttribute('maximumReplace', node.get('battrs')['Max_replacements']);
                tag.setAttribute('caseSensitive', node.get('battrs')['Case_Senstive']);
                tag.setAttribute('finalText', node.get('battrs')['Output_Text']);
                tag.setAttribute('replacementMade', node.get('battrs')['Replacements_made']);
            }
            else if (tag.nodeName=='parsexml') {
            	createAssign("__xml","XML");
            	createAssign("__namespaces","Namespace");
            	createAssign("__xpath1","Xpath1");
            	createAssign("__xpath2","Xpath2");
            	createAssign("__xpath3","Xpath3");

            	tag.setAttribute('xpathOutput1', node.get('battrs')['XpathOut1']);
                tag.setAttribute('xpathOutput1', node.get('battrs')['XpathOut2']);
                tag.setAttribute('xpathOutput1', node.get('battrs')['XpathOut3']);
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
                else if (next.nodeName=='findtext') {
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

    $('#save').on('click', function() {
        var evtData = {
            event_workflow_json: graphToJSON(),
            id_form: $("#id_form", top.document).val(),
            id_form_field: $("#id_form_field", top.document).val(),
            id_frontendevent: $("#id_frontendevent", top.document).val(),
            frontend_process_id: $("#frontend_process_id", top.document).val()
        };
        if(evtData.event_workflow_json == "" || evtData.event_workflow_json == "{\"cells\":[]}") {
            return;
        }
        evtData.event_workflow_xml = encodeURIComponent(getEventWorkFlowXml());

        console.log(evtData.event_workflow_xml);
        $.ajax({
            url: "?forms/save_form_events",
            type: "POST",
            data: evtData,
            success: function (response) { 
                response = JSON.parse(response);
                window.setTimeout(function(){
                   bootbox.hideAll();
                }, 2000);
                if(response.success == 1){
                    var currentEvt = $("#autogen_id", top.document).val(); 
                    $("#frontend_process_id", top.document).val(response.id);
                    $("#" + currentEvt, top.document).attr("data-event_workflow_json", evtData.event_workflow_json);
                    $("#" + currentEvt, top.document).attr("data-frontend_process_id", response.id);
                    bootbox.dialog({
                        size: "small",
                        //title: "<strong>Sukses!</strong>",
                        message: "<div class=\"text-success\"><strong>" + response.message + "</strong></div>"
                    });
                }
                else{
                    bootbox.dialog({
                        size: "small",
                        //title: "<strong>Gabim!</strong>",
                        message: "<div class=\"text-danger\"><strong>" + response.message + "</strong></div>"
                    });
                }
            },
            error: function () {
                bootbox.alert("Server error!");
            },
            complete: function () {
            }
        });
    });

    $("#formEvents [data-trigger=\"click\"]", top.document).click(function(e){
        var label = "";
        $("#autogen_id", top.document).val($(this).attr("id")); //ruajme id e elementit qe u klikua
        $("#id_frontendevent", top.document).val($(this).attr("data-frontendevent_id"));
        
        if($(this).attr("data-formfieldtype") != "form") {
            label = $(this).attr("data-field_name") + "/" + $(this).text() + ' <span class="caret"></span>';
            $("#id_form_field", top.document).val($(this).attr("data-id_form_field"));
        }
        else {
            label = "form"+ "/" + $(this).attr("data-form_view_mode") + "/" + $(this).text() + ' <span class="caret"></span>';
        }
        $("#frontend_process_id", top.document).val($(this).attr("data-frontend_process_id"));
       
        var graphJSON = $(this).attr("data-event_workflow_json");
        $("#event_workflow_json", top.document).val(graphJSON);
        $("#formEventsLabel", top.document).html(label);

        if(graphJSON != "") {
           graphFromJSON(graphJSON);
        }
        else {
            graphFromJSON("{\"cells\":[]}"); // empty graph
        }
    })

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
    var kGraph = new joint.dia.Graph;
    var previousState;
    var currentState;
    var paperSmall = new joint.dia.Paper({
        el: $('#hold'),
        model: graph,
    });
    paperSmall.scale(.15);
    paperSmall.$el.css('pointer-events', 'none');
    $currentView = $("<div>").addClass("current-view");
    paperSmall.$el.parent().append($currentView); 
    $currentView.draggable({
        containment: "#pan", 
        scroll: false, 
        drag: function() {
            $('.paper-scroller').animate({
                scrollTop: ($('.current-view').offset().top-$('#pan').offset().top)/(0.15*scaleX),
                scrollLeft: ($('.current-view').offset().left-$('#pan').offset().left)/(0.15*scaleX)
            },0);
        },
    });

    $('.paper-scroller').scroll(function(evt) {
        updateCurrentView();
    });

/*    $('#pan').on('click', function(evt) {
        console.log($('.current-view').offset());
        $('.current-view').offset().top=evt.offsetY-$('.current-view').offset().height/2;
        $('.current-view').offset().left=evt.offsetX-$('.current-view').offset().width/2;
        console.log($('.current-view').offset());
        $('.paper-scroller').animate({
            scrollTop: ($('.current-view').offset().top-$('#pan').offset().top)/(0.15*scaleX),
            scrollLeft: ($('.current-view').offset().left-$('#pan').offset().left)/(0.15*scaleX)
        },10);
    });*/

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
        height: 150,
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
        height: 300,
        model: sGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var datetime = new joint.dia.Paper({
        el: $('#datetime'),
        width: 210,
        height: 350,
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

    var eve = new joint.dia.Paper({
        el: $('#xevents'),
        width: 210,
        height: 150,
        model: eGraph,
        interactive: false,

        validateMagnet: function(cellView, magnet) {
            return false;
        }
    });

    var kcl = new joint.dia.Paper({
        el: $('#kclient'),
        width: 210,
        height: 250,
        model: kGraph,
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


    [vars, conds, forms, xmls, strings, datetime, eve, kcl].forEach(function(cPaper) {
        cPaper.on('cell:pointerdown', function(c, evt, x, y) {
            dropModelID=c.model.id; 
            var holdURL='url('+eval(c.model.prop('where')[0]+'Graph').getCell(dropModelID).attr('image/xlink:href')+") 6 6, auto";
            $('.stencil-scroller').css({'cursor': holdURL});
            $('.paper-scroller').css({'cursor': holdURL});
        });
    });

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 1600,
        height: 1000,
        model: graph,
        snapLinks: true,
        linkPinning: false,
        gridSize: 10,
        
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

      
    updateCurrentView();
    function updateCurrentView() {
        var currentViewGeometry = {
            top: parseInt($('#inspector').css('height'),10)+ $('.paper-scroller').scrollTop()*0.15/scaleX,
            left: $('.paper-scroller').scrollLeft() * 0.15/scaleX,
            width: $('.paper-scroller').innerWidth() * 0.15/scaleX,
            height: $('.paper-scroller').innerHeight() * 0.15/scaleX
        }
        $currentView.css(currentViewGeometry);
    }


    var highlighter = V('path', {
        'stroke': '#FF0000',
        'stroke-width': '2px',
        'fill': 'transparent',
        'pointer-events': 'none'
    });

    joint.shapes.devs.Model.prototype.getHighlighterPath = function(w, h) {
        return ['M', w, 0, w, h, 0, h, 0, 0, 'z'].join(' ');
    };

    paper.off('cell:highlight cell:unhighlight');

    // Bind custom ones.
    paper.on('cell:highlight', function(cellView) {

        var padding = 5*scaleX;

        var bbox = g.rect(cellView.getBBox({ useModelGeometry: true })).moveAndExpand({
            x: -padding,
            y: -padding,
            width: 2 * padding,
            height: 2 * padding
        });

        highlighter.translate(bbox.x/scaleX, bbox.y/scaleX, { absolute: true });
        highlighter.attr('d', cellView.model.getHighlighterPath(bbox.width/scaleX, bbox.height/scaleX));

        V(paper.viewport).append(highlighter);
    });

    paper.on('cell:unhighlight', function() {
        highlighter.remove();
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

    var allPapers=[stencil, vars, conds, forms, xmls, strings, datetime, eve, kcl];
    var cacheBackPaper=[];
    var hold;
    var temp=[];
    $('.search').keydown(function(key) {
        if (temp.length==0)
            temp.push(key.which);
        else if ($.inArray(key.which, temp)==-1)
            temp.push(key.which);
    });

    $('.search').keyup(function(key) {
        if (temp.length>1) {
            temp=[];
            return;
        }
        temp=[];

        $('h3').next().slideDown();
        if ($('h3').hasClass('closed'))
            $('h3').removeClass('closed');

        if ((key.which==32)||((key.which>64)&&(key.which<91))) 
            searchFor($('.search').val());
        else if (key.which==8) 
            searchFor($('.search').val(),1);

    });

    function searchFor(letters,back) {
        console.log(letters);
        letters=letters.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        if (letters=='') {
            if (back) {        
                for(var j=0; j<allBackups.length; j++) {
                    allPapers[j].$el.parent().show(); 
                    //allPapers[j].options.model.resetCells(allBackups[j]);
                    for (var l=0; allPapers[j].options.model.getCells().length; l++) 
                        allPapers[j].options.model.getCells()[0].remove();
                    for (var k=0; k<allBackups[j].length; k++)
                        allPapers[j].options.model.addCell(allBackups[j][k]);
                    allPapers[j].options.height=50*(allBackups[j].length);
                    allPapers[j].$el.children().last().css({'height': allPapers[j].options.height});
                    //reArrange(allPapers[j]);   
                }
            }
            cleanStuff();return;
        }
        if (typeof cacheBackPaper[letters]!='function') {
            if (letters in cacheBackPaper) {
                var state=cacheBackPaper[letters];
                for(var i=0; i<allPapers.length; i++) {
                    if (state[i]=='empty') {
                        allPapers[i].$el.parent().hide();
                    }
                    else {
                        allPapers[i].$el.parent().show();
                        allPapers[i].options.model.resetCells(state[i]);
                        reArrange(allPapers[i]);   
                    }
                }
                cleanStuff();return;
            }
        }

        pointer=0;
        var alive=[];
        var search = new RegExp(letters, 'i');
        allPapers.forEach(function(onePaper) {
            onePaper.options.model.get('cells').models.forEach(function(oneModel){
                var findMatchHere = oneModel.get('battrs').Name;
                var result = findMatchHere.match(search);
                if (result) {
                    if (alive[pointer])
                        alive[pointer].push(oneModel);
                    else alive[pointer]=[oneModel];
                }
            });
            if (!alive[pointer])
                alive[pointer]='empty';
            pointer++;
        });

        if (typeof cacheBackPaper[letters]=='function')
            cacheBackPaper[letters]=alive;
        else if (!cacheBackPaper[letters])
            cacheBackPaper[letters]=alive;

        for(var i=0; i<allPapers.length; i++) {
            if (alive[i]=='empty') {
                allPapers[i].$el.parent().hide();
            }
            else {
                allPapers[i].options.model.resetCells(alive[i]);
                reArrange(allPapers[i]);
            }
        }
        cleanStuff();
    }

    function reArrange(papr) {
        for(var k=0; k<papr.options.model.get('cells').length; k++) {
            papr.options.model.get('cells').models[k].prop('position/y', 20+100*k);
            papr.options.model.get('cells').models[k].attr('.label/ref-x', 220);
            papr.options.model.get('cells').models[k].attr('.label/ref-y', 20);
        }
        papr.options.height=50*(papr.options.model.get('cells').length);
        papr.$el.children().last().css({'height': papr.options.height});
        if (papr.$el.parent().hasClass('closed'))
            papr.$el.parent().removeClass('closed');
    }

    function cleanStuff() {
        $('.content').find('.inPorts').remove();
        $('.content').find('.outPorts').remove();
        $('.content').find('.label').css({'font-size': 25});
    }

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

        $('.paper-scroller').animate({
            scrollTop: holdy-$('.paper-scroller').offset().top,
            scrollLeft: holdx-$('.paper-scroller').offset().left
        });
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

        $('.paper-scroller').animate({
            scrollTop: holdy-$('.paper-scroller').offset().top,
            scrollLeft: holdx-$('.paper-scroller').offset().left
        });
        paper.findViewByModel(linkEnd).highlight();  
    };

    var prevX;
    var prevY;
    var currentView;
    paper.on('cell:pointerdown', function(cellView, evt, x, y) { 
        previousState=JSON.parse(JSON.stringify(graph.get('cells')));
        prevX=x;
        prevY=y;
        currentView=cellView;
        trdEvent.events.trigger('register:copy', cellView);
        trdEvent.events.trigger('register:cut', cellView);
        trdEvent.events.trigger('keydown');
    });

    paper.on('cell:pointermove', function (cellView, evt, x, y) {

        var bbox = cellView.getBBox();
        var constrained = false;
        var constrainedX = x;
        
        if (bbox.x <= 0) { 
            constrainedX = x + paper.options.gridSize;
            constrained = true
        }
        
        if (bbox.x + bbox.width >= paper.options.width) { 
            constrainedX = x - paper.options.gridSize; 
            constrained = true
        }
                            
        var constrainedY = y;
        
        if (bbox.y <= 0) {
            constrainedY = y + paper.options.gridSize;
            constrained = true
        }
        
        if (bbox.y + bbox.height >= paper.options.height) { 
            constrainedY = y - paper.options.gridSize; 
            constrained = true
        }
        console.log(constrained);
        //if you fire the event all the time you get a stack overflow
        if (constrained) { 
            cellView.pointermove(evt, constrainedX, constrainedY)
        }
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
            else if (kGraph.getCell(dropModelID))
                var dropCell=JSON.parse(JSON.stringify(kGraph.getCell(dropModelID)));
            else var dropCell=JSON.parse(JSON.stringify(eGraph.getCell(dropModelID)));
            dropCell['id']=dropCell['id'].concat(dropCounter);
            dropCell['position']['x']=x;
            dropCell['position']['y']=y;
            dropCell['ordinal']='';
            dropCell['level']='';
            dropCell['where']='paper';
            dropCell['attrs']['.label']['ref-x']= 0.5;
            dropCell['attrs']['.label']['ref-y']= 60;
            temp.push(dropCell);
            graph.resetCells(JSON.parse(JSON.stringify(temp)));
            dropModelID=0;
            $('.stencil-scroller').css({"cursor": "pointer"});
            $('.paper-scroller').css({"cursor": "pointer"});
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
            if (!cellView.model.isLink()) {
                paper.findViewByModel(cellView.model).highlight();
            }
        }
        catch(e) {
            console.log(e);
        }

        redoStack=[];
        if (cellView.model.isLink()) {
            try {
                var tLink = cellView.model.get('target').id; 
            }
            catch  (e)  {
                console.log(e);
            }
            if (tLink) {
                var pastState=undoStack[undoStack.length-1].curr;
                var linkIndex=pastState.map(function(el) {if (el.id==cellView.model.id) return 1; return 0;}).indexOf(1);
                if (linkIndex!=-1) {
                    if (pastState[linkIndex].vertices!=cellView.model.attributes.vertices)
                        previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));
                }
/*               console.log(pastState[linkIndex]);
                console.log(cellView.model);
                if (cellView.model.changed.vertices) 
                    previousState=JSON.parse(JSON.stringify(undoStack[undoStack.length-1].curr));*/
                else {
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'start.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'custom_block.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'select_case.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'Set_Variable.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'Multi_Set_Variable.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'get_variable_length.png' },
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
                Time_Language: '',
                Date_Time: '',
                Year: '',
                Month: '',
                Date: '',
                Hour: '',
                Minute: '',
                Second: '',
                Weekday: '',
                Month_Name: '',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'get_time.png' },
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
                Interval: '',
                New_Date: '',
                Time_Language: '',
                Year:'',
                Month:'',
                Date:'',
                Hour:'',
                Minute:'',
                Second:'',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'add_date.png' },
                '.label': { text: 'Add Date', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.outPorts circle': { fill: '#00FF00', magnet: 'active', type: 'output'},
                '.port-body': {r: 6},
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.SubtractDate = joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'Block.SubtractDate',
            ordinal: '',
            level: '',

            Name: 'Subtract Date',
            battrs: {
                Name: 'Subtract Date',
                Date_Format:'',
                Date_Time: '',
                Interval: '',
                New_Date: '',
                Time_Language: '',
                Year:'',
                Month:'',
                Date:'',
                Hour:'',
                Minute:'',
                Second:'',
            },

            pout: {
                out: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'get_date_diff.png' },
                '.label': { text: 'Subtract Date', 'ref-x': .5, 'ref-y': 60 },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'get_date_diff.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'cancel_timer.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'on_timer.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'sleep_icon.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'if_clause.png' },
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
                First_position_found: '', 
                Last_position_found: '' 
            },

            pout: {
                Found: 'open',
                Not_Found: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['Found', 'Not_Found'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'find_string.png' },
                '.label': { text: 'Find String', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.FindText= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.FindText',
            ordinal: '',
            level: '',

            Name: 'Find Text',
            battrs: {
                Name: 'Find Text',
                Text_string: '',
                String_to_find: '',
                Delimiter: '',
                Position_found: ''
            },

            pout: {
                Found: 'open',
                Not_Found: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['Found', 'Not_Found'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'find_string.png' },
                '.label': { text: 'Find Text', 'ref-x': .5, 'ref-y': 60 },
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
                String_to_split: '',
                Delimiter: '',
                Limit: '',
                Side: '',
                Split_Value: '',
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'split_string.png' },
                '.label': { text: 'Split String', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.Substring= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.Substring',
            ordinal: '',
            level: '',

            Name: 'Substring',
            battrs: {
                Name: 'Substring',
                Original_String:'',
                Side: '',
                Length: '',
                Start_position_in_string: '',
                Substring: '',
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'split_string.png' },
                '.label': { text: 'Substring', 'ref-x': .5, 'ref-y': 60 },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'concatenate_icons.png' },
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
                Max_replacements: '',
                Case_Senstive: '',
                Output_Text: '',
                Replacements_made: ''  
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'replace_icons.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'on_form_submit.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'show_forms.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'Send_XML_Parse_Response.png' },
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
                Namespace: '',
                Xpath1: '',
                Xpath2: '', 
                Xpath3: '', 
                //Error_Code: '',
                XpathOut1: '',
                XpathOut2: '',  
                XpathOut3: '', 
            },

            pout: {
                out: 'open',
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'parse_xml.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'Create_calendar_event.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'create_notifications.png' },
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'send_email.png' },
                '.label': { text: 'Send eMail', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.ConfirmBox= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.ConfirmBox',
            ordinal: '',
            level: '',

            Name: 'Confirm Box',
            battrs: {
                Name: 'Confirm Box',
                Box: '', 
            },

            pout: {
                Ok: 'open',
                Cancel: 'open'
            },

            size: { width: 50, height: 50 },
            inPorts: ['in'],
            outPorts: ['Ok', 'Cancel'],
            attrs: {
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'confirm_box.png' },
                '.label': { text: 'Confirm Box', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.Focus= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.Focus',
            ordinal: '',
            level: '',

            Name: 'Focus',
            battrs: {
                Name: 'Focus',
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'focus.png' },
                '.label': { text: 'Focus', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.ToggleEnabled= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.ToggleEnabled',
            ordinal: '',
            level: '',

            Name: 'Toggle Enabled',
            battrs: {
                Name: 'Toggle Enabled',
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'toggle_enabled.png' },
                '.label': { text: 'Toggle Enabled', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.ToggleVisibility= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.ToggleVisibility',
            ordinal: '',
            level: '',

            Name: 'Toggle Visibilityi',
            battrs: {
                Name: 'Toggle Visibility',
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'toggle_visibility.png' },
                '.label': { text: 'Toggle Visibility', 'ref-x': .5, 'ref-y': 60 },
                '.inPorts circle': { fill: '#FFFF00', magnet: 'passive', type: 'input'},
                '.port-body': {r: 6},
                '.outPorts circle': { fill: '#00FF00', type: 'output'}
            },

        }, joint.shapes.devs.Model.prototype.defaults),
    });

    joint.shapes.Block.MsgBox= joint.shapes.devs.Model.extend({
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({

            type: 'Block.MsgBox',
            ordinal: '',
            level: '',

            Name: 'Msg Box',
            battrs: {
                Name: 'Msg Box',
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
                image: {'ref-x': -2, 'ref-y': -2, ref: 'rect', width:55, height:55, 'xlink:href': iconsPath +'msg_box.png' },
                '.label': { text: 'MsgBox', 'ref-x': .5, 'ref-y': 60 },
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
            if (this.model.prop('where')=='paper') {

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
    joint.shapes.Block.FindTextView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SplitStringView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SubstringView=joint.shapes.Block.ElementView;
    joint.shapes.Block.AddDateView=joint.shapes.Block.ElementView;
    joint.shapes.Block.SubtractDateView=joint.shapes.Block.ElementView;
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
    joint.shapes.Block.ConfirmBoxView=joint.shapes.Block.ElementView;
    joint.shapes.Block.FocusView=joint.shapes.Block.ElementView;
    joint.shapes.Block.ToggleEnabledView=joint.shapes.Block.ElementView;
    joint.shapes.Block.ToggleVisibilityView=joint.shapes.Block.ElementView;
    joint.shapes.Block.MsgBoxView=joint.shapes.Block.ElementView;


    var m1 = joint.shapes.Block;
    function placeBlock(elm, posx, posy) {
        var cell = new elm({
            position: { x: posx, y: posy },
        }); 
        return cell;
    };


	if (0/*diagram_json*/) {
		graph.fromJSON(diagram_json);
	}
	else {
		//graph.addCell(v1).addCell(v2).addCell(v4).addCell(v5).addCell(v6).addCell(v7);
	}

    var s1= placeBlock(m1.Start,40,20).prop('where', 'initial');
    var s21= placeBlock(m1.CustomBlock,40,120).prop('where', 'initial');
    stGraph.addCell(s1).addCell(s21);

    var s2= placeBlock(m1.SetVariable,40,20).prop('where', 'var');
    var s11=placeBlock(m1.MultiSetVariable,40, 120).prop('where', 'var');
    var s16=placeBlock(m1.GetVariableLength,40, 220).prop('where', 'var');
    vGraph.addCell(s2).addCell(s11).addCell(s16);
    
    var s8=placeBlock(m1.FindString,40, 20).prop('where', 'str');
    var s12=placeBlock(m1.SplitString,40, 120).prop('where', 'str');
    var s25=placeBlock(m1.Substring,40, 220).prop('where', 'str');
    var s26=placeBlock(m1.FindText,40, 320).prop('where', 'str');
    var s14=placeBlock(m1.Concatenate,40, 420).prop('where', 'str');
    var s15=placeBlock(m1.Replace,40, 520).prop('where', 'str');
    sGraph.addCell(s8).addCell(s12).addCell(s14).addCell(s15).addCell(s25).addCell(s26);

    var s4=placeBlock(m1.If,40, 20).prop('where', 'cond');
    var s6=placeBlock(m1.SelectCase,40, 120).prop('where', 'cond');
    cGraph.addCell(s4).addCell(s6);

    var s7=placeBlock(m1.GetTime,40, 20).prop('where', 'datetime');
    var s9=placeBlock(m1.AddDate,40, 120).prop('where', 'datetime');
    var s10=placeBlock(m1.GetDateDifference,40, 220).prop('where', 'datetime');
    var s5=placeBlock(m1.Sleep,40, 320).prop('where', 'datetime');
    var s13=placeBlock(m1.CancelTimer,40, 420).prop('where', 'datetime');
    var s3=placeBlock(m1.OnTimer,40, 520).prop('where', 'datetime');
    var s27=placeBlock(m1.SubtractDate,40, 620).prop('where', 'datetime');
    dGraph.addCell(s7).addCell(s9).addCell(s10).addCell(s5).addCell(s13).addCell(s3).addCell(s27);

    var s17=placeBlock(m1.OnFormSubmit,40, 20).prop('where', 'form');
    var s18=placeBlock(m1.ShowForms,40, 120).prop('where', 'form');
    fGraph.addCell(s17).addCell(s18);

    var s19=placeBlock(m1.SendXMLParseResponse,40, 20).prop('where', 'xml');
    var s20=placeBlock(m1.ParseXML,40, 120).prop('where', 'xml');
    xGraph.addCell(s19).addCell(s20);

    var s22=placeBlock(m1.CreateCalendarEvent,40, 20).prop('where', 'external');
    var s23=placeBlock(m1.CreateNotification,40, 120).prop('where', 'external');
    var s24=placeBlock(m1.SendEmail,40, 220).prop('where', 'external');
    eGraph.addCell(s22).addCell(s23).addCell(s24);

    var s28=placeBlock(m1.ConfirmBox,40, 20).prop('where', 'kclient');
    var s29=placeBlock(m1.Focus,40, 120).prop('where', 'kclient');
    var s30=placeBlock(m1.ToggleEnabled,40, 220).prop('where', 'kclient');
    var s31=placeBlock(m1.ToggleVisibility,40, 320).prop('where', 'kclient');
    var s32=placeBlock(m1.MsgBox,40, 420).prop('where', 'kclient');
    kGraph.addCell(s28).addCell(s29).addCell(s30).addCell(s31).addCell(s32);

    var allBackups=[];
    [stencil, vars, conds, forms, xmls, strings, datetime, eve, kcl].forEach(function(cPaper) {
        cPaper.scale(0.5);
        
        cPaper.options.model.get('cells').models.forEach(function(cModel){
            cModel.attr('.label/ref-x', 220);
            cModel.attr('.label/ref-y', 20);
            $('.inPorts').remove();
            $('.outPorts').remove();
            $('.label').css({'font-size': 25});
            $('.label').css({'align': 'left'});
        });

        allBackups.push(JSON.parse(JSON.stringify(cPaper.options.model.get('cells'))));
    });


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


