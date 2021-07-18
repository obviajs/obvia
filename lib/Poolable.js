var Poolable = function(){
    this.instances = {};
    this.getInstance = function (instName) {
        if (!instName)
            instName = this.name;
        let instance = this.instances[instName];
        if (!instance)
            instance = this.instances[instName] = new this();
        return instance;
    };
};
export {
    Poolable
};