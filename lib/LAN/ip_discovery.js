/*
 * ip_discovery.js: Attempts to discover your own IP address using HTML5 WebRTC APIs.
 *
 * @author joev
 */
var lan = lan || {};
(function(){

    function discoverIps(opts, callback) {
    
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
    
      if (!('waitForNext' in opts)) {
        opts.waitForNext = false; // ms
      }
    
      /*
       * based heavily on the beef implementation here:
       * https://github.com/beefproject/beef/wiki/Module:-Get-Internal-IP-WebRTC
       */
    
      var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      function run() {
        var addrs = { "0.0.0.0": false };
        var pendingTimeout = null;
    
        // Establish a connection with ICE / relay servers - in this instance: NONE
        var rtc = new RTCPeerConnection({iceServers: []});
        rtc.createDataChannel('', {reliable:false});
    
        // Upon an ICE candidate being found
        // Grep the SDP data for IP address data
        rtc.onicecandidate = function (evt) {
          if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
        };
    
        // Create an SDP offer
        rtc.createOffer(function (offerDesc) {
          grepSDP(offerDesc.sdp);
          rtc.setLocalDescription(offerDesc);
        }, function (e) { callback("SDP Offer Failed"); });
    
        function processIPs(newAddr) {
          if (newAddr in addrs) return;
          if (!newAddr.match(/^\d+\.\d+\.\d+\.\d+$/)) return;
          else addrs[newAddr] = true;
    
          if (opts.waitForNext) {
            if (pendingTimeout) clearTimeout(pendingTimeout);
            pendingTimeout = setTimeout(function() {
              var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
              callback(false, displayAddrs);
            }, opts.waitForNext);
          } else {
            callback(false, newAddr);
          }
        }
    
        function grepSDP(sdp) {
          var parts, addr, type;
          var hosts = [];
    
          sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
            if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
              parts = line.split(' ');              // http://tools.ietf.org/html/rfc5245#section-15.1
              addr = parts[4];
              type = parts[7];
              if (type === 'host') processIPs(addr);
          } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
              parts = line.split(' ');
              addr = parts[2];
              processIPs(addr);
            }
          });
        }
      }
    
      if (RTCPeerConnection) {
        run();
      } else {
        setTimeout(function () { // avoid zalgo's reach
          callback("RTCPeerConnection is not supported by this browser");
        });
      }
    
    }
    
    
    /*
     * exports
     */
    lan = Object.assign(lan, {
      IpDiscovery: {
        start: discoverIps
      }
    });
    }).call(window);