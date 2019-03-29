var P3Com = function (_u = "ws://localhost:4649/") {
    var _autoRetry;
    var _socket;
    var _url = _u;
    var commands = {};
    var _self = this;
    this.$el = $(this);

    this.send = function (msg) {
        _socket = new WebSocket(_url);

        if (_socket) {
            var command = new Command();
            var cmdtype = new CommandType();

            cmdtype.moduleName = msg.key;
            cmdtype.command = msg.command;
            cmdtype.cancelable = msg.cancelable;

            commands[command.guid] = command;
            msg.guid = command.guid;

            command.commandType = cmdtype;
            command.parameters = msg.data;
            command.dateSent = new Date();
            command.dateAcknowledged;
            command.dateComplete;
            command.statusCode;
            command.statusCodeDescription;

            _socket.onopen = function (event) {
                sendMessage(JSON.stringify(msg))
            };

            _socket.onmessage = (function (cmd) {
                return function (event, cmd) {
                    var responseObj = JSON.parse(event.data);

                    if (responseObj) {
                        command.statusCode = responseObj.statusCode;

                        if (responseObj.statusCode == 1000) {
                            command.dateAcknowledged = new Date();
                            command.statusCodeDescription = 'Command was acknowledged.';

                            var eventObject = $.Event(P3ComEventType.COMMAND_ACKNOWLEDGED);
                            _self.trigger(eventObject, [responseObj, command]);

                        } else if (responseObj.statusCode == 1001) {
                            command.dateComplete = new Date();
                            command.statusCodeDescription = 'General failure: ' + responseObj.statusMsg;

                            var eventObject = $.Event(P3ComEventType.COMMAND_REJECETED);
                            _self.trigger(eventObject, [responseObj, command]);

                            if (_socket) {
                                _socket.close();
                            }
                        } else if (responseObj.statusCode == 1003) {
                            command.dateComplete = new Date();
                            // command.statusCodeDescription = responseObj.statusMsg;

                            var eventObject = $.Event(P3ComEventType.COMMAND_PROGRESS);
                            _self.trigger(eventObject, [responseObj, command]);

                        } else if (responseObj.statusCode == 1002) {
                            command.dateComplete = new Date();
                            command.statusCodeDescription = responseObj.statusMsg;

                            if (responseObj.pluginStatusCode == 0) {
                                var eventObject = $.Event(P3ComEventType.COMMAND_COMPLETED);
                                _self.trigger(eventObject, [responseObj, command]);

                            } else {
                                var eventObject = $.Event(P3ComEventType.COMMAND_FAILED);
                                _self.trigger(eventObject, [responseObj, command]);
                            }

                            if (_socket) {
                                _socket.close();
                            }
                        }

                    }
                    //_socket.close();
                    console.log("received from ", event.data);
                }
            })(command.guid);

            _socket.onerror = (function (cmd) {
                return function (event, cmd) {
                    console.log("error ", event);

                    var eventObject1 = $.Event(P3ComEventType.CONNECTION_ERROR);
                    _self.trigger(eventObject1, [event]);

                    command.dateComplete = new Date();
                    command.statusCode = -1000;
                    command.statusCodeDescription = event.data;
                }
            })(command);

            _socket.onclose = (function (cmd) {
                return function (event, cmd) {
                    console.log("connection closed ", event);

                    var eventObject1 = $.Event(P3ComEventType.CONNECTION_CLOSE);
                    _self.trigger(eventObject1, [event.code]);

                    command.dateComplete = new Date();
                    command.statusCode = event.code;
                    command.statusCodeDescription = event.reason;

                    _socket = null;
                }
            })(command);
        }

    };

    function sendMessage(msg) {
        waitForSocketConnection(_socket, function () {
            _socket.send(msg);
        });
    }

    function waitForSocketConnection(socket, callback) {
        setTimeout(
            function () {
                if (socket.readyState === 1) {
                    if (callback != null) {
                        callback();
                    }
                } else {
                    waitForSocketConnection(socket, callback);
                }
            }, 5);
    }


    Object.defineProperty(this, "autoRetry",
        {
            get: function autoRetry() {
                return _autoRetry;
            },
            set: function autoRetry(x) {
                _autoRetry = x;
            }
        });
};

P3Com.prototype = Object.create(EventDispatcher.prototype);