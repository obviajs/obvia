function P3ComManager(){
    var WS_BLOCKED_PORTS = [1,7,9,11,13,15,17,19,20,21,22,23,25,37,42,43,53,
        77,79,87,95,101,102,103,104,109,110,111,113,115,
        117,119,123,135,139,143,179,389,465,512,513,514,
        515,526,530,531,532,540,556,563,587,601,636,993,
        995,2049,4045,6000];
    
    /*
    * @param [Number] port the port to check
    * @return [Boolean] websockets spec allows connection on port
    */
    this.isAllowedWebSocketPort = function(port) {
        return WS_BLOCKED_PORTS_OBJ[''+port] || true;
    };    
        
    this.myIP;
    this.handshakePort = 4649;
    this.port = 4659;
    this.sckConnTimeoutMs = 1000;
    this.batchSize = 10;
    this.map = {};
    this.batchDelay = 1500;
    this.$el = $(this);
    /*
      window.onbeforeunload = function(event) {
                  socket.close();
               };

        window.onbeforeunload = function(){

        $scope.websocket.onclose = function () {}; // disable onclose handler first

        $scope.websocket.close();

    };       
    */    
    this.scan = function(){
        var hosts = {};
        var dtStarted = new Date();
       
        lan.IpDiscovery.start(function(error, ip) {
            this.myIP = ip;
            // if (!ip.match(/192.168.0/))return;
            if (error) return;
            var mask = ip.replace(/\d+$/, '');
            var range = [];
            for (var i = 0; i < 256; i++) {
              range.push(mask+i);
            }
            // range = ["192.168.1.98"];
            var eventObject = $.Event(P3ComEventType.DISCOVERY_STARTED);
            this.trigger(eventObject);
            var start = 0;
            var end = this.batchSize;
            var batch;

            var _sendNextBatch = function(){
                batch = range.slice(start, end);
                batch.forEach(function(ip, index) {
                    var _socket;
                
                    _socket = new WebSocket("ws://"+ip+":"+this.handshakePort+"/Discover");
                        if(_socket){
                        //con
                        (function(ip) { // a closure is created
                            return function () {
                                var _sckConnTimeout = setTimeout(function(){
                                    if(hosts[ip]==undefined)
                                        hosts[ip] = null;
                                    //console.log("timed out ", ip, " ",this.sckConnTimeoutMs);    
                                }.bind(this), this.sckConnTimeoutMs);

                                _socket.onopen = function (event) {
                                    //console.log("opened on ", ip);
                                    _socket.send("")
                                }
                                _socket.onmessage = function (event) {
                                    hosts[ip] = JSON.parse(event.data);
                                    _socket.close();
                                    clearTimeout(_sckConnTimeout);
                                    //console.log("received from ", ip);
                                }
                                _socket.onerror = function (event) {
                                    if(hosts[ip]==undefined)
                                        hosts[ip] = null;
                                    clearTimeout(_sckConnTimeout);
                                    //console.log("error ", ip);    
                                }
                                _socket.onclose = function(){
                                    if(hosts[ip]==undefined)
                                        hosts[ip] = null;
                                    clearTimeout(_sckConnTimeout);
                                    //console.log("connection closed ", ip); 
                                    
                                }
                            }.call(this);
                        }.bind(this))(ip);


                        //console.log(_socket.readyState)
                        if(1){//_socket.readyState == 0){
                            //console.log("trying connection on ", ip);    
                        }
                    }else{
                        hosts[ip] = null;
                        //console.log("refused ", ip); 
                    }
                }.bind(this));
                start += this.batchSize;
                if(end<range.length){
                    end += this.batchSize;
                    end = Math.min(end, range.length);
                    if(end<=range.length){
                        setTimeout(function(){
                            //console.log("process next batch")
                            _sendNextBatch();
                        }.bind(this), this.batchDelay);
                    }
                }

            }.bind(this);
            _sendNextBatch();
            //process next batch
            

        }.bind(this));
        _waitScan(hosts, dtStarted);
    }
    this.discoveredHosts = [];
    var _waitScan = function(hosts, dtStarted){
        //mund te zgjedhim qe te dergojme nje event te ndermjetem qe te njoftojme nese kemi te pakten +nje host discovered
        var scannedHosts = Object.keys(hosts);
        var discoveredHosts = [];

        if(scannedHosts.length == 256){
            var eventObject = $.Event(P3ComEventType.DISCOVERY_FINISHED);
            //console.log(hosts)
            scannedHosts.forEach(function(ip, index) {
                //console.log("137 ", ip," ",index)
                if(hosts[ip] != null){
                    discoveredHosts[ip] = hosts[ip];
                }
                if(index==255){
                    eventObject.discoveredHosts = discoveredHosts;
                    eventObject.dateStarted = dtStarted;
                    eventObject.dateFinished = new Date();
                    _buildTree(discoveredHosts);
                    //console.log(this.map);
                    this.trigger(eventObject);
                }
            }.bind(this));
        }else{
            if(scannedHosts.length>0){
                scannedHosts.forEach(function(ip, index) {
                    if(hosts[ip] != null && this.discoveredHosts[ip] == undefined ){
                        discoveredHosts[ip] = hosts[ip];
                        this.discoveredHosts[ip] = hosts[ip];
                        var test = new P3Com('ws://'+ip+':4659/');

                        var eventObject = $.Event(P3ComEventType.HOST_DISCOVERED);
                        eventObject.discoveredHosts = discoveredHosts;
                        eventObject.dateStarted = dtStarted;
                        this.trigger(eventObject);
                    }
                }.bind(this));
            }
            setTimeout(function(){
                _waitScan(hosts, dtStarted);
            }.bind(this), this.sckConnTimeoutMs);
        }

    }.bind(this);

    var _buildTree = function(dscHosts) {
        for (var host in dscHosts) {
            this.map[host] = new P3Com("ws://" + host + ":" + this.port + "/");
        }
    }.bind(this);

}

P3ComManager.prototype = Object.create(EventDispatcher.prototype);