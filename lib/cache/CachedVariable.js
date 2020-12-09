var CachedVariable = function () {
    this.dependecies = [];
    this.updateTime = new Date().getTime();
    this.value;
    this.ttl;
};