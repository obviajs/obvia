function P3ComManager(){
    this.myIP;
    this.$el = $(this);
    
    this.scan = function(){

        lan.IpDiscovery.start(function(error, ip) {
            this.myIP = ip;
            // if (!ip.match(/192.168.0/))return;
            if (error) return;
            var mask = ip.replace(/\d+$/, '');
            var range = [];
            for (var i = 0; i < 256; i++) {
              range.push(mask+i);
            }
            this.trigger(P3ComEventType.DISCOVERY_STARTED);
          
            new lan.HostScan(range, 4069, {batchSize: 125}).start({
              stream: function(addr, state, duration) {
                if (state == 'up')
                  log(div, addr.replace(/:\d+$/, '')+" - " +state.toUpperCase());
              },
              complete: function(results) {
                div.querySelector('.load').style.display = 'none';
                div.style.paddingBottom = 0;
                var hostsUp = 0;
                results.forEach(function(el, index){
                    if(el.state == 'up'){
                        console.log(el.address+" is up.");
                        ++hostsUp;
                    }
                });
                log(div, "<span style='color:#0f0'>Scan complete. Hosts Up:  "+hostsUp+"</span>");
              }
            });
          });    









        //return instances of HandShaked
        return [];
    }




    this.on = function (eventType, fnc) {
        if (typeof fnc !== 'function') {
            throw Error("The specified parameter is not a callback")
        } else {
            if (typeof fnc == 'function') {
                this.$el.on(eventType, function () {
                    fnc.apply(this, arguments);
                }.bind(this));
            }
        }
        return this;
    }
    this.trigger = function () {
        this.$el.trigger.apply(this.$el, arguments);
    }
}