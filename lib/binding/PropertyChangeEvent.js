var PropertyChangeEvent = function (source, property, oldValue, newValue) {
    this.source = source; //Object
    this.property = property;
    this.oldValue = oldValue;
    this.newValue = newValue;
    //$.Event
    this.type = "propertyChange";
    this.time = new Date();
}