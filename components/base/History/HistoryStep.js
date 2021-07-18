var HistoryStep = function(_props)
{ 
    var _id = StringUtils.guid();
    this.behaviorName = "";
    this.description = "";
    this.stepType = 1; //2 type of change Minor/Major
    this.date = new Date();
    this.args;
    this.thisObj;
    this.retObj;

    Object.defineProperty(this, "id", {
        get: function id()
        {
            return _id;
        }
    });
}