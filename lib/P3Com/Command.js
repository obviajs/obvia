function Command(){
    this.commandType;
    this.guid;//generate guid 
    this.parameters; 
    this.dateSent;
    this.dateAcknowledged;
    this.dateComplete;
    this.statusCode; //negative status codes are P3Com.js statuses(sending, sent, timedOut, canceled), positive ones are sent from P3Com.net
    this.statusCodeDescription;
}